import fs from "fs";
import path from "path";
import matter from "gray-matter";

const SITE_URL = "https://garagegymbuilders.com";
const SITE_NAME = "GarageGymBuilders";
const SITE_DESCRIPTION =
  "Expert reviews, budget builds, and guides to help you build the perfect garage gym.";
const FEED_AUTHOR = "GarageGymBuilders Team";
const FEED_EMAIL = "hello@garagegymbuilders.com";
const LIMIT = 30;

const contentDir = path.join(process.cwd(), "src/content");
const types = ["best-gear", "reviews", "guides", "builds"];

function escapeXml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cdata(str) {
  return `<![CDATA[${String(str || "").replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

function getArticles() {
  return types
    .flatMap((type) => {
      const dir = path.join(contentDir, type);
      if (!fs.existsSync(dir)) return [];
      return fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".mdx"))
        .map((f) => {
          const slug = f.replace(/\.mdx$/, "");
          const { data } = matter(
            fs.readFileSync(path.join(dir, f), "utf8")
          );
          const updated = data.updated || data.date;
          return {
            type,
            slug,
            title: data.title || slug,
            description: data.description || "",
            date: data.date,
            updated,
            author: data.author || FEED_AUTHOR,
            image: data.featuredImage || null,
            category: data.category || type,
            tags: data.tags || [],
          };
        });
    })
    .filter((a) => a.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, LIMIT);
}

const articles = getArticles();
const now = new Date().toUTCString();
const nowIso = new Date().toISOString();

// RSS 2.0
const rssItems = articles
  .map((a) => {
    const url = `${SITE_URL}/${a.type}/${a.slug}/`;
    const pubDate = new Date(a.date).toUTCString();
    const imageTag = a.image
      ? `      <enclosure url="${SITE_URL}${escapeXml(a.image)}" type="image/webp" length="0" />\n      <media:content url="${SITE_URL}${escapeXml(a.image)}" medium="image" />`
      : "";
    const categoryTags = [a.category, ...(a.tags || [])]
      .filter(Boolean)
      .map((c) => `      <category>${escapeXml(c)}</category>`)
      .join("\n");
    return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${cdata(a.description)}</description>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>${escapeXml(a.author)}</dc:creator>
${categoryTags}
${imageTag}
    </item>`;
  })
  .join("\n");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <copyright>Copyright © ${new Date().getFullYear()} ${escapeXml(SITE_NAME)}</copyright>
    <lastBuildDate>${now}</lastBuildDate>
    <generator>GarageGymBuilders static build</generator>
    <image>
      <url>${SITE_URL}/icon-512.png</url>
      <title>${escapeXml(SITE_NAME)}</title>
      <link>${SITE_URL}</link>
      <width>512</width>
      <height>512</height>
    </image>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>`;

fs.writeFileSync(path.join(process.cwd(), "public/feed.xml"), rss);

// Atom 1.0
const atomEntries = articles
  .map((a) => {
    const url = `${SITE_URL}/${a.type}/${a.slug}/`;
    const published = new Date(a.date).toISOString();
    const updated = new Date(a.updated || a.date).toISOString();
    const categoryTags = [a.category, ...(a.tags || [])]
      .filter(Boolean)
      .map((c) => `    <category term="${escapeXml(c)}" />`)
      .join("\n");
    return `  <entry>
    <id>${url}</id>
    <title>${escapeXml(a.title)}</title>
    <link rel="alternate" type="text/html" href="${url}" />
    <published>${published}</published>
    <updated>${updated}</updated>
    <author>
      <name>${escapeXml(a.author)}</name>
    </author>
    <summary type="html">${cdata(a.description)}</summary>
${categoryTags}
  </entry>`;
  })
  .join("\n");

const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${SITE_URL}/</id>
  <title>${escapeXml(SITE_NAME)}</title>
  <subtitle>${escapeXml(SITE_DESCRIPTION)}</subtitle>
  <link rel="self" type="application/atom+xml" href="${SITE_URL}/atom.xml" />
  <link rel="alternate" type="text/html" href="${SITE_URL}" />
  <updated>${nowIso}</updated>
  <rights>© ${new Date().getFullYear()} ${escapeXml(SITE_NAME)}</rights>
  <generator uri="${SITE_URL}">GarageGymBuilders static build</generator>
  <icon>${SITE_URL}/icon-192.png</icon>
  <logo>${SITE_URL}/icon-512.png</logo>
  <author>
    <name>${escapeXml(FEED_AUTHOR)}</name>
    <email>${escapeXml(FEED_EMAIL)}</email>
  </author>
${atomEntries}
</feed>`;

fs.writeFileSync(path.join(process.cwd(), "public/atom.xml"), atom);

// OpenSearch description
const opensearch = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>${escapeXml(SITE_NAME)}</ShortName>
  <Description>Search ${escapeXml(SITE_NAME)} for home gym gear reviews, guides, and builds.</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Image width="512" height="512" type="image/png">${SITE_URL}/icon-512.png</Image>
  <Url type="text/html" method="get" template="${SITE_URL}/search/?q={searchTerms}" />
  <moz:SearchForm xmlns:moz="http://www.mozilla.org/2006/browser/search/">${SITE_URL}/search/</moz:SearchForm>
</OpenSearchDescription>`;

fs.writeFileSync(path.join(process.cwd(), "public/opensearch.xml"), opensearch);

console.log(
  `Feeds generated: feed.xml (RSS, ${articles.length}), atom.xml (Atom, ${articles.length}), opensearch.xml`
);
