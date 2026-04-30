"use client";

import { useEffect, useState } from "react";
import { List, ChevronDown } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const elements = article.querySelectorAll("h2, h3");
    const items: TocItem[] = [];

    elements.forEach((el) => {
      const text = el.textContent || "";
      const id =
        el.id ||
        text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      el.id = id;
      items.push({
        id,
        text,
        level: el.tagName === "H2" ? 2 : 3,
      });
    });

    setHeadings(items);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (headings.length < 3) return null;

  return (
    <div className="mb-12 border border-zinc-800 bg-zinc-900/50">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 p-5 text-left transition-colors hover:bg-zinc-900"
        aria-expanded={!!open}
        aria-controls="toc-list"
      >
        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-500">
          <List size={14} />
          Table of Contents
          <span className="ml-1 text-zinc-400">
            ({headings.length})
          </span>
        </span>
        <ChevronDown
          size={16}
          className={`text-zinc-400 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <nav
          id="toc-list"
          className="border-t border-zinc-800 px-5 pb-5 pt-4"
        >
          <ul className="space-y-2">
            {headings.map((heading) => (
              <li
                key={heading.id}
                className={heading.level === 3 ? "ml-4" : ""}
              >
                <a
                  href={`#${heading.id}`}
                  className={`relative block py-1 text-sm transition-colors ${
                    activeId === heading.id
                      ? "font-bold text-orange-500"
                      : "text-zinc-400 hover:text-zinc-300"
                  }`}
                >
                  {activeId === heading.id && (
                    <span className="absolute -left-3 top-1/2 h-4 w-0.5 -translate-y-1/2 bg-orange-500" />
                  )}
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
