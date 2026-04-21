import Link from "next/link";
import { getAllArticles, type ArticleMeta } from "@/lib/mdx";
import { ArrowRight } from "lucide-react";

const typeLabels: Record<string, string> = {
  "best-gear": "Best Gear",
  reviews: "Reviews",
  guides: "Guides",
  builds: "Budget Builds",
};

const allTypes = ["best-gear", "reviews", "guides", "builds"];

function scoreCrossMatch(
  article: ArticleMeta,
  category: string,
  tags: string[],
): number {
  let score = 0;
  if (
    article.category &&
    category &&
    article.category.toLowerCase() === category.toLowerCase()
  )
    score += 3;
  if (tags.length > 0 && article.tags) {
    const articleTags = new Set(article.tags.map((t) => t.toLowerCase()));
    for (const tag of tags) {
      if (articleTags.has(tag.toLowerCase())) score += 1;
    }
  }
  return score;
}

interface RelatedArticlesProps {
  currentSlug: string;
  contentType: string;
  category?: string;
  tags?: string[];
  maxItems?: number;
}

export function RelatedArticles({
  currentSlug,
  contentType,
  category = "",
  tags = [],
  maxItems = 3,
}: RelatedArticlesProps) {
  const sameType = getAllArticles(contentType)
    .filter((a) => a.slug !== currentSlug)
    .slice(0, maxItems);

  const crossType: (ArticleMeta & { _score: number })[] = [];
  if (category || tags.length > 0) {
    for (const type of allTypes) {
      if (type === contentType) continue;
      for (const article of getAllArticles(type)) {
        const score = scoreCrossMatch(article, category, tags);
        if (score > 0) crossType.push({ ...article, _score: score });
      }
    }
    crossType.sort((a, b) => b._score - a._score);
  }
  const crossItems = crossType.slice(0, 3);

  if (sameType.length === 0 && crossItems.length === 0) return null;

  return (
    <>
      {sameType.length > 0 && (
        <section className="mt-20 border-t border-zinc-800 pt-12">
          <h2 className="mb-8 text-2xl font-black uppercase italic tracking-tighter">
            More in {typeLabels[contentType] || contentType}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sameType.map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                href={`/${contentType}/${article.slug}`}
              />
            ))}
          </div>
        </section>
      )}
      {crossItems.length > 0 && (
        <section className="mt-12 border-t border-zinc-800/50 pt-12">
          <h2 className="mb-8 text-2xl font-black uppercase italic tracking-tighter">
            You Might Also Like
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {crossItems.map((article) => (
              <ArticleCard
                key={`${article.contentType}-${article.slug}`}
                article={article}
                href={`/${article.contentType}/${article.slug}`}
                badge={typeLabels[article.contentType]}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function ArticleCard({
  article,
  href,
  badge,
}: {
  article: ArticleMeta;
  href: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="group border border-zinc-800 bg-zinc-900/40 p-5 transition-colors hover:border-orange-600/50"
    >
      {badge && (
        <span className="mb-2 inline-block text-[9px] font-black uppercase tracking-widest text-zinc-400">
          {badge}
        </span>
      )}
      <h3 className="mb-2 text-sm font-black uppercase italic leading-snug tracking-tighter transition-colors group-hover:text-orange-500">
        {article.title}
      </h3>
      <p className="line-clamp-2 text-xs text-zinc-400">
        {article.description}
      </p>
      <div className="mt-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-orange-600 transition-colors group-hover:text-orange-400">
        Read <ArrowRight size={10} />
      </div>
    </Link>
  );
}
