"use client";

import { useState, useMemo } from "react";
import { Plus, X, Check, Minus, Search as SearchIcon } from "lucide-react";

interface CatalogProduct {
  id: string;
  name: string;
  brand: string;
  price: string;
  image: string;
  specs: {
    weightCapacity?: string;
    footprint?: string;
    material?: string;
    [key: string]: string | undefined;
  };
  pros: string[];
  cons: string[];
  amazonLink: string;
  walmartLink: string;
}

interface CompareClientProps {
  catalog: CatalogProduct[];
}

export function CompareClient({ catalog }: CompareClientProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selectedProducts = useMemo(
    () =>
      selected
        .map((id) => catalog.find((p) => p.id === id))
        .filter((p): p is CatalogProduct => !!p),
    [selected, catalog]
  );

  const filteredCatalog = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog
      .filter((p) => !selected.includes(p.id))
      .filter((p) =>
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      );
  }, [catalog, selected, query]);

  const addProduct = (id: string) => {
    if (selected.length >= 4) return;
    setSelected([...selected, id]);
    setPickerOpen(false);
    setQuery("");
  };

  const removeProduct = (id: string) => {
    setSelected(selected.filter((s) => s !== id));
  };

  if (selected.length === 0) {
    return (
      <div className="border-2 border-dashed border-zinc-800 bg-zinc-900/30 p-16 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center border-2 border-orange-600/30 bg-orange-600/10">
            <Plus className="text-orange-500" size={32} />
          </div>
        </div>
        <h2 className="mb-2 text-2xl font-black uppercase italic tracking-tighter">
          Start a Comparison
        </h2>
        <p className="mb-8 text-zinc-500">
          Pick your first product to compare.
        </p>
        <button
          onClick={() => setPickerOpen(true)}
          className="skew-x-[-12deg] bg-orange-600 px-8 py-4 font-black uppercase italic text-white transition hover:bg-orange-500"
        >
          <span className="inline-block skew-x-[12deg]">Pick First Product</span>
        </button>
        {pickerOpen && (
          <Picker
            catalog={filteredCatalog}
            query={query}
            onQuery={setQuery}
            onPick={addProduct}
            onClose={() => {
              setPickerOpen(false);
              setQuery("");
            }}
          />
        )}
      </div>
    );
  }

  return (
    <>
      {/* Comparison Grid */}
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${Math.min(selectedProducts.length + (selectedProducts.length < 4 ? 1 : 0), 4)}, minmax(0, 1fr))`,
        }}
      >
        {selectedProducts.map((product) => (
          <div
            key={product.id}
            className="relative border border-zinc-800 bg-zinc-900/50"
          >
            <button
              onClick={() => removeProduct(product.id)}
              className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center border border-zinc-700 bg-zinc-900 text-zinc-500 transition-colors hover:border-red-500 hover:text-red-400"
              aria-label={`Remove ${product.name}`}
            >
              <X size={14} />
            </button>
            <div className="border-b border-zinc-800 p-5">
              <div className="text-[9px] font-black uppercase tracking-widest text-zinc-600">
                {product.brand}
              </div>
              <div className="mt-1 text-sm font-black uppercase italic leading-tight tracking-tighter">
                {product.name}
              </div>
              <div className="mt-3 text-3xl font-black italic text-orange-500">
                {product.price}
              </div>
            </div>

            <div className="space-y-4 p-5 text-xs">
              <div>
                <div className="mb-1 text-[9px] font-black uppercase tracking-widest text-zinc-600">
                  Weight Capacity
                </div>
                <div className="text-zinc-300">
                  {product.specs.weightCapacity || "—"}
                </div>
              </div>
              <div>
                <div className="mb-1 text-[9px] font-black uppercase tracking-widest text-zinc-600">
                  Footprint
                </div>
                <div className="text-zinc-300">
                  {product.specs.footprint || "—"}
                </div>
              </div>
              <div>
                <div className="mb-1 text-[9px] font-black uppercase tracking-widest text-zinc-600">
                  Material
                </div>
                <div className="text-zinc-300">
                  {product.specs.material || "—"}
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-3">
                <div className="mb-2 text-[9px] font-black uppercase tracking-widest text-green-500">
                  Top Pros
                </div>
                <ul className="space-y-1">
                  {product.pros.slice(0, 4).map((pro, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-1 text-[11px] text-zinc-400"
                    >
                      <Check
                        size={10}
                        className="mt-1 shrink-0 text-green-500"
                      />
                      <span className="line-clamp-2">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-zinc-800 pt-3">
                <div className="mb-2 text-[9px] font-black uppercase tracking-widest text-red-500">
                  Trade-Offs
                </div>
                <ul className="space-y-1">
                  {product.cons.slice(0, 3).map((con, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-1 text-[11px] text-zinc-400"
                    >
                      <Minus
                        size={10}
                        className="mt-1 shrink-0 text-red-500"
                      />
                      <span className="line-clamp-2">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px border-t border-zinc-800">
              <a
                href={product.amazonLink}
                target="_blank"
                rel="sponsored nofollow noopener"
                className="bg-[#FF9900] py-3 text-center text-[10px] font-black uppercase italic tracking-tighter text-black transition hover:brightness-110"
              >
                Amazon
              </a>
              <a
                href={product.walmartLink}
                target="_blank"
                rel="sponsored nofollow noopener"
                className="bg-[#0071CE] py-3 text-center text-[10px] font-black uppercase italic tracking-tighter text-white transition hover:brightness-110"
              >
                Walmart
              </a>
            </div>
          </div>
        ))}

        {selectedProducts.length < 4 && (
          <button
            onClick={() => setPickerOpen(true)}
            className="flex min-h-[320px] flex-col items-center justify-center gap-3 border-2 border-dashed border-zinc-800 bg-zinc-900/20 text-zinc-600 transition-colors hover:border-orange-600/60 hover:text-orange-500"
          >
            <div className="flex h-14 w-14 items-center justify-center border border-current">
              <Plus size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">
              Add Product
            </span>
            <span className="text-[10px] text-zinc-700">
              {4 - selectedProducts.length} slot
              {selectedProducts.length < 3 ? "s" : ""} left
            </span>
          </button>
        )}
      </div>

      {pickerOpen && (
        <Picker
          catalog={filteredCatalog}
          query={query}
          onQuery={setQuery}
          onPick={addProduct}
          onClose={() => {
            setPickerOpen(false);
            setQuery("");
          }}
        />
      )}
    </>
  );
}

function Picker({
  catalog,
  query,
  onQuery,
  onPick,
  onClose,
}: {
  catalog: CatalogProduct[];
  query: string;
  onQuery: (q: string) => void;
  onPick: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-6 pt-24">
      <button
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative z-10 w-full max-w-2xl border-2 border-zinc-800 bg-[#0a0a0a]">
        <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-4">
          <SearchIcon size={16} className="shrink-0 text-orange-500" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-600 outline-none"
          />
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {catalog.length === 0 ? (
            <div className="p-10 text-center text-sm text-zinc-600">
              No matches
            </div>
          ) : (
            catalog.map((product) => (
              <button
                key={product.id}
                onClick={() => onPick(product.id)}
                className="flex w-full items-center justify-between gap-3 border-b border-zinc-800/50 px-4 py-3 text-left transition-colors hover:bg-zinc-900"
              >
                <div className="min-w-0">
                  <div className="text-[9px] font-black uppercase tracking-widest text-orange-500/80">
                    {product.brand}
                  </div>
                  <div className="truncate text-sm font-bold text-zinc-200">
                    {product.name}
                  </div>
                </div>
                <div className="shrink-0 text-sm font-black italic text-orange-500">
                  {product.price}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
