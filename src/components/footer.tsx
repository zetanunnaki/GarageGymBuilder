import Link from "next/link";
import { Dumbbell, ArrowRight } from "lucide-react";

export function Footer() {
  const sections = [
    {
      label: "Discover",
      links: [
        { href: "/best-gear/", label: "Best Gear" },
        { href: "/reviews/", label: "Reviews" },
        { href: "/guides/", label: "Guides" },
        { href: "/builds/", label: "Builds" },
        { href: "/topics/", label: "Topics" },
      ],
    },
    {
      label: "Tools",
      links: [
        { href: "/calculator/", label: "Calculator" },
        { href: "/compare/", label: "Compare" },
        { href: "/glossary/", label: "Glossary" },
        { href: "/search/", label: "Search" },
        { href: "/picks/", label: "Our Picks" },
      ],
    },
    {
      label: "About",
      links: [
        { href: "/team/", label: "Team" },
        { href: "/about/", label: "About" },
        { href: "/how-we-test/", label: "How We Test" },
        { href: "/affiliate-disclosure/", label: "Affiliate Disclosure" },
        { href: "/privacy-policy/", label: "Privacy" },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-zinc-900 bg-zinc-950 px-4 pt-16 pb-12 sm:px-6 sm:pt-20">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div
        className="glow-orb pointer-events-none"
        style={{
          bottom: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "300px",
          background: "rgba(234, 88, 12, 0.06)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Top section: brand + sections */}
        <div className="grid gap-10 border-b border-zinc-800 pb-12 md:grid-cols-4">
          {/* Brand block */}
          <div className="md:col-span-1">
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-2"
            >
              <div className="skew-x-[-12deg] bg-orange-600 p-1.5">
                <Dumbbell
                  className="skew-x-[12deg] text-black"
                  size={20}
                />
              </div>
              <span className="text-lg font-black uppercase italic tracking-tighter">
                GarageGym<span className="text-orange-500">Builders</span>
              </span>
            </Link>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-zinc-500">
              Expert, database-free reviews of home gym equipment. We pull
              the data, you pull the weight.
            </p>
            <Link
              href="/calculator/"
              className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-500 hover:text-orange-400"
            >
              Plan Your Build
              <ArrowRight
                size={12}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Section columns */}
          {sections.map((section) => (
            <div key={section.label}>
              <div className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">
                <div className="h-2 w-2 bg-orange-500" />
                {section.label}
              </div>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-400 transition-colors hover:text-orange-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="mx-auto mt-8 max-w-3xl text-center text-[10px] uppercase leading-loose tracking-[0.25em] text-zinc-600">
          GarageGymBuilders is a participant in the Amazon Services LLC
          Associates Program and Walmart Associates Program. We may earn a
          commission on purchases made through our links at no extra cost to
          you.
        </p>

        <p className="mt-6 text-center text-[10px] tracking-widest text-zinc-700">
          &copy; {new Date().getFullYear()} GarageGymBuilders. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
