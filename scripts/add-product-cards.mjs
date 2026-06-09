import fs from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "src/content");
let filesModified = 0;

// Map each file to the product(s) it should feature
const productMap = {
  // === BEST-GEAR (7 files) ===
  "best-gear/best-bumper-plates.mdx": [
    { id: "fringe-sport-bumper-plates", badge: "Best Overall", after: "## Why Bumper Plates Matter" },
    { id: "yes4all-olympic-plates", badge: "Best Budget", after: "## Why Bumper Plates Matter" },
  ],
  "best-gear/best-gym-flooring.mdx": [
    { id: "balancefrom-puzzle-mat", badge: "Best Budget Flooring" },
  ],
  "best-gear/best-gym-mirrors.mdx": [
    { id: "gym-wall-mirror", badge: "Best Value Mirror" },
  ],
  "best-gear/best-pull-up-bars.mdx": [
    { id: "iron-gym-pull-up-bar", badge: "Best Doorway Pull-Up Bar" },
  ],
  "best-gear/cap-hex-vs-bowflex-552.mdx": [
    { id: "cap-hex-dumbbells", badge: "Budget Pick" },
    { id: "bowflex-selecttech-552", badge: "Premium Pick" },
  ],
  "best-gear/sunny-rower-vs-concept2.mdx": [
    { id: "sunny-sf-rw5515-rower", badge: "Budget Pick" },
    { id: "concept2-rowerg", badge: "Premium Pick" },
  ],
  "best-gear/trx-vs-bodylastics.mdx": [
    { id: "trx-go-suspension-trainer", badge: "Premium Pick" },
    { id: "bodylastics-resistance-bands", badge: "Budget Pick" },
  ],

  // === GUIDES (17 files) ===
  "guides/barbell-only-exercises.mdx": [
    { id: "cap-barbell-olympic", badge: "Best Starter Barbell Set" },
    { id: "synergee-olympic-barbell", badge: "Best Upgrade Barbell" },
  ],
  "guides/buying-used-gym-equipment.mdx": [
    { id: "fitness-reality-810xlt", badge: "Best Budget Rack (New)" },
    { id: "flybird-adjustable-bench", badge: "Best Budget Bench (New)" },
  ],
  "guides/garage-gym-electrical-setup.mdx": [
    { id: "rogue-echo-bike", badge: "Top Cardio Pick" },
  ],
  "guides/garage-gym-flooring-guide.mdx": [
    { id: "balancefrom-puzzle-mat", badge: "Best Budget Gym Flooring" },
  ],
  "guides/garage-gym-lighting-guide.mdx": [
    { id: "gym-wall-mirror", badge: "Pair With Good Lighting" },
  ],
  "guides/garage-gym-summer-cooling.mdx": [
    { id: "rogue-echo-bike", badge: "Built for Garage Use" },
  ],
  "guides/garage-gym-ventilation-guide.mdx": [
    { id: "assault-airbike-classic", badge: "Garage Gym Essential" },
  ],
  "guides/home-gym-for-women.mdx": [
    { id: "flybird-adjustable-bench", badge: "Best Starter Bench" },
    { id: "bodylastics-resistance-bands", badge: "Best Resistance Bands" },
  ],
  "guides/home-gym-insurance-liability.mdx": [
    { id: "fitness-reality-810xlt", badge: "Safe Budget Rack" },
  ],
  "guides/home-gym-nutrition-basics.mdx": [
    { id: "cap-barbell-olympic", badge: "Start Training Today" },
  ],
  "guides/home-gym-programming-guide.mdx": [
    { id: "cap-barbell-olympic", badge: "Best Starter Set" },
    { id: "flybird-adjustable-bench", badge: "Best Budget Bench" },
  ],
  "guides/home-gym-vs-commercial-gym.mdx": [
    { id: "fitness-reality-810xlt", badge: "Best Budget Rack" },
    { id: "flybird-adjustable-bench", badge: "Best Budget Bench" },
  ],
  "guides/how-to-anchor-power-rack.mdx": [
    { id: "fitness-reality-810xlt", badge: "Best Budget Rack" },
    { id: "mikolo-f4-power-cage", badge: "Best Mid-Range Rack" },
  ],
  "guides/how-to-choose-gym-flooring.mdx": [
    { id: "balancefrom-puzzle-mat", badge: "Best Budget Gym Flooring" },
  ],
  "guides/how-to-clean-gym-equipment.mdx": [
    { id: "triggerpoint-grid", badge: "Easy-Clean Recovery Tool" },
  ],
  "guides/soundproofing-garage-gym.mdx": [
    { id: "balancefrom-puzzle-mat", badge: "Noise-Reducing Flooring" },
    { id: "fringe-sport-bumper-plates", badge: "Quiet-Drop Bumper Plates" },
  ],
  "guides/strength-vs-hypertrophy-programming.mdx": [
    { id: "cap-barbell-olympic", badge: "Best Starter Set" },
    { id: "flybird-adjustable-bench", badge: "Best Budget Bench" },
  ],

  // === TOPICS (16 files) ===
  "topics/beginners.mdx": [
    { id: "fitness-reality-810xlt", badge: "Best Starter Rack" },
    { id: "cap-barbell-olympic", badge: "Best Starter Barbell Set" },
  ],
  "topics/bodybuilding.mdx": [
    { id: "powerblock-elite-90", badge: "Best Adjustable Dumbbells" },
    { id: "flybird-adjustable-bench", badge: "Best Budget Bench" },
  ],
  "topics/budget-builds.mdx": [
    { id: "fitness-reality-810xlt", badge: "Best Budget Rack" },
    { id: "cap-barbell-olympic", badge: "Best Budget Barbell Set" },
  ],
  "topics/cardio.mdx": [
    { id: "rogue-echo-bike", badge: "Best Air Bike" },
    { id: "concept2-rowerg", badge: "Best Rower" },
  ],
  "topics/comparisons.mdx": [
    { id: "mikolo-f4-power-cage", badge: "Best Mid-Range Rack" },
  ],
  "topics/crossfit.mdx": [
    { id: "assault-airbike-classic", badge: "Best for CrossFit" },
    { id: "concept2-rowerg", badge: "Best Rower" },
  ],
  "topics/maintenance.mdx": [
    { id: "liquid-grip-chalk", badge: "Keep Equipment Clean" },
  ],
  "topics/mma-combat.mdx": [
    { id: "rogue-style-weight-vest", badge: "Best Weighted Vest" },
    { id: "yes4all-slam-ball", badge: "Best Slam Ball" },
  ],
  "topics/powerlifting.mdx": [
    { id: "titan-safety-squat-bar", badge: "Best Specialty Bar" },
    { id: "dark-iron-lifting-belt", badge: "Best Lifting Belt" },
  ],
  "topics/programming.mdx": [
    { id: "cap-barbell-olympic", badge: "Best Starter Set" },
    { id: "gymboss-timer", badge: "Best Interval Timer" },
  ],
  "topics/recovery.mdx": [
    { id: "triggerpoint-grid", badge: "Best Foam Roller" },
    { id: "theragun-mini", badge: "Best Massage Gun" },
  ],
  "topics/safety.mdx": [
    { id: "dark-iron-lifting-belt", badge: "Best Lifting Belt" },
    { id: "nordic-lifting-knee-sleeves", badge: "Best Knee Sleeves" },
  ],
  "topics/seniors.mdx": [
    { id: "bodylastics-resistance-bands", badge: "Best Resistance Bands" },
    { id: "flybird-adjustable-bench", badge: "Best Adjustable Bench" },
  ],
  "topics/small-spaces.mdx": [
    { id: "bowflex-selecttech-552", badge: "Best Space-Saving Dumbbells" },
    { id: "flybird-adjustable-bench", badge: "Foldable Bench" },
  ],
  "topics/women.mdx": [
    { id: "flybird-adjustable-bench", badge: "Best Starter Bench" },
    { id: "bodylastics-resistance-bands", badge: "Best Resistance Bands" },
  ],
  "topics/buying-guides.mdx": [
    { id: "fitness-reality-810xlt", badge: "Best Budget Rack" },
    { id: "flybird-adjustable-bench", badge: "Best Budget Bench" },
  ],
};

