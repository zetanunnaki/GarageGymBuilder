// For each orphan article (0 inbound links), find its top 3 most-related
// articles and inject a link to the orphan into each of their Related
// Content sections. Idempotent — won't duplicate links.

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "src/content");
const contentTypes = ["best-gear", "reviews", "guides", "builds"];

const articles = [];
for (const type of contentTypes) {
  const dir = path.join(contentDir, type);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".mdx")) continue;
    const slug = file.replace(/\.mdx$/, "");
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    articles.push({
      type,
      slug,
      filePath,
      raw,
      content,
      title: data.title || slug,
      category: (data.category || "").toLowerCase(),
      tokens: tokenize(`${slug} ${data.title || ""} ${data.category || ""}`),
      inbound: new Set(),
      data,
    });
  }
}

function tokenize(text) {
  const stop = new Set([
    "the", "a", "an", "for", "to", "of", "in", "on", "and", "or", "with",
    "best", "vs", "review", "guide", "home", "gym", "garage", "builders",
    "complete", "ultimate", "your", "how", "what", "why", "is", "are",
    "do", "should", "can", "i", "we", "you",
  ]);
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/[\s-]+/)
      .filter((w) => w.length > 2 && !stop.has(w))
  );
}

// Compute inbound counts
const linkRe = /\[[^\]]*\]\(\/((?:best-gear|reviews|guides|builds)\/[a-z0-9-]+)\/?\)/gi;
const bySlug = new Map(articles.map((a) => [`/${a.type}/${a.slug}/`, a]));

for (const article of articles) {
  let m;
  linkRe.lastIndex = 0;
  while ((m = linkRe.exec(article.content)) !== null) {
    const target = `/${m[1]}/`;
    if (target === `/${article.type}/${article.slug}/`) continue;
    const targetArticle = bySlug.get(target);
    if (targetArticle) {
      targetArticle.inbound.add(`/${article.type}/${article.slug}/`);
    }
  }
}

const orphans = articles.filter((a) => a.inbound.size === 0);
console.log(`Found ${orphans.length} orphans\n`);

function score(a, b) {
  if (a.slug === b.slug) return -1;
  let s = 0;
  if (a.category && a.category === b.category) s += 4;
  for (const t of a.tokens) if (b.tokens.has(t)) s += 1;
  if (a.type === b.type) s += 0.5;
  return s;
}

// Track edits per article so we don't open files multiple times
const edits = new Map(); // filePath -> new content

for (const orphan of orphans) {
  // Find top 3 most related articles that already have a Related Content
  // section we can append to
  const candidates = articles
    .map((b) => ({ a: b, s: score(orphan, b) }))
    .filter((x) => x.s >= 2 && x.a.slug !== orphan.slug)
    .sort((a, b) => b.s - a.s);

  let injected = 0;
  const orphanLink = `- [${orphan.title}](/${orphan.type}/${orphan.slug}/)`;
  const orphanHref = `/${orphan.type}/${orphan.slug}/`;

  for (const { a: target } of candidates) {
    if (injected >= 3) break;

    const currentContent = edits.get(target.filePath) || target.content;

    // Skip if target already links to orphan
    if (currentContent.includes(orphanHref)) continue;

    // Find the Related Content section
    const relatedHeader = currentContent.match(
      /^##\s+(Related Content|Related Articles|Related|See Also|Related Reading)\b.*$/im
    );
    if (!relatedHeader) continue;

    // Insert the orphan link as the LAST list item in the Related section.
    // Find the next ## heading (or EOF) and insert before it.
    const relIdx = relatedHeader.index;
    const afterHeader = currentContent.slice(relIdx + relatedHeader[0].length);
    const nextHeaderMatch = afterHeader.match(/\n##\s/);
    const sectionEnd = nextHeaderMatch
      ? relIdx + relatedHeader[0].length + nextHeaderMatch.index
      : currentContent.length;

    // Inject link just before the section ends (after the last list item)
    const before = currentContent.slice(0, sectionEnd).trimEnd();
    const after = currentContent.slice(sectionEnd);
    const newContent = `${before}\n${orphanLink}\n${after.startsWith("\n") ? "" : "\n"}${after}`;

    edits.set(target.filePath, newContent);
    injected++;
    console.log(
      `  ${orphan.slug} -> injected into ${target.slug} (score ${score(orphan, target).toFixed(1)})`
    );
  }

  if (injected === 0) {
    console.log(`  ${orphan.slug} -> NO matches found`);
  }
}

// Write all edits
let written = 0;
for (const [filePath, newContent] of edits.entries()) {
  const article = articles.find((a) => a.filePath === filePath);
  if (!article) continue;
  const updated = matter.stringify(newContent, article.data);
  fs.writeFileSync(filePath, updated, "utf8");
  written++;
}

console.log(`\nFiles modified: ${written}`);
