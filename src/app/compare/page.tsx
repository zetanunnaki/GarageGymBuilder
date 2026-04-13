import { Metadata } from "next";
import { CompareClient } from "./compare-client";
import productsData from "@/data/products.json";
import type { Product } from "@/lib/products";

export const metadata: Metadata = {
  title: "Compare Home Gym Products",
  description:
    "Side-by-side comparison of home gym equipment. Pick 2-4 products and see specs, pricing, pros, and cons at a glance.",
  alternates: { canonical: "/compare/" },
};

export default function ComparePage() {
  const products = productsData as Record<string, Product>;
  const catalog = Object.entries(products).map(([id, product]) => ({
    id,
    name: product.name,
    brand: product.brand,
    price: product.price,
    image: product.image,
    specs: product.specs,
    pros: product.pros,
    cons: product.cons,
    amazonLink: product.amazonLink,
    walmartLink: product.walmartLink,
  }));

  return (
    <div className="mx-auto max-w-7xl px-6 pt-24 pb-16 sm:pt-32 sm:pb-20">
      <header className="mb-12">
        <div className="mb-4 flex items-center gap-3">
          <div className="skew-x-[-12deg] bg-orange-600 p-2">
            <svg
              className="skew-x-[12deg] text-black"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="10" y1="6" x2="21" y2="6" />
              <line x1="10" y1="12" x2="21" y2="12" />
              <line x1="10" y1="18" x2="21" y2="18" />
              <polyline points="3 6 4 7 6 5" />
              <polyline points="3 12 4 13 6 11" />
              <polyline points="3 18 4 19 6 17" />
            </svg>
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-orange-500">
            Comparison Tool
          </div>
        </div>
        <h1 className="mb-4 text-5xl font-black uppercase italic leading-[0.85] tracking-tighter md:text-6xl">
          Compare <br />
          <span className="bg-gradient-to-br from-orange-300 via-orange-500 to-orange-800 bg-clip-text text-transparent">
            Head-to-Head
          </span>
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-zinc-500">
          Pick 2-4 products and see specs, pricing, pros, and cons side by
          side. Every product is Amazon/Walmart verified with 4.5+ stars.
        </p>
      </header>

      <CompareClient catalog={catalog} />
    </div>
  );
}
