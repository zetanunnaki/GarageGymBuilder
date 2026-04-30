import { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import { BuyButtons } from "@/components/mdx/buy-buttons";
import { Award } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { generateCollectionPageSchema } from "@/lib/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Our Picks — Every Product We Recommend",
  description:
    "Every product GarageGymBuilders recommends in one place. Tested, reviewed, and ranked by our team.",
  path: "/picks/",
  image: "/og-default.png",
  keywords: [
    "home gym recommendations",
    "best home gym products",
    "tested home gym gear",
  ],
});

const categoryOrder = [
  { label: "Power Racks", ids: ["fitness-reality-810xlt", "mikolo-f4-power-cage", "sportsroyals-power-cage"] },
  { label: "Dumbbells", ids: ["bowflex-selecttech-552", "powerblock-elite-90", "cap-hex-dumbbells"] },
  { label: "Barbells & Weights", ids: ["cap-barbell-olympic", "synergee-olympic-barbell", "yes4all-olympic-plates", "yes4all-hex-trap-bar", "cap-ez-curl-bar", "titan-safety-squat-bar"] },
  { label: "Cardio", ids: ["rogue-echo-bike", "assault-airbike-classic", "concept2-rowerg", "sunny-sf-rw5515-rower", "sunny-spin-bike", "wod-nation-jump-rope"] },
  { label: "Benches", ids: ["flybird-adjustable-bench", "marcy-olympic-bench"] },
  { label: "Kettlebells & Conditioning", ids: ["yes4all-kettlebell-set", "yes4all-slam-ball", "yes4all-sandbag", "power-guidance-battle-rope", "yes4all-plyo-box"] },
  { label: "Bodyweight & Gymnastics", ids: ["iron-gym-pull-up-bar", "iron-bull-dip-belt", "rogue-style-gymnastic-rings", "yes4all-parallettes", "perfect-fitness-ab-wheel", "yes4all-roman-chair"] },
  { label: "Bands & Mobility", ids: ["bodylastics-resistance-bands", "trx-go-suspension-trainer", "luxfit-foam-roller", "triggerpoint-grid"] },
  { label: "Lifting Accessories", ids: ["dark-iron-lifting-belt", "harbinger-lifting-straps", "rip-toned-wrist-wraps", "nordic-lifting-knee-sleeves", "fat-gripz", "liquid-grip-chalk", "synergee-barbell-collars"] },
  { label: "Storage & Organization", ids: ["titan-plate-tree", "yes4all-dumbbell-rack", "titan-deadlift-jack", "balancefrom-puzzle-mat", "gym-wall-mirror", "gymboss-timer"] },
];

export default function PicksPage() {
  const allProducts = getAllProducts();

  const picksItems = categoryOrder.flatMap((cat) =>
    cat.ids
      .filter((id) => allProducts[id])
      .map((id) => ({
        name: allProducts[id].name,
        url: `/picks/#${id}`,
        description: `${allProducts[id].brand} — ${allProducts[id].price}`,
        image: allProducts[id].image,
      }))
  );

  const picksSchema = generateCollectionPageSchema(
    "Our Picks — Every Product We Recommend",
    "Every product GarageGymBuilders recommends in one place. Tested, reviewed, and ranked by our team.",
    "/picks/",
    picksItems
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(picksSchema) }}
      />
    <div className="mx-auto max-w-7xl px-6 pt-24 pb-16 sm:pt-32 sm:pb-20">
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
        <p className="max-w-2xl text-lg text-zinc-400">
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
                  id={id}
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
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
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
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                          Capacity:{" "}
                        </span>
                        <span className="text-sm font-bold">
                          {product.specs.weightCapacity}
                        </span>
                      </div>
                    )}
                    {product.specs.material && (
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
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
                    <BuyButtons productId={id} compact />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
    </>
  );
}
