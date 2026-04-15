"use client";

import { useEffect, useRef } from "react";

// Tracks the pointer within its parent and exposes --mx / --my CSS vars
// on the parent, which are consumed by .spotlight pseudo-elements in globals.css.
export function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let raf = 0;
    let px = 50;
    let py = 50;

    const onMove = (e: PointerEvent) => {
      const rect = parent.getBoundingClientRect();
      px = ((e.clientX - rect.left) / rect.width) * 100;
      py = ((e.clientY - rect.top) / rect.height) * 100;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          parent.style.setProperty("--mx", `${px}%`);
          parent.style.setProperty("--my", `${py}%`);
          raf = 0;
        });
      }
    };

    parent.addEventListener("pointermove", onMove);
    return () => {
      parent.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="spotlight" aria-hidden="true" />;
}
