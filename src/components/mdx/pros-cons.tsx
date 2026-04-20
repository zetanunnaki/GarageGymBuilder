import { Check, X } from "lucide-react";

interface ProsConsProps {
  list?: string[];
  data?: string;
  type: "pros" | "cons";
}

export function ProsCons({ list, data, type }: ProsConsProps) {
  let items: string[] = [];
  if (list && Array.isArray(list)) {
    items = list;
  } else if (data) {
    try {
      items = JSON.parse(data);
    } catch {
      return null;
    }
  }
  if (items.length === 0) return null;

  const isPros = type === "pros";

  return (
    <div className="not-prose my-6">
      <div
        className={`border ${isPros ? "border-green-900/50 bg-green-950/20" : "border-red-900/50 bg-red-950/20"}`}
      >
        <ul className="divide-y divide-zinc-800/50">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 px-5 py-3">
              <span
                className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isPros ? "bg-green-500/15" : "bg-red-500/15"}`}
              >
                {isPros ? (
                  <Check
                    size={12}
                    className="text-green-500"
                    strokeWidth={3}
                  />
                ) : (
                  <X size={12} className="text-red-500" strokeWidth={3} />
                )}
              </span>
              <span className="text-sm leading-relaxed text-zinc-300">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
