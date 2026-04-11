import Link from "next/link";
import { getAllArticles, type ArticleMeta } from "@/lib/mdx";
import { ArrowRight } from "lucide-react";

interface RelatedArticlesProps {
  currentSlug: string;
  contentType: string;
  maxItems?: number;
}

export function RelatedArticles({
  currentSlug,
  contentType,
  maxItems = 3,
}: RelatedArticlesProps) {
  const articles = getAllArticles(contentType)
    .filter((a) => a.slug !== currentSlug)
    .slice(0, maxItems);

  if (articles.length === 0) return null;

  const typeLabels: Record<string, string> = {
    "best-gear": "Best Gear",
    reviews: "Reviews",
    guides: "Guides",
    builds: "Budget Builds",
  };

  return (
    <section className="mt-20 border-t border-zinc-800 pt-12">
      <h2 className="mb-8 text-2xl font-black uppercase italic tracking-tighter">
        More in {typeLabels[contentType] || contentType}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/${contentType}/${article.slug}`}
            className="group border border-zinc-800 bg-zinc-900/40 p-5 transition-colors hover:border-orange-600/50"
          >
            <h3 className="mb-2 text-sm font-black uppercase italic leading-snug tracking-tighter transition-colors group-hover:text-orange-500">
              {article.title}
            </h3>
            <p className="line-clamp-2 text-xs text-zinc-600">
              {article.description}
            </p>
            <div className="mt-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-orange-600 transition-colors group-hover:text-orange-400">
              Read <ArrowRight size={10} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