function addProductCards(filePath, products) {
  let content = fs.readFileSync(filePath, "utf8");

  // Check if any ProductCard or BuyButtons already exists
  if (/<ProductCard |<BuyButtons /.test(content)) {
    return false;
  }

  // Build the ProductCard block
  const cards = products
    .map((p) => `<ProductCard productId="${p.id}" badge="${p.badge}" />`)
    .join("\n\n");

  // Find the best insertion point
  // Strategy: Insert after the first paragraph that follows the first ## heading
  // This places products right where readers start reading the main content

  // For best-gear comparison files, insert after the first ## section intro
  // For guides/topics, insert after "## " second heading or before FAQ

  const lines = content.split("\n");
  let insertIndex = -1;

  // Strategy 1: Find the second ## heading and insert before it
  let headingCount = 0;
  for (let i = 0; i < lines.length; i++) {
    if (/^## /.test(lines[i])) {
      headingCount++;
      if (headingCount === 2) {
        // Insert before this heading (after the first section)
        insertIndex = i;
        break;
      }
    }
  }

  // Strategy 2: If only one heading or none found, insert after the first paragraph
  // after AffiliateDisclaimer
  if (insertIndex === -1) {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("<AffiliateDisclaimer")) {
        // Find the end of the next paragraph (first blank line after non-blank content)
        let foundContent = false;
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].trim()) foundContent = true;
          if (foundContent && !lines[j].trim()) {
            insertIndex = j + 1;
            break;
          }
        }
        break;
      }
    }
  }

  // Fallback: insert after line 15 (after frontmatter + AffiliateDisclaimer + intro)
  if (insertIndex === -1) {
    insertIndex = Math.min(15, lines.length);
  }

  // Insert the product cards
  lines.splice(insertIndex, 0, "", cards, "");
  content = lines.join("\n");

  fs.writeFileSync(filePath, content);
  return true;
}

// Process all mapped files
for (const [relPath, products] of Object.entries(productMap)) {
  const filePath = path.join(contentDir, relPath);
  if (!fs.existsSync(filePath)) {
    console.log(`SKIP (not found): ${relPath}`);
    continue;
  }

  const modified = addProductCards(filePath, products);
  if (modified) {
    filesModified++;
    const productIds = products.map((p) => p.id).join(", ");
    console.log(`Added: ${relPath} → [${productIds}]`);
  } else {
    console.log(`SKIP (already has products): ${relPath}`);
  }
}

console.log(`\nTotal files modified: ${filesModified}`);
