import { RefreshCw } from "lucide-react";

interface LastUpdatedBadgeProps {
  date: string;
}

export function LastUpdatedBadge({ date }: LastUpdatedBadgeProps) {
  const articleDate = new Date(date);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - articleDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays > 90) return null;

  const label =
    diffDays <= 7
      ? "Updated this week"
      : diffDays <= 30
        ? "Updated this month"
        : "Recently updated";

  return (
    <span className="inline-flex items-center gap-1 bg-green-600/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-green-500">
      <RefreshCw size={8} />
      {label}
    </span>
  );
}
