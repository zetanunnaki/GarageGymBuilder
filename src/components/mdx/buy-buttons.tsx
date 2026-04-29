import { getProduct } from "@/lib/products";
import { ShoppingCart, ExternalLink } from "lucide-react";
import { AffiliateLink } from "../affiliate-link";

interface BuyButtonsProps {
  productId: string;
}

export function BuyButtons({ productId }: BuyButtonsProps) {
  const product = getProduct(productId);
  if (!product) return null;

  return (
    <div className="not-prose my-6">
      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <AffiliateLink
          href={product.amazonLink}
          merchant="amazon"
          productId={productId}
          productName={product.name}
          price={product.price}
          ariaLabel={`Buy ${product.name} on Amazon`}
          className="flex flex-1 items-center justify-center gap-2 bg-[#FF9900] px-6 py-4 text-center text-sm font-black uppercase italic tracking-tighter text-black transition hover:brightness-110"
        >
          <ShoppingCart size={18} />
          Amazon
        </AffiliateLink>
      </div>
      <p className="mt-2 text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-400">
        Price and availability may change
      </p>
    </div>
  );
}
