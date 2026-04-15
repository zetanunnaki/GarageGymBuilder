interface MarqueeProps {
  items: string[];
}

export function Marquee({ items }: MarqueeProps) {
  // Double the items so the seamless loop works
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-zinc-800 bg-gradient-to-r from-[#0a0a0a] via-zinc-950 to-[#0a0a0a] py-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent" />
      <div className="marquee-track flex whitespace-nowrap">
        {doubled.map((item, i) => {
          const stroked = i % 2 === 1;
          return (
            <span
              key={i}
              className={`mx-8 flex items-center gap-6 text-3xl font-black uppercase italic tracking-tighter sm:text-4xl md:text-5xl ${
                stroked ? "text-outline-zinc" : "text-zinc-200"
              }`}
            >
              {item}
              <span className="inline-block h-2 w-2 rotate-45 bg-orange-600" />
            </span>
          );
        })}
      </div>
    </div>
  );
}
