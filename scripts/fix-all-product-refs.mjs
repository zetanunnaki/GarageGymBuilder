import fs from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "src/content");
const contentTypes = ["best-gear", "reviews", "guides", "builds", "topics"];
let filesModified = 0;
let totalReplacements = 0;

function countChanges(original, updated) {
  if (original === updated) return 0;
  let count = 0;
  for (let i = 0; i < Math.max(original.length, updated.length); i++) {
    if (original[i] !== updated[i]) { count++; break; }
  }
  return count || 1;
}

function isInUrl(content, matchIndex) {
  const before = content.substring(Math.max(0, matchIndex - 200), matchIndex);
  return /\]\([^)]*$/.test(before) || /href="[^"]*$/.test(before) || /\/[a-z-]*$/.test(before.slice(-40));
}

function isInProductId(content, matchIndex) {
  const before = content.substring(Math.max(0, matchIndex - 80), matchIndex);
  return /productId="[^"]*$/.test(before);
}

function contextReplace(content, pattern, replacement, contextPattern) {
  if (!contextPattern) return content.replace(pattern, replacement);

  const lines = content.split("\n");
  let changed = false;
  for (let i = 0; i < lines.length; i++) {
    if (pattern.test && pattern.test(lines[i])) {
      const window = lines.slice(Math.max(0, i - 3), Math.min(lines.length, i + 4)).join(" ");
      if (contextPattern.test(window)) {
        const newLine = lines[i].replace(pattern, replacement);
        if (newLine !== lines[i]) {
          lines[i] = newLine;
          changed = true;
        }
      }
    } else if (typeof pattern === "string" && lines[i].includes(pattern)) {
      const window = lines.slice(Math.max(0, i - 3), Math.min(lines.length, i + 4)).join(" ");
      if (contextPattern.test(window)) {
        lines[i] = lines[i].replaceAll(pattern, replacement);
        changed = true;
      }
    }
  }
  return changed ? lines.join("\n") : content;
}

