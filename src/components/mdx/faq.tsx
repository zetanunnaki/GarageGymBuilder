"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  items: FaqItem[];
}

export function Faq({ items }: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!items || !Array.isArray(items)) return null;

  // Generate FAQPage JSON-LD schema for rich snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="not-prose my-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <h3 className="mb-6 text-xl font-black uppercase italic tracking-tighter">
        Frequently Asked Questions
      </h3>
      <div className="divide-y divide-zinc-800 border border-zinc-800">
        {items.map((item, i) => (
          <div key={i} className="bg-zinc-900/50">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-bold text-zinc-200 transition-colors hover:text-orange-500"
            >
              {item.question}
              <ChevronDown
                size={16}
                className={`shrink-0 text-zinc-500 transition-transform ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === i && (
              <div className="border-t border-zinc-800 px-6 py-4 text-sm text-zinc-400">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
