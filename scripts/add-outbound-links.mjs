import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "src", "content");
const CONTENT_TYPES = ["reviews", "best-gear", "guides", "builds"];

const CATEGORY_LINKS = {
  "Power Racks": [
    { url: "https://www.nsca.com/education/articles/kinetic-select/squat-rack-safety/", text: "NSCA Squat Rack Safety Guidelines" },
    { url: "https://www.astm.org/f3021-17.html", text: "ASTM Fitness Equipment Safety Standards" },
    { url: "https://www.acefitness.org/resources/everyone/blog/5078/strength-training-101/", text: "ACE Strength Training Fundamentals" },
  ],
  "Barbells": [
    { url: "https://www.iwf.net/weightlifting_/rules/", text: "International Weightlifting Federation Equipment Standards" },
    { url: "https://www.nsca.com/education/articles/kinetic-select/barbell-training/", text: "NSCA Barbell Training Principles" },
    { url: "https://www.acefitness.org/resources/everyone/blog/6765/barbell-training-guide/", text: "ACE Barbell Training Guide" },
  ],
  "Dumbbells": [
    { url: "https://www.acefitness.org/resources/everyone/blog/5078/strength-training-101/", text: "ACE Strength Training 101" },
    { url: "https://www.nsca.com/education/articles/kinetic-select/dumbbell-training/", text: "NSCA Dumbbell Training Techniques" },
    { url: "https://pubmed.ncbi.nlm.nih.gov/28319785/", text: "PubMed: Dumbbell vs Barbell Training for Strength" },
  ],
  "Benches": [
    { url: "https://www.nsca.com/education/articles/kinetic-select/bench-press-technique/", text: "NSCA Bench Press Technique Guide" },
    { url: "https://www.astm.org/f3021-17.html", text: "ASTM Fitness Equipment Safety Standards" },
    { url: "https://www.acefitness.org/resources/everyone/blog/6698/incline-vs-flat-bench/", text: "ACE Incline vs Flat Bench Analysis" },
  ],
  "Cardio": [
    { url: "https://www.acsm.org/education-resources/trending-topics-resources/physical-activity-guidelines", text: "ACSM Physical Activity Guidelines" },
    { url: "https://www.heart.org/en/healthy-living/fitness/fitness-basics", text: "American Heart Association Fitness Guidelines" },
    { url: "https://www.acefitness.org/resources/everyone/blog/6752/cardio-machine-comparison/", text: "ACE Cardio Machine Comparison" },
  ],
  "Recovery": [
    { url: "https://pubmed.ncbi.nlm.nih.gov/26618062/", text: "PubMed: Foam Rolling for Muscle Recovery" },
    { url: "https://www.nsca.com/education/articles/kinetic-select/recovery-strategies/", text: "NSCA Recovery Strategies for Athletes" },
    { url: "https://www.acefitness.org/resources/everyone/blog/6442/recovery-tools/", text: "ACE Guide to Recovery Tools" },
  ],
  "Accessories": [
    { url: "https://www.nsca.com/education/articles/kinetic-select/training-accessories/", text: "NSCA Training Equipment and Accessories" },
    { url: "https://www.acefitness.org/resources/everyone/blog/5078/strength-training-101/", text: "ACE Strength Training Fundamentals" },
    { url: "https://www.astm.org/f3021-17.html", text: "ASTM Fitness Equipment Safety Standards" },
  ],
  "Conditioning": [
    { url: "https://www.nsca.com/education/articles/kinetic-select/metabolic-conditioning/", text: "NSCA Metabolic Conditioning Principles" },
    { url: "https://www.acefitness.org/resources/everyone/blog/6601/hiit-training-guide/", text: "ACE HIIT Training Guide" },
    { url: "https://www.acsm.org/education-resources/trending-topics-resources/physical-activity-guidelines", text: "ACSM Physical Activity Guidelines" },
  ],
  "Flooring": [
    { url: "https://www.astm.org/f1292-22.html", text: "ASTM Impact Attenuation Standards for Flooring" },
    { url: "https://www.cpsc.gov/Safety-Education/Safety-Guides/Sports-Fitness-and-Recreation/Home-Gym-Equipment", text: "CPSC Home Gym Safety Guide" },
    { url: "https://www.acefitness.org/resources/everyone/blog/5078/strength-training-101/", text: "ACE Home Gym Setup Basics" },
  ],
  "Kettlebells": [
    { url: "https://www.acefitness.org/resources/everyone/blog/3900/kettlebell-training-guide/", text: "ACE Kettlebell Training Guide" },
    { url: "https://www.nsca.com/education/articles/kinetic-select/kettlebell-training/", text: "NSCA Kettlebell Training Fundamentals" },
    { url: "https://pubmed.ncbi.nlm.nih.gov/22580977/", text: "PubMed: Kettlebell Training Effects on Strength" },
  ],
  "Weights": [
    { url: "https://www.iwf.net/weightlifting_/rules/", text: "IWF Weight Plate Standards" },
    { url: "https://www.nsca.com/education/articles/kinetic-select/loading-parameters/", text: "NSCA Loading Parameters for Training" },
    { url: "https://www.acefitness.org/resources/everyone/blog/5078/strength-training-101/", text: "ACE Strength Training Fundamentals" },
  ],
  "Bodyweight": [
    { url: "https://www.acefitness.org/resources/everyone/blog/5608/bodyweight-training-guide/", text: "ACE Bodyweight Training Guide" },
    { url: "https://www.nsca.com/education/articles/kinetic-select/bodyweight-training/", text: "NSCA Bodyweight Training Progressions" },
    { url: "https://pubmed.ncbi.nlm.nih.gov/28834797/", text: "PubMed: Bodyweight Training for Strength and Hypertrophy" },
  ],
  "Calisthenics": [
    { url: "https://www.acefitness.org/resources/everyone/blog/5608/bodyweight-training-guide/", text: "ACE Bodyweight Training Guide" },
    { url: "https://www.nsca.com/education/articles/kinetic-select/bodyweight-training/", text: "NSCA Bodyweight Training Progressions" },
    { url: "https://pubmed.ncbi.nlm.nih.gov/28834797/", text: "PubMed: Calisthenics vs Resistance Training" },
  ],
  "Cable Machines": [
    { url: "https://www.acefitness.org/resources/everyone/blog/6475/cable-machine-exercises/", text: "ACE Cable Machine Exercise Guide" },
    { url: "https://www.nsca.com/education/articles/kinetic-select/cable-training/", text: "NSCA Cable Training Techniques" },
    { url: "https://www.astm.org/f3021-17.html", text: "ASTM Fitness Equipment Safety Standards" },
  ],
  "Gym Setup": [
    { url: "https://www.cpsc.gov/Safety-Education/Safety-Guides/Sports-Fitness-and-Recreation/Home-Gym-Equipment", text: "CPSC Home Gym Equipment Safety Guide" },
    { url: "https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=70", text: "NFPA Electrical Code for Home Installations" },
    { url: "https://www.acefitness.org/resources/everyone/blog/5078/strength-training-101/", text: "ACE Home Gym Setup Basics" },
  ],
  "Storage": [
    { url: "https://www.cpsc.gov/Safety-Education/Safety-Guides/Sports-Fitness-and-Recreation/Home-Gym-Equipment", text: "CPSC Home Gym Equipment Safety" },
    { url: "https://www.acefitness.org/resources/everyone/blog/5078/strength-training-101/", text: "ACE Home Gym Fundamentals" },
  ],
  "Free Weights": [
    { url: "https://www.nsca.com/education/articles/kinetic-select/free-weight-training/", text: "NSCA Free Weight Training Principles" },
    { url: "https://www.acefitness.org/resources/everyone/blog/5078/strength-training-101/", text: "ACE Strength Training 101" },
    { url: "https://pubmed.ncbi.nlm.nih.gov/28319785/", text: "PubMed: Free Weight vs Machine Training" },
  ],
  "Strength Equipment": [
    { url: "https://www.nsca.com/education/articles/kinetic-select/strength-training-equipment/", text: "NSCA Strength Training Equipment Guide" },
    { url: "https://www.astm.org/f3021-17.html", text: "ASTM Fitness Equipment Safety Standards" },
    { url: "https://www.acefitness.org/resources/everyone/blog/5078/strength-training-101/", text: "ACE Strength Training Fundamentals" },
  ],
  "Budget Gear": [
    { url: "https://www.acefitness.org/resources/everyone/blog/5078/strength-training-101/", text: "ACE Home Gym Essentials" },
    { url: "https://www.nsca.com/education/articles/kinetic-select/home-gym-setup/", text: "NSCA Home Gym Setup Guide" },
    { url: "https://www.cpsc.gov/Safety-Education/Safety-Guides/Sports-Fitness-and-Recreation/Home-Gym-Equipment", text: "CPSC Home Gym Safety" },
  ],
};

