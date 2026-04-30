import { Square } from "lucide-react";

interface ChecklistItem {
  name: string;
  price?: string;
  note?: string;
}

interface EquipmentChecklistProps {
  title?: string;
  items?: ChecklistItem[] | string;
  data?: string;
}

function normalizeItems(raw: unknown[]): ChecklistItem[] {
  return raw.map((item) => {
    if (typeof item === "string") return { name: item };
    if (item && typeof item === "object" && "name" in item)
      return item as ChecklistItem;
    return { name: String(item) };
  });
}

export function EquipmentChecklist({
  title = "Equipment Checklist",
  items,
  data,
}: EquipmentChecklistProps) {
  let checklistItems: ChecklistItem[] = [];

  const source = data ?? (typeof items === "string" ? items : null);
  if (source) {
    try {
      const parsed = JSON.parse(source);
      if (Array.isArray(parsed)) checklistItems = normalizeItems(parsed);
    } catch {
      return null;
    }
  } else if (Array.isArray(items)) {
    checklistItems = normalizeItems(items);
  }

  if (checklistItems.length === 0) return null;

  return (
    <div className="not-prose my-8 border border-zinc-800 bg-zinc-900/50">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/50 px-6 py-3">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
          {title}
        </h4>
        <span className="text-[10px] font-bold text-orange-500">
          {checklistItems.length} items
        </span>
      </div>
      <div className="divide-y divide-zinc-800/50">
        {checklistItems.map((item, i) => (
          <div key={i} className="flex items-center gap-3 px-6 py-3">
            <Square size={16} className="shrink-0 text-zinc-400" />
            <span className="flex-1 text-sm text-zinc-300">{item.name}</span>
            {item.price && (
              <span className="text-sm font-bold italic text-zinc-400">
                {item.price}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
