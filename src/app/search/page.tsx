import { Metadata } from "next";
import { SearchClient } from "./search-client";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search GarageGymBuilders for reviews, guides, builds, and best-of lists. Find the gear and answers you need for your home gym.",
  alternates: { canonical: "/search/" },
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 pt-32 pb-20">
      <h1 className="mb-4 text-5xl font-black uppercase italic leading-none tracking-tighter md:text-6xl">
        Search
      </h1>
      <p className="mb-10 text-lg italic text-zinc-500">
        Find reviews, guides, builds, and product comparisons across the entire site.
      </p>
      <SearchClient />
    </section>
  );
}
