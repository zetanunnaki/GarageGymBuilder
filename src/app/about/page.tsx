import { Metadata } from "next";
import Link from "next/link";
import { Dumbbell, ArrowRight } from "lucide-react";
import { getAllAuthors } from "@/data/authors";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description:
    "Learn about GarageGymBuilders — our mission, our team, and how we help you build the perfect home gym on any budget.",
  path: "/about/",
  image: "/og-default.png",
  keywords: [
    "about garagegymbuilders",
    "home gym experts",
    "home gym review team",
  ],
});

export default function AboutPage() {
  const authors = getAllAuthors();
  return (
    <div className="mx-auto max-w-3xl px-6 pt-24 pb-16 sm:pt-32 sm:pb-20">
      <div className="mb-8 flex items-center gap-3">
        <div className="skew-x-[-12deg] bg-orange-600 p-1.5">
          <Dumbbell className="skew-x-[12deg] text-black" size={24} />
        </div>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">
          About Us
        </h1>
      </div>

      <div className="prose prose-lg prose-invert max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter prose-p:text-zinc-400 prose-p:leading-relaxed prose-strong:text-zinc-200">
        <p>
          GarageGymBuilders was founded with a simple mission: help people build
          great home gyms without wasting money on equipment they don&apos;t
          need.
        </p>

        <h2>Our Testing Process</h2>
        <p>
          Every product we recommend has been personally tested by our team. We
          don&apos;t just read spec sheets — we assemble, lift on, and live with
          the equipment before writing a single word.
        </p>

        <h2>How We Make Money</h2>
        <p>
          GarageGymBuilders is reader-supported. When you buy through links on our
          site, we may earn an affiliate commission at no additional cost to you.
          This helps us keep testing equipment and publishing free content.
        </p>
        <p>
          Our affiliate relationships never influence our recommendations. If a
          product isn&apos;t good enough for our own gyms, we won&apos;t
          recommend it for yours.
        </p>

        <h2>Contact</h2>
        <p>
          Have questions, feedback, or want to work with us? Reach out at{" "}
          <strong>hello@garagegymbuilders.com</strong>.
        </p>
      </div>

      {/* Meet the Team Section */}
      <div className="mt-16 border-t border-zinc-800 pt-12">
        <h2 className="mb-4 text-3xl font-black uppercase italic tracking-tighter">
          Meet the Team
        </h2>
        <p className="mb-8 text-zinc-500">
          The lifters and coaches behind every review.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {authors.map((author) => (
            <Link
              key={author.slug}
              href={`/team/${author.slug}/`}
              className="group block border border-zinc-800 bg-zinc-900/40 p-6 transition-colors hover:border-orange-600/50"
            >
              <div className="mb-3 flex h-14 w-14 items-center justify-center bg-orange-600/10">
                <Dumbbell className="text-orange-500" size={24} />
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                {author.role}
              </div>
              <p className="mb-2 text-base font-black uppercase italic tracking-tighter transition-colors group-hover:text-orange-500">
                {author.name}
              </p>
              <p className="text-xs leading-relaxed text-zinc-500">
                {author.shortBio}
              </p>
            </Link>
          ))}
        </div>
        <Link
          href="/team/"
          className="mt-6 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-500 hover:underline"
        >
          See full team page <ArrowRight size={10} />
        </Link>
      </div>
    </div>
  );
}
