// Bulk-reattribute articles from "Gym Builder Team" to named authors
// based on topic keywords in the slug. E-E-A-T boost for the Person
// schemas we added on /team/[slug] pages.

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "src/content");
const contentTypes = ["best-gear", "reviews", "guides", "builds"];

const MARCUS = "Marcus Reid";
const LENA = "Lena Park";
const DEREK = "Derek Walsh";

// Keyword → author mapping, evaluated in order.
// First match wins.
const rules = [
  // Lena — cardio, women, seniors, rehab, mobility, running, cycling
  { author: LENA, keywords: [
    "rower", "rowing", "rw5515", "concept2", "row-erg",
    "women", "female",
    "senior", "over-40",
    "postpartum", "rehab", "recovery",
    "runner", "running",
    "cyclist", "cycling",
    "kids-teens",
    "ventilation", "lighting",
    "nutrition",
    "foam-roller",
  ]},
  // Derek — accessories, conditioning, strongman, flooring, used, mma, crossfit
  { author: DEREK, keywords: [
    "kettlebell",
    "sandbag",
    "slam-ball",
    "plyo-box",
    "jump-rope", "wod-nation", "crossrope",
    "trx", "suspension",
    "resistance-bands", "bodylastics",
    "dip-belt", "iron-bull",
    "mma", "boxing", "combat",
    "crossfit",
    "flooring", "gym-flooring",
    "storage", "organizing",
    "used-gym-equipment", "buying-used",
    "maintenance", "clean",
    "apartment",
    "small-space", "small-spaces",
    "travel",
    "budget",
    "accessory",
    "parallettes",
    "battle-rope",
    "ab-wheel", "ab-carver",
    "roman-chair", "hyperextension",
    "pull-up-bar", "iron-gym",
    "gymnastic-rings", "rings",
    "weight-vest",
    "lifting-straps",
    "airbike", "air-bike", "assault",
  ]},
  // Marcus — powerlifting, racks, barbells, benches, plates, builds, belts, wraps, sleeves, dumbbells
  { author: MARCUS, keywords: [
    "power-rack", "rack",
    "810xlt", "mikolo", "sportsroyals", "fitness-reality",
    "barbell", "bar-",
    "synergee", "cap-barbell",
    "bench", "flybird", "marcy",
    "plates", "yes4all-olympic",
    "powerlifter", "powerlifting",
    "squat",
    "deadlift",
    "dumbbell", "dumbbells",
    "bowflex", "powerblock",
    "knee-sleeves", "nordic",
    "wrist-wraps", "rip-toned",
    "lifting-belt", "dark-iron",
    "bodybuilder", "bodybuilding",
    "build",
    "home-gym-under",
    "dream-gym",
    "calculator",
    "how-to-choose",
    "programming",
    "safety",
    "soundproofing",
    "electrical",
    "platform",
    "how-to-build-a-garage",
    "mistakes",
    "insurance",
    "vs-", // comparisons
    "back-pain",
    "seo",
  ]},
];

function assignAuthor(slug) {
  const lower = slug.toLowerCase();
  for (const rule of rules) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.author;
    }
  }
  return MARCUS; // fallback
}

let updated = 0;
let unchanged = 0;
const counts = { [MARCUS]: 0, [LENA]: 0, [DEREK]: 0 };

for (const type of contentTypes) {
  const dir = path.join(contentDir, type);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  for (const file of files) {
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.mdx$/, "");
    const newAuthor = assignAuthor(slug);
    counts[newAuthor] = (counts[newAuthor] || 0) + 1;

    if (data.author === newAuthor) {
      unchanged++;
      continue;
    }

    data.author = newAuthor;
    const newContent = matter.stringify(content, data);
    fs.writeFileSync(filePath, newContent, "utf8");
    updated++;
  }
}

console.log(`Updated: ${updated}`);
console.log(`Unchanged: ${unchanged}`);
console.log(`\nTotal per author:`);
for (const [author, count] of Object.entries(counts)) {
  console.log(`  ${author}: ${count}`);
}
