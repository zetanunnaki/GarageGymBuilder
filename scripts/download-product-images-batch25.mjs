import https from "https";
import http from "http";
import fs from "fs";
import sharp from "sharp";

const outDir = "C:/Users/Issam/GarageGymBuilder/public/images/products";

const images = [
  // Fitness Reality 810XLT
  { id: "fitness-reality-810xlt", url: "https://www.ultrapickleball.com/cdn/shop/products/412L5rdouWL.jpg?v=1575933742" },
  // XMark preacher curl bench
  { id: "xmark-preacher-curl", url: "https://www.usa-homegym.com/wp-content/uploads/2014/05/XMarkXM4436SeatedPreacherCurl.jpg" },
  // Yes4All plyo box (retry with different URL)
  { id: "yes4all-plyo-box", url: "https://m.media-amazon.com/images/I/61+sI7TqH1L._AC_SL1500_.jpg" },
  // WOD Nation jump rope (retry with different URL)
  { id: "wod-nation-rope", url: "https://m.media-amazon.com/images/I/61H-2YJZXAL._AC_SL1500_.jpg" },
  // Yes4All parallettes
  { id: "yes4all-parallettes", url: "https://m.media-amazon.com/images/I/61q5mQgRe7L._AC_SL1500_.jpg" },
  // Yes4All Olympic plates
  { id: "yes4all-plates", url: "https://m.media-amazon.com/images/I/71S3uFLb1cL._AC_SL1500_.jpg" },
  // Yes4All roman chair
  { id: "yes4all-roman-chair", url: "https://m.media-amazon.com/images/I/71U8P6YlJnL._AC_SL1500_.jpg" },
  // Yes4All landmine
  { id: "yes4all-landmine", url: "https://m.media-amazon.com/images/I/71fJWKRQ-4L._AC_SL1500_.jpg" },
  // Gym wall mirror (generic)
  { id: "gym-wall-mirror", url: "https://m.media-amazon.com/images/I/71fQb-hGdCL._AC_SL1500_.jpg" },
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
