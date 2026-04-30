import { Award } from "lucide-react";
import { StarRating } from "@/components/star-rating";
import { BuyButtons } from "./buy-buttons";
import { getProduct } from "@/lib/products";

interface VerdictBoxProps {
  productId: string;
  rating: string | number;
  verdict: string;
}

export function VerdictBox({ productId, rating, verdict }: VerdictBoxProps) {
  const product = getProduct(productId);
  const parsed = typeof rating === "number" ? rating : parseFloat(String(rating ?? "0"));
  const displayRating = !isNaN(parsed) ? parsed : 0;

  return (
    <div className="not-prose my-12 border-2 border-orange-600/30 bg-zinc-900">
      <div className="flex items-center gap-3 border-b border-orange-600/30 bg-orange-600/5 px-6 py-4">
        <Award size={20} className="text-orange-500" />
        <div className="flex flex-1 flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <span className="text-sm font-black uppercase italic tracking-tighter text-orange-500">
            Final Verdict
          </span>
          {product && (
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              {product.name}
            </span>
          )}
        </div>
      </div>
      <div className="p-6">
        <div className="mb-4">
          <StarRating rating={displayRating} />
        </div>
        <p className="mb-6 text-zinc-400">{verdict}</p>
        <BuyButtons productId={productId} compact />
      </div>
    </div>
  );
}
