import { getProduct } from "@/lib/products";
import { BuyButtons } from "./buy-buttons";

interface ComparisonTableProps {
  productIds?: string[];
  data?: string;
}

export function ComparisonTable({ productIds, data }: ComparisonTableProps) {
  let ids: string[] = [];
  if (productIds && Array.isArray(productIds)) {
    ids = productIds;
  } else if (data) {
    try {
      ids = JSON.parse(data);
    } catch {
      return null;
    }
  }
  if (ids.length === 0) return null;

  const products = ids
    .map((id) => ({ id, product: getProduct(id) }))
    .filter((p) => p.product !== null);

  if (products.length === 0) return null;

  const specLabels = ["Capacity", "Steel", "Footprint", "Price"] as const;

  const getSpec = (product: NonNullable<ReturnType<typeof getProduct>>, label: string) => {
    switch (label) {
      case "Capacity": return product.specs.weightCapacity ?? "---";
      case "Steel": return product.specs.material ?? "---";
      case "Footprint": return product.specs.footprint ?? "---";
      case "Price": return product.price;
      default: return "---";
    }
  };

  return (
    <div className="not-prose my-20 overflow-hidden border border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 bg-zinc-950/50 p-6">
        <h3 className="text-xl font-black uppercase italic tracking-tighter">
          Head-to-Head Comparison
        </h3>
      </div>

      {/* Spec-row layout: each spec is a row, products are columns */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <caption className="sr-only">
            Product comparison: {products.map(({ product }) => product!.name).join(" vs ")}
          </caption>
          <thead>
            <tr className="border-b border-zinc-800">
              <th scope="col" className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 sm:p-6">
                Spec
              </th>
              {products.map(({ id, product }) => (
                <th
                  key={id}
                  scope="col"
                  className="max-w-[200px] truncate p-4 text-sm font-bold uppercase italic leading-tight text-zinc-200 sm:p-6"
                >
                  {product!.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
            {specLabels.map((label) => (
              <tr key={label} className="border-b border-zinc-800 hover:bg-white/[0.02]">
                <th scope="row" className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 sm:p-6">
                  {label}
                </th>
                {products.map(({ id, product }) => (
                  <td
                    key={id}
                    className={`p-4 sm:p-6 ${label === "Price" ? "font-black italic text-orange-500" : "text-zinc-300"}`}
                  >
                    {getSpec(product!, label)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-b border-zinc-800">
              <th scope="row" className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 sm:p-6">
                Buy
              </th>
              {products.map(({ id }) => (
                <td key={id} className="p-4 sm:p-6">
                  <BuyButtons productId={id} compact />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
