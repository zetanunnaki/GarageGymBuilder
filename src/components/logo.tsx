interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = "", size = 22 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Barbell icon */}
      <rect x="2" y="7" width="4" height="10" rx="1" fill="currentColor" />
      <rect x="18" y="7" width="4" height="10" rx="1" fill="currentColor" />
      <rect x="5" y="9" width="2" height="6" rx="0.5" fill="currentColor" />
      <rect x="17" y="9" width="2" height="6" rx="0.5" fill="currentColor" />
      <rect x="7" y="11" width="10" height="2" rx="0.5" fill="currentColor" />
    </svg>
  );
}
