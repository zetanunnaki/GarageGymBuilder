import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "src/content");

export interface ArticleFrontmatter {
  title: string;
  seoTitle: string;
  description: string;
  author: string;
  authorSlug?: string;
  date: string;
  updated?: string;
  featuredImage: string;
  category: string;
  tags?: string[];
  keywords?: string[];
  rating?: number;
}

export interface ArticleMeta extends ArticleFrontmatter {
  slug: string;
  contentType: string;
}

export function getArticleSlugs(contentType: string): string[] {
  const dir = path.join(contentDir, contentType);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function estimateReadingTime(content: string): number {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 250));
}

export function getArticleBySlug(
  contentType: string,
  slug: string
): { frontmatter: ArticleFrontmatter; content: string; readingTime: number } {
  const filePath = path.join(contentDir, contentType, `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  return {
    frontmatter: data as ArticleFrontmatter,
    content,
    readingTime: estimateReadingTime(content),
  };
}

export function getAllArticles(contentType: string): ArticleMeta[] {
  const slugs = getArticleSlugs(contentType);
  return slugs
    .map((slug) => {
      const { frontmatter } = getArticleBySlug(contentType, slug);
      return { ...frontmatter, slug, contentType };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllContent(): ArticleMeta[] {
  const types = ["best-gear", "reviews", "guides", "builds"];
  return types
    .flatMap((type) => getAllArticles(type))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
