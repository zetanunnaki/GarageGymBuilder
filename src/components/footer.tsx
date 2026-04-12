import Link from "next/link";
import { Dumbbell } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 px-6 py-20">
      <div className="mx-auto max-w-7xl text-center">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="skew-x-[-12deg] bg-zinc-800 p-1.5">
            <Dumbbell className="skew-x-[12deg] text-white" size={20} />
          </div>
          <span className="text-lg font-black uppercase italic tracking-tighter">
            GarageGym<span className="text-orange-600">Builders</span>
          </span>
        </div>

        {/* Disclaimer */}
        <p className="mx-auto mb-10 max-w-2xl text-[10px] uppercase leading-loose tracking-[0.3em] text-zinc-600">
          GarageGymBuilders is a participant in the Amazon Services LLC Associates
          Program and Walmart Associates Program. We may earn a commission on
          purchases made through our links.
        </p>

        {/* Links */}
        <div className="mb-8 flex justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <Link href="/best-gear" className="transition-colors hover:text-white">
            Best Gear
          </Link>
          <Link href="/reviews" className="transition-colors hover:text-white">
            Reviews
          </Link>
          <Link href="/guides" className="transition-colors hover:text-white">
            Guides
          </Link>
          <Link href="/builds" className="transition-colors hover:text-white">
            Builds
          </Link>
          <Link href="/picks" className="transition-colors hover:text-white">
            Our Picks
          </Link>
        </div>
        <div className="flex justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <Link href="/privacy-policy" className="transition-colors hover:text-white">
            Privacy
          </Link>
          <Link href="/about" className="transition-colors hover:text-white">
            About
          </Link>
          <Link href="/how-we-test" className="transition-colors hover:text-white">
            How We Test
          </Link>
          <Link href="/affiliate-disclosure" className="transition-colors hover:text-white">
            Affiliate Disclosure
          </Link>
        </div>

        <p className="mt-10 text-[10px] tracking-widest text-zinc-700">
          &copy; {new Date().getFullYear()} GarageGymBuilders. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
