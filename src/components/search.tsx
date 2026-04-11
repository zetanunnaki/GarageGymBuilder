"use client";

import { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, X, ArrowRight } from "lucide-react";

interface SearchItem {
  title: string;
  description: string;
  slug: string;
  contentType: string;
  category: string;
}

interface SearchProps {
  articles: SearchItem[];
}

export function Search({ articles }: SearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results =
    query.length >= 2
      ? articles.filter(
          (a) =>
            a.title.toLowerCase().includes(query.toLowerCase()) ||
            a.description.toLowerCase().includes(query.toLowerCase()) ||
            a.category.toLowerCase().includes(query.toLowerCase())
        )
      : [];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="hidden items-center gap-2 border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 transition-colors hover:border-orange-600/50 hover:text-zinc-300 md:flex"
        aria-label="Search"
      >
        <SearchIcon size={12} />
        Search
        <kbd className="ml-1 rounded border border-zinc-700 px-1 text-[9px] text-zinc-600">
          Ctrl+K
        </kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => {
          setOpen(false);
          setQuery("");
        }}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-xl border border-zinc-800 bg-[#0a0a0a] shadow-2xl">
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-4">
          <SearchIcon size={16} className="shrink-0 text-orange-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, reviews, guides..."
            className="flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-600 outline-none"
          />
          <button
            onClick={() => {
              setOpen(false);
              setQuery("");
            }}
            className="text-zinc-500 hover:text-zinc-300"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        {query.length >= 2 && (
          <div className="max-h-80 overflow-y-auto">
            {results.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-zinc-600">
                No results for &ldquo;{query}&rdquo;
              </div>
            ) : (
              results.map((article) => (
                <a
                  key={`${article.contentType}/${article.slug}`}
                  href={`/${article.contentType}/${article.slug}`}
                  className="group flex items-center justify-between border-b border-zinc-800/50 px-4 py-3 transition-colors hover:bg-zinc-900"
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-orange-500/70">
                      {article.contentType.replace("-", " ")}
                    </span>
                    <p className="text-sm font-bold text-zinc-300 group-hover:text-orange-500">
                      {article.title}
                    </p>
                  </div>
                  <ArrowRight
                    size={14}
                    className="shrink-0 text-zinc-700 group-hover:text-orange-500"
                  />
                </a>
              ))
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-800 px-4 py-2 text-[10px] text-zinc-600">
          <span>Type to search</span>
          <span>
            <kbd className="rounded border border-zinc-700 px-1">ESC</kbd> to
            close
          </span>
        </div>
      </div>
    </div>
  );
}
