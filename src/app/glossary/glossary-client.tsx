"use client";

import { useState, useMemo } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import type { GlossaryTerm } from "@/data/glossary";

interface GlossaryClientProps {
  terms: GlossaryTerm[];
}

export function GlossaryClient({ terms }: GlossaryClientProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const set = new Set(terms.map((t) => t.category));
    return ["all", ...Array.from(set)];
  }, [terms]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return terms
      .filter((t) => category === "all" || t.category === category)
      .filter((t) => {
        if (!q) return true;
        return (
          t.term.toLowerCase().includes(q) ||
          t.short.toLowerCase().includes(q) ||
          t.long.toLowerCase().includes(q)
        );
      });
  }, [terms, query, category]);

  const grouped = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {};
    for (const t of filtered) {
      if (!groups[t.category]) groups[t.category] = [];
      groups[t.category].push(t);
    }
    return groups;
  }, [filtered]);

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6">
        <SearchIcon
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
          size={18}
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search terms..."
          className="w-full border-2 border-zinc-800 bg-zinc-900/40 py-4 pl-12 pr-12 text-base text-zinc-100 placeholder:text-zinc-600 focus:border-orange-600 focus:outline-none"
          aria-label="Search glossary"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-orange-500"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`border px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors ${
              category === cat
                ? "border-orange-600 bg-orange-600/10 text-orange-500"
                : "border-zinc-800 text-zinc-500 hover:border-orange-600/50 hover:text-orange-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="mb-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">
        {filtered.length} term{filtered.length === 1 ? "" : "s"}
      </div>

      {filtered.length === 0 ? (
        <div className="border border-zinc-800 bg-zinc-900/30 p-12 text-center text-zinc-500">
          No matches for &ldquo;{query}&rdquo;
        </div>
      ) : (
        Object.entries(grouped).map(([cat, items]) => (
          <section key={cat} className="mb-12">
            <h2 className="mb-6 border-l-8 border-orange-600 pl-4 text-2xl font-black uppercase italic tracking-tighter">
              {cat}
            </h2>
            <dl className="space-y-4">
              {items.map((t) => (
                <div
                  key={t.term}
                  id={t.term.toLowerCase().replace(/\s+/g, "-")}
                  className="border border-zinc-800 bg-zinc-900/40 p-6 transition-colors hover:border-orange-600/40"
                >
                  <dt className="mb-2 flex items-baseline gap-3">
                    <span className="text-2xl font-black uppercase italic tracking-tighter text-zinc-100">
                      {t.term}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">
                      {t.category}
                    </span>
                  </dt>
                  <dd>
                    <p className="mb-2 font-bold text-orange-400">{t.short}</p>
                    <p className="text-sm leading-relaxed text-zinc-400">
                      {t.long}
                    </p>
                    {t.related && t.related.length > 0 && (
                      <div className="mt-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                        <span>Related:</span>
                        {t.related.map((r) => (
                          <a
                            key={r}
                            href={`#${r.toLowerCase().replace(/\s+/g, "-")}`}
                            className="text-orange-500 hover:underline"
                          >
                            {r}
                          </a>
                        ))}
                      </div>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))
      )}
    </div>
  );
}