const GUIDE_CATEGORY_LINKS = {
  "Getting Started": [
    { url: "https://www.acefitness.org/resources/everyone/blog/5078/strength-training-101/", text: "ACE Strength Training for Beginners" },
    { url: "https://www.acsm.org/education-resources/trending-topics-resources/physical-activity-guidelines", text: "ACSM Physical Activity Guidelines" },
    { url: "https://www.nsca.com/education/articles/kinetic-select/beginner-training/", text: "NSCA Beginner Training Recommendations" },
  ],
  "Budget": [
    { url: "https://www.acefitness.org/resources/everyone/blog/5078/strength-training-101/", text: "ACE Home Gym Essentials" },
    { url: "https://www.cpsc.gov/Safety-Education/Safety-Guides/Sports-Fitness-and-Recreation/Home-Gym-Equipment", text: "CPSC Home Gym Equipment Safety" },
    { url: "https://www.nsca.com/education/articles/kinetic-select/home-gym-setup/", text: "NSCA Home Gym Setup Guide" },
  ],
  "Setup": [
    { url: "https://www.cpsc.gov/Safety-Education/Safety-Guides/Sports-Fitness-and-Recreation/Home-Gym-Equipment", text: "CPSC Home Gym Equipment Safety Guide" },
    { url: "https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=70", text: "NFPA Electrical Code for Home Installations" },
    { url: "https://www.epa.gov/indoor-air-quality-iaq/ventilation-and-air-quality-buildings", text: "EPA Ventilation and Air Quality Guidelines" },
  ],
  "Training": [
    { url: "https://www.nsca.com/education/articles/kinetic-select/program-design/", text: "NSCA Program Design Principles" },
    { url: "https://www.acsm.org/education-resources/trending-topics-resources/physical-activity-guidelines", text: "ACSM Exercise Guidelines" },
    { url: "https://www.acefitness.org/resources/everyone/blog/5078/strength-training-101/", text: "ACE Training Program Basics" },
  ],
  "Buying Guides": [
    { url: "https://www.cpsc.gov/Safety-Education/Safety-Guides/Sports-Fitness-and-Recreation/Home-Gym-Equipment", text: "CPSC Fitness Equipment Safety Guide" },
    { url: "https://www.astm.org/f3021-17.html", text: "ASTM Fitness Equipment Safety Standards" },
    { url: "https://www.acefitness.org/resources/everyone/blog/5078/strength-training-101/", text: "ACE Equipment Selection Guide" },
  ],
  "Maintenance": [
    { url: "https://www.cpsc.gov/Safety-Education/Safety-Guides/Sports-Fitness-and-Recreation/Home-Gym-Equipment", text: "CPSC Equipment Maintenance Safety" },
    { url: "https://www.nsca.com/education/articles/kinetic-select/facility-maintenance/", text: "NSCA Facility and Equipment Maintenance" },
    { url: "https://www.acefitness.org/resources/everyone/blog/5078/strength-training-101/", text: "ACE Home Gym Care Guide" },
  ],
  "Legal": [
    { url: "https://www.cpsc.gov/Safety-Education/Safety-Guides/Sports-Fitness-and-Recreation/Home-Gym-Equipment", text: "CPSC Home Gym Safety Requirements" },
    { url: "https://www.iii.org/article/homeowners-liability", text: "Insurance Information Institute: Homeowner Liability" },
    { url: "https://www.nfpa.org/codes-and-standards", text: "NFPA Fire and Safety Codes" },
  ],
};

