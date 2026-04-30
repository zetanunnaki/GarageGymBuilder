import Link from "next/link";
import { getAllContent } from "@/lib/mdx";
import { generateWebsiteSchema, generateOrganizationSchema } from "@/lib/json-ld";
import { PopularProducts } from "@/components/popular-products";
import { AnimatedCounter } from "@/components/animated-counter";
import { Marquee } from "@/components/marquee";
import { SectionHeading } from "@/components/section-heading";
import { SignatureBarbell } from "@/components/signature-barbell";
import { CursorSpotlight } from "@/components/cursor-spotlight";
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
  { href: "/guides/how-to-choose-power-rack/", label: "Power Rack", Icon: Shield },
  { href: "/guides/how-to-choose-barbell/", label: "Barbell", Icon: Weight },
  { href: "/guides/how-to-choose-adjustable-dumbbells/", label: "Adjustable Dumbbells", Icon: Dumbbell },
  { href: "/guides/how-to-choose-weight-bench/", label: "Weight Bench", Icon: Armchair },
  { href: "/guides/how-to-choose-weight-plates/", label: "Weight Plates", Icon: Disc },
  { href: "/guides/how-to-choose-kettlebell/", label: "Kettlebell", Icon: Circle },
  { href: "/guides/how-to-choose-gym-flooring/", label: "Gym Flooring", Icon: Grid3x3 },
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
      {/* HERO SECTION — signature */}
      <section className="relative isolate overflow-hidden px-4 pt-28 pb-20 sm:px-6 sm:pt-36 sm:pb-28">
        {/* layered backdrop */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/covers/hero-bg.webp')" }}
        />
        <div className="absolute inset-0 grid-pattern opacity-60" />
        <div
          className="glow-orb"
          style={{
            top: "8%",
            left: "10%",
            width: "560px",
            height: "560px",
            background: "rgba(234, 88, 12, 0.22)",
          }}
        />
        <div
          className="glow-orb"
          style={{
            bottom: "-10%",
            right: "5%",
            width: "520px",
            height: "520px",
            background: "rgba(249, 115, 22, 0.14)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/50 via-transparent to-[#0a0a0a]" />

        {/* Oversized ghost type behind everything */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-16 z-0 select-none overflow-hidden text-center"
        >
          <div
            className="text-outline-zinc whitespace-nowrap font-black uppercase italic leading-none tracking-tighter opacity-60"
            style={{ fontSize: "clamp(8rem, 26vw, 24rem)" }}
          >
            IRON&nbsp;·&nbsp;STEEL
          </div>
        </div>

        {/* Cursor-driven spotlight */}
        <CursorSpotlight />
        <div className="noise-overlay" />

        {/* Diagonal corner marks — brutalist framing */}
        <div className="pointer-events-none absolute inset-6 z-10 hidden md:block">
          <div className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-orange-600" />
          <div className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-orange-600" />
          <div className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-orange-600" />
          <div className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-orange-600" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 md:grid-cols-[1.2fr_1fr]">
          {/* LEFT — copy column */}
          <div className="text-center md:text-left">
            <div
              data-reveal
              className="mb-6 inline-flex items-center gap-2 border border-orange-500/40 bg-orange-500/5 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-orange-400 backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 animate-pulse bg-orange-500" />
              Rig &middot; 2026 Season &middot; 70 Products Tested
            </div>

            <h1
              data-reveal="1"
              className="text-display-xl mb-6 font-black uppercase italic tracking-[-0.04em]"
            >
              <span className="block etched-metal">Build Your</span>
              <span className="relative block">
                <span className="text-fill-on-scroll block">Iron</span>
              </span>
              <span className="relative block">
                <span className="etched-metal">Paradise.</span>
                <span
                  aria-hidden="true"
                  className="absolute -right-4 top-1/2 hidden h-[2px] w-24 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-transparent md:block"
                />
              </span>
            </h1>

            <p
              data-reveal="2"
              className="mx-auto mb-8 max-w-xl text-base font-medium leading-relaxed text-zinc-400 sm:text-lg md:mx-0 md:text-xl"
            >
              <span className="text-zinc-200">We pull the data.</span>{" "}
              <span className="italic text-orange-500">You pull the weight.</span>{" "}
              Zero fluff, zero affiliate theater — just gear that survives the
              garage.
            </p>

            <div
              data-reveal="3"
              className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 md:justify-start"
            >
              <Link
                href="/builds/home-gym-under-1000/"
                className="btn-sheen pulse-orange skew-x-[-12deg] bg-orange-600 px-8 py-4 text-base font-black uppercase italic tracking-tighter text-white transition hover:bg-orange-500 sm:px-10 sm:py-5 sm:text-lg"
              >
                <span className="flex skew-x-[12deg] items-center justify-center gap-3">
                  Start a $1K Build <MoveRight size={18} />
                </span>
              </Link>
              <Link
                href="/best-gear/"
                className="btn-sheen skew-x-[-12deg] border-2 border-zinc-700 bg-zinc-900/40 px-8 py-4 text-base font-black uppercase italic tracking-tighter text-zinc-300 backdrop-blur-sm transition hover:border-orange-500 hover:text-orange-400 sm:px-10 sm:py-5 sm:text-lg"
              >
                <span className="flex skew-x-[12deg] items-center justify-center gap-3">
                  Browse Best Gear
                </span>
              </Link>
            </div>

            {/* Credibility strip */}
            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-zinc-800/80 pt-6 text-left md:max-w-sm">
              {[
                { k: "500+", v: "Hrs Tested" },
                { k: "70", v: "Products" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="font-mono text-xl font-black text-orange-500 sm:text-2xl">
                    {s.k}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — signature barbell */}
          <div className="relative">
            <div className="relative mx-auto max-w-lg">
              {/* Spec label top-right */}
              <div className="absolute -top-6 right-0 z-10 border border-orange-500/40 bg-black/70 px-2 py-1 font-mono text-[9px] tracking-[0.25em] text-orange-400 backdrop-blur-sm">
                SPEC&nbsp;//&nbsp;20KG&nbsp;·&nbsp;190K&nbsp;PSI
              </div>
              <div className="absolute -bottom-6 left-0 z-10 border border-zinc-700/60 bg-black/70 px-2 py-1 font-mono text-[9px] tracking-[0.25em] text-zinc-400 backdrop-blur-sm">
                LOADED&nbsp;//&nbsp;315&nbsp;LB
              </div>
              <SignatureBarbell className="relative z-[1] h-auto w-full drop-shadow-[0_20px_40px_rgba(234,88,12,0.2)]" />

              {/* Orbit line */}
              <svg
                className="absolute inset-0 -z-10 h-full w-full"
                viewBox="0 0 800 240"
                fill="none"
                aria-hidden="true"
              >
                <ellipse
                  cx="400"
                  cy="120"
                  rx="380"
                  ry="95"
                  stroke="rgba(234,88,12,0.25)"
                  strokeWidth="1"
                  strokeDasharray="3 6"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Scroll tick */}
        <div className="relative z-10 mt-16 flex flex-col items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.4em] text-zinc-400">
          <span>▼&nbsp; Scroll</span>
          <div className="h-10 w-px bg-gradient-to-b from-orange-500 to-transparent" />
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
          <AnimatedCounter value="500+" label="Hours Testing" />
          <AnimatedCounter value="70" label="Products Reviewed" />
          <AnimatedCounter value="170+" label="Articles Published" />
        </div>
      </section>

      {/* SIGNATURE — LOAD THE BAR */}
      <section className="relative overflow-hidden border-b border-zinc-800 py-20 sm:py-28">
        <div className="absolute inset-0 slash-block" />
        <div
          className="glow-orb"
          style={{
            top: "50%",
            left: "10%",
            transform: "translateY(-50%)",
            width: "600px",
            height: "360px",
            background: "rgba(234, 88, 12, 0.1)",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
          {/* Left: Signature slab */}
          <div className="relative">
            <div className="mb-6 flex items-center gap-3">
              <span className="border border-orange-600/50 bg-orange-600/5 px-3 py-1 font-mono text-[10px] font-bold tracking-[0.25em] text-orange-500">
                04
              </span>
              <div className="h-px w-20 bg-gradient-to-r from-orange-600 to-transparent" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">
                Signature
              </span>
            </div>
            <h2 className="text-display-lg font-black uppercase italic leading-[0.85] tracking-[-0.04em]">
              <span className="block text-outline">Load</span>
              <span className="block etched-metal">the bar.</span>
              <span className="block bg-gradient-to-br from-orange-300 via-orange-500 to-orange-800 bg-clip-text text-transparent">
                Not the cart.
              </span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-zinc-400 sm:text-lg">
              Every plate on this bar represents a real dollar you shouldn&apos;t
              waste. Here&apos;s exactly what your budget buys — stripped to the
              iron.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/calculator/"
                className="btn-sheen skew-x-[-12deg] border-2 border-orange-600 bg-orange-600/10 px-6 py-3 text-xs font-black uppercase italic tracking-widest text-orange-400 transition hover:bg-orange-600 hover:text-white"
              >
                <span className="inline-block skew-x-[12deg]">
                  Run the Calculator
                </span>
              </Link>
              <Link
                href="/picks/"
                className="btn-sheen skew-x-[-12deg] border-2 border-zinc-700 bg-zinc-900/60 px-6 py-3 text-xs font-black uppercase italic tracking-widest text-zinc-300 transition hover:border-zinc-500"
              >
                <span className="inline-block skew-x-[12deg]">Our Picks</span>
              </Link>
            </div>
          </div>

          {/* Right: Plate-math visual */}
          <div className="relative">
            <div className="conic-border relative border border-zinc-800 bg-zinc-950/80 p-6 backdrop-blur-sm sm:p-8">
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="font-mono text-[9px] tracking-[0.3em] text-zinc-400">
                    PLATE&nbsp;MATH&nbsp;//&nbsp;$&nbsp;→&nbsp;LB
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 bg-orange-500" />
                    <span className="h-1.5 w-1.5 bg-orange-500/60" />
                    <span className="h-1.5 w-1.5 bg-orange-500/30" />
                  </div>
                </div>

                {[
                  {
                    budget: "$500",
                    label: "Starter Stack",
                    plates: [45, 25, 10],
                    total: "160 lb",
                    href: "/builds/home-gym-under-500/",
                    hue: "from-orange-400 to-orange-700",
                  },
                  {
                    budget: "$1,000",
                    label: "Real Gym",
                    plates: [45, 45, 25, 10, 5],
                    total: "260 lb",
                    href: "/builds/home-gym-under-1000/",
                    hue: "from-orange-300 to-orange-600",
                    featured: true,
                  },
                  {
                    budget: "$2,000",
                    label: "Forever Setup",
                    plates: [45, 45, 45, 25, 10, 5, 2.5],
                    total: "355 lb",
                    href: "/builds/home-gym-under-2000/",
                    hue: "from-amber-200 to-orange-500",
                  },
                ].map((row) => (
                  <Link
                    href={row.href}
                    key={row.budget}
                    className={`group relative mt-4 flex items-center gap-4 border px-4 py-4 transition-all first:mt-0 ${
                      row.featured
                        ? "border-orange-600/60 bg-orange-600/5"
                        : "border-zinc-800 bg-zinc-900/50 hover:border-orange-600/40"
                    }`}
                  >
                    <div className="w-20 shrink-0">
                      <div className="font-mono text-[9px] uppercase tracking-widest text-zinc-400">
                        {row.label}
                      </div>
                      <div className="text-xl font-black italic leading-none tracking-tighter text-white sm:text-2xl">
                        {row.budget}
                      </div>
                    </div>

                    {/* mini barbell */}
                    <div className="flex flex-1 items-center justify-center gap-[2px]">
                      {/* L plates */}
                      {[...row.plates].reverse().map((p, i) => (
                        <span
                          key={`l${i}`}
                          className={`bg-gradient-to-b ${row.hue}`}
                          style={{
                            width: "6px",
                            height: `${16 + p * 0.7}px`,
                          }}
                        />
                      ))}
                      <span className="h-[3px] flex-1 max-w-[140px] bg-gradient-to-r from-zinc-700 via-zinc-300 to-zinc-700" />
                      {/* R plates */}
                      {row.plates.map((p, i) => (
                        <span
                          key={`r${i}`}
                          className={`bg-gradient-to-b ${row.hue}`}
                          style={{
                            width: "6px",
                            height: `${16 + p * 0.7}px`,
                          }}
                        />
                      ))}
                    </div>

                    <div className="w-16 shrink-0 text-right">
                      <div className="font-mono text-[9px] uppercase tracking-widest text-zinc-400">
                        Loaded
                      </div>
                      <div className="text-sm font-black tracking-tighter text-orange-400">
                        {row.total}
                      </div>
                    </div>
                    <MoveRight
                      className="shrink-0 text-zinc-400 transition-all group-hover:translate-x-1 group-hover:text-orange-500"
                      size={16}
                    />
                  </Link>
                ))}

                <div className="mt-5 flex items-center justify-end border-t border-zinc-800 pt-3 font-mono text-[9px] tracking-[0.25em] text-zinc-400">
                  <span className="text-orange-500">
                    AUDITED&nbsp;2026.Q1
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENTO GRID */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
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
            <span className="relative z-10 mt-1 text-[9px] tracking-widest text-zinc-400">
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
            <span className="relative z-10 mt-1 text-[9px] tracking-widest text-zinc-400">
              47 Articles
            </span>
          </Link>
        </div>
      </section>

      {/* POPULAR PRODUCTS */}
      <PopularProducts />

      {/* BUYER'S GUIDES */}
      <section className="relative overflow-hidden border-t border-zinc-800 bg-zinc-900/30 px-4 py-16 sm:px-6 sm:py-24">
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
                  <div className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">
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
      <section className="relative px-4 py-16 sm:px-6 sm:py-24">
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
                  <p className="line-clamp-2 text-sm leading-relaxed text-zinc-400">
                    {article.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-zinc-800/50 pt-4 text-[10px] tracking-widest text-zinc-400">
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
                className="group skew-x-[-12deg] border border-zinc-800 bg-zinc-900/50 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-all hover:border-orange-600 hover:bg-orange-600/5 hover:text-orange-400"
              >
                <span className="inline-block skew-x-[12deg]">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="relative overflow-hidden border-t border-zinc-800 px-4 py-16 sm:px-6 sm:py-24">
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
          <h2 className="text-display-lg mb-6 font-black uppercase italic tracking-tighter">
            Ready to <br />
            <span className="bg-gradient-to-br from-orange-300 via-orange-500 to-orange-800 bg-clip-text text-transparent">
              Build?
            </span>
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-zinc-400 sm:mb-10 sm:text-lg">
            Pick your budget and we&apos;ll show you exactly what to buy.
            Every product tested, every dollar accounted for.
          </p>
          <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Link
              href="/builds/home-gym-under-500/"
              className="group skew-x-[-12deg] border-2 border-zinc-700 bg-zinc-900/50 px-6 py-4 text-base font-black italic uppercase tracking-tighter text-zinc-300 backdrop-blur-sm transition-all hover:border-orange-600 hover:bg-orange-600/10 hover:text-orange-400 sm:px-8 sm:text-lg"
            >
              <span className="inline-block skew-x-[12deg]">$500 Build</span>
            </Link>
            <Link
              href="/builds/home-gym-under-1000/"
              className="pulse-orange skew-x-[-12deg] bg-orange-600 px-8 py-4 text-base font-black italic uppercase tracking-tighter text-white transition hover:bg-orange-500 sm:px-10 sm:text-lg"
            >
              <span className="inline-block skew-x-[12deg]">$1,000 Build</span>
            </Link>
            <Link
              href="/builds/home-gym-under-2000/"
              className="group skew-x-[-12deg] border-2 border-zinc-700 bg-zinc-900/50 px-6 py-4 text-base font-black italic uppercase tracking-tighter text-zinc-300 backdrop-blur-sm transition-all hover:border-orange-600 hover:bg-orange-600/10 hover:text-orange-400 sm:px-8 sm:text-lg"
            >
              <span className="inline-block skew-x-[12deg]">$2,000 Build</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
