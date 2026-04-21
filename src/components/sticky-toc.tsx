"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function StickyToc() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

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
      { rootMargin: "-100px 0px -70% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (headings.length < 4) return null;

  return (
    <aside className="hidden xl:block fixed top-28 right-[max(1rem,calc((100vw-896px)/2-280px))] w-56">
      <div className="border border-zinc-800 bg-zinc-900/30 p-4">
        <div className="mb-3 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-400">
          <List size={10} />
          On this page
        </div>
        <nav>
          <ul className="space-y-1.5">
            {headings
              .filter((h) => h.level === 2)
              .map((heading) => (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    className={`block text-[11px] leading-tight transition-colors ${
                      activeId === heading.id
                        ? "font-bold text-orange-500"
                        : "text-zinc-400 hover:text-zinc-400"
                    }`}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
