import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { ArrowRight } from "lucide-react";

export function PopularProducts() {
  const allProducts = getAllProducts();
  const featured = [
    { id: "fitness-reality-810xlt", link: "/reviews/fitness-reality-810xlt-review" },
    { id: "rep-pr-4000", link: "/reviews/rep-fitness-pr4000-review" },
    { id: "bowflex-selecttech-552", link: "/reviews/bowflex-selecttech-552-review" },
    { id: "rogue-echo-bike", link: "/reviews/rogue-echo-bike-review" },
  ];

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 border-l-8 border-orange-600 pl-6 text-4xl font-black uppercase italic tracking-tighter">
          Popular Products
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map(({ id, link }) => {
            const product = allProducts[id];
            if (!product) return null;
            return (
              <Link
                key={id}
                href={link}
                className="group border border-zinc-800 bg-zinc-900/40 transition-colors hover:border-orange-600/50"
              >
                <div className="flex aspect-square items-center justify-center border-b border-zinc-800 bg-zinc-900 p-4 transition-colors group-hover:bg-zinc-800/50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                    {product.brand}
                  </p>
                  <h3 className="mt-1 text-sm font-black uppercase italic leading-snug tracking-tighter transition-colors group-hover:text-orange-500">
                    {product.name}
                  </h3>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-black italic text-orange-500">
                      {product.price}
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-zinc-700 transition-all group-hover:translate-x-1 group-hover:text-orange-500"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
