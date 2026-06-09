import fs from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "src/content");
const contentTypes = ["best-gear", "reviews", "guides", "builds", "topics"];
let filesModified = 0;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const original = content;
  const fileName = path.basename(filePath);

  // Skip bumper plate files — "Rogue Echo" in those files refers to bumper plates, not the bike
  const isBumperFile = fileName.includes("bumper");

  // Fix "Rogue Schwinn Airdyne" → "Schwinn Airdyne" (artifact from partial replacement)
  content = content.replace(/Rogue Schwinn Airdyne/g, "Schwinn Airdyne");

  // Fix "Rogue Echo" (without "Bike" or "Bumper") in air bike context only
  if (!isBumperFile) {
    // "Rogue Echo" NOT followed by "Bumper" or "bumper" → "Schwinn Airdyne"
    content = content.replace(/Rogue Echo(?! [Bb]umper)/g, "Schwinn Airdyne");
  }

  // Fix "the Echo" standalone references in air bike / cardio context
  // These should become "the Airdyne" — but only when referring to the bike
  // Check if file discusses air bikes
  const isAirBikeContext = /air bike|fan bike|conditioning|cardio.*bike|Schwinn Airdyne|Assault/i.test(content);

  if (isAirBikeContext && !isBumperFile) {
    // "the Echo" → "the Airdyne" (when clearly about the bike)
    content = content.replace(/the Echo(?='s| wins| stays| stayed| has| is | was | does| gives| eliminates| simply| feel)/g, "the Airdyne");
    content = content.replace(/The Echo(?='s| wins| stays| stayed| has| is | was | does| gives| eliminates| simply| feel)/g, "The Airdyne");
    // "the Echo's" possessive
    content = content.replace(/the Echo's/g, "the Airdyne's");
    content = content.replace(/The Echo's/g, "The Airdyne's");
    // "the Echo" at end of sentence (before period, comma, semicolon)
    content = content.replace(/the Echo(?=[.,;)\s—])/g, "the Airdyne");
    content = content.replace(/The Echo(?=[.,;)\s—])/g, "The Airdyne");
    // "Echo's" without "the"
    content = content.replace(/(?<= )Echo's/g, "Airdyne's");
  }

  // Fix "Assault Bike" references (without "AirBike")
  content = content.replace(/(?<!\w)Assault Bike(?!\w)/g, "Sunny Health Fan Bike");

  // Fix "the Assault" standalone in air bike context
  if (isAirBikeContext) {
    // "the Assault" when referring to the bike (followed by common patterns)
    content = content.replace(/the Assault(?='s| is | was | wins| has| at | lists| costs)/g, "the Sunny Health SF-B223018");
    content = content.replace(/The Assault(?='s| is | was | wins| has| at | lists| costs)/g, "The Sunny Health SF-B223018");
    content = content.replace(/the Assault's/g, "the Sunny Health SF-B223018's");
    content = content.replace(/The Assault's/g, "The Sunny Health SF-B223018's");
    // "the Assault" at end of patterns
    content = content.replace(/the Assault(?=[.,;)\s—])/g, "the Sunny Health SF-B223018");
  }

  // Fix title artifacts
  if (fileName === "assault-airbike-review.mdx") {
    // Fix leftover "vs the Rogue Echo" in title
    content = content.replace(
      "The Original vs the Rogue Echo",
      "Premium Air Bike for Home Gyms"
    );
  }

  // Fix "the Assault" in how-to-choose-cardio-machine
  content = content.replace(/\(Assault\)/g, "(Sunny Health SF-B223018)");
  content = content.replace(/\(Rogue Echo\)/g, "(Schwinn Airdyne)");

  // Fix leftover Assault references in comparison text
  // "Assault, Schwinn AD7" type patterns
  content = content.replace(/\(Assault,/g, "(Sunny Health SF-B223018,");

  // Clean up any double replacements
  content = content.replace(/Schwinn Airdyne Airdyne/g, "Schwinn Airdyne");
  content = content.replace(/the Airdyne's's/g, "the Airdyne's");

  // Fix "Assault BikeX" which is a different product - restore it
  // Actually, "Assault BikeX" is also from Assault Fitness and likely should stay
  // but let's check if it got changed
  content = content.replace(/Sunny Health Fan BikeX/g, "Assault BikeX");

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
