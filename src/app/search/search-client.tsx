"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search as SearchIcon, X } from "lucide-react";
import searchIndex from "@/data/search-index.json";

type IndexEntry = {
  title: string;
  description: string;
  slug: string;
  contentType: string;
  category?: string;
};

const contentTypeLabels: Record<string, string> = {
  "best-gear": "Best Gear",
  reviews: "Review",
  guides: "Guide",
  builds: "Build",
  products: "Product",
};

function getResultHref(r: IndexEntry): string {
  if (r.contentType === "products") return `/picks/#${r.slug}`;
  return `/${r.contentType}/${r.slug}/`;
}

function score(entry: IndexEntry, terms: string[]): number {
  const title = entry.title.toLowerCase();
  const desc = entry.description.toLowerCase();
  const cat = (entry.category || "").toLowerCase();
  let s = 0;
  for (const t of terms) {
    if (!t) continue;
    if (title.includes(t)) s += 10;
    if (title.startsWith(t)) s += 5;
    if (desc.includes(t)) s += 3;
    if (cat.includes(t)) s += 2;
  }
  return s;
}

export function SearchClient() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) setQuery(q);
  }, []);

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [] as (IndexEntry & { _score: number })[];
    const terms = trimmed.split(/\s+/);
    const entries = searchIndex as IndexEntry[];
    return entries
      .filter((e) => filter === "all" || e.contentType === filter)
      .map((e) => ({ ...e, _score: score(e, terms) }))
      .filter((e) => e._score > 0)
      .sort((a, b) => b._score - a._score)
      .slice(0, 50);
  }, [query, filter]);

  const filters = [
    { key: "all", label: "All" },
    { key: "reviews", label: "Reviews" },
    { key: "guides", label: "Guides" },
    { key: "best-gear", label: "Best Gear" },
    { key: "builds", label: "Builds" },
  ];

  return (
    <div>
      <div className="relative mb-6">
        <SearchIcon
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
          size={20}
        />
        <input
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search reviews, guides, products..."
          className="w-full border-2 border-zinc-800 bg-zinc-900/40 py-4 pl-12 pr-12 text-base text-zinc-100 placeholder:text-zinc-400 focus:border-orange-600 focus:outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-orange-500"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`border px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors ${
              filter === f.key
                ? "border-orange-600 bg-orange-600/10 text-orange-500"
                : "border-zinc-800 text-zinc-400 hover:border-orange-600/50 hover:text-orange-500"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {!query.trim() && (
        <div className="border border-zinc-800 bg-zinc-900/30 p-10 text-center">
          <p className="text-zinc-400">
            Start typing above to search across {(searchIndex as IndexEntry[]).length}+ articles.
          </p>
        </div>
      )}

      {query.trim() && results.length === 0 && (
        <div className="border border-zinc-800 bg-zinc-900/30 p-10 text-center">
          <p className="mb-2 text-zinc-400">
            No results for &ldquo;{query}&rdquo;.
          </p>
          <p className="text-sm text-zinc-400">
            Try a broader term or check the filter above.
          </p>
        </div>
      )}

      {results.length > 0 && (
        <>
          <div className="mb-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
            {results.length} result{results.length === 1 ? "" : "s"}
          </div>
          <ul className="space-y-3">
            {results.map((r) => (
              <li key={`${r.contentType}/${r.slug}`}>
                <Link
                  href={getResultHref(r)}
                  className="block border border-zinc-800 bg-zinc-900/40 p-6 transition-colors hover:border-orange-600/50"
                >
                  <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-orange-500">
                    {contentTypeLabels[r.contentType] || r.contentType}
                    {r.category && (
                      <span className="ml-2 text-zinc-400">&middot; {r.category}</span>
                    )}
                  </div>
                  <h2 className="mb-2 text-lg font-black uppercase italic leading-tight tracking-tighter text-zinc-100 transition-colors group-hover:text-orange-500">
                    {r.title}
                  </h2>
                  <p className="line-clamp-2 text-sm text-zinc-400">{r.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
