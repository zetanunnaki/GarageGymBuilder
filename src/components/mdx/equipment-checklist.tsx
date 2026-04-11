"use client";

import { useState } from "react";
import { CheckSquare, Square, RotateCcw } from "lucide-react";

interface EquipmentChecklistProps {
  title?: string;
  items: { name: string; price?: string; note?: string }[];
}

export function EquipmentChecklist({
  title = "Equipment Checklist",
  items,
}: EquipmentChecklistProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  if (!items || !Array.isArray(items)) return null;

  const toggle = (i: number) => {
    const next = new Set(checked);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setChecked(next);
  };

  return (
    <div className="not-prose my-8 border border-zinc-800 bg-zinc-900/50">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/50 px-6 py-3">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
          {title}
        </h4>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-orange-500">
            {checked.size}/{items.length}
          </span>
          {checked.size > 0 && (
            <button
              onClick={() => setChecked(new Set())}
              className="text-zinc-600 hover:text-zinc-400"
              aria-label="Reset checklist"
            >
              <RotateCcw size={12} />
            </button>
          )}
        </div>
      </div>
      <div className="divide-y divide-zinc-800/50">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={`flex w-full items-center gap-3 px-6 py-3 text-left transition-colors hover:bg-zinc-800/30 ${
              checked.has(i) ? "opacity-60" : ""
            }`}
          >
            {checked.has(i) ? (
              <CheckSquare size={16} className="shrink-0 text-orange-500" />
            ) : (
              <Square size={16} className="shrink-0 text-zinc-600" />
            )}
            <span
              className={`flex-1 text-sm ${
                checked.has(i)
                  ? "text-zinc-600 line-through"
                  : "text-zinc-300"
              }`}
            >
              {item.name}
            </span>
            {item.price && (
              <span className="text-sm font-bold italic text-zinc-500">
                {item.price}
              </span>
            )}
          </button>
        ))}
      </div>
      {/* Progress bar */}
      <div className="h-1 bg-zinc-800">
        <div
          className="h-full bg-orange-600 transition-all duration-300"
          style={{
            width: `${items.length > 0 ? (checked.size / items.length) * 100 : 0}%`,
          }}
        />
      </div>
    </div>
  );
}
