import https from "https";
import http from "http";
import fs from "fs";
import sharp from "sharp";

const outDir = "C:/Users/Issam/GarageGymBuilder/public/images/products";

const images = [
  // BalanceFrom puzzle mat
  { id: "balancefrom-puzzle-mat", url: "https://superarbor.io/cdn/shop/files/652a2fbae078878fcdd4abd83e151873_1800x1800.jpg?v=1763287724" },
  // Power Guidance battle rope
  { id: "battle-rope", url: "https://mikefit.com/cdn/shop/files/71jqwJgv-bL.jpg?v=1731303562&width=1946" },
  // SPRI medicine ball
  { id: "spri-medicine-ball", url: "https://www.protherapysupplies.com/web/image/product.template/74452/image_1920?unique=3ef5e29" },
  // Gaiam yoga mat
  { id: "gaiam-yoga-mat", url: "https://www.yeswellness.com/cdn/shop/files/gaiam-essentials-yoga-mat-6mm-various-colours-018713633170-43299917529390.jpg?v=1707178320&width=480" },
  // Yes4All sandbag
  { id: "sandbag", url: "https://urbanspacemarkets.com/cdn/shop/files/31NPEr2giYL.jpg?v=1717478913&width=1946" },
  // Yes4All slam ball
  { id: "yes4all-slam-ball", url: "https://m.media-amazon.com/images/I/815W2ch7W6L._US500_.jpg" },
  // Yes4All trap bar (generic hex bar image — closest match)
  { id: "yes4all-trap-bar", url: "https://midwaysports.com/cdn/shop/files/trapbarhorizontalnatural.png?v=1762198837" },
  // Yes4All plyo box
  { id: "yes4all-plyo-box", url: "https://cdn.freshstore.cloud/offer/images/13438/18746/c/yes4all-stackable-soft-plyo-box-adjustable-plyometric-jump-box-for-plyometric-exercises-hiit-conditioning-black-6-18746.jpg" },
  // TRX GO suspension trainer
  { id: "trx-go", url: "https://cdn.arenacommerce.com/repfitnessco/IMG_8101 Main-1920x1920-5c7db94.png" },
  // WOD Nation jump rope — site is "coming soon", use Amazon image
  { id: "wod-nation-rope", url: "https://m.media-amazon.com/images/I/71Y4G0BRf2L._AC_SL1500_.jpg" },
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
