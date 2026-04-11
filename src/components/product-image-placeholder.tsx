import { Dumbbell, Bike, Armchair, Weight } from "lucide-react";

const categoryIcons: Record<string, React.ElementType> = {
  "Power Racks": Dumbbell,
  Dumbbells: Weight,
  Barbells: Weight,
  Weights: Weight,
  Cardio: Bike,
  Benches: Armchair,
};

interface ProductImagePlaceholderProps {
  category?: string;
  className?: string;
}

export function ProductImagePlaceholder({
  category,
  className = "",
}: ProductImagePlaceholderProps) {
  const Icon = (category && categoryIcons[category]) || Dumbbell;

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 ${className}`}
    >
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <Icon className="h-40 w-40" />
        </div>
        <Icon className="h-20 w-20 text-zinc-600" />
      </div>
    </div>
  );
}
