import { TrendingDown, ExternalLink } from "lucide-react";
import { getProduct } from "@/lib/products";
import { AffiliateLink } from "../affiliate-link";

interface PriceAlertProps {
  productId: string;
  note?: string;
}

export function PriceAlert({ productId, note }: PriceAlertProps) {
  const product = getProduct(productId);
  if (!product) return null;

  return (
    <div className="not-prose my-8 border-2 border-green-600/30 bg-green-600/5 p-5">
      <div className="flex items-start gap-3">
        <TrendingDown size={20} className="mt-0.5 shrink-0 text-green-500" />
        <div className="flex-1">
          <p className="text-sm font-black uppercase italic tracking-tighter text-green-400">
            Price Check
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            <strong className="text-zinc-200">{product.name}</strong> is
            currently listed at{" "}
            <strong className="text-green-400">{product.price}</strong>.
            {note && <span> {note}</span>}
          </p>
          <div className="mt-3 flex gap-3">
            <AffiliateLink
              href={product.amazonLink}
              merchant="amazon"
              productId={productId}
              productName={product.name}
              price={product.price}
              className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#FF9900] hover:underline"
            >
              Amazon <ExternalLink size={10} />
            </AffiliateLink>
          </div>
        </div>
      </div>
    </div>
  );
}
