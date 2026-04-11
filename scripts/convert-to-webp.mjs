import sharp from "sharp";
import fs from "fs";
import path from "path";

const coversDir = path.join(process.cwd(), "public/images/covers");

const jpgFiles = fs.readdirSync(coversDir).filter((f) => f.endsWith(".jpg"));

console.log(`Converting ${jpgFiles.length} JPEG files to WebP...\n`);

let converted = 0;
for (const file of jpgFiles) {
  const inputPath = path.join(coversDir, file);
  const outputPath = path.join(coversDir, file.replace(".jpg", ".webp"));

  try {
    const inputSize = fs.statSync(inputPath).size;
    await sharp(inputPath).webp({ quality: 80 }).toFile(outputPath);
    const outputSize = fs.statSync(outputPath).size;
    const savings = Math.round((1 - outputSize / inputSize) * 100);
    console.log(
      `  ${file} -> ${file.replace(".jpg", ".webp")} (${savings}% smaller)`
    );
    // Remove original JPEG
    fs.unlinkSync(inputPath);
    converted++;
  } catch (err) {
    console.error(`  ERROR converting ${file}: ${err.message}`);
  }
}

console.log(`\nConverted ${converted}/${jpgFiles.length} files to WebP.`);
