import Link from "next/link";
import { CalendarDays } from "lucide-react";
import type { ArticleMeta } from "@/lib/mdx";

interface ArticleCardProps {
  article: ArticleMeta;
  showType?: boolean;
}

const contentTypeMap: Record<string, string> = {
  "best-gear": "Best Gear",
  reviews: "Review",
  guides: "Guide",
  builds: "Build",
};

export function ArticleCard({ article, showType = false }: ArticleCardProps) {
  return (
    <Link
      href={`/${article.contentType}/${article.slug}`}
      className="group overflow-hidden border border-zinc-800 bg-zinc-900/40 transition-colors hover:border-orange-600/50"
    >
      {/* Cover Image */}
      {article.featuredImage && (
        <div className="aspect-[16/9] w-full overflow-hidden border-b border-zinc-800">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-6">
        <div className="mb-3 text-[10px] font-black uppercase tracking-widest text-orange-500">
          {showType
            ? contentTypeMap[article.contentType] || article.contentType
            : article.category}
        </div>
        <h3 className="mb-3 text-lg font-black uppercase italic leading-snug tracking-tighter transition-colors group-hover:text-orange-500">
          {article.title}
        </h3>
        <p className="line-clamp-2 text-sm text-zinc-500">
          {article.description}
        </p>
        <div className="mt-4 flex items-center gap-1 text-[10px] tracking-widest text-zinc-600">
          <CalendarDays className="h-3 w-3" />
          {new Date(article.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>
    </Link>
  );
}
