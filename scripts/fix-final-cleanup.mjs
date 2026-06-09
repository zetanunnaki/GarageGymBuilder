import fs from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "src/content");
const contentTypes = ["best-gear", "reviews", "guides", "builds", "topics"];
let filesModified = 0;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const original = content;

  // Fix double-s typo: "Bike Seriess" → "Bike Series"
  content = content.replace(/Bike Seriess/g, "Bike Series");

  // Fix standalone "Assault" references in air bike context
  // "the Assault" → "the Sunny Health SF-B223018"
  content = content.replace(/the Assault(?= showed| support| include| cost| doesn't| at \$| lists| supports)/g, "the Sunny Health SF-B223018");
  content = content.replace(/The Assault(?= showed| support| include| cost| doesn't| at \$| lists| supports)/g, "The Sunny Health SF-B223018");
  // "Assault" at start of sentence or after "and " in comparison text
  content = content.replace(/and Assault(?= support| include| cost| at )/g, "and Sunny Health SF-B223018");
  // "the 98 lb Assault"
  content = content.replace(/the 98 lb Assault/g, "the 98 lb Sunny Health SF-B223018");
  // "Assault Bikes" (plural, as a product category reference)
  content = content.replace(/Assault Bikes/g, "Sunny Health Fan Bikes");
  // "Assault-specific"
  content = content.replace(/Assault-specific/g, "model-specific");
  // "Assault sells" / "Assault Tabata"
  content = content.replace(/Assault sells/g, "The manufacturer sells");
  content = content.replace(/The Assault Tabata/g, "The Built-In Tabata");
  // "Assault or Schwinn" in crossfit build context
  content = content.replace(/Assault or Schwinn Airdyne/g, "Sunny Health SF-B223018 or Schwinn Airdyne");
  // "Concept2 vs Assault comparison" — keep "Assault" in URL link text since the URL says assault
  // but fix visible text if not in a markdown link
  // Actually the link format is [Concept2 vs Assault comparison](/best-gear/concept2-vs-assault-bike/)
  // The link text should match the updated product name
  content = content.replace(/\[Concept2 vs Assault comparison\]/g, "[Concept2 vs Sunny Health Fan Bike comparison]");
  content = content.replace(/\[Concept2 vs Sunny Health SF-B223018 comparison\]/g, "[Concept2 vs Sunny Health Fan Bike comparison]");

  // Fix "Rogue built this bike" in Schwinn Airdyne content
  content = content.replace(/Rogue built this bike/g, "This bike was built");
  // Fix "Only available direct from Rogue"
  content = content.replace(/Only available direct from Rogue — no Amazon Prime shipping/g, "Premium price for a consumer air bike");
  // Fix "you need a Rogue-specific replacement part"
  content = content.replace(/you need a Rogue-specific replacement part/g, "you need a manufacturer-specific replacement part");

  // Fix "Fitness Reality" in home-gym-for-travel title
  content = content.replace(
    "title: 'Mikolo vs Sportsroyals vs Fitness Reality: Budget vs Features vs Price'",
    "title: 'Mikolo vs Sportsroyals vs ULTRA FUEGO: Budget vs Features vs Price'"
  );
  content = content.replace(
    /Fitness Reality(?=:| vs)/g,
    "ULTRA FUEGO"
  );

  // Fix remaining "Fitness Reality" brand refs in specific product contexts
  // (Keep it in generic brand-listing contexts like "budget brands")
  content = content.replace(/Fitness Reality at least has/g, "ULTRA FUEGO at least has");

  // Fix "Concept2 vs Assault Bike" article title if present
  content = content.replace(
    /Concept2 vs Assault Bike/g,
    "Concept2 vs Sunny Health Fan Bike"
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    filesModified++;
    console.log(`Fixed: ${path.relative(contentDir, filePath)}`);
  }
}

for (const type of contentTypes) {
  const dir = path.join(contentDir, type);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  for (const file of files) {
    processFile(path.join(dir, file));
  }
}

console.log(`\nTotal files modified: ${filesModified}`);
