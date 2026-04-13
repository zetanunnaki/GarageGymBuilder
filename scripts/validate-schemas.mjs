// Walks the build output (out/) and validates every JSON-LD <script>
// block against schema.org structural rules. Reports errors and warnings.
//
// Usage: node scripts/validate-schemas.mjs
// Returns exit code 1 if any errors are found.

import fs from "fs";
import path from "path";

const outDir = path.join(process.cwd(), "out");

if (!fs.existsSync(outDir)) {
  console.error("out/ does not exist — run `npm run build` first.");
  process.exit(1);
}

// Required fields per schema.org type. Keys are @type values.
const REQUIRED = {
  Article: ["headline", "datePublished", "author"],
  BlogPosting: ["headline", "datePublished", "author"],
  Review: ["itemReviewed", "author"],
  Product: ["name"],
  HowTo: ["name", "step"],
  FAQPage: ["mainEntity"],
  Person: ["name"],
  Organization: ["name", "url"],
  WebSite: ["name", "url"],
  BreadcrumbList: ["itemListElement"],
  CollectionPage: ["name"],
  ItemList: ["itemListElement"],
  DefinedTermSet: ["name"],
  WebPage: ["name"],
};

// Recommended fields — emit warnings, not errors, when missing.
const RECOMMENDED = {
  Article: ["image", "publisher", "mainEntityOfPage"],
  BlogPosting: ["image", "publisher", "mainEntityOfPage", "wordCount"],
  Review: ["reviewRating", "datePublished"],
  Product: ["brand", "image", "offers"],
  Organization: ["logo"],
  WebSite: ["potentialAction"],
  Person: ["jobTitle", "url"],
  HowTo: ["description", "image"],
  CollectionPage: ["url", "description"],
};

let errorCount = 0;
let warningCount = 0;
let schemaCount = 0;
let pageCount = 0;
const errorsByType = {};
const warningsByType = {};

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name === "index.html") out.push(p);
  }
  return out;
}

function extractJsonLd(html) {
  const blocks = [];
  const re =
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const raw = m[1].trim();
    try {
      blocks.push({ raw, parsed: JSON.parse(raw) });
    } catch (err) {
      blocks.push({
        raw,
        parsed: null,
        parseError: err instanceof Error ? err.message : String(err),
      });
    }
  }
  return blocks;
}

