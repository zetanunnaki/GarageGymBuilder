"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Trophy,
  Star,
  BookOpen,
  Home,
  Compass,
  Calculator,
  GitCompare,
  BookA,
  Users,
} from "lucide-react";
import { Search } from "./search";
import { LogoMark } from "./logo-mark";
import searchIndex from "@/data/search-index.json";

const navLinks = [
  { href: "/best-gear", label: "Best Gear" },
  { href: "/reviews", label: "Reviews" },
  { href: "/guides", label: "Guides" },
  { href: "/builds", label: "Builds" },
  { href: "/topics", label: "Topics" },
  { href: "/calculator", label: "Calculator" },
  { href: "/compare", label: "Compare" },
];

// Mobile drawer is grouped for scannability
const mobileSections = [
  {
    label: "Discover",
    links: [
      { href: "/best-gear/", label: "Best Gear", Icon: Trophy, desc: "Tested top picks" },
      { href: "/reviews/", label: "Reviews", Icon: Star, desc: "37 deep reviews" },
      { href: "/guides/", label: "Guides", Icon: BookOpen, desc: "47 how-tos" },
      { href: "/builds/", label: "Builds", Icon: Home, desc: "12 budget builds" },
      { href: "/topics/", label: "Topics", Icon: Compass, desc: "Browse by subject" },
    ],
  },
  {
    label: "Tools",
    links: [
      { href: "/calculator/", label: "Calculator", Icon: Calculator, desc: "Plan your build" },
      { href: "/compare/", label: "Compare", Icon: GitCompare, desc: "Side-by-side" },
      { href: "/glossary/", label: "Glossary", Icon: BookA, desc: "52 terms" },
    ],
  },
  {
    label: "About",
    links: [
      { href: "/team/", label: "Meet the Team", Icon: Users, desc: "Real lifters" },
      { href: "/picks/", label: "Our Picks", Icon: Star, desc: "All catalog" },
    ],
  },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full border-b backdrop-blur-xl transition-all duration-300 ${
          scrolled
            ? "border-zinc-800/80 bg-[#0a0a0a]/95 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            : "border-zinc-800/40 bg-[#0a0a0a]/70"
        }`}
      >
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 sm:px-6 ${
            scrolled ? "h-14 sm:h-16" : "h-16 sm:h-20"
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
            aria-label="GarageGymBuilders home"
          >
            <div
              className={`flex items-center justify-center border-2 border-orange-500 bg-[#0a0a0a] text-orange-500 transition-all duration-300 group-hover:border-orange-400 group-hover:text-orange-400 ${
                scrolled ? "h-8 w-8" : "h-9 w-9 sm:h-10 sm:w-10"
              }`}
            >
              <LogoMark size={scrolled ? 24 : 28} />
            </div>
            <span
              className={`font-black uppercase italic tracking-tighter text-white transition-all duration-300 ${
                scrolled ? "text-base sm:text-lg" : "text-lg sm:text-xl"
              }`}
            >
              GarageGym<span className="text-orange-500">Builders</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-5 lg:flex xl:gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-orange-400"
              >
                <span>{link.label}</span>
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-orange-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Search + CTA (desktop) */}
          <div className="hidden items-center gap-3 md:flex">
            <Search articles={searchIndex} />
            <Link
              href="/calculator/"
              className="skew-x-[-12deg] bg-white px-5 py-2 text-[10px] font-black uppercase text-black transition-all hover:bg-orange-500"
            >
              <span className="inline-block skew-x-[12deg]">Plan Build</span>
            </Link>
          </div>

          {/* Mobile Toggle - 44px tap target */}
          <button
            onClick={() => setOpen(!open)}
            className="flex h-11 w-11 items-center justify-center text-zinc-300 transition-colors hover:text-orange-500 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={26} strokeWidth={2.5} /> : <Menu size={26} strokeWidth={2.5} />}
          </button>
        </nav>
      </header>

      {/* MOBILE DRAWER - full screen */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />
        {/* Drawer panel */}
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto bg-[#0a0a0a] border-l border-zinc-800 transition-transform duration-500 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
          <div
            className="glow-orb pointer-events-none"
            style={{
              top: "10%",
              right: "-20%",
              width: "400px",
              height: "400px",
              background: "rgba(234, 88, 12, 0.15)",
            }}
          />

          {/* Drawer Header */}
          <div className="relative flex h-16 items-center justify-between border-b border-zinc-800 px-6">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5"
            >
              <div className="flex h-8 w-8 items-center justify-center border-2 border-orange-500 bg-[#0a0a0a] text-orange-500">
                <LogoMark size={22} />
              </div>
              <span className="text-base font-black uppercase italic tracking-tighter text-white">
                GarageGym<span className="text-orange-500">Builders</span>
              </span>
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="flex h-11 w-11 items-center justify-center text-zinc-400 hover:text-orange-500"
              aria-label="Close menu"
            >
              <X size={24} strokeWidth={2.5} />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="relative px-6 py-6">
            {mobileSections.map((section, sIdx) => (
              <div key={section.label} className={sIdx > 0 ? "mt-8" : ""}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">
                    {section.label}
                  </span>
                  <div className="h-px flex-1 bg-zinc-800" />
                </div>
                <div className="space-y-1">
                  {section.links.map((link) => {
                    const Icon = link.Icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="group flex min-h-[56px] items-center gap-4 border border-transparent px-3 py-3 transition-all hover:border-orange-600/40 hover:bg-orange-600/5"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-zinc-800 bg-zinc-900 transition-colors group-hover:border-orange-600/50 group-hover:bg-orange-600/10">
                          <Icon className="text-orange-500" size={18} />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-black uppercase italic tracking-tighter text-zinc-100 transition-colors group-hover:text-orange-400">
                            {link.label}
                          </div>
                          <div className="text-[10px] text-zinc-400">
                            {link.desc}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Drawer CTA */}
            <Link
              href="/calculator/"
              onClick={() => setOpen(false)}
              className="mt-8 flex min-h-[56px] skew-x-[-12deg] items-center justify-center bg-orange-600 py-4 text-base font-black uppercase italic tracking-tighter text-white transition hover:bg-orange-500"
            >
              <span className="inline-block skew-x-[12deg]">
                Plan Your Build &rarr;
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
