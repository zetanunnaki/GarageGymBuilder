interface SectionHeadingProps {
  number?: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export function SectionHeading({
  number,
  eyebrow,
  title,
  subtitle,
}: SectionHeadingProps) {
  return (
    <div className="mb-12">
      <div className="mb-4 flex items-center gap-4">
        {number && (
          <span className="border border-orange-600/40 bg-orange-600/5 px-3 py-1 font-mono text-[10px] font-bold tracking-widest text-orange-500">
            {number}
          </span>
        )}
        <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-orange-600 to-transparent" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">
          {eyebrow}
        </span>
      </div>
      <h2 className="text-4xl font-black uppercase italic leading-none tracking-tighter md:text-6xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-lg italic leading-relaxed text-zinc-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}
