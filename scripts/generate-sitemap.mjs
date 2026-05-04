import fs from "fs";
import path from "path";
import matter from "gray-matter";

const SITE_URL = "https://garagegymbuilders.com";
const contentDir = path.join(process.cwd(), "src/content");
const contentTypes = ["best-gear", "reviews", "guides", "builds"];

function getArticleSlugs(contentType) {
  const dir = path.join(contentDir, contentType);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

// Static topic slugs kept in sync with src/data/topics.ts
const TOPIC_SLUGS = [
  "powerlifting",
  "bodybuilding",
  "crossfit",
  "mma-combat",
  "beginners",
  "budget-builds",
  "small-spaces",
  "cardio",
  "recovery",
  "women",
  "seniors",
  "safety",
  "buying-guides",
  "comparisons",
  "maintenance",
  "programming",
];

const staticPages = [
  { url: "/", priority: "1.0", lastmod: "2026-04-28" },
  { url: "/best-gear/", priority: "0.9", lastmod: "2026-04-25" },
  { url: "/reviews/", priority: "0.9", lastmod: "2026-04-22" },
  { url: "/guides/", priority: "0.9", lastmod: "2026-04-20" },
  { url: "/builds/", priority: "0.9", lastmod: "2026-04-18" },
  { url: "/topics/", priority: "0.8", lastmod: "2026-03-15" },
  { url: "/picks/", priority: "0.7", lastmod: "2026-04-10" },
  { url: "/compare/", priority: "0.7", lastmod: "2026-03-22" },
  { url: "/calculator/", priority: "0.7", lastmod: "2026-02-18" },
  { url: "/glossary/", priority: "0.7", lastmod: "2026-03-05" },
  { url: "/team/", priority: "0.6", lastmod: "2026-01-28" },
  { url: "/search/", priority: "0.4", lastmod: "2026-02-10" },
  { url: "/how-we-test/", priority: "0.5", lastmod: "2026-02-25" },
  { url: "/about/", priority: "0.3", lastmod: "2026-01-15" },
  { url: "/privacy-policy/", priority: "0.3", lastmod: "2026-01-08" },
  { url: "/affiliate-disclosure/", priority: "0.3", lastmod: "2026-01-12" },
  ...TOPIC_SLUGS.map((slug, i) => ({
    url: `/topics/${slug}/`,
    priority: "0.7",
    lastmod: `2026-0${Math.floor(i / 8) + 2}-${String((i % 28) + 3).padStart(2, "0")}`,
  })),
];

function readArticleFrontmatter(type, slug) {
  const filePath = path.join(contentDir, type, `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContents);
  return data;
}

const articleEntries = contentTypes.flatMap((type) =>
  getArticleSlugs(type).map((slug) => {
    const fm = readArticleFrontmatter(type, slug);
    return {
      url: `/${type}/${slug}/`,
      priority: "0.8",
      changefreq: "weekly",
      image: fm.featuredImage || null,
      title: fm.title || slug,
      caption: fm.description || fm.title || "",
      lastmod: fm.updated || fm.date || null,
    };
  })
);

const articleUrls = articleEntries.map((e) => ({
  url: e.url,
  priority: e.priority,
  changefreq: e.changefreq,
  image: e.image,
  title: e.title,
  caption: e.caption,
  lastmod: e.lastmod,
}));

const allUrls = [
  ...staticPages.map((p) => ({
    url: p.url,
    priority: p.priority,
    changefreq: p.priority === "1.0" ? "daily" : "monthly",
    image: null,
    title: null,
    caption: null,
    lastmod: p.lastmod || null,
  })),
  ...articleUrls,
];
const today = new Date().toISOString().split("T")[0];

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allUrls
  .map((entry) => {
    const lastmod = entry.lastmod || today;
    const imageBlock = entry.image
      ? `
    <image:image>
      <image:loc>${SITE_URL}${entry.image}</image:loc>
      <image:title>${escapeXml(entry.title || "")}</image:title>
      <image:caption>${escapeXml(entry.caption || entry.title || "")}</image:caption>
    </image:image>`
      : "";
    const alternate = `
    <xhtml:link rel="alternate" hreflang="en-US" href="${SITE_URL}${entry.url}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${entry.url}" />`;
    return `  <url>
    <loc>${SITE_URL}${entry.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>${alternate}${imageBlock}
  </url>`;
  })
  .join("\n")}
</urlset>`;

fs.writeFileSync(path.join(process.cwd(), "public/sitemap.xml"), xml);
console.log(
  `Sitemap generated with ${allUrls.length} URLs (${articleEntries.filter((e) => e.image).length} with images)`
);

// Generate search index
const searchIndex = contentTypes.flatMap((type) =>
  getArticleSlugs(type).map((slug) => {
    const filePath = path.join(contentDir, type, `${slug}.mdx`);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);
    return {
      title: data.title || slug,
      description: data.description || "",
      slug,
      contentType: type,
      category: data.category || "",
    };
  })
);

fs.writeFileSync(
  path.join(process.cwd(), "src/data/search-index.json"),
  JSON.stringify(searchIndex, null, 2)
);
console.log(`Search index generated with ${searchIndex.length} articles`);
