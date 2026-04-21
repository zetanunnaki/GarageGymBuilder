import { Square } from "lucide-react";

interface ChecklistItem {
  name: string;
  price?: string;
  note?: string;
}

interface EquipmentChecklistProps {
  title?: string;
  items?: ChecklistItem[];
  data?: string;
}

export function EquipmentChecklist({
  title = "Equipment Checklist",
  items,
  data,
}: EquipmentChecklistProps) {
  let checklistItems: ChecklistItem[] = [];
  if (items && Array.isArray(items)) {
    checklistItems = items;
  } else if (data) {
    try {
      checklistItems = JSON.parse(data);
    } catch {
      return null;
    }
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
