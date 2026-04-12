"use client";

import { useState } from "react";
import { X, Check, Dumbbell, ShoppingCart, ExternalLink } from "lucide-react";
import { type Product } from "@/lib/products";
import { AffiliateLink } from "./affiliate-link";

interface ProductQuickViewProps {
  product: Product;
  productId: string;
  trigger: React.ReactNode;
}

export function ProductQuickView({
  product,
  productId,
  trigger,
}: ProductQuickViewProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {trigger}
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-2xl border-2 border-zinc-800 bg-[#0a0a0a] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                  {product.brand}
                </p>
                <h3 className="text-lg font-black uppercase italic tracking-tighter">
                  {product.name}
                </h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="grid gap-6 p-6 md:grid-cols-2">
              {/* Image */}
              <div className="flex aspect-square items-center justify-center border-2 border-zinc-800 bg-zinc-900">
                <Dumbbell className="h-24 w-24 text-zinc-700" />
              </div>

              {/* Details */}
              <div className="space-y-4">
                <p className="text-3xl font-black italic text-orange-500">
                  {product.price}
                </p>

                {/* Specs */}
                <div className="space-y-2">
                  {product.specs.weightCapacity && (
                    <div className="flex justify-between border-b border-zinc-800/50 pb-1 text-sm">
                      <span className="text-zinc-500">Capacity</span>
                      <span className="font-bold">{product.specs.weightCapacity}</span>
                    </div>
                  )}
                  {product.specs.footprint && (
                    <div className="flex justify-between border-b border-zinc-800/50 pb-1 text-sm">
                      <span className="text-zinc-500">Footprint</span>
                      <span className="font-bold">{product.specs.footprint}</span>
                    </div>
                  )}
                  {product.specs.material && (
                    <div className="flex justify-between border-b border-zinc-800/50 pb-1 text-sm">
                      <span className="text-zinc-500">Material</span>
                      <span className="font-bold">{product.specs.material}</span>
                    </div>
                  )}
                </div>

                {/* Pros */}
                <div>
                  <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-green-500">
                    Top Pros
                  </p>
                  <ul className="space-y-1">
                    {product.pros.slice(0, 3).map((pro, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-zinc-400">
                        <Check size={10} className="shrink-0 text-green-500" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-2">
                  <AffiliateLink
                    href={product.amazonLink}
                    merchant="amazon"
                    productId={productId}
                    productName={product.name}
                    price={product.price}
                    className="flex flex-1 items-center justify-center gap-2 bg-[#FF9900] py-3 text-xs font-black uppercase italic tracking-tighter text-black transition hover:brightness-110"
                  >
                    <ShoppingCart size={14} /> Amazon
                  </AffiliateLink>
                  <AffiliateLink
                    href={product.walmartLink}
                    merchant="walmart"
                    productId={productId}
                    productName={product.name}
                    price={product.price}
                    className="flex flex-1 items-center justify-center gap-2 bg-[#0071CE] py-3 text-xs font-black uppercase italic tracking-tighter text-white transition hover:brightness-110"
                  >
                    <ExternalLink size={14} /> Walmart
                  </AffiliateLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
