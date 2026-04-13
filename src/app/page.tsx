import Link from "next/link";
import { getAllContent } from "@/lib/mdx";
import { generateWebsiteSchema, generateOrganizationSchema } from "@/lib/json-ld";
import { PopularProducts } from "@/components/popular-products";
import { AnimatedCounter } from "@/components/animated-counter";
import { Marquee } from "@/components/marquee";
import { SectionHeading } from "@/components/section-heading";
import {
  Dumbbell,
  Zap,
  MoveRight,
  ChevronRight,
  ShieldCheck,
  Weight,
  CalendarDays,
  Shield,
  Disc,
  Layers,
  Armchair,
  Grid3x3,
  Circle,
} from "lucide-react";

const buyersGuides = [
  { href: "/guides/how-to-choose-power-rack", label: "Power Rack", Icon: Shield },
  { href: "/guides/how-to-choose-barbell", label: "Barbell", Icon: Weight },
  { href: "/guides/how-to-choose-adjustable-dumbbells", label: "Adjustable Dumbbells", Icon: Dumbbell },
  { href: "/guides/how-to-choose-weight-bench", label: "Weight Bench", Icon: Armchair },
  { href: "/guides/how-to-choose-weight-plates", label: "Weight Plates", Icon: Disc },
  { href: "/guides/how-to-choose-kettlebell", label: "Kettlebell", Icon: Circle },
  { href: "/guides/how-to-choose-gym-flooring", label: "Gym Flooring", Icon: Grid3x3 },
];

const contentTypeMap: Record<string, string> = {
  "best-gear": "Best Gear",
  reviews: "Review",
  guides: "Guide",
  builds: "Build",
};

