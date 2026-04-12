import { Info } from "lucide-react";

export function AffiliateDisclaimer() {
  return (
    <div className="not-prose mb-10 flex items-start gap-3 border border-zinc-800 bg-zinc-900 p-4">
      <Info size={16} className="mt-0.5 shrink-0 text-orange-500" />
      <p className="text-[10px] font-bold uppercase leading-tight tracking-wider text-zinc-500">
        GarageGymBuilders is reader-supported. We may earn a commission through
        links on this page.{" "}
        <a
          href="/affiliate-disclosure"
          className="text-orange-500 underline transition-colors hover:text-orange-400"
        >
          Learn more
        </a>
        .
      </p>
    </div>
  );
}
