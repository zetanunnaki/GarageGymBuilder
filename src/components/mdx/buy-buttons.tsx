import { getProduct } from "@/lib/products";
import { ShoppingCart, Check, ArrowRight } from "lucide-react";
import { AffiliateLink } from "../affiliate-link";

interface BuyButtonsProps {
  productId: string;
  compact?: boolean;
}

export function BuyButtons({ productId, compact = false }: BuyButtonsProps) {
  const product = getProduct(productId);
  if (!product) return null;

  if (compact) {
    return (
      <div className="not-prose my-6">
        <AffiliateLink
          href={product.amazonLink}
          merchant="amazon"
          productId={productId}
          productName={product.name}
          price={product.price}
          ariaLabel={`Check price for ${product.name} on Amazon`}
          className="flex items-center justify-center gap-2 bg-[#FF9900] px-6 py-3.5 text-center text-sm font-black uppercase italic tracking-tighter text-black transition hover:brightness-110"
        >
          <ShoppingCart size={16} />
          Check Price on Amazon
        </AffiliateLink>
        <p className="mt-2 text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500">
          Price and availability may change
        </p>
      </div>
    );
  }

  const topPros = product.pros.slice(0, 2);

  return (
    <div className="not-prose my-8 overflow-hidden border-2 border-zinc-800 bg-zinc-900/40 transition-colors hover:border-zinc-700">
      <div className="h-1 bg-gradient-to-r from-orange-600/80 via-orange-500 to-orange-600/80" />

      <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr]">
        {/* Product image */}
        <div className="flex items-center justify-center border-b border-zinc-800 bg-zinc-900 p-5 sm:border-r sm:border-b-0">
          <img
            src={product.image}
            alt={product.name}
            className="h-24 w-24 object-contain sm:h-28 sm:w-28"
            loading="lazy"
          />
        </div>

        {/* Product info + CTA */}
        <div className="p-5 sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
            {product.brand}
          </p>
          <h4 className="mt-1 text-lg font-black uppercase italic leading-tight tracking-tighter text-white sm:text-xl">
            {product.name}
          </h4>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-2xl font-black italic text-orange-500">
              {product.price}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">
              on Amazon
            </span>
          </div>

          {topPros.length > 0 && (
            <div className="mt-3 space-y-1.5 border-t border-zinc-800/60 pt-3">
              {topPros.map((pro, i) => (
                <p
                  key={i}
                  className="flex items-start gap-2 text-xs leading-snug text-zinc-400"
                >
                  <Check
                    size={12}
                    className="mt-0.5 shrink-0 text-green-500"
                  />
                  {pro}
                </p>
              ))}
            </div>
          )}

          <div className="mt-4">
            <AffiliateLink
              href={product.amazonLink}
              merchant="amazon"
              productId={productId}
              productName={product.name}
              price={product.price}
              ariaLabel={`Check price for ${product.name} on Amazon`}
              className="group flex items-center justify-center gap-2 bg-[#FF9900] px-6 py-3.5 text-center text-sm font-black uppercase italic tracking-tighter text-black transition hover:brightness-110"
            >
              <ShoppingCart size={16} />
              Check Price on Amazon
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </AffiliateLink>
          </div>

          <p className="mt-2 text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500">
            Price and availability may change
          </p>
        </div>
      </div>
    </div>
  );
}