export default function HomePage() {
  const recentArticles = getAllContent().slice(0, 6);

  const websiteSchema = generateWebsiteSchema();
  const organizationSchema = generateOrganizationSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {/* HERO SECTION */}
      <section className="relative overflow-hidden px-6 pt-40 pb-24">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('/images/covers/hero-bg.webp')" }}
        />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-pattern opacity-50" />
        {/* Glow orbs */}
        <div
          className="glow-orb"
          style={{
            top: "10%",
            left: "15%",
            width: "500px",
            height: "500px",
            background: "rgba(234, 88, 12, 0.25)",
          }}
        />
        <div
          className="glow-orb"
          style={{
            bottom: "5%",
            right: "10%",
            width: "400px",
            height: "400px",
            background: "rgba(249, 115, 22, 0.15)",
          }}
        />
        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-transparent to-[#0a0a0a]" />
        {/* Noise grain */}
        <div className="noise-overlay" />

        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <div
            data-reveal
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-orange-400 backdrop-blur-sm"
          >
            <Zap size={12} fill="currentColor" className="animate-pulse" />{" "}
            2026 Ultimate Gear Tested &middot; 30+ Products
          </div>
          <h1
            data-reveal="1"
            className="mb-8 text-7xl font-black uppercase italic leading-[0.82] tracking-tighter md:text-[10rem]"
          >
            Build Your <br />
            <span className="bg-gradient-to-br from-orange-300 via-orange-500 to-orange-800 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(234,88,12,0.4)]">
              Iron Paradise
            </span>
          </h1>
          <p
            data-reveal="2"
            className="mx-auto mb-12 max-w-2xl text-lg font-medium leading-relaxed text-zinc-400 md:text-xl"
          >
            Expert, database-free reviews.{" "}
            <span className="text-zinc-200">We pull the data,</span>{" "}
            <span className="italic text-orange-500">you pull the weight.</span>
          </p>
          <div
            data-reveal="3"
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/builds/home-gym-under-1000/"
              className="pulse-orange skew-x-[-12deg] bg-orange-600 px-10 py-5 text-lg font-black uppercase italic tracking-tighter text-white transition hover:bg-orange-500"
            >
              <span className="flex skew-x-[12deg] items-center gap-3">
                Start a Budget Build <MoveRight />
              </span>
            </Link>
            <Link
              href="/best-gear/"
              className="skew-x-[-12deg] border-2 border-zinc-700 px-10 py-5 text-lg font-black uppercase italic tracking-tighter text-zinc-300 transition hover:border-orange-500 hover:text-orange-400"
            >
              <span className="flex skew-x-[12deg] items-center gap-3">
                Browse Best Gear
              </span>
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="mt-20 flex flex-col items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">
            <span>Scroll to explore</span>
            <div className="h-8 w-px bg-gradient-to-b from-orange-500 to-transparent" />
          </div>
        </div>
      </section>

      {/* MARQUEE TICKER */}
      <Marquee
        items={[
          "Power Racks",
          "Adjustable Dumbbells",
          "Olympic Barbells",
          "Gymnastic Rings",
          "Rowing Machines",
          "Lifting Belts",
          "Kettlebells",
          "Plyo Boxes",
          "Weight Plates",
          "Trap Bars",
          "Jump Ropes",
          "Resistance Bands",
        ]}
      />

      {/* STATS BAR */}
      <section className="relative overflow-hidden border-y border-zinc-800 bg-zinc-900/30">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div
          className="glow-orb"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "800px",
            height: "200px",
            background: "rgba(234, 88, 12, 0.08)",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl grid-cols-3 divide-x divide-zinc-800">
          <AnimatedCounter value="200+" label="Hours Testing" />
          <AnimatedCounter value="36" label="Products Reviewed" />
          <AnimatedCounter value="135+" label="Articles Published" />
        </div>
      </section>

      {/* BENTO GRID */}
      <section className="relative mx-auto max-w-7xl px-6 py-24">
        <SectionHeading
          number="01"
          eyebrow="Explore"
          title="Pick Your Mission"
          subtitle="Every category, curated. Click in."
        />
        <div className="grid h-full grid-cols-1 gap-4 md:h-[520px] md:grid-cols-4 md:grid-rows-2">
          {/* Power Racks - Large Card */}
          <Link
            href="/best-gear/best-power-racks-under-500/"
            className="group relative flex flex-col justify-end overflow-hidden border border-zinc-800 bg-zinc-900 p-10 transition-all duration-500 hover:border-orange-600/60 hover:shadow-[0_30px_60px_-20px_rgba(234,88,12,0.4)] md:col-span-2 md:row-span-2"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 transition-all duration-[900ms] group-hover:scale-110 group-hover:opacity-40"
              style={{
                backgroundImage: "url('/images/covers/bento-power-racks.webp')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="noise-overlay" />
            <div className="absolute right-6 top-6 z-10 border border-orange-500/40 bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-orange-400 backdrop-blur-sm">
              Centerpiece
            </div>
            <h3 className="relative z-10 mb-4 text-5xl font-black uppercase italic leading-[0.85] md:text-7xl">
              Power <br />
              <span className="bg-gradient-to-r from-orange-400 to-orange-700 bg-clip-text text-transparent">
                Racks
              </span>
            </h3>
            <p className="relative z-10 max-w-[260px] text-sm leading-relaxed text-zinc-300">
              The absolute centerpiece of every home gym. Tested for safety,
              ranked by value.
            </p>
            <div className="relative z-10 mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-400">
              Browse Racks <MoveRight size={12} />
            </div>
          </Link>

          {/* Budget Builds - Orange Card */}
          <Link
            href="/builds/"
            className="group relative flex flex-col justify-between overflow-hidden bg-orange-600 p-10 transition-all duration-500 hover:bg-orange-500 md:col-span-2"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-multiply transition-all duration-[900ms] group-hover:scale-110 group-hover:opacity-30"
              style={{
                backgroundImage:
                  "url('/images/covers/bento-budget-builds.webp')",
              }}
            />
            <div className="noise-overlay" />
            <div className="relative z-10">
              <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-black/70">
                12 Complete Builds
              </div>
              <h3 className="text-3xl font-black uppercase italic leading-[0.9] text-black md:text-4xl">
                Budget Builds <br />
                $500 &middot; $1K &middot; $2K
              </h3>
            </div>
            <ChevronRight
              className="relative z-10 self-end text-black transition-transform duration-500 group-hover:translate-x-2"
              size={48}
              strokeWidth={3}
            />
          </Link>

          {/* Reviews */}
          <Link
            href="/reviews/"
            className="group relative flex flex-col items-center justify-center overflow-hidden border border-zinc-800 bg-zinc-900 p-6 text-center transition-all duration-500 hover:border-orange-600 hover:bg-zinc-900/80"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/0 via-orange-600/0 to-orange-600/0 transition-all duration-500 group-hover:from-orange-600/10 group-hover:to-orange-600/0" />
            <ShieldCheck
              className="relative z-10 mb-2 text-orange-500 transition-transform duration-500 group-hover:scale-110"
              size={32}
            />
            <span className="relative z-10 text-xs font-black uppercase italic tracking-widest">
              Reviews
            </span>
            <span className="relative z-10 mt-1 text-[9px] tracking-widest text-zinc-600">
              31 Tested
            </span>
          </Link>

          {/* Guides */}
          <Link
            href="/guides/"
            className="group relative flex flex-col items-center justify-center overflow-hidden border border-zinc-800 bg-zinc-900 p-6 text-center transition-all duration-500 hover:border-orange-600 hover:bg-zinc-900/80"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/0 via-orange-600/0 to-orange-600/0 transition-all duration-500 group-hover:from-orange-600/10 group-hover:to-orange-600/0" />
            <Weight
              className="relative z-10 mb-2 text-orange-500 transition-transform duration-500 group-hover:scale-110"
              size={32}
            />
            <span className="relative z-10 text-xs font-black uppercase italic tracking-widest">
              Guides
            </span>
            <span className="relative z-10 mt-1 text-[9px] tracking-widest text-zinc-600">
              47 Articles
            </span>
          </Link>
        </div>
      </section>

      {/* POPULAR PRODUCTS */}
      <PopularProducts />

      {/* BUYER'S GUIDES */}
      <section className="relative overflow-hidden border-t border-zinc-800 bg-zinc-900/30 px-6 py-24">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div
          className="glow-orb"
          style={{
            top: "-10%",
            right: "-5%",
            width: "500px",
            height: "500px",
            background: "rgba(234, 88, 12, 0.08)",
          }}
        />
        <div className="relative mx-auto max-w-7xl">
          <SectionHeading
            number="02"
            eyebrow="Decide Smart"
            title="Buyer's Guides"
            subtitle="Don't buy gear blind. Learn what actually matters before you spend."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {buyersGuides.map(({ href, label, Icon }, idx) => (
              <Link
                key={href}
                href={href}
                className="group relative flex items-center gap-4 overflow-hidden border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-orange-600/60 hover:shadow-[0_20px_40px_-15px_rgba(234,88,12,0.3)]"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-orange-500 to-orange-700 scale-y-0 origin-top transition-transform duration-500 group-hover:scale-y-100" />
                <div className="absolute right-3 top-3 font-mono text-[9px] tracking-widest text-zinc-700">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-zinc-800 bg-zinc-900 transition-all duration-500 group-hover:border-orange-600/50 group-hover:bg-orange-600/10">
                  <Icon
                    className="text-orange-500 transition-transform duration-500 group-hover:scale-110"
                    size={24}
                  />
                </div>
                <div>
                  <div className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
                    How to Choose
                  </div>
                  <div className="text-sm font-black uppercase italic tracking-tighter text-zinc-200 transition-colors group-hover:text-orange-400">
                    {label}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* RECENT ARTICLES */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            number="03"
            eyebrow="Fresh"
            title="Latest Articles"
            subtitle="New reviews, builds, and guides every week."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recentArticles.map((article, idx) => (
              <Link
                key={article.slug}
                href={`/${article.contentType}/${article.slug}/`}
                className="group relative block overflow-hidden border border-zinc-800 bg-zinc-900/40 transition-all duration-500 hover:-translate-y-1 hover:border-orange-600/60 hover:bg-zinc-900/70 hover:shadow-[0_20px_50px_-12px_rgba(234,88,12,0.25)]"
              >
                <div className="absolute left-0 top-0 z-10 h-0.5 w-0 bg-gradient-to-r from-orange-500 to-orange-700 transition-all duration-500 group-hover:w-full" />
                <div className="absolute right-4 top-4 z-10 font-mono text-[10px] tracking-widest text-zinc-700">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                {article.featuredImage && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-zinc-800">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                )}
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-2 w-2 bg-orange-500" />
                    <div className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                      {contentTypeMap[article.contentType] ||
                        article.contentType}
                    </div>
                  </div>
                  <h3 className="mb-3 text-lg font-black uppercase italic leading-snug tracking-tighter transition-colors group-hover:text-orange-400">
                    {article.title}
                  </h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-zinc-500">
                    {article.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-zinc-800/50 pt-4 text-[10px] tracking-widest text-zinc-600">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {new Date(article.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="font-black uppercase tracking-widest text-orange-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      Read &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Browse All CTA */}
          <div className="mt-16 flex flex-wrap justify-center gap-3">
            {[
              { href: "/best-gear/", label: "All Roundups" },
              { href: "/reviews/", label: "All Reviews" },
              { href: "/guides/", label: "All Guides" },
              { href: "/builds/", label: "All Builds" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group skew-x-[-12deg] border border-zinc-800 bg-zinc-900/50 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all hover:border-orange-600 hover:bg-orange-600/5 hover:text-orange-400"
              >
                <span className="inline-block skew-x-[12deg]">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="relative overflow-hidden border-t border-zinc-800 px-6 py-24">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div
          className="glow-orb"
          style={{
            top: "20%",
            left: "30%",
            width: "600px",
            height: "600px",
            background: "rgba(234, 88, 12, 0.12)",
          }}
        />
        <div className="noise-overlay" />
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-orange-400 backdrop-blur-sm">
            <Zap size={12} fill="currentColor" /> No Wasted Dollars
          </div>
          <h2 className="mb-6 text-5xl font-black uppercase italic leading-[0.85] tracking-tighter md:text-7xl">
            Ready to <br />
            <span className="bg-gradient-to-br from-orange-300 via-orange-500 to-orange-800 bg-clip-text text-transparent">
              Build?
            </span>
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-zinc-400">
            Pick your budget and we&apos;ll show you exactly what to buy.
            Every product tested, every dollar accounted for.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/builds/home-gym-under-500/"
              className="group skew-x-[-12deg] border-2 border-zinc-700 bg-zinc-900/50 px-8 py-4 text-lg font-black italic uppercase tracking-tighter text-zinc-300 backdrop-blur-sm transition-all hover:border-orange-600 hover:bg-orange-600/10 hover:text-orange-400"
            >
              <span className="inline-block skew-x-[12deg]">$500 Build</span>
            </Link>
            <Link
              href="/builds/home-gym-under-1000/"
              className="pulse-orange skew-x-[-12deg] bg-orange-600 px-10 py-4 text-lg font-black italic uppercase tracking-tighter text-white transition hover:bg-orange-500"
            >
              <span className="inline-block skew-x-[12deg]">$1,000 Build</span>
            </Link>
            <Link
              href="/builds/home-gym-under-2000/"
              className="group skew-x-[-12deg] border-2 border-zinc-700 bg-zinc-900/50 px-8 py-4 text-lg font-black italic uppercase tracking-tighter text-zinc-300 backdrop-blur-sm transition-all hover:border-orange-600 hover:bg-orange-600/10 hover:text-orange-400"
            >
              <span className="inline-block skew-x-[12deg]">$2,000 Build</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
