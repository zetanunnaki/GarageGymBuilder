import { Metadata } from "next";
import Link from "next/link";
import { getAllAuthors } from "@/data/authors";
import { Dumbbell, ArrowRight } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Meet the Team",
  description:
    "Meet the powerlifters, coaches, and equipment specialists behind GarageGymBuilders. Real lifters, real testing, real reviews.",
  path: "/team/",
  image: "/og-default.png",
  keywords: [
    "home gym experts",
    "powerlifting coaches",
    "garagegymbuilders team",
  ],
});

export default function TeamPage() {
  const authors = getAllAuthors();
  const teamSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "GarageGymBuilders Team",
    description:
      "Real lifters, coaches, and equipment specialists behind every review at GarageGymBuilders.",
    itemListElement: authors.map((author, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Person",
        name: author.name,
        jobTitle: author.role,
        description: author.shortBio,
        url: `https://garagegymbuilders.com/team/${author.slug}/`,
        worksFor: {
          "@type": "Organization",
          name: "GarageGymBuilders",
          url: "https://garagegymbuilders.com",
        },
      },
    })),
  };

  return (
    <div className="mx-auto max-w-4xl px-6 pt-24 pb-16 sm:pt-32 sm:pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamSchema) }}
      />
      <div className="mb-12">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-orange-400">
          <Dumbbell size={12} /> Real Lifters. Real Testing.
        </div>
        <h1 className="mb-6 text-5xl font-black uppercase italic leading-none tracking-tighter md:text-6xl">
          Meet the Team
        </h1>
        <p className="text-lg italic leading-relaxed text-zinc-400">
          The lifters, coaches, and engineers behind every review. We assemble
          every rack, load every plate, and break every piece of equipment so
          you don&apos;t have to.
        </p>
      </div>

      <div className="space-y-6">
        {authors.map((author) => (
          <Link
            key={author.slug}
            href={`/team/${author.slug}/`}
            className="group block border border-zinc-800 bg-zinc-900/40 p-8 transition-colors hover:border-orange-600/50"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center border-2 border-zinc-800 bg-zinc-900 transition-colors group-hover:border-orange-600">
                <Dumbbell className="text-orange-500" size={40} />
              </div>
              <div className="flex-1">
                <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-orange-500">
                  {author.role}
                </div>
                <h2 className="mb-3 text-3xl font-black uppercase italic leading-none tracking-tighter transition-colors group-hover:text-orange-500">
                  {author.name}
                </h2>
                <p className="mb-4 text-sm leading-relaxed text-zinc-400">
                  {author.shortBio}
                </p>
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  <span>{author.yearsExperience}+ years experience</span>
                  <span>&middot;</span>
                  <span className="flex items-center gap-1 text-orange-500">
                    Read full bio <ArrowRight size={10} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 border border-zinc-800 bg-zinc-900/30 p-8">
        <h2 className="mb-4 text-2xl font-black uppercase italic tracking-tighter">
          Our Testing Standards
        </h2>
        <ul className="space-y-3 text-sm text-zinc-400">
          <li>
            <strong className="text-zinc-200">We buy our own equipment.</strong>{" "}
            No PR samples, no sponsored reviews, no pay-to-play rankings.
          </li>
          <li>
            <strong className="text-zinc-200">We use it daily.</strong> Every
            piece of equipment we recommend has been part of our personal
            training for at least 30 days, often years.
          </li>
          <li>
            <strong className="text-zinc-200">We document failures.</strong> If
            something breaks, we tell you. Negative reviews are just as
            important as positive ones.
          </li>
          <li>
            <strong className="text-zinc-200">
              We disclose affiliate relationships.
            </strong>{" "}
            We earn commissions from Amazon affiliate links, but our
            recommendations come first. Read our{" "}
            <Link
              href="/affiliate-disclosure/"
              className="text-orange-500 hover:underline"
            >
              affiliate disclosure
            </Link>
            .
          </li>
        </ul>
      </div>
    </div>
  );
}
