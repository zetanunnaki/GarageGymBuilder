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
      <h2 className="text-display-md font-black uppercase italic tracking-tighter">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 max-w-2xl text-base italic leading-relaxed text-zinc-400 sm:mt-4 sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
