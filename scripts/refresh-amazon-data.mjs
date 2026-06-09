/**
 * Refresh product data (name, price, image) from the Amazon Creators API.
 *
 *   node scripts/refresh-amazon-data.mjs --probe   # auth + dump raw JSON for 2 ASINs (discover field paths)
 *   node scripts/refresh-amazon-data.mjs --dry-run  # fetch all, print proposed changes, write nothing
 *   node scripts/refresh-amazon-data.mjs            # fetch all + write products.json
 *
 * Creators API replaced PA-API 5.0 on 2026-05-15. Auth is LWA OAuth (client_credentials),
 * NOT SigV4. Credentials live in .env (gitignored).
 */
import fs from "fs";
import path from "path";

// --- minimal .env loader (no dependency) ---
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*?)\s*$/);
    if (m && !line.trim().startsWith("#") && !(m[1] in process.env)) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

const CLIENT_ID = process.env.AMAZON_CREATORS_CLIENT_ID;
const CLIENT_SECRET = process.env.AMAZON_CREATORS_CLIENT_SECRET;
const PARTNER_TAG = process.env.AMAZON_PARTNER_TAG || "garagegymbu0e-20";
const MARKETPLACE = "www.amazon.com";
const TOKEN_URL = "https://api.amazon.com/auth/o2/token";
const API_URL = "https://creatorsapi.amazon/catalog/v1/getItems";
const PRODUCTS_PATH = path.join(process.cwd(), "src/data/products.json");

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("✖ Missing AMAZON_CREATORS_CLIENT_ID / _SECRET (check .env)");
  process.exit(1);
}

const mode = process.argv.includes("--probe")
  ? "probe"
  : process.argv.includes("--dry-run")
    ? "dry-run"
    : "write";

function extractAsin(url) {
  const m = String(url || "").match(/\/dp\/([A-Z0-9]{10})/);
  return m ? m[1] : null;
}

