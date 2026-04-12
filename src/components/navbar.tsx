"use client";

import Link from "next/link";
import { useState } from "react";
import { Dumbbell, Menu, X } from "lucide-react";
import { Search } from "./search";
import searchIndex from "@/data/search-index.json";

const navLinks = [
  { href: "/best-gear", label: "Best Gear" },
  { href: "/reviews", label: "Reviews" },
  { href: "/guides", label: "Guides" },
  { href: "/builds", label: "Builds" },
  { href: "/picks", label: "Our Picks" },
  { href: "/calculator", label: "Calculator" },
  { href: "/team", label: "Team" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-zinc-800 bg-[#0a0a0a]/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="skew-x-[-12deg] bg-orange-600 p-1.5">
            <Dumbbell className="skew-x-[12deg] text-black" size={22} />
          </div>
          <span className="text-xl font-black uppercase italic tracking-tighter text-white">
            GarageGym<span className="text-orange-600">Builders</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-orange-500"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Search + CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Search articles={searchIndex} />
          <Link
            href="/builds/home-gym-under-1000"
            className="skew-x-[-12deg] bg-white px-5 py-2 text-[10px] font-black uppercase text-black transition-all hover:bg-orange-500"
          >
            <span className="inline-block skew-x-[12deg]">Get The Guide</span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex items-center justify-center p-2 text-zinc-400 hover:text-orange-500 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-zinc-800 bg-[#0a0a0a] md:hidden">
          <div className="space-y-1 px-6 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-sm font-black uppercase italic tracking-wider text-zinc-400 transition-colors hover:text-orange-500"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/builds/home-gym-under-1000"
              onClick={() => setOpen(false)}
              className="mt-4 block skew-x-[-12deg] bg-orange-600 py-3 text-center text-sm font-black uppercase text-white"
            >
              <span className="inline-block skew-x-[12deg]">Get The Guide</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
