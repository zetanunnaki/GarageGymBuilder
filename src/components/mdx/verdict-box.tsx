import { Award } from "lucide-react";
import { StarRating } from "@/components/star-rating";
import { BuyButtons } from "./buy-buttons";

interface VerdictBoxProps {
  productId: string;
  rating: number;
  verdict: string;
}

export function VerdictBox({ productId, rating, verdict }: VerdictBoxProps) {
  return (
    <div className="not-prose my-12 border-2 border-orange-600/30 bg-zinc-900">
      <div className="flex items-center gap-3 border-b border-orange-600/30 bg-orange-600/5 px-6 py-4">
        <Award size={20} className="text-orange-500" />
        <span className="text-sm font-black uppercase italic tracking-tighter text-orange-500">
          Final Verdict
        </span>
      </div>
      <div className="p-6">
        <div className="mb-4">
          <StarRating rating={rating} />
        </div>
        <p className="mb-6 text-zinc-400">{verdict}</p>
        <BuyButtons productId={productId} />
      </div>
    </div>
  );
}
