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

const staticPages = [
  { url: "/", priority: "1.0" },
  { url: "/best-gear", priority: "0.9" },
  { url: "/reviews", priority: "0.9" },
  { url: "/guides", priority: "0.9" },
  { url: "/builds", priority: "0.9" },
  { url: "/picks", priority: "0.7" },
  { url: "/calculator", priority: "0.6" },
  { url: "/how-we-test", priority: "0.5" },
  { url: "/about", priority: "0.3" },
  { url: "/privacy-policy", priority: "0.3" },
  { url: "/affiliate-disclosure", priority: "0.3" },
];

const articleUrls = contentTypes.flatMap((type) =>
  getArticleSlugs(type).map((slug) => ({
    url: `/${type}/${slug}`,
    priority: "0.8",
  }))
);

const allUrls = [...staticPages, ...articleUrls];
const today = new Date().toISOString().split("T")[0];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (entry) => `  <url>
    <loc>${SITE_URL}${entry.url}</loc>
    <lastmod>${today}</lastmod>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

fs.writeFileSync(path.join(process.cwd(), "public/sitemap.xml"), xml);
console.log(`Sitemap generated with ${allUrls.length} URLs`);

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
