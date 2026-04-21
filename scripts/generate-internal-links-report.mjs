import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "src", "content");
const CONTENT_TYPES = ["reviews", "best-gear", "guides", "builds"];

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

function extractInternalLinks(content) {
  const links = new Set();
  const patterns = [
    /\[(?:[^\]]*)\]\((\/(?:reviews|best-gear|guides|builds)\/[^)#\s]+)\)/g,
    /href="(\/(?:reviews|best-gear|guides|builds)\/[^"#]+)"/g,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(content)) !== null) {
      let url = m[1].replace(/\/$/, "");
      links.add(url);
    }
  }
  return [...links];
}

const articles = [];
for (const type of CONTENT_TYPES) {
  const dir = path.join(CONTENT_DIR, type);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".mdx")) continue;
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const fm = parseFrontmatter(raw);
    const outboundLinks = extractInternalLinks(raw);
    articles.push({
      type,
      slug,
      title: fm.title || slug,
      category: fm.category || "",
      outboundLinks,
      outbound: outboundLinks.length,
    });
  }
}

const inboundMap = {};
for (const a of articles) {
  const key = `/${a.type}/${a.slug}`;
  if (!inboundMap[key]) inboundMap[key] = [];
}
for (const a of articles) {
  for (const link of a.outboundLinks) {
    if (!inboundMap[link]) inboundMap[link] = [];
    inboundMap[link].push(`/${a.type}/${a.slug}/`);
  }
}

for (const a of articles) {
  const key = `/${a.type}/${a.slug}`;
  a.inboundLinks = inboundMap[key] || [];
  a.inbound = a.inboundLinks.length;
}

const orphans = articles
  .filter((a) => a.inbound === 0)
  .map(({ type, slug, title, category, outbound }) => ({ type, slug, title, category, outbound }));

const thin = articles
  .filter((a) => a.inbound >= 1 && a.inbound <= 3)
  .map(({ type, slug, title, category, outbound, inboundLinks }) => ({
    type, slug, title, category, outbound, inbound: inboundLinks,
  }));

const underLinkers = articles
  .filter((a) => a.outbound < 2)
  .map(({ type, slug, title, category, inbound, outbound }) => ({
    type, slug, title, category, inbound, outbound,
  }));

const topLinked = articles
  .sort((a, b) => b.inbound - a.inbound)
  .slice(0, 15)
  .map(({ slug, type, title, inbound }) => ({ slug, type, title, inbound }));

const report = {
  summary: {
    total: articles.length,
    orphans: orphans.length,
    thin: thin.length,
    underLinkers: underLinkers.length,
    generated: new Date().toISOString(),
  },
  orphans,
  thin,
  underLinkers,
  topLinked,
};

fs.writeFileSync(
  path.join(ROOT, "internal-links-report.json"),
  JSON.stringify(report, null, 2)
);
console.log(`Report generated: ${articles.length} pages analyzed`);
console.log(`  Orphans (0 inbound): ${orphans.length}`);
console.log(`  Thin (1-3 inbound): ${thin.length}`);
console.log(`  Under-linkers (<2 outbound): ${underLinkers.length}`);
