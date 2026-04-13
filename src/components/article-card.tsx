import Link from "next/link";
import { CalendarDays, ArrowUpRight } from "lucide-react";
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
      href={`/${article.contentType}/${article.slug}/`}
      className="group relative block overflow-hidden border border-zinc-800 bg-zinc-900/40 transition-all duration-500 hover:-translate-y-1 hover:border-orange-600/60 hover:bg-zinc-900/70 hover:shadow-[0_20px_50px_-12px_rgba(234,88,12,0.25)]"
    >
      {/* Top accent bar - fills in on hover */}
      <div className="absolute left-0 top-0 z-10 h-0.5 w-0 bg-gradient-to-r from-orange-500 to-orange-700 transition-all duration-500 group-hover:w-full" />

      {/* Cover Image */}
      {article.featuredImage && (
        <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-zinc-800">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-110"
            loading="lazy"
          />
          {/* Dark gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          {/* Arrow badge that slides in */}
          <div className="absolute right-4 top-4 flex h-10 w-10 translate-x-12 items-center justify-center bg-orange-600 text-black opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
            <ArrowUpRight size={20} strokeWidth={3} />
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-2 w-2 bg-orange-500" />
          <div className="text-[10px] font-black uppercase tracking-widest text-orange-500">
            {showType
              ? contentTypeMap[article.contentType] || article.contentType
              : article.category}
          </div>
        </div>
        <h3 className="mb-3 text-lg font-black uppercase italic leading-snug tracking-tighter transition-colors group-hover:text-orange-400">
          {article.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-zinc-500">
          {article.description}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-zinc-800/50 pt-4 text-[10px] tracking-widest text-zinc-600">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            {new Date(article.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className="font-black uppercase tracking-widest text-orange-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            Read &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
