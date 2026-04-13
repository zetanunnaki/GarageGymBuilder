import { Dumbbell } from "lucide-react";

interface MarqueeProps {
  items: string[];
}

export function Marquee({ items }: MarqueeProps) {
  // Double the items so the seamless loop works
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-zinc-800 bg-zinc-900/40 py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent" />
      <div className="marquee-track flex whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="mx-6 flex items-center gap-3 text-xl font-black uppercase italic tracking-tighter text-zinc-400"
          >
            <Dumbbell className="text-orange-500" size={16} />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
