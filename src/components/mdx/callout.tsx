import { AlertTriangle, Info, CheckCircle, Zap } from "lucide-react";

interface CalloutProps {
  type?: "info" | "warning" | "success" | "tip";
  title?: string;
  children: React.ReactNode;
}

const calloutConfig = {
  info: {
    icon: Info,
    border: "border-blue-600/30",
    bg: "bg-blue-600/5",
    iconColor: "text-blue-500",
    titleColor: "text-blue-400",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-amber-600/30",
    bg: "bg-amber-600/5",
    iconColor: "text-amber-500",
    titleColor: "text-amber-400",
  },
  success: {
    icon: CheckCircle,
    border: "border-green-600/30",
    bg: "bg-green-600/5",
    iconColor: "text-green-500",
    titleColor: "text-green-400",
  },
  tip: {
    icon: Zap,
    border: "border-orange-600/30",
    bg: "bg-orange-600/5",
    iconColor: "text-orange-500",
    titleColor: "text-orange-400",
  },
};

export function Callout({ type = "info", title, children }: CalloutProps) {
  const config = calloutConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={`not-prose my-8 border ${config.border} ${config.bg} p-5`}
    >
      <div className="flex items-start gap-3">
        <Icon size={18} className={`mt-0.5 shrink-0 ${config.iconColor}`} />
        <div>
          {title && (
            <p
              className={`mb-2 text-sm font-black uppercase italic tracking-tighter ${config.titleColor}`}
            >
              {title}
            </p>
          )}
          <div className="text-sm text-zinc-400">{children}</div>
        </div>
      </div>
    </div>
  );
}
