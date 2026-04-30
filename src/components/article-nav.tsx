import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getAllArticles } from "@/lib/mdx";

interface ArticleNavProps {
  currentSlug: string;
  contentType: string;
}

export function ArticleNav({ currentSlug, contentType }: ArticleNavProps) {
  const articles = getAllArticles(contentType);
  const currentIndex = articles.findIndex((a) => a.slug === currentSlug);
  if (currentIndex === -1) return null;

  const prev = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;
  const next = currentIndex > 0 ? articles[currentIndex - 1] : null;

  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Article navigation"
      className="mt-12 grid grid-cols-1 gap-4 border-t border-zinc-800 pt-8 sm:grid-cols-2"
    >
      {prev ? (
        <Link
          href={`/${contentType}/${prev.slug}/`}
          className="group flex items-start gap-3 border border-zinc-800 bg-zinc-900/40 p-5 transition-colors hover:border-orange-600/50"
        >
          <ArrowLeft
            size={16}
            className="mt-1 shrink-0 text-zinc-500 transition-transform group-hover:-translate-x-1 group-hover:text-orange-500"
          />
          <div className="min-w-0">
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
              Previous
            </span>
            <p className="mt-1 truncate text-sm font-bold leading-snug text-zinc-300 transition-colors group-hover:text-orange-500">
              {prev.title}
            </p>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/${contentType}/${next.slug}/`}
          className="group flex items-start justify-end gap-3 border border-zinc-800 bg-zinc-900/40 p-5 text-right transition-colors hover:border-orange-600/50"
        >
          <div className="min-w-0">
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
              Next
            </span>
            <p className="mt-1 truncate text-sm font-bold leading-snug text-zinc-300 transition-colors group-hover:text-orange-500">
              {next.title}
            </p>
          </div>
          <ArrowRight
            size={16}
            className="mt-1 shrink-0 text-zinc-500 transition-transform group-hover:translate-x-1 group-hover:text-orange-500"
          />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
