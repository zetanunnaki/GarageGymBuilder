import https from "https";
import http from "http";
import fs from "fs";
import sharp from "sharp";

const outDir = "C:/Users/Issam/GarageGymBuilder/public/images/products";

const images = [
  // Sunny Health spin bike SF-B1805
  { id: "sunny-spin-bike", url: "https://sunnyhealthfitness.com/cdn/shop/products/sunny-health-fitness-bikes-magnetic-belt-drive-indoor-cycling-bike-high-weight-capacity-and-tablet-holder-SF-B1805-07_750x.jpg?v=1608752694" },
  // Sunny Health rower SF-RW5515
  { id: "sunny-rower", url: "https://sunnyhealthfitness.com/cdn/shop/products/sunny-health-fitness-rowers-magnetic-rowing-machine-SF-RW5515-01_750x.jpg?v=1632353188" },
  // Assault AirBike Classic (duplicate old filename)
  { id: "assault-airbike", url: "https://www.assaultfitness.com/cdn/shop/files/assault_bike_classic_1_2x_374e588b-597b-4525-926f-5c93e3c1c615.webp?v=1769641068&width=3200" },
  // Harbinger lifting straps (duplicate old filename)
  { id: "harbinger-straps", url: "https://harbingerfitness.com/cdn/shop/files/qnrrgu5jawfw0p6qy3xm_00cb8b3a-4cad-4b71-93f3-41141fe07864.jpg?crop=center&height=1024&v=1745266978&width=1024" },
  // Nordic Lifting knee sleeves (duplicate old filename)
  { id: "nordic-knee-sleeves", url: "https://nordiclifting.com/cdn/shop/files/1_-_Knee_Sleeves_Black_Main_Image.jpg?v=1739347447&width=1946" },
  // Rip Toned wrist wraps (duplicate old filename)
  { id: "rip-toned-wraps", url: "https://riptoned.com/cdn/shop/products/wrist-wraps-stiff-423744.jpg?v=1760134808&width=533" },
  // Bodylastics resistance bands (duplicate old filename)
  { id: "bodylastics-bands", url: "https://bodylastics.com/cdn/shop/files/BLSET05.jpg?v=1759594499&width=984" },
  // Gymnastic rings (duplicate old filename)
  { id: "gymnastic-rings", url: "https://titan.fitness/cdn/shop/files/410111_01.jpg?v=1708458519&width=1946" },
  // Weight vest (duplicate old filename)
  { id: "weight-vest", url: "https://titan.fitness/cdn/shop/files/429229_01.jpg?v=1708304829&width=1946" },
  // Perfect Fitness Ab Wheel
  { id: "ab-wheel", url: "https://live-perfect-fitness.pantheonsite.io/wp-content/uploads/2022/10/PF_31042_Product_AbCarverPro_Front_Clip-MV-1024x1024.jpg" },
  // XTERRA TR150 Treadmill
  { id: "xterra-treadmill", url: "https://static.wixstatic.com/media/b8c01f_49f01b4c4814440ba936738ac31afcaf~mv2.jpg" },
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
