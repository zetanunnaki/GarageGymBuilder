import { getProduct } from "@/lib/products";
import { Ruler, Weight, Wrench, DollarSign } from "lucide-react";

interface QuickSpecsProps {
  productId: string;
}

export function QuickSpecs({ productId }: QuickSpecsProps) {
  const product = getProduct(productId);
  if (!product) return null;

  const specs = [
    {
      icon: Weight,
      label: "Capacity",
      value: product.specs.weightCapacity,
    },
    {
      icon: Ruler,
      label: "Footprint",
      value: product.specs.footprint,
    },
    {
      icon: Wrench,
      label: "Material",
      value: product.specs.material,
    },
    {
      icon: DollarSign,
      label: "Price",
      value: product.price,
    },
  ].filter((s) => s.value);

  return (
    <div className="not-prose my-8 border border-zinc-800 bg-zinc-900/50">
      <div className="border-b border-zinc-800 bg-zinc-950/50 px-6 py-3">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
          Quick Specs &middot; {product.name}
        </h4>
      </div>
      <div className="grid grid-cols-2 gap-px bg-zinc-800 sm:grid-cols-4">
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="flex flex-col items-center justify-center bg-zinc-900 p-4 text-center"
          >
            <spec.icon size={16} className="mb-2 text-orange-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {spec.label}
            </span>
            <span className="mt-1 text-sm font-black italic">
              {spec.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