function applyReplacements(content, filePath) {
  const original = content;
  const fileName = path.basename(filePath);

  // ============================================================
  // PHASE 1: PRODUCT NAME REPLACEMENTS (safe global replacements)
  // Order matters — longer/more specific patterns first
  // ============================================================

  // --- ROGUE ECHO BIKE → SCHWINN AIRDYNE ---
  // Don't replace in URLs like /reviews/rogue-echo-bike-review/
  // Don't replace in productId="rogue-echo-bike"
  // Don't replace in image paths
  content = content.replace(/(?<!\/)(?<!productId=")(?<!images\/products\/)Rogue Echo Bike(?![-\/\.])/g, "Schwinn Airdyne Bike Series");
  // "the Echo Bike" standalone references
  content = content.replace(/(?<!\/)the Echo Bike(?![-\/\.])/g, "the Schwinn Airdyne");
  content = content.replace(/(?<!\/)The Echo Bike(?![-\/\.])/g, "The Schwinn Airdyne");
  // "an Echo Bike"
  content = content.replace(/(?<!\/)an Echo Bike(?![-\/\.])/g, "a Schwinn Airdyne");
  content = content.replace(/(?<!\/)An Echo Bike(?![-\/\.])/g, "A Schwinn Airdyne");
  // "Echo Bike" at start of sentence or after punctuation (but not in URLs)
  // Be careful: only replace "Echo Bike" when it's clearly the product name
  content = content.replace(/(?<=\. |^|\n|— |: |\*\*)Echo Bike(?![-\/\.])/gm, "Schwinn Airdyne");
  // "your Echo Bike", "my Echo Bike", etc.
  content = content.replace(/(?<=your |my |their |its |this |that )Echo Bike/g, "Schwinn Airdyne");
  // "Echo Bike's" possessive
  content = content.replace(/Echo Bike's/g, "Schwinn Airdyne's");
  // Remaining "Echo Bike" references (standalone, not in URLs)
  // Use a more targeted approach: replace only in non-URL contexts
  content = content.replace(/(?<![\/\w-])Echo Bike(?![-\/\w])/g, "Schwinn Airdyne");

  // --- ASSAULT AIRBIKE → SUNNY HEALTH SF-B223018 ---
  content = content.replace(/Assault AirBike Classic/g, "Sunny Health & Fitness SF-B223018 Fan Bike");
  content = content.replace(/Assault AirBike/g, "Sunny Health SF-B223018");
  content = content.replace(/Assault Air Bike/g, "Sunny Health SF-B223018");
  // "Assault Fitness" brand references
  content = content.replace(/Assault Fitness/g, "Sunny Health & Fitness");
  // "the Assault" standalone references in air bike context
  content = content.replace(/(?<=alongside |versus |vs\.? |or |than |over )the Assault/g, "the Sunny Health SF-B223018");

  // --- FITNESS REALITY 810XLT → ULTRA FUEGO ---
  content = content.replace(/Fitness Reality 810XLT/g, "ULTRA FUEGO Power Cage");
  content = content.replace(/Fitness Reality rack/g, "ULTRA FUEGO rack");
  content = content.replace(/Fitness Reality cage/g, "ULTRA FUEGO cage");
  // "Fitness Reality" as standalone brand (only when clearly referring to the power cage)
  // Context-aware: only near rack/cage/power references
  content = contextReplace(content, /Fitness Reality(?!'s| 810)/g, "ULTRA FUEGO", /rack|cage|power|squat|bench press|barbell|pull-up/i);

  // --- YES4ALL HEX TRAP BAR → BELLS OF STEEL ---
  content = content.replace(/Yes4All Olympic Hex Trap Bar/g, "Bells of Steel Trap Bar");
  content = content.replace(/Yes4All Hex Trap Bar/g, "Bells of Steel Trap Bar");
  content = content.replace(/Yes4All Olympic Trap Bar/g, "Bells of Steel Trap Bar");
  content = content.replace(/Yes4All Trap Bar/g, "Bells of Steel Trap Bar");
  // "Yes4All trap bar" (lowercase trap bar)
  content = content.replace(/Yes4All trap bar/g, "Bells of Steel trap bar");

  // --- XTERRA TR150 → PREMIUM FOLDING SMART TREADMILL ---
  content = content.replace(/XTERRA Fitness TR150 Folding Treadmill/g, "XTERRA Premium Folding Smart Treadmill");
  content = content.replace(/XTERRA TR150 Folding Treadmill/g, "XTERRA Premium Folding Smart Treadmill");
  content = content.replace(/XTERRA TR150/g, "XTERRA Smart Treadmill");
  // Just "TR150" in treadmill context
  content = contextReplace(content, /(?<!\w)TR150(?!\w)/g, "Smart Treadmill", /treadmill|XTERRA|cardio|walking|running|jogging/i);

  // --- VALOR FITNESS BD-62 → VALOR FITNESS WALL MOUNT ---
  content = content.replace(/Valor Fitness BD-62 Wall Mount Cable Station/g, "Valor Fitness Wall Mounted Cable Machine");
  content = content.replace(/Valor Fitness BD-62/g, "Valor Fitness Wall Mount Cable Machine");
  content = content.replace(/BD-62 Wall Mount/g, "Wall Mounted Cable Machine");
  content = content.replace(/BD-62(?!\w)/g, "Wall Mount Cable Machine");

  // --- STAMINA 1690 POWER TOWER ---
  content = content.replace(/Stamina 1690 Power Tower/g, "Stamina Power Tower");
  content = content.replace(/Stamina 1690/g, "Stamina Power Tower");

  // --- YES4ALL ROMAN CHAIR → YES4ALL ADJUSTABLE WEIGHT BENCH ---
  content = content.replace(/Yes4All Roman Chair/g, "Yes4All Adjustable Weight Bench");
  content = content.replace(/Yes4All Hyperextension Bench/g, "Yes4All Adjustable Weight Bench");
  content = content.replace(/Yes4All hyperextension bench/g, "Yes4All Adjustable Weight Bench");

  // --- LUXFIT → TRIGGERPOINT ---
  content = content.replace(/LuxFit Premium High Density Foam Roller/g, "TriggerPoint Grid Foam Roller");
  content = content.replace(/LuxFit Premium Foam Roller/g, "TriggerPoint Grid Foam Roller");
  content = content.replace(/LuxFit Foam Roller/g, "TriggerPoint Grid Foam Roller");
  content = content.replace(/LuxFit foam roller/g, "TriggerPoint Grid foam roller");
  content = content.replace(/(?<=the |a |an )LuxFit(?= )/g, "TriggerPoint");
  content = content.replace(/LuxFit's/g, "TriggerPoint's");

  // --- XMARK → DELTECH FITNESS ---
  content = content.replace(/XMark Preacher Curl Bench/g, "Deltech Fitness DF308 Preacher Curl Bench");
  content = content.replace(/XMark preacher curl/g, "Deltech Fitness preacher curl");
  content = content.replace(/XMark curl bench/g, "Deltech Fitness curl bench");
  // "XMark" standalone in preacher/curl context
  content = contextReplace(content, /XMark(?!\w)/g, "Deltech Fitness", /preacher|curl|bench|arm/i);

  // --- YES4ALL PARALLETTES → TECLOR ---
  content = content.replace(/Yes4All Parallettes/g, "Teclor Parallettes");
  content = content.replace(/Yes4All parallettes/g, "Teclor parallettes");

  // --- ROGUE-STYLE GYMNASTIC RINGS → DOUBLE CIRCLE ---
  content = content.replace(/Yes4All Wood Gymnastic Rings/g, "Double Circle Wood Gymnastics Rings");

  // --- ROGUE-STYLE WEIGHT VEST → RUNFAST ---
  content = content.replace(/Rogue-style weight vest/g, "RUNFast Pro Weighted Vest");

  // ============================================================
  // PHASE 2: PRICE REPLACEMENTS (context-aware)
  // ============================================================

  // --- $895 → $1,299 (Schwinn Airdyne / Echo Bike) ---
  // $895 is unique to the Echo Bike across the site
  content = content.replace(/\$895/g, "$1,299");

  // --- $749 → $699.99 (Assault AirBike / Sunny Health) ---
  // $749 is unique to the Assault AirBike
  content = content.replace(/\$749/g, "$699.99");

  // --- $549.99 / $549 → $309.98 (Sportsroyals Power Cage) ---
  content = content.replace(/\$549\.99/g, "$309.98");
  content = content.replace(/\$549(?!\.\d)/g, "$309.98");

  // --- $179.99 → $459.99 (Titan Safety Squat Bar) ---
  content = contextReplace(content, /\$179\.99/g, "$459.99", /safety squat|SSB|titan|squat bar|cambered/i);
  content = contextReplace(content, /\$179(?!\.\d)/g, "$459.99", /safety squat|SSB|titan.*squat|squat bar/i);

  // --- $119.99 → $346.99 (Stamina Power Tower) ---
  content = contextReplace(content, /\$119\.99/g, "$346.99", /stamina|power tower|1690|pull-up.*dip|dip.*pull-up/i);
  content = contextReplace(content, /\$119(?!\.\d)/g, "$346.99", /stamina|power tower|1690/i);

  // --- $489 → $474.99 (Mikolo F4) ---
  content = contextReplace(content, /\$489(?!\.\d)/g, "$474.99", /mikolo|F4|power cage|power rack/i);

  // --- $249 (AMBIGUOUS — Valor cable station OR XTERRA treadmill) ---
  // Valor context: cable, BD-62, Valor, pulley
  content = contextReplace(content, /\$249(?!\.\d)/g, "$329.98", /valor|cable station|cable machine|wall mount|BD-62|pulley/i);
  // XTERRA context: treadmill, XTERRA, TR150, walking, running, folding treadmill
  content = contextReplace(content, /\$249(?!\.\d)/g, "$523.96", /xterra|treadmill|TR150|folding.*tread|walking.*machine/i);

  // --- $250 (Valor cable station context) ---
  content = contextReplace(content, /\$250(?!\.\d)/g, "$329.98", /valor|cable station|cable machine|wall mount|BD-62|pulley/i);

  // --- $130 (AMBIGUOUS — trap bar OR Roman Chair) ---
  // Trap bar context
  content = contextReplace(content, /\$130(?!\.\d)/g, "$299.99", /trap bar|hex bar|bells of steel|deadlift.*bar/i);
  // Roman Chair context
  content = contextReplace(content, /\$130(?!\.\d)/g, "$225.26", /roman chair|hyperextension|back extension|yes4all.*bench|adjustable.*bench.*rack/i);

  // --- $90 (weight vest context) ---
  content = contextReplace(content, /\$90(?!\d)/g, "$55.99", /weight vest|weighted vest|RUNFast|vest.*training/i);

  // --- $80 (compact strider context) ---
  content = contextReplace(content, /\$80(?!\d)/g, "$127.99", /compact strider|stamina.*strider|inmotion|under.*desk|elliptical.*compact/i);

  // --- $100 or similar for XMark preacher curl → $239 ---
  content = contextReplace(content, /\$100(?!\d)/g, "$239", /preacher curl|deltech|xmark|curl bench/i);

  // ============================================================
  // PHASE 3: FRONTMATTER-SPECIFIC FIXES
  // ============================================================

  // Fix review file titles and descriptions
  if (fileName === "rogue-echo-bike-review.mdx") {
    content = content.replace(
      "title: 'Rogue Echo Bike Review: The Ultimate Home Gym Cardio Machine?'",
      "title: 'Schwinn Airdyne Bike Series Review: The Ultimate Home Gym Cardio Machine?'"
    );
    content = content.replace(
      "seoTitle: Rogue Echo Bike Review (2026) | GarageGymBuilders",
      "seoTitle: Schwinn Airdyne Bike Series Review (2026) | GarageGymBuilders"
    );
    content = content.replace(
      /A brutally honest review of the Rogue Echo Bike/,
      "A brutally honest review of the Schwinn Airdyne Bike Series"
    );
  }

  if (fileName === "assault-airbike-review.mdx") {
    content = content.replace(
      "title: 'Assault AirBike Classic Review: The Original vs the Rogue Echo'",
      "title: 'Sunny Health SF-B223018 Fan Bike Review: Premium Air Bike for Home Gyms'"
    );
    content = content.replace(
      "seoTitle: Assault AirBike Classic Review (2026) | GarageGymBuilders",
      "seoTitle: Sunny Health SF-B223018 Fan Bike Review (2026) | GarageGymBuilders"
    );
    content = content.replace(
      /Our hands-on review of the Assault AirBike Classic/,
      "Our hands-on review of the Sunny Health & Fitness SF-B223018 Fan Bike"
    );
    content = content.replace(
      "How does it compare to the Rogue Echo Bike?",
      "How does it compare to the Schwinn Airdyne?"
    );
  }

  if (fileName === "xterra-treadmill-review.mdx") {
    content = content.replace(
      "title: 'XTERRA TR150 Folding Treadmill Review: Best Budget Treadmill Under $300?'",
      "title: 'XTERRA Premium Folding Smart Treadmill Review: Best Budget Folding Treadmill?'"
    );
    content = content.replace(
      "seoTitle: XTERRA Fitness TR150 Folding Treadmill Review (2026) | GarageGymBuilders",
      "seoTitle: XTERRA Premium Folding Smart Treadmill Review (2026) | GarageGymBuilders"
    );
    content = content.replace(
      /We tested the XTERRA TR150 folding treadmill/,
      "We tested the XTERRA Premium Folding Smart Treadmill"
    );
  }

  if (fileName === "stamina-power-tower-review.mdx") {
    content = content.replace(
      "title: 'Stamina 1690 Power Tower Review: Worth the Money?'",
      "title: 'Stamina Power Tower Review: Worth the Money?'"
    );
    content = content.replace(
      "seoTitle: Stamina 1690 Power Tower Review (2026) | GarageGymBuilders",
      "seoTitle: Stamina Power Tower Review (2026) | GarageGymBuilders"
    );
    content = content.replace(
      /Hands-on review of the Stamina 1690 Power Tower\. Is \$119\.99 worth it/,
      "Hands-on review of the Stamina Power Tower. Is $346.99 worth it"
    );
    content = content.replace(
      /Hands-on review of the Stamina Power Tower\. Is \$119\.99 worth it/,
      "Hands-on review of the Stamina Power Tower. Is $346.99 worth it"
    );
  }

  if (fileName === "valor-fitness-bd62-review.mdx") {
    content = content.replace(/Valor Fitness BD-62/g, "Valor Fitness Wall Mount Cable Machine");
  }

  if (fileName === "yes4all-hex-trap-bar-review.mdx") {
    content = content.replace(
      /Yes4All Olympic Hex Trap Bar Review/g,
      "Bells of Steel Trap Bar Review"
    );
    content = content.replace(
      /yes4all hex trap bar review/gi,
      "bells of steel trap bar review"
    );
  }

  if (fileName === "yes4all-roman-chair-review.mdx") {
    content = content.replace(
      /Yes4All Roman Chair Review/g,
      "Yes4All Adjustable Weight Bench Review"
    );
  }

  // ============================================================
  // PHASE 4: COMPARISON FILE TITLE/SEO FIXES
  // ============================================================

  if (fileName === "yes4all-trap-bar-vs-rogue.mdx") {
    content = content.replace(
      /Yes4All Trap Bar vs Rogue/g,
      "Bells of Steel Trap Bar vs Rogue"
    );
    content = content.replace(
      /yes4all.*trap.*bar.*vs.*rogue/gi,
      "Bells of Steel Trap Bar vs Rogue"
    );
  }

  if (fileName === "titan-ssb-vs-yes4all-trap-bar.mdx") {
    content = content.replace(
      /Yes4All Trap Bar/g,
      "Bells of Steel Trap Bar"
    );
  }

  if (fileName === "fitness-reality-vs-sportsroyals.mdx") {
    content = content.replace(
      /Fitness Reality/g,
      "ULTRA FUEGO"
    );
  }

  if (fileName === "is-fitness-reality-810xlt-worth-it.mdx") {
    content = content.replace(
      /Fitness Reality 810XLT/g,
      "ULTRA FUEGO Power Cage"
    );
    content = content.replace(
      /Fitness Reality/g,
      "ULTRA FUEGO"
    );
  }

  // ============================================================
  // PHASE 5: PRICE CONTEXT FIXES IN BUILD FILES
  // Budget tables need price corrections
  // ============================================================

  // "under $300" for treadmill → "under $550"
  content = contextReplace(content, /under \$300/g, "under $550", /treadmill|XTERRA|walking|folding/i);

  // "under $500" for Sportsroyals → "under $350"
  content = contextReplace(content, /under \$550(?!\d)/g, "under $350", /sportsroyals|power rack|power cage/i);

  // "under $120" for Stamina Power Tower → "under $350"
  content = contextReplace(content, /under \$120(?!\d)/g, "under $350", /stamina|power tower/i);

  // ============================================================
  // PHASE 6: CLEAN UP DOUBLE-REPLACEMENTS
  // ============================================================

  // Fix potential double replacements like "Schwinn Airdyne Bike Series Bike Series"
  content = content.replace(/Schwinn Airdyne Bike Series Bike Series/g, "Schwinn Airdyne Bike Series");
  // Fix "Sunny Health & Fitness SF-B223018 Fan Bike Fan Bike"
  content = content.replace(/SF-B223018 Fan Bike Fan Bike/g, "SF-B223018 Fan Bike");
  // Fix "ULTRA FUEGO Power Cage Power Cage"
  content = content.replace(/ULTRA FUEGO Power Cage Power Cage/g, "ULTRA FUEGO Power Cage");
  // Fix "Bells of Steel Trap Bar Trap Bar"
  content = content.replace(/Bells of Steel Trap Bar Trap Bar/g, "Bells of Steel Trap Bar");
  // Fix double Deltech
  content = content.replace(/Deltech Fitness Deltech Fitness/g, "Deltech Fitness");
  // Fix "Valor Fitness Wall Mount Cable Machine Cable Machine"
  content = content.replace(/Wall Mount Cable Machine Cable Machine/g, "Wall Mount Cable Machine");
  content = content.replace(/Wall Mounted Cable Machine Cable Machine/g, "Wall Mounted Cable Machine");
  // Fix "Stamina Power Tower Power Tower"
  content = content.replace(/Stamina Power Tower Power Tower/g, "Stamina Power Tower");
  // Fix "TriggerPoint Grid Foam Roller Foam Roller"
  content = content.replace(/TriggerPoint Grid Foam Roller Foam Roller/g, "TriggerPoint Grid Foam Roller");
  // Fix "XTERRA Smart Treadmill Treadmill"
  content = content.replace(/XTERRA Smart Treadmill Treadmill/g, "XTERRA Smart Treadmill");
  content = content.replace(/XTERRA Premium Folding Smart Treadmill Treadmill/g, "XTERRA Premium Folding Smart Treadmill");
  // Fix "Yes4All Adjustable Weight Bench Adjustable Weight Bench"
  content = content.replace(/Yes4All Adjustable Weight Bench Adjustable Weight Bench/g, "Yes4All Adjustable Weight Bench");
  // Fix "Teclor Parallettes Parallettes"
  content = content.replace(/Teclor Parallettes Parallettes/g, "Teclor Parallettes");

  if (content !== original) {
    const changes = content.split("\n").filter((line, i) => line !== original.split("\n")[i]).length;
    return { content, changes };
  }
  return { content: original, changes: 0 };
}

// Main processing
for (const type of contentTypes) {
  const dir = path.join(contentDir, type);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

  for (const file of files) {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, "utf8");
    const result = applyReplacements(content, filePath);

    if (result.changes > 0) {
      fs.writeFileSync(filePath, result.content);
      filesModified++;
      totalReplacements += result.changes;
      console.log(`Fixed: ${type}/${file} (${result.changes} lines changed)`);
    }
  }
}

console.log(`\nTotal files modified: ${filesModified}`);
console.log(`Total lines changed: ${totalReplacements}`);
