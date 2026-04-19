import https from "https";
import http from "http";
import fs from "fs";
import sharp from "sharp";

const outDir = "C:/Users/Issam/GarageGymBuilder/public/images/products";

const images = [
  // Bowflex 552 (duplicate old filename)
  { id: "bowflex-552", url: "https://www.bowflex.com/dw/image/v2/AAYW_PRD/on/demandware.static/-/Sites-nautilus-master-catalog/default/dw6f262211/images/bfx/weights/ZMK4011008/results-series-552-dumbbell-pair-black-orange.jpg.jpg?sw=2600&sh=1464&sm=fit" },
  // Mikolo F4 Power Cage
  { id: "mikolo-f4", url: "https://gym-mikolo.com/cdn/shop/files/mikolo-f4-power-rack-with-latpull-down-system.png?v=1775698312&width=2000" },
  // Sportsroyals Power Cage
  { id: "sportsroyals-rack", url: "https://www.sportsroyals.us/images/cd8ee67debde.jpg" },
  // CAP Barbell 300 lb Set
  { id: "cap-barbell-300", url: "https://capbarbell.com/cdn/shop/files/OSHW_300__52836__69070.1446739888.1280.1280_85583027-1cfa-4f28-8a7f-9dad0da0a81b.jpg?v=1768893052" },
  // Synergee Games Barbell
  { id: "synergee-barbell", url: "https://synergeefitness.com/cdn/shop/files/cerakote_20barbell_20red_2015kg_20amazon_20image_201_202025.jpg?v=1773933844&width=1080" },
  // FLYBIRD bench (duplicate old filename)
  { id: "flybird-bench", url: "https://flybirdfitness.com/cdn/shop/files/flybird-foldable-weight-bench-fb299.webp?v=1725593795&width=533" },
  // Marcy Olympic bench (duplicate old filename)
  { id: "marcy-bench", url: "https://www.marcypro.com/cdn/shop/files/MD-857-01.jpg?v=1767806660&width=1946" },
  // Rogue Echo Bike
  { id: "rogue-echo-bike", url: "https://assets.roguefitness.com/f_auto,q_auto,c_fill,g_center,w_768,h_402,b_rgb:f8f8f8/catalog/Conditioning/Endurance%20/Bikes/ECHOBIKE/ECHOBIKE-H_t5871p.png" },
  // Dark Iron lifting belt (duplicate old filename)
  { id: "dark-iron-belt", url: "https://darkironfitness.com/wp-content/uploads/2025/08/Pro-Powerlifting-Belt-768x511.jpg" },
  // Iron Gym pull-up bar (duplicate old filename)
  { id: "iron-gym-bar", url: "https://www.living.fit/cdn/shop/files/Untitleddesign_11_1_535x.png?v=1768185746" },
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
