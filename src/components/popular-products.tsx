import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

export function PopularProducts() {
  const allProducts = getAllProducts();
  const featured = [
    {
      id: "fitness-reality-810xlt",
      link: "/reviews/fitness-reality-810xlt-review",
      tag: "Editor's Pick",
      category: "Power Rack",
    },
    {
      id: "mikolo-f4-power-cage",
      link: "/reviews/mikolo-f4-power-cage-review",
      tag: "Best Value",
      category: "Power Rack",
    },
    {
      id: "bowflex-selecttech-552",
      link: "/reviews/bowflex-selecttech-552-review",
      tag: "Space Saver",
      category: "Dumbbells",
    },
    {
      id: "synergee-olympic-barbell",
      link: "/reviews/synergee-olympic-barbell-review",
      tag: "Tested",
      category: "Barbell",
    },
    {
      id: "assault-airbike-classic",
      link: "/reviews/assault-airbike-review",
      tag: "Cardio King",
      category: "Cardio",
    },
    {
      id: "powerblock-elite-90",
      link: "/reviews/powerblock-elite-90-review",
      tag: "Heavy Duty",
      category: "Dumbbells",
    },
    {
      id: "flybird-adjustable-bench",
      link: "/reviews/flybird-adjustable-bench-review",
      tag: "Budget Hero",
      category: "Bench",
    },
    {
      id: "concept2-rowerg",
      link: "/reviews/concept2-rowerg-review",
      tag: "Gold Standard",
      category: "Cardio",
    },
  ];

  return (
    <section className="relative overflow-hidden border-y border-zinc-800 bg-zinc-950/50 px-4 py-16 sm:px-6 sm:py-24">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div
        className="glow-orb"
        style={{
          top: "10%",
          right: "5%",
          width: "480px",
          height: "480px",
          background: "rgba(234, 88, 12, 0.08)",
        }}
      />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          number="04"
          eyebrow="Hand-Tested"
          title="Popular Products"
          subtitle="Illustrated guides to the gear our team actually trains with. Click any card to read the full review, specs, and buying guidance."
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {featured.map(({ id, link, tag, category }, idx) => {
            const product = allProducts[id];
            if (!product) return null;
            return (
              <Link
                key={id}
                href={link}
                className="group relative flex flex-col overflow-hidden border border-zinc-800 bg-zinc-950 transition-all duration-500 hover:-translate-y-1 hover:border-orange-600/60 hover:shadow-[0_30px_60px_-20px_rgba(234,88,12,0.4)]"
              >
                {/* IMAGE FRAME */}
                <div className="relative aspect-[4/3] overflow-hidden border-b border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black">
                  {/* spotlight */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(234,88,12,0.15),transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  {/* grid */}
                  <div className="absolute inset-0 grid-pattern opacity-40" />
                  {/* corner brackets */}
                  <div className="pointer-events-none absolute inset-2">
                    <div className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-orange-600/50" />
                    <div className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-orange-600/50" />
                    <div className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-orange-600/50" />
                    <div className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-orange-600/50" />
                  </div>
                  {/* editorial tag top-left */}
                  <div className="absolute left-3 top-3 z-10 border border-orange-500/50 bg-black/70 px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-orange-400 backdrop-blur-sm">
                    {tag}
                  </div>
                  {/* index / serial number top-right */}
                  <div className="absolute right-3 top-3 z-10 font-mono text-[8px] font-bold tracking-[0.2em] text-zinc-400">
                    #{String(idx + 1).padStart(2, "0")}
                  </div>
                  {/* Image */}
                  <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain transition-transform duration-[600ms] ease-out group-hover:scale-[1.08]"
                      loading="lazy"
                      width={600}
                      height={600}
                    />
                  </div>
                  {/* bottom editorial caption — signals intentional illustration */}
                  <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between border-t border-zinc-800/80 bg-black/60 px-3 py-1.5 font-mono text-[8px] tracking-[0.2em] text-zinc-400 backdrop-blur-sm">
                    <span>ILLUSTRATED</span>
                    <span className="flex items-center gap-1 text-orange-500/70">
                      <CheckCircle2 size={9} strokeWidth={3} /> VERIFIED
                    </span>
                  </div>
                </div>

                {/* INFO */}
                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                      {product.brand}
                    </p>
                    <span className="font-mono text-[8px] tracking-widest text-zinc-700">
                      {category}
                    </span>
                  </div>
                  <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-black uppercase italic leading-[1.1] tracking-tight text-zinc-100 transition-colors group-hover:text-orange-400">
                    {product.name}
                  </h3>
                  <div className="mt-auto flex items-center justify-between border-t border-zinc-800/70 pt-3">
                    <span className="text-base font-black italic tracking-tight text-orange-500">
                      {product.price}
                    </span>
                    <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 transition-all group-hover:text-orange-400">
                      Review
                      <ArrowRight
                        size={12}
                        className="transition-transform duration-500 group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Editorial footnote */}
        <p className="mt-8 text-center text-[10px] font-mono tracking-[0.2em] text-zinc-400">
          ILLUSTRATIONS ARE IN-HOUSE EDITORIAL RENDERS &middot; SEE EACH REVIEW FOR REAL-WORLD PHOTOS &amp; TESTING NOTES
        </p>
      </div>
    </section>
  );
}
