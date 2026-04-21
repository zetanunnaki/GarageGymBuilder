"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Cookie } from "lucide-react";

const STORAGE_KEY = "ggb-consent-v1";
type ConsentState = "accepted" | "declined" | null;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function readConsent(): ConsentState {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "accepted" || v === "declined") return v;
  } catch {
    /* localStorage may be unavailable */
  }
  return null;
}

function writeConsent(value: "accepted" | "declined") {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* noop */
  }
}

function applyConsent(value: "accepted" | "declined") {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  // Google Consent Mode v2 — update analytics + ad storage based on choice
  if (value === "accepted") {
    window.gtag("consent", "update", {
      ad_storage: "granted",
      analytics_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
  } else {
    window.gtag("consent", "update", {
      ad_storage: "denied",
      analytics_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const state = readConsent();
    if (state === null) {
      setVisible(true);
    } else {
      // Apply saved choice on every page load so GA respects prior consent
      applyConsent(state);
    }
  }, []);

  const accept = () => {
    writeConsent("accepted");
    applyConsent("accepted");
    setVisible(false);
  };

  const decline = () => {
    writeConsent("declined");
    applyConsent("declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-[60] sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md"
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
    >
      <div className="relative border-2 border-zinc-800 bg-[#0a0a0a]/95 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-6">
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-orange-600 via-orange-500 to-orange-700" />

        <button
          onClick={decline}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center text-zinc-400 hover:text-orange-400"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>

        <div className="mb-3 flex items-center gap-2">
          <Cookie size={16} className="text-orange-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">
            Cookies & Privacy
          </span>
        </div>

        <h2 className="mb-2 text-lg font-black uppercase italic tracking-tighter text-zinc-100">
          We use cookies
        </h2>

        <p className="mb-4 pr-2 text-xs leading-relaxed text-zinc-400">
          We use cookies for analytics (Google Analytics) and to attribute
          shared links. We never sell your data. Choose your preference —
          you can change it later in our{" "}
          <Link
            href="/privacy-policy/"
            className="text-orange-500 underline hover:text-orange-400"
          >
            privacy policy
          </Link>
          .
        </p>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={accept}
            className="skew-x-[-12deg] bg-orange-600 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-orange-500"
          >
            <span className="inline-block skew-x-[12deg]">Accept All</span>
          </button>
          <button
            onClick={decline}
            className="skew-x-[-12deg] border-2 border-zinc-700 bg-zinc-900/50 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-300 transition hover:border-orange-600/60 hover:text-orange-400"
          >
            <span className="inline-block skew-x-[12deg]">Essential Only</span>
          </button>
        </div>
      </div>
    </div>
  );
}
