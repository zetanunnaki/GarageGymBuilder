import { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import { BuyButtons } from "@/components/mdx/buy-buttons";
import { Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Picks — Every Product We Recommend",
  description:
    "Every product GarageGymBuilder recommends in one place. Tested, reviewed, and ranked by our team.",
};

const categoryOrder = [
  { label: "Power Racks", ids: ["fitness-reality-810xlt", "rogue-monster-lite-r3", "rep-pr-4000", "titan-t3"] },
  { label: "Dumbbells", ids: ["bowflex-selecttech-552"] },
  { label: "Barbells & Weights", ids: ["cap-barbell-olympic"] },
  { label: "Cardio", ids: ["rogue-echo-bike"] },
  { label: "Benches", ids: ["flybird-adjustable-bench"] },
];

export default function PicksPage() {
  const allProducts = getAllProducts();

  return (
    <div className="mx-auto max-w-7xl px-6 pt-32 pb-20">
      <header className="mb-16">
        <div className="mb-4 flex items-center gap-3">
          <div className="skew-x-[-12deg] bg-orange-600 p-2">
            <Award className="skew-x-[12deg] text-black" size={24} />
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-orange-500">
            Tested & Approved
          </div>
        </div>
        <h1 className="mb-4 text-5xl font-black uppercase italic tracking-tighter md:text-6xl">
          Our Picks
        </h1>
        <p className="max-w-2xl text-lg text-zinc-500">
          Every product we recommend, organized by category. We buy it, test it,
          and train with it before adding it here.
        </p>
      </header>

      {categoryOrder.map((category) => (
        <section key={category.label} className="mb-16">
          <h2 className="mb-8 border-l-8 border-orange-600 pl-6 text-2xl font-black uppercase italic tracking-tighter">
            {category.label}
          </h2>
          <div className="space-y-4">
            {category.ids.map((id) => {
              const product = allProducts[id];
              if (!product) return null;
              return (
                <div
                  key={id}
                  className="grid items-center gap-6 border border-zinc-800 bg-zinc-900/40 p-4 md:grid-cols-12"
                >
                  {/* Product image */}
                  <div className="flex items-center justify-center border border-zinc-800 bg-zinc-900 p-2 md:col-span-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-24 w-24 object-contain"
                      loading="lazy"
                    />
                  </div>

                  {/* Info */}
                  <div className="md:col-span-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                      {product.brand}
                    </p>
                    <h3 className="mt-1 text-lg font-black uppercase italic tracking-tighter">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xl font-black italic text-orange-500">
                      {product.price}
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="md:col-span-2">
                    {product.specs.weightCapacity && (
                      <div className="mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                          Capacity:{" "}
                        </span>
                        <span className="text-sm font-bold">
                          {product.specs.weightCapacity}
                        </span>
                      </div>
                    )}
                    {product.specs.material && (
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                          Steel:{" "}
                        </span>
                        <span className="text-sm font-bold">
                          {product.specs.material}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Buy */}
                  <div className="md:col-span-4">
                    <BuyButtons productId={id} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
