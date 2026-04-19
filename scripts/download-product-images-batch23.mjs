import https from "https";
import http from "http";
import fs from "fs";
import sharp from "sharp";

const outDir = "C:/Users/Issam/GarageGymBuilder/public/images/products";

const images = [
  // Ab Wheel (Perfect Fitness Ab Carver Pro)
  { id: "ab-wheel", url: "https://forzasports.com/cdn/shop/files/imp10422.jpg?v=1751207166&width=5000" },
  // Yes4All Kettlebells
  { id: "yes4all-kettlebells", url: "https://onerunsports.com/cdn/shop/files/7145bnnd8pL._AC_SL1500.jpg?v=1689438250&width=1946" },
  // Yes4All Dumbbell Rack
  { id: "yes4all-dumbbell-rack", url: "https://workouthealthy.com/cdn/shop/files/Yes4All-Adjustable-Dumbbell-Stand.webp?v=1740362576&width=1080" },
  // Concept2 RowErg
  { id: "concept2-rowerg", url: "https://cdn.shopify.com/s/files/1/0574/1215/7598/t/16/assets/acf.RowERG_Standard_FlyFrontAngle-(1).png?v=1640040616" },
];

function download(url) {
  return new Promise((resolve, reject) => {
    const get = (u) => {
      const mod = u.startsWith("https") ? https : http;
      mod.get(u, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const loc = res.headers.location.startsWith("http") ? res.headers.location : new URL(res.headers.location, u).href;
          return get(loc);
        }
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      }).on("error", reject);
    };
    get(url);
  });
}

async function main() {
  for (const { id, url } of images) {
    const outPath = `${outDir}/${id}.webp`;
    try {
      console.log(`Downloading: ${id}...`);
      const buf = await download(url);
      await sharp(buf).resize(800, 800, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } }).webp({ quality: 85 }).toFile(outPath);
      const size = fs.statSync(outPath).size;
      console.log(`  OK: ${id}.webp (${(size/1024).toFixed(0)}KB)`);
    } catch (err) {
      console.error(`  FAIL: ${id} — ${err.message}`);
    }
  }
  console.log("\nDone!");
}
main();
