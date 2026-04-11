import fs from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "src/content");
const coversDir = path.join(process.cwd(), "public/images/covers");
const contentTypes = ["best-gear", "reviews", "guides", "builds"];

// Get all available webp files
const webpFiles = fs.readdirSync(coversDir).filter((f) => f.endsWith(".webp"));
console.log(`Found ${webpFiles.length} WebP cover images.\n`);

let updated = 0;

for (const type of contentTypes) {
  const dir = path.join(contentDir, type);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, "utf8");

    // The cover image should be named after the slug
    const expectedWebp = `${slug}.webp`;
    const newPath = `/images/covers/${expectedWebp}`;

    if (webpFiles.includes(expectedWebp)) {
      // Replace the featuredImage line
      const oldContent = content;
      content = content.replace(
        /featuredImage:\s*"[^"]*"/,
        `featuredImage: "${newPath}"`
      );
      if (content !== oldContent) {
        fs.writeFileSync(filePath, content);
        console.log(`  UPDATED ${slug} -> ${newPath}`);
        updated++;
      } else {
        console.log(`  OK      ${slug} (already correct)`);
      }
    } else {
      console.log(`  MISSING ${slug} (no webp file found)`);
    }
  }
}

console.log(`\nUpdated ${updated} frontmatter paths.`);
