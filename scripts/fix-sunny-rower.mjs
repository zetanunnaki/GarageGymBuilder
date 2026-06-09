import fs from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "src/content");
const contentTypes = ["best-gear", "reviews", "guides", "builds", "topics"];
let filesModified = 0;

for (const type of contentTypes) {
  const dir = path.join(contentDir, type);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

  for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, "utf8");
    const original = content;

    // Replace model name in content text (NOT in URLs/links)
    // URLs contain sunny-sf-rw5515 which should stay unchanged
    content = content.replace(/SF-RW5515/g, "SF-RW522016");

    // Fix specific price references for this product
    // "at $250" or "costs under $250" referring to the Sunny rower
    content = content.replace(/at \$250/g, "at $289");
    content = content.replace(/costs under \$250/g, "costs under $300");
    content = content.replace(/under \$300,/g, "under $300,"); // already correct
    content = content.replace(/\(\$250\)/g, "($289)");

    // Fix the $350 reference in concept2 review (was wrong even before)
    // "a magnetic rower at roughly $350" should be $289
    content = content.replace(
      /a magnetic rower at roughly \$350/g,
      "a magnetic rower at $289"
    );

    // Fix "$250 and whispers" pattern
    content = content.replace(/costs \$250 and/g, "costs $289 and");

    // Fix "at $250 is the smarter purchase"
    content = content.replace(/at \$250 is the smarter/g, "at $289 is the smarter");

    // Fix "Magnetic rowing machine ($250)"
    content = content.replace(
      /Magnetic rowing machine \(\$250\)/g,
      "Magnetic rowing machine ($289)"
    );

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      filesModified++;
      console.log(`Fixed: ${type}/${file}`);
    }
  }
}
console.log(`\nTotal files modified: ${filesModified}`);
