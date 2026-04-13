import Link from "next/link";
import {
  AlertTriangle,
  Search as SearchIcon,
  Calculator,
  Dumbbell,
  ArrowRight,
} from "lucide-react";

export default function NotFound() {
  const popularLinks = [
    {
      href: "/guides/ultimate-beginners-home-gym-guide/",
      label: "Ultimate Beginner's Guide",
      eyebrow: "Start Here",
    },
    {
      href: "/builds/home-gym-under-1000/",
      label: "Home Gym Under $1,000",
      eyebrow: "Most Popular Build",
    },
    {
      href: "/calculator/",
      label: "Build Calculator",
      eyebrow: "Smart Tool",
    },
    {
      href: "/compare/",
      label: "Compare Products",
      eyebrow: "Side-by-Side",
    },
    {
      href: "/best-gear/",
      label: "Best Gear Roundups",
      eyebrow: "Our Picks",
    },
    {
      href: "/glossary/",
      label: "Home Gym Glossary",
      eyebrow: "Reference",
    },
  ];

  return (
    <section className="relative overflow-hidden px-6 pt-32 pb-20">
      {/* Background grid + glow */}
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div
        className="glow-orb"
        style={{
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "600px",
          background: "rgba(234, 88, 12, 0.12)",
        }}
      />
      <div className="noise-overlay" />

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-orange-400 backdrop-blur-sm">
          <AlertTriangle size={12} /> Plate Not Found
        </div>

        <h1 className="mb-4 text-8xl font-black uppercase italic leading-[0.85] tracking-tighter md:text-[12rem]">
          <span className="bg-gradient-to-br from-orange-300 via-orange-500 to-orange-800 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(234,88,12,0.4)]">
            404
          </span>
        </h1>

        <h2 className="mb-6 text-3xl font-black uppercase italic leading-none tracking-tighter md:text-5xl">
          Missed the Lift
        </h2>

        <p className="mx-auto mb-12 max-w-xl text-lg leading-relaxed text-zinc-400">
          The page you were looking for either moved, was renamed, or never
          existed. Here&apos;s where to pick up instead.
        </p>

        {/* CTA buttons */}
        <div className="mb-16 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="skew-x-[-12deg] bg-orange-600 px-8 py-4 text-sm font-black uppercase italic tracking-tighter text-white transition hover:bg-orange-500"
          >
            <span className="flex skew-x-[12deg] items-center gap-2">
              <Dumbbell size={16} /> Back to Home
            </span>
          </Link>
          <Link
            href="/search/"
            className="skew-x-[-12deg] border-2 border-zinc-700 bg-zinc-900/50 px-8 py-4 text-sm font-black uppercase italic tracking-tighter text-zinc-300 backdrop-blur-sm transition hover:border-orange-600 hover:text-orange-400"
          >
            <span className="flex skew-x-[12deg] items-center gap-2">
              <SearchIcon size={16} /> Search Everything
            </span>
          </Link>
          <Link
            href="/calculator/"
            className="skew-x-[-12deg] border-2 border-zinc-700 bg-zinc-900/50 px-8 py-4 text-sm font-black uppercase italic tracking-tighter text-zinc-300 backdrop-blur-sm transition hover:border-orange-600 hover:text-orange-400"
          >
            <span className="flex skew-x-[12deg] items-center gap-2">
              <Calculator size={16} /> Use Calculator
            </span>
          </Link>
        </div>

        {/* Popular destinations */}
        <div className="text-left">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-orange-600 to-transparent" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">
              Popular
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-zinc-800 to-transparent" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {popularLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between border border-zinc-800 bg-zinc-900/40 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-600/60 hover:bg-zinc-900/70"
              >
                <div>
                  <div className="mb-1 text-[9px] font-black uppercase tracking-[0.2em] text-orange-500">
                    {link.eyebrow}
                  </div>
                  <div className="text-sm font-black uppercase italic tracking-tighter text-zinc-200 transition-colors group-hover:text-orange-400">
                    {link.label}
                  </div>
                </div>
                <ArrowRight
                  size={18}
                  className="shrink-0 text-zinc-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-orange-500"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
