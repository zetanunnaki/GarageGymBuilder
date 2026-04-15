interface SignatureBarbellProps {
  className?: string;
}

// Hand-drawn inline SVG barbell. Stroke draws in, then plates pop on.
// No external assets. Scales fluidly with parent width.
export function SignatureBarbell({ className = "" }: SignatureBarbellProps) {
  // plate sizes, from inner (big) to outer (small)
  const plates = [
    { w: 10, h: 140, fill: "#0a0a0a", stroke: "#ea580c", offset: 96 },
    { w: 8, h: 120, fill: "#0a0a0a", stroke: "#f97316", offset: 108 },
    { w: 7, h: 96, fill: "#0a0a0a", stroke: "#fb923c", offset: 118 },
    { w: 6, h: 72, fill: "#0a0a0a", stroke: "#fdba74", offset: 127 },
  ];

  return (
    <svg
      viewBox="0 0 800 240"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* knurling shading marks on the sleeve centerline */}
      <defs>
        <linearGradient id="sleeve-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#52525b" />
          <stop offset="50%" stopColor="#a1a1aa" />
          <stop offset="100%" stopColor="#27272a" />
        </linearGradient>
        <linearGradient id="bar-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#71717a" />
          <stop offset="50%" stopColor="#e4e4e7" />
          <stop offset="100%" stopColor="#3f3f46" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* center shaft (the bar itself) — drawn in */}
      <line
        x1="180"
        y1="120"
        x2="620"
        y2="120"
        stroke="url(#bar-grad)"
        strokeWidth="10"
        strokeLinecap="square"
        className="stroke-draw"
      />

      {/* collars (left + right) */}
      <rect x="168" y="104" width="14" height="32" fill="url(#sleeve-grad)" />
      <rect x="618" y="104" width="14" height="32" fill="url(#sleeve-grad)" />

      {/* sleeves */}
      <rect x="88" y="100" width="80" height="40" fill="url(#sleeve-grad)" />
      <rect x="632" y="100" width="80" height="40" fill="url(#sleeve-grad)" />

      {/* plates — right side, stagger delays so they load outward */}
      {plates.map((p, i) => {
        const x = 712 + i * (p.w + 4);
        return (
          <rect
            key={`r-${i}`}
            x={x}
            y={120 - p.h / 2}
            width={p.w}
            height={p.h}
            fill={p.fill}
            stroke={p.stroke}
            strokeWidth="2"
            className="plate-load-r"
            style={{ animationDelay: `${0.4 + i * 0.12}s` }}
          />
        );
      })}

      {/* plates — left side mirror */}
      {plates.map((p, i) => {
        const x = 88 - (i + 1) * (p.w + 4);
        return (
          <rect
            key={`l-${i}`}
            x={x}
            y={120 - p.h / 2}
            width={p.w}
            height={p.h}
            fill={p.fill}
            stroke={p.stroke}
            strokeWidth="2"
            className="plate-load-l"
            style={{ animationDelay: `${0.4 + i * 0.12}s` }}
          />
        );
      })}

      {/* center knurl marks */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((i) => (
        <line
          key={i}
          x1={340 + i * 8}
          y1="112"
          x2={340 + i * 8}
          y2="128"
          stroke="#52525b"
          strokeWidth="1"
        />
      ))}

      {/* orange glow pin on the center */}
      <circle
        cx="400"
        cy="120"
        r="4"
        fill="#ea580c"
        filter="url(#glow)"
        className="plate-load-r"
        style={{ animationDelay: "1.1s" }}
      />
    </svg>
  );
}
