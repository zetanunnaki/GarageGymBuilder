interface LogoMarkProps {
  size?: number;
  className?: string;
}

/**
 * Brand barbell mark — kept inline as SVG so it scales perfectly,
 * inherits color via fill, and avoids an extra HTTP request.
 */
export function LogoMark({ size = 24, className }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      role="img"
    >
      <rect x="6" y="20" width="4" height="24" fill="currentColor" />
      <rect x="10" y="24" width="3" height="16" fill="currentColor" />
      <rect x="13" y="29" width="38" height="6" fill="currentColor" />
      <rect x="51" y="24" width="3" height="16" fill="currentColor" />
      <rect x="54" y="20" width="4" height="24" fill="currentColor" />
    </svg>
  );
}
