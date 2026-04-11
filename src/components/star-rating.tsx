import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
}

export function StarRating({ rating, maxRating = 5 }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.3 && rating % 1 <= 0.7;
  const emptyStars = maxRating - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star
          key={`full-${i}`}
          size={18}
          className="fill-orange-500 text-orange-500"
        />
      ))}
      {hasHalf && (
        <StarHalf
          size={18}
          className="fill-orange-500 text-orange-500"
        />
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star
          key={`empty-${i}`}
          size={18}
          className="text-zinc-700"
        />
      ))}
      <span className="ml-2 text-sm font-black italic text-orange-500">
        {rating}/{maxRating}
      </span>
    </div>
  );
}
