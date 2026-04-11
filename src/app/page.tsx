import Link from "next/link";
import { getAllContent } from "@/lib/mdx";
import { generateWebsiteSchema } from "@/lib/json-ld";
import { PopularProducts } from "@/components/popular-products";
import { AnimatedCounter } from "@/components/animated-counter";
import {
  Dumbbell,
  Zap,
  MoveRight,
  ChevronRight,
  ShieldCheck,
  Weight,
  CalendarDays,
} from "lucide-react";

const contentTypeMap: Record<string, string> = {
  "best-gear": "Best Gear",
  reviews: "Review",
  guides: "Guide",
  builds: "Build",
};

export default function HomePage() {
  const recentArticles = getAllContent().slice(0, 6);

  const websiteSchema = generateWebsiteSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {/* HERO SECTION */}
      <section className="relative overflow-hidden px-6 pt-40 pb-20">
        <div className="absolute inset-0 bg-[url('/images/covers/hero-bg.webp')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-transparent to-[#0a0a0a]" />
        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-orange-400">
            <Zap size={12} fill="currentColor" /> 2026 Ultimate Gear Tested
          </div>
          <h1 className="mb-8 text-7xl font-black uppercase italic leading-[0.85] tracking-tighter md:text-9xl">
            Build Your <br />
            <span className="bg-gradient-to-b from-orange-400 to-orange-700 bg-clip-text text-transparent">
              Iron Paradise
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg font-medium leading-relaxed text-zinc-500 md:text-xl">
            Expert, database-free reviews. We pull the data, you pull the weight.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/builds/home-gym-under-1000"
              className="skew-x-[-12deg] bg-orange-600 px-10 py-5 text-lg font-black uppercase italic tracking-tighter text-white transition hover:bg-orange-500"
            >
              <span className="flex skew-x-[12deg] items-center gap-3">
                Start a Budget Build <MoveRight />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="border-y border-zinc-800 bg-zinc-900/30">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-zinc-800 sm:grid-cols-4">
          <AnimatedCounter value="200+" label="Hours Testing" />
          <AnimatedCounter value="8" label="Products Reviewed" />
          <AnimatedCounter value="26+" label="Articles Published" />
          <AnimatedCounter value="$0" label="Database Cost" />
        </div>
      </section>

      {/* BENTO GRID */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid h-full grid-cols-1 gap-4 md:h-[500px] md:grid-cols-4 md:grid-rows-2">
          {/* Power Racks - Large Card */}
          <Link
            href="/best-gear/best-power-racks-under-500"
            className="group relative flex flex-col justify-end overflow-hidden border border-zinc-800 bg-zinc-900 p-10 md:col-span-2 md:row-span-2"
          >
            <div className="absolute inset-0 bg-[url('/images/covers/bento-power-racks.webp')] bg-cover bg-center opacity-20 transition-opacity duration-500 group-hover:opacity-35" />
            <h3 className="relative z-10 mb-4 text-5xl font-black uppercase italic leading-none">
              Power <br />
              Racks
            </h3>
            <p className="relative z-10 max-w-[200px] text-sm text-zinc-500">
              The absolute centerpiece of every home gym. Tested for safety.
            </p>
          </Link>

          {/* Budget Builds - Orange Card */}
          <Link
            href="/builds"
            className="group relative flex flex-col justify-between overflow-hidden bg-orange-600 p-10 md:col-span-2"
          >
            <div className="absolute inset-0 bg-[url('/images/covers/bento-budget-builds.webp')] bg-cover bg-center opacity-15 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-25" />
            <h3 className="text-3xl font-black uppercase italic leading-none text-black">
              Budget Builds <br />
              $500 &middot; $1K &middot; $2K
            </h3>
            <ChevronRight
              className="self-end text-black transition-transform group-hover:translate-x-2"
              size={40}
            />
          </Link>

          {/* Reviews */}
          <Link
            href="/reviews"
            className="flex flex-col items-center justify-center border border-zinc-800 bg-zinc-900 p-6 text-center transition-colors hover:border-orange-600"
          >
            <ShieldCheck className="mb-2 text-orange-500" size={32} />
            <span className="text-xs font-black uppercase italic tracking-widest">
              Reviews
            </span>
          </Link>

          {/* Guides */}
          <Link
            href="/guides"
            className="flex flex-col items-center justify-center border border-zinc-800 bg-zinc-900 p-6 text-center transition-colors hover:border-orange-600"
          >
            <Weight className="mb-2 text-orange-500" size={32} />
            <span className="text-xs font-black uppercase italic tracking-widest">
              Guides
            </span>
          </Link>
        </div>
      </section>

      {/* POPULAR PRODUCTS */}
      <PopularProducts />

      {/* RECENT ARTICLES */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 border-l-8 border-orange-600 pl-6 text-4xl font-black uppercase italic tracking-tighter">
            Latest Articles
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/${article.contentType}/${article.slug}`}
                className="group overflow-hidden border border-zinc-800 bg-zinc-900/40 transition-colors hover:border-orange-600/50"
              >
                {article.featuredImage && (
                  <div className="aspect-[16/9] w-full overflow-hidden border-b border-zinc-800">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="mb-3 text-[10px] font-black uppercase tracking-widest text-orange-500">
                    {contentTypeMap[article.contentType] || article.contentType}
                  </div>
                  <h3 className="mb-3 text-lg font-black uppercase italic leading-snug tracking-tighter transition-colors group-hover:text-orange-500">
                    {article.title}
                  </h3>
                  <p className="line-clamp-2 text-sm text-zinc-500">
                    {article.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-[10px] tracking-widest text-zinc-600">
                    <CalendarDays className="h-3 w-3" />
                    {new Date(article.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Browse All CTA */}
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {[
              { href: "/best-gear", label: "All Roundups" },
              { href: "/reviews", label: "All Reviews" },
              { href: "/guides", label: "All Guides" },
              { href: "/builds", label: "All Builds" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border border-zinc-800 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-colors hover:border-orange-600 hover:text-orange-500"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="border-t border-zinc-800 bg-zinc-900/30 px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-black uppercase italic tracking-tighter md:text-4xl">
            Ready to Build?
          </h2>
          <p className="mb-8 text-zinc-500">
            Pick your budget and we&apos;ll show you exactly what to buy. Every
            product tested, every dollar accounted for.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/builds/home-gym-under-500"
              className="border-2 border-zinc-700 px-8 py-4 font-black italic text-zinc-300 transition-colors hover:border-orange-600 hover:text-orange-500"
            >
              $500 Build
            </Link>
            <Link
              href="/builds/home-gym-under-1000"
              className="skew-x-[-12deg] bg-orange-600 px-8 py-4 font-black italic text-white transition hover:bg-orange-500"
            >
              <span className="skew-x-[12deg] inline-block">$1,000 Build</span>
            </Link>
            <Link
              href="/builds/home-gym-under-2000"
              className="border-2 border-zinc-700 px-8 py-4 font-black italic text-zinc-300 transition-colors hover:border-orange-600 hover:text-orange-500"
            >
              $2,000 Build
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
