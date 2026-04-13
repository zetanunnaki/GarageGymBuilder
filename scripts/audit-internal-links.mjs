// Internal linking audit. For every MDX article in src/content/ this
// script counts:
//   - outbound: how many other articles this article links TO
//   - inbound:  how many other articles link TO this article
//
// Reports orphans (no inbound links), thin pages (≤1 inbound), and
// articles that link out to fewer than 3 other articles.
//
// Usage: node scripts/audit-internal-links.mjs [--verbose] [--write-report]

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "src/content");
const contentTypes = ["best-gear", "reviews", "guides", "builds"];
const verbose = process.argv.includes("--verbose");
const writeReport = process.argv.includes("--write-report");

// First pass: build the article registry { fullPath: {type, slug, body} }
const articles = new Map(); // key: `/${type}/${slug}/` (canonical)
const slugToArticle = new Map(); // key: slug

for (const type of contentTypes) {
  const dir = path.join(contentDir, type);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".mdx")) continue;
    const slug = file.replace(/\.mdx$/, "");
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const canonical = `/${type}/${slug}/`;
    const article = {
      type,
      slug,
      filePath,
      title: data.title || slug,
      category: data.category || "",
      body: content,
      outbound: new Set(),
      inbound: new Set(),
    };
    articles.set(canonical, article);
    slugToArticle.set(slug, article);
  }
}

// Second pass: extract internal links from each article body
// Match markdown links of the form [text](/path/) or [text](/path)
// where path starts with a content type.
const linkRe = /\[[^\]]*\]\(\/((?:best-gear|reviews|guides|builds)\/[a-z0-9-]+)\/?\)/gi;

for (const article of articles.values()) {
  let m;
  linkRe.lastIndex = 0;
  while ((m = linkRe.exec(article.body)) !== null) {
    const target = `/${m[1]}/`;
    if (target === `/${article.type}/${article.slug}/`) continue; // self-link
    if (articles.has(target)) {
      article.outbound.add(target);
      articles.get(target).inbound.add(`/${article.type}/${article.slug}/`);
    }
  }
}

// Build reports
const all = [...articles.values()];
const total = all.length;

const orphans = all.filter((a) => a.inbound.size === 0);
const thin = all.filter((a) => a.inbound.size > 0 && a.inbound.size <= 1);
const stale = all.filter((a) => a.outbound.size < 3);

const sorted = [...all].sort((a, b) => a.inbound.size - b.inbound.size);

console.log(`Internal Linking Audit`);
console.log(`======================`);
console.log(`Total articles:        ${total}`);
console.log(`Orphans (0 inbound):   ${orphans.length}`);
console.log(`Thin (1 inbound):      ${thin.length}`);
console.log(`Under-linker (<3 out): ${stale.length}\n`);

console.log(`Top 15 most-linked articles (by inbound count):`);
const topLinked = [...all]
  .sort((a, b) => b.inbound.size - a.inbound.size)
  .slice(0, 15);
for (const a of topLinked) {
  console.log(`  ${a.inbound.size.toString().padStart(3)}  /${a.type}/${a.slug}/`);
}

console.log(`\nOrphans (must fix — 0 inbound links):`);
for (const a of orphans.slice(0, 30)) {
  console.log(`  /${a.type}/${a.slug}/  —  out: ${a.outbound.size}`);
}
if (orphans.length > 30) {
  console.log(`  ... and ${orphans.length - 30} more`);
}

console.log(`\nThin (1 inbound only):`);
for (const a of thin.slice(0, 30)) {
  console.log(`  /${a.type}/${a.slug}/  —  out: ${a.outbound.size}`);
}
if (thin.length > 30) {
  console.log(`  ... and ${thin.length - 30} more`);
}

console.log(`\nUnder-linkers (<3 outbound links):`);
for (const a of stale.slice(0, 20)) {
  console.log(`  /${a.type}/${a.slug}/  —  in: ${a.inbound.size}, out: ${a.outbound.size}`);
}
if (stale.length > 20) {
  console.log(`  ... and ${stale.length - 20} more`);
}

if (verbose) {
  console.log(`\nFull article details (sorted by inbound):`);
  for (const a of sorted) {
    console.log(`\n/${a.type}/${a.slug}/  in:${a.inbound.size} out:${a.outbound.size}`);
    if (a.inbound.size > 0) {
      console.log(`  inbound:`);
      for (const i of [...a.inbound].sort()) console.log(`    ${i}`);
    }
  }
}

if (writeReport) {
  const reportPath = path.join(process.cwd(), "internal-links-report.json");
  const report = {
    summary: {
      total,
      orphans: orphans.length,
      thin: thin.length,
      underLinkers: stale.length,
      generated: new Date().toISOString(),
    },
    orphans: orphans.map((a) => ({
      type: a.type,
      slug: a.slug,
      title: a.title,
      category: a.category,
      outbound: a.outbound.size,
    })),
    thin: thin.map((a) => ({
      type: a.type,
      slug: a.slug,
      title: a.title,
      category: a.category,
      outbound: a.outbound.size,
      inbound: [...a.inbound],
    })),
    underLinkers: stale.map((a) => ({
      type: a.type,
      slug: a.slug,
      title: a.title,
      category: a.category,
      inbound: a.inbound.size,
      outbound: a.outbound.size,
    })),
    topLinked: topLinked.map((a) => ({
      slug: a.slug,
      type: a.type,
      title: a.title,
      inbound: a.inbound.size,
    })),
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nReport written to ${reportPath}`);
}