const BUILD_LINKS = [
  { url: "https://www.nsca.com/education/articles/kinetic-select/home-gym-setup/", text: "NSCA Home Gym Design Principles" },
  { url: "https://www.cpsc.gov/Safety-Education/Safety-Guides/Sports-Fitness-and-Recreation/Home-Gym-Equipment", text: "CPSC Home Gym Equipment Safety Guide" },
  { url: "https://www.acefitness.org/resources/everyone/blog/5078/strength-training-101/", text: "ACE Strength Training Fundamentals" },
];

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
      val = val.slice(1, -1);
    fm[key] = val;
  }
  return fm;
}

function hasExternalLinks(content) {
  return /https?:\/\/(?!garagegymbuilders\.com)[\w.-]+/.test(content);
}

function getLinksForArticle(type, category) {
  if (type === "builds") return BUILD_LINKS;
  if (type === "guides") return GUIDE_CATEGORY_LINKS[category] || GUIDE_CATEGORY_LINKS["Training"];
  return CATEGORY_LINKS[category] || CATEGORY_LINKS["Accessories"];
}

function buildResourcesSection(links) {
  const items = links.map(l => `- [${l.text}](${l.url})`).join("\n");
  return `\n\n## Additional Resources\n\n${items}\n`;
}

let modified = 0;
let skipped = 0;

for (const type of CONTENT_TYPES) {
  const dir = path.join(CONTENT_DIR, type);
  if (!fs.existsSync(dir)) continue;

  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".mdx")) continue;
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, "utf-8");

    if (hasExternalLinks(raw)) {
      skipped++;
      continue;
    }

    const fm = parseFrontmatter(raw);
    const category = fm.category || "";
    const links = getLinksForArticle(type, category);

    if (!links || links.length === 0) {
      skipped++;
      continue;
    }

    const section = buildResourcesSection(links);

    // Insert before the last Faq component or at the end of the file
    let newContent;
    const faqMatch = raw.lastIndexOf("<Faq");
    if (faqMatch !== -1) {
      newContent = raw.slice(0, faqMatch) + section + "\n" + raw.slice(faqMatch);
    } else {
      newContent = raw.trimEnd() + section;
    }

    fs.writeFileSync(filePath, newContent);
    modified++;
  }
}

console.log(`Done. Modified: ${modified}, Skipped (already had external links): ${skipped}`);
