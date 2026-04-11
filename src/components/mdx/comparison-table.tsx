import { getProduct } from "@/lib/products";
import { BuyButtons } from "./buy-buttons";

interface ComparisonTableProps {
  productIds: string[];
}

export function ComparisonTable({ productIds }: ComparisonTableProps) {
  if (!productIds || !Array.isArray(productIds)) return null;

  const products = productIds
    .map((id) => ({ id, product: getProduct(id) }))
    .filter((p) => p.product !== null);

  if (products.length === 0) return null;

  return (
    <div className="not-prose my-20 overflow-hidden border border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 bg-zinc-950/50 p-6">
        <h3 className="text-xl font-black uppercase italic tracking-tighter">
          Head-to-Head Comparison
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500">
              <th className="p-6">Equipment</th>
              <th className="p-6">Capacity</th>
              <th className="p-6">Steel</th>
              <th className="p-6">Footprint</th>
              <th className="p-6">Price</th>
              <th className="p-6">Buy</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {products.map(({ id, product }) => (
              <tr
                key={id}
                className="border-b border-zinc-800 hover:bg-white/[0.02]"
              >
                <td className="p-6 font-bold uppercase italic">
                  {product!.name}
                </td>
                <td className="p-6">
                  {product!.specs.weightCapacity ?? "---"}
                </td>
                <td className="p-6">{product!.specs.material ?? "---"}</td>
                <td className="p-6">{product!.specs.footprint ?? "---"}</td>
                <td className="p-6 font-black italic text-orange-500">
                  {product!.price}
                </td>
                <td className="p-6">
                  <BuyButtons productId={id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
