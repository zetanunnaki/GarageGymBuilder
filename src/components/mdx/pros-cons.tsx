import { Check, X } from "lucide-react";

interface ProsConsProps {
  list: string[];
  type: "pros" | "cons";
}

export function ProsCons({ list, type }: ProsConsProps) {
  if (!list || !Array.isArray(list)) return null;
  const isPros = type === "pros";

  return (
    <div className="not-prose my-4">
      <ul className="space-y-2">
        {list.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-[11px] text-zinc-400">
            {isPros ? (
              <Check size={14} className="mt-0.5 shrink-0 text-green-500" />
            ) : (
              <X size={14} className="mt-0.5 shrink-0 text-red-500" />
            )}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
