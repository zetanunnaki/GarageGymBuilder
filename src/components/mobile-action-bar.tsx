"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUp, Share2, List as ListIcon } from "lucide-react";

interface MobileActionBarProps {
  shareTitle: string;
  shareUrl: string;
}

export function MobileActionBar({ shareTitle, shareUrl }: MobileActionBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show after scrolling past first viewport
      setVisible(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url: shareUrl });
      } catch {
        // user cancelled
      }
    } else if (typeof navigator !== "undefined") {
      try {
        await navigator.clipboard.writeText(shareUrl);
      } catch {
        /* noop */
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToToc = () => {
    const toc = document.getElementById("toc-list");
    if (toc) {
      toc.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    // Fallback: scroll to first H2
    const h2 = document.querySelector("article h2");
    if (h2) h2.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className={`pointer-events-none fixed bottom-4 left-1/2 z-40 -translate-x-1/2 transition-all duration-300 md:hidden ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-12 opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <div className="pointer-events-auto flex items-center gap-2 border-2 border-zinc-800 bg-[#0a0a0a]/95 px-2 py-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <button
          onClick={scrollToToc}
          className="flex h-11 w-11 items-center justify-center text-zinc-300 transition-colors hover:text-orange-400"
          aria-label="Jump to contents"
        >
          <ListIcon size={20} />
        </button>
        <div className="h-6 w-px bg-zinc-800" />
        <button
          onClick={handleShare}
          className="flex h-11 w-11 items-center justify-center text-zinc-300 transition-colors hover:text-orange-400"
          aria-label="Share article"
        >
          <Share2 size={20} />
        </button>
        <div className="h-6 w-px bg-zinc-800" />
        <Link
          href="/calculator/"
          className="flex h-11 skew-x-[-12deg] items-center bg-orange-600 px-4 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-orange-500"
        >
          <span className="inline-block skew-x-[12deg]">Plan Build</span>
        </Link>
        <div className="h-6 w-px bg-zinc-800" />
        <button
          onClick={scrollToTop}
          className="flex h-11 w-11 items-center justify-center text-zinc-300 transition-colors hover:text-orange-400"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      </div>
    </div>
  );
}
