import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  items?: FaqItem[];
  data?: string;
}

export function Faq({ items, data }: FaqProps) {
  let faqItems: FaqItem[] = [];
  if (items && Array.isArray(items)) {
    faqItems = items;
  } else if (data) {
    try {
      faqItems = JSON.parse(data);
    } catch {
      return null;
    }
  }
  if (faqItems.length === 0) return null;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
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
        {faqItems.map((item, i) => (
          <details
            key={i}
            className="group bg-zinc-900/50"
            open={i === 0 ? true : undefined}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-4 text-sm font-bold text-zinc-200 transition-colors hover:text-orange-500 [&::-webkit-details-marker]:hidden">
              {item.question}
              <ChevronDown
                size={16}
                className="shrink-0 text-zinc-400 transition-transform group-open:rotate-180"
              />
            </summary>
            <div className="border-t border-zinc-800 px-6 py-4 text-sm text-zinc-400">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
