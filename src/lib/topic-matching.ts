import { getAllContent, type ArticleMeta } from "@/lib/mdx";
import { topics, type Topic } from "@/data/topics";

export function getArticlesForTopic(topic: Topic): ArticleMeta[] {
  const all = getAllContent();
  const lowerKeywords = topic.keywords.map((k) => k.toLowerCase());
  return all.filter((article) => {
    const slug = article.slug.toLowerCase();
    const category = (article.category || "").toLowerCase();
    return lowerKeywords.some(
      (kw) => slug.includes(kw) || category.includes(kw)
    );
  });
}

export function getTopicCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const topic of topics) {
    counts[topic.slug] = getArticlesForTopic(topic).length;
  }
  return counts;
}
