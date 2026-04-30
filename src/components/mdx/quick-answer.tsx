import { Zap } from "lucide-react";

interface QuickAnswerProps {
  children?: React.ReactNode;
  text?: string;
}

export function QuickAnswer({ children, text }: QuickAnswerProps) {
  const content = text || children;
  if (!content) return null;

  return (
    <div className="not-prose my-8 border-l-4 border-orange-500 bg-zinc-900/60 p-6">
      <div className="mb-3 flex items-center gap-2">
        <Zap size={14} className="text-orange-500" />
        <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
          Quick Answer
        </span>
      </div>
      <p className="text-sm leading-relaxed text-zinc-300">{content}</p>
    </div>
  );
}