async function getToken() {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      scope: "creatorsapi::default",
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Token request failed ${res.status}: ${text}`);
  return JSON.parse(text).access_token;
}

async function getItems(token, asins) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-marketplace": MARKETPLACE,
    },
    body: JSON.stringify({
      itemIds: asins,
      itemIdType: "ASIN",
      resources: [
        "itemInfo.title",
        "images.primary.large",
        "offersV2.listings.price",
        "offersV2.listings.availability",
        "offersV2.listings.condition",
      ],
      partnerTag: PARTNER_TAG,
      partnerType: "Associates",
      marketplace: MARKETPLACE,
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`getItems failed ${res.status}: ${text}`);
  return JSON.parse(text);
}

async function main() {
  const catalog = JSON.parse(fs.readFileSync(PRODUCTS_PATH, "utf8"));
  const entries = Object.entries(catalog)
    .map(([slug, p]) => ({ slug, asin: extractAsin(p.amazonLink), product: p }))
    .filter((e) => e.asin);

  console.log(`Found ${entries.length} products with ASINs.`);

  console.log("Requesting OAuth token…");
  const token = await getToken();
  console.log("✔ Token acquired.");

  if (mode === "probe") {
    const asinArg = process.argv.find((a) => a.startsWith("--asin="));
    const sample = asinArg
      ? asinArg.slice("--asin=".length).split(",").map((s) => s.trim()).filter(Boolean)
      : entries.slice(0, 2).map((e) => e.asin);
    console.log(`Probing ASINs: ${sample.join(", ")}`);
    const resp = await getItems(token, sample);
    for (const item of resp?.itemsResult?.items || []) {
      const l = (item.offersV2?.listings || []).find((x) => x.isBuyBoxWinner) || (item.offersV2?.listings || [])[0] || {};
      console.log(
        `\n• ${item.asin}\n  title: ${item.itemInfo?.title?.displayValue}\n  price: ${l.price?.money?.displayAmount}\n  stock: ${l.availability?.message} (${l.availability?.type})\n  image: ${item.images?.primary?.large?.url}`,
      );
    }
    for (const e of resp?.errors || []) console.log(`  ! ${e.code}: ${e.message}`);
    return;
  }

  // --- fetch all unique ASINs in batches of 10 ---
  const uniqueAsins = [...new Set(entries.map((e) => e.asin))];
  const byAsin = new Map(); // asin -> live item
  for (let i = 0; i < uniqueAsins.length; i += 10) {
    const batch = uniqueAsins.slice(i, i + 10);
    process.stdout.write(`Fetching ${i + 1}-${i + batch.length} of ${uniqueAsins.length}… `);
    const resp = await getItems(token, batch);
    for (const item of resp?.itemsResult?.items || []) byAsin.set(item.asin, item);
    const errs = resp?.errors || [];
    console.log(`ok${errs.length ? ` (${errs.length} error(s))` : ""}`);
    for (const e of errs) console.log(`   ! ${e.code || ""} ${e.message || ""}`);
  }

  // --- detect ASIN collisions (same ASIN on 2+ slugs = a wrong link somewhere) ---
  const slugsByAsin = new Map();
  for (const { slug, asin } of entries) {
    if (!slugsByAsin.has(asin)) slugsByAsin.set(asin, []);
    slugsByAsin.get(asin).push(slug);
  }

  // --- apply updates ---
  const changes = [];
  const warnings = [];
  const notFound = [];
  const skipped = [];
  const today = new Date().toISOString().slice(0, 10);

  for (const { slug, asin, product } of entries) {
    const item = byAsin.get(asin);
    if (!item) {
      notFound.push(`${slug} (${asin})`);
      continue;
    }

    const liveTitleEarly = item.itemInfo?.title?.displayValue || "";
    const brandTok = (product.brand || "").split(/\s+/)[0]?.toLowerCase();
    const collides = (slugsByAsin.get(asin) || []).length > 1;
    if (collides && brandTok && liveTitleEarly && !liveTitleEarly.toLowerCase().includes(brandTok)) {
      skipped.push(
        `${slug}: ASIN ${asin} also used by [${slugsByAsin.get(asin).filter((s) => s !== slug).join(", ")}] and brand "${product.brand}" ≠ live title — left untouched, fix the link`,
      );
      continue;
    }

    const listing =
      (item.offersV2?.listings || []).find((l) => l.isBuyBoxWinner) ||
      (item.offersV2?.listings || [])[0] ||
      null;

    const newPrice = listing?.price?.money?.displayAmount;
    const newImage = item.images?.primary?.large?.url;
    const availType = listing?.availability?.type;
    const availMsg = listing?.availability?.message;
    const liveTitle = item.itemInfo?.title?.displayValue || "";

    if (newPrice && newPrice !== product.price) {
      changes.push(`${slug}: price ${product.price} → ${newPrice}`);
      product.price = newPrice;
    }
    if (newImage && newImage !== product.image) {
      changes.push(`${slug}: image → Amazon CDN`);
      product.image = newImage;
    }
    if (availType) {
      // Purchasable now: in stock, limited stock, or short lead time. Not: out of stock / future-dated.
      const buyable = ["IN_STOCK", "IN_STOCK_SCARCE", "LEADTIME"].includes(availType);
      product.inStock = buyable;
      product.availability = availMsg || (buyable ? "In Stock" : "Unavailable");
      if (!buyable) warnings.push(`${slug}: OUT OF STOCK — ${product.availability} (${availType})`);
      else if (availType !== "IN_STOCK") warnings.push(`${slug}: ${product.availability} (${availType})`);
    }
    product.lastVerified = today;

    // name-mismatch heuristic — catches wrong ASIN (don't auto-overwrite the editorial name)
    const brandToken = (product.brand || "").split(/\s+/)[0]?.toLowerCase();
    if (brandToken && liveTitle && !liveTitle.toLowerCase().includes(brandToken)) {
      warnings.push(
        `${slug}: NAME/ASIN MISMATCH — brand "${product.brand}" not in live title "${liveTitle.slice(0, 70)}…" (ASIN ${asin})`,
      );
    }
  }

  // --- report ---
  console.log(`\n=== ${changes.length} change(s) ===`);
  for (const c of changes) console.log("  " + c);
  if (warnings.length) {
    console.log(`\n=== ${warnings.length} warning(s) — review manually ===`);
    for (const w of warnings) console.log("  ⚠ " + w);
  }
  if (notFound.length) {
    console.log(`\n=== ${notFound.length} ASIN(s) not returned by Amazon ===`);
    for (const n of notFound) console.log("  ✖ " + n);
  }
  if (skipped.length) {
    console.log(`\n=== ${skipped.length} skipped (bad/duplicate ASIN — needs a real fix) ===`);
    for (const s of skipped) console.log("  ⊘ " + s);
  }

  if (mode === "dry-run") {
    console.log("\n(dry-run — nothing written)");
    return;
  }

  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(catalog, null, 2) + "\n");
  console.log(`\n✔ Wrote ${PRODUCTS_PATH}`);
}

main().catch((err) => {
  console.error("\n✖ " + err.message);
  process.exit(1);
});