function validateNode(node, location) {
  if (!node || typeof node !== "object" || Array.isArray(node)) return;
  const type = node["@type"];
  if (!type) return;

  // Track per-type usage
  const typeName = Array.isArray(type) ? type[0] : type;
  schemaCount++;

  // @context check at the root only
  if (!node._isNested && !node["@context"]) {
    addError(typeName, `${location}: missing @context on root @type ${typeName}`);
  } else if (
    !node._isNested &&
    typeof node["@context"] === "string" &&
    !node["@context"].includes("schema.org")
  ) {
    addWarning(typeName, `${location}: @context should be https://schema.org`);
  }

  // Required fields
  const required = REQUIRED[typeName] || [];
  for (const field of required) {
    if (
      node[field] === undefined ||
      node[field] === null ||
      (Array.isArray(node[field]) && node[field].length === 0)
    ) {
      addError(typeName, `${location}: ${typeName} missing required field "${field}"`);
    }
  }

  // Recommended fields
  const recommended = RECOMMENDED[typeName] || [];
  for (const field of recommended) {
    if (node[field] === undefined || node[field] === null) {
      addWarning(typeName, `${location}: ${typeName} missing recommended field "${field}"`);
    }
  }

  // Type-specific deeper checks
  if (typeName === "Review") {
    if (node.itemReviewed && typeof node.itemReviewed === "object") {
      // mark nested so we don't require @context
      node.itemReviewed._isNested = true;
      validateNode(node.itemReviewed, location + " > itemReviewed");
    }
    if (node.reviewRating && typeof node.reviewRating === "object") {
      const r = node.reviewRating;
      if (r.ratingValue === undefined) {
        addError(typeName, `${location}: Review.reviewRating missing ratingValue`);
      }
    }
  }

  if (typeName === "Product") {
    if (node.offers && typeof node.offers === "object") {
      const o = node.offers;
      if (!o.price && !o.priceSpecification) {
        addWarning(typeName, `${location}: Product.offers should have price`);
      }
      if (!o.priceCurrency) {
        addWarning(typeName, `${location}: Product.offers should have priceCurrency`);
      }
    }
    if (node.aggregateRating && typeof node.aggregateRating === "object") {
      if (node.aggregateRating.ratingValue === undefined) {
        addError(typeName, `${location}: Product.aggregateRating missing ratingValue`);
      }
      if (node.aggregateRating.reviewCount === undefined &&
          node.aggregateRating.ratingCount === undefined) {
        addWarning(typeName, `${location}: Product.aggregateRating missing reviewCount/ratingCount`);
      }
    }
  }

  if (typeName === "HowTo" && Array.isArray(node.step)) {
    for (let i = 0; i < node.step.length; i++) {
      const s = node.step[i];
      if (!s.name && !s.text) {
        addError(typeName, `${location}: HowTo.step[${i}] missing name and text`);
      }
    }
  }

  if (typeName === "BreadcrumbList" && Array.isArray(node.itemListElement)) {
    for (let i = 0; i < node.itemListElement.length; i++) {
      const item = node.itemListElement[i];
      if (item.position === undefined) {
        addError(typeName, `${location}: BreadcrumbList.itemListElement[${i}] missing position`);
      }
      if (!item.name) {
        addError(typeName, `${location}: BreadcrumbList.itemListElement[${i}] missing name`);
      }
    }
  }

  if (typeName === "FAQPage" && Array.isArray(node.mainEntity)) {
    for (let i = 0; i < node.mainEntity.length; i++) {
      const q = node.mainEntity[i];
      if (q["@type"] !== "Question") {
        addError(typeName, `${location}: FAQPage.mainEntity[${i}] should be @type Question`);
      }
      if (!q.name) {
        addError(typeName, `${location}: FAQPage.mainEntity[${i}] (Question) missing name`);
      }
      if (!q.acceptedAnswer || !q.acceptedAnswer.text) {
        addError(typeName, `${location}: FAQPage.mainEntity[${i}] missing acceptedAnswer.text`);
      }
    }
  }
}

function addError(type, msg) {
  errorCount++;
  if (!errorsByType[type]) errorsByType[type] = [];
  errorsByType[type].push(msg);
}

function addWarning(type, msg) {
  warningCount++;
  if (!warningsByType[type]) warningsByType[type] = [];
  warningsByType[type].push(msg);
}

const files = walk(outDir);
console.log(`Validating JSON-LD across ${files.length} HTML files...\n`);

for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const blocks = extractJsonLd(html);
  if (blocks.length === 0) continue;
  pageCount++;

  const rel = path.relative(outDir, file);
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.parseError) {
      addError("ParseError", `${rel} block#${i + 1}: invalid JSON — ${block.parseError}`);
      continue;
    }
    validateNode(block.parsed, `${rel} block#${i + 1}`);
  }
}

console.log(`Pages with JSON-LD: ${pageCount}`);
console.log(`Total schema nodes: ${schemaCount}`);
console.log(`Errors: ${errorCount}`);
console.log(`Warnings: ${warningCount}\n`);

if (errorCount > 0) {
  console.log("=== ERRORS ===");
  for (const [type, msgs] of Object.entries(errorsByType)) {
    console.log(`\n[${type}] ${msgs.length}`);
    // Show first 5 of each type to keep output manageable
    for (const m of msgs.slice(0, 5)) {
      console.log(`  ✗ ${m}`);
    }
    if (msgs.length > 5) {
      console.log(`  ... and ${msgs.length - 5} more`);
    }
  }
}

if (warningCount > 0) {
  console.log("\n=== WARNINGS (top by type) ===");
  for (const [type, msgs] of Object.entries(warningsByType)) {
    console.log(`\n[${type}] ${msgs.length}`);
    for (const m of msgs.slice(0, 3)) {
      console.log(`  ⚠ ${m}`);
    }
    if (msgs.length > 3) {
      console.log(`  ... and ${msgs.length - 3} more`);
    }
  }
}

if (errorCount === 0) {
  console.log("\n✓ All schemas pass structural validation");
}

process.exit(errorCount > 0 ? 1 : 0);
