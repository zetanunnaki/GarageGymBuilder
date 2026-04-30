import { getProduct } from "@/lib/products";
import { Check, X } from "lucide-react";
import { BuyButtons } from "./buy-buttons";

interface ProductCardProps {
  productId: string;
  badge?: string;
}

export function ProductCard({ productId, badge }: ProductCardProps) {
  const product = getProduct(productId);
  if (!product) return null;

  return (
    <div className="not-prose group relative mb-12 overflow-hidden border-2 border-zinc-800 bg-zinc-900/40">
      {badge && (
        <div className="absolute top-0 left-0 z-10 skew-x-[-12deg] bg-orange-600 px-4 py-1 text-[10px] font-black uppercase text-white">
          {badge}
        </div>
      )}
      <div className="grid gap-8 p-8 md:grid-cols-5">
        {/* Product Image */}
        <div className="flex aspect-square items-center justify-center border-4 border-zinc-800 bg-zinc-900 transition-colors duration-500 group-hover:border-orange-600 md:col-span-2">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-4 md:col-span-3">
          <h3 className="text-3xl font-black uppercase italic leading-none tracking-tighter">
            {product.name}
          </h3>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-4 border-y border-zinc-800/50 py-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Capacity
              </p>
              <p className="font-bold">{product.specs.weightCapacity}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Steel
              </p>
              <p className="font-bold">{product.specs.material}</p>
            </div>
            {product.specs.footprint && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Footprint
                </p>
                <p className="font-bold">{product.specs.footprint}</p>
              </div>
            )}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Price
              </p>
              <p className="font-black italic text-orange-500">
                {product.price}
              </p>
            </div>
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <ul className="space-y-1">
              {product.pros.map((pro, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-[11px] text-zinc-400"
                >
                  <Check size={12} className="shrink-0 text-green-500" />
                  {pro}
                </li>
              ))}
            </ul>
            <ul className="space-y-1">
              {product.cons.map((con, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-[11px] text-zinc-400"
                >
                  <X size={12} className="shrink-0 text-red-500" />
                  {con}
                </li>
              ))}
            </ul>
          </div>

          {/* Buy Buttons */}
          <BuyButtons productId={productId} compact />
        </div>
      </div>
    </div>
  );
}
