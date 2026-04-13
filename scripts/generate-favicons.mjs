// Generate a full favicon set from the existing icon.svg.
// Produces: /public/favicon.ico, /public/icon-{16,32,48,192,512}.png,
// /public/apple-icon.png (180x180), /public/manifest uses icon-192 and icon-512.

import fs from "fs";
import path from "path";
import sharp from "sharp";

const publicDir = path.join(process.cwd(), "public");
const svgPath = path.join(process.cwd(), "src/app/icon.svg");

// Read the svg; scale up for crisp rendering
const svgBuffer = fs.readFileSync(svgPath);

// High-res base svg we'll re-encode for higher densities
// Recreate the icon as a 512x512 SVG for crisp scaling
const scaledSvg = `<svg width="512" height="512" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#ea580c"/>
  <rect x="4" y="9" width="5" height="14" rx="1" fill="#000"/>
  <rect x="23" y="9" width="5" height="14" rx="1" fill="#000"/>
  <rect x="8" y="11" width="3" height="10" rx="0.5" fill="#000"/>
  <rect x="21" y="11" width="3" height="10" rx="0.5" fill="#000"/>
  <rect x="11" y="14.5" width="10" height="3" rx="0.5" fill="#000"/>
</svg>`;

const hiRes = Buffer.from(scaledSvg);

async function makePng(size, outName) {
  const outPath = path.join(publicDir, outName);
  await sharp(hiRes)
    .resize(size, size, { fit: "contain" })
    .png({ quality: 95, compressionLevel: 9 })
    .toFile(outPath);
  console.log(`  ${outName} (${size}x${size})`);
}

async function main() {
  console.log("Generating favicon PNG set...");
  await makePng(16, "favicon-16x16.png");
  await makePng(32, "favicon-32x32.png");
  await makePng(48, "favicon-48x48.png");
  await makePng(180, "apple-icon.png");
  await makePng(192, "icon-192.png");
  await makePng(512, "icon-512.png");
  // Generate a "dummy" ICO by copying the 32x32 png under favicon.ico
  // Real .ico requires a multi-resolution container; Next.js/browsers
  // accept PNG-formatted favicon.ico from app/favicon.ico or public/.
  // We create one via sharp then rename for maximum compatibility.
  const ico32 = path.join(publicDir, "favicon-32x32.png");
  fs.copyFileSync(ico32, path.join(publicDir, "favicon.ico"));
  console.log("  favicon.ico (copied from favicon-32x32.png)");
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
