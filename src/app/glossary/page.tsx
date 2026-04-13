import { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { glossaryTerms } from "@/data/glossary";
import { GlossaryClient } from "./glossary-client";

export const metadata: Metadata = {
  title: "Home Gym Glossary",
  description:
    "Complete glossary of home gym terminology — lifts, equipment, training concepts, form cues, and accessories. 50+ terms defined clearly.",
  alternates: { canonical: "/glossary/" },
  openGraph: {
    title: "Home Gym Glossary",
    description:
      "50+ home gym terms defined clearly — AMRAP, EMOM, RPE, hypertrophy, Valsalva, and more.",
    type: "website",
    url: "/glossary/",
  },
};

export default function GlossaryPage() {
  // Generate DefinedTermSet JSON-LD for SEO
  const schema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Home Gym Glossary",
    description:
      "Complete glossary of home gym terminology, lifts, equipment, and training concepts.",
    hasDefinedTerm: glossaryTerms.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: t.short,
      inDefinedTermSet: "https://garagegymbuilders.com/glossary/",
    })),
  };

  return (
    <div className="mx-auto max-w-5xl px-6 pt-24 pb-16 sm:pt-32 sm:pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <header className="mb-12">
        <div className="mb-4 flex items-center gap-3">
          <div className="skew-x-[-12deg] bg-orange-600 p-2">
            <BookOpen className="skew-x-[12deg] text-black" size={24} />
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-orange-500">
            Reference
          </div>
        </div>
        <h1 className="mb-4 text-5xl font-black uppercase italic leading-[0.85] tracking-tighter md:text-6xl">
          Home Gym <br />
          <span className="bg-gradient-to-br from-orange-300 via-orange-500 to-orange-800 bg-clip-text text-transparent">
            Glossary
          </span>
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-zinc-500">
          {glossaryTerms.length} terms defined — from AMRAP to Zone 2.
          Everything you need to speak gym fluently.
        </p>
      </header>

      <GlossaryClient terms={glossaryTerms} />
    </div>
  );
}
