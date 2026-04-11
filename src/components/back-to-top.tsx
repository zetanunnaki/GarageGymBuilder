"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed right-6 bottom-6 z-40 flex h-12 w-12 items-center justify-center border border-zinc-700 bg-zinc-900 text-zinc-400 transition-all hover:border-orange-600 hover:text-orange-500"
      aria-label="Back to top"
    >
      <ChevronUp size={20} />
    </button>
  );
}
