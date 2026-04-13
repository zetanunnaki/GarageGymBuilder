// For every MDX article that doesn't already have a "## Related Content"
// (or "## Related" / "## Related Articles") section, suggest 5 topically
// related articles and append the section.
//
// Topic matching uses category overlap + keyword overlap on slug/title.
// The script is idempotent: re-running it does not duplicate sections.

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "src/content");
const contentTypes = ["best-gear", "reviews", "guides", "builds"];

// Build registry
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

function score(a, b) {
  if (a.slug === b.slug) return -1;
  let s = 0;
  // Category match weighted heavily
  if (a.category && a.category === b.category) s += 4;
  // Token overlap
  for (const t of a.tokens) if (b.tokens.has(t)) s += 1;
  // Same content type bonus
  if (a.type === b.type) s += 0.5;
  return s;
}

const RELATED_RE =
  /^##\s+(Related Content|Related Articles|Related|See Also|Related Reading)\b/im;

let added = 0;
let skipped = 0;

for (const article of articles) {
  if (RELATED_RE.test(article.content)) {
    skipped++;
    continue;
  }

  // Find top 5 related articles by score
  const ranked = articles
    .map((b) => ({ a: b, s: score(article, b) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 5);

  if (ranked.length < 3) {
    skipped++;
    continue;
  }

  // Build the new section
  const lines = [];
  lines.push("");
  lines.push("## Related Content");
  lines.push("");
  for (const { a } of ranked) {
    lines.push(`- [${a.title}](/${a.type}/${a.slug}/)`);
  }
  lines.push("");
  const newSection = lines.join("\n");

  // Append before any trailing whitespace, before ## The Bottom Line if it
  // exists at the very end... actually just append to end of body.
  const newContent = article.content.trimEnd() + "\n" + newSection;

  // Re-stringify with frontmatter
  const matterIn = matter(article.raw);
  const updated = matter.stringify(newContent, matterIn.data);
  fs.writeFileSync(article.filePath, updated, "utf8");
  added++;
}

console.log(`Added Related Content to: ${added} articles`);
console.log(`Skipped (already had section or no matches): ${skipped}`);
