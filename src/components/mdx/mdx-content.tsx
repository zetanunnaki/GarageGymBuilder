import { MDXRemote } from "next-mdx-remote/rsc";
import { AffiliateDisclaimer } from "./affiliate-disclaimer";
import { BuyButtons } from "./buy-buttons";
import { ProductCard } from "./product-card";
import { ComparisonTable } from "./comparison-table";
import { ProsCons } from "./pros-cons";
import { QuickSpecs } from "./quick-specs";
import { VerdictBox } from "./verdict-box";
import { Faq } from "./faq";
import { Callout } from "./callout";
import { PriceAlert } from "./price-alert";
import { EquipmentChecklist } from "./equipment-checklist";

const mdxComponents = {
  AffiliateDisclaimer,
  BuyButtons,
  DualBuyButton: BuyButtons,
  ProductCard,
  EquipmentCard: ProductCard,
  ComparisonTable,
  ProsCons,
  QuickSpecs,
  VerdictBox,
  Faq,
  Callout,
  PriceAlert,
  EquipmentChecklist,
};

interface MdxContentProps {
  source: string;
}

export function MdxContent({ source }: MdxContentProps) {
  return (
    <div className="prose prose-lg prose-invert max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter prose-h2:border-l-8 prose-h2:border-orange-600 prose-h2:pl-6 prose-h2:text-3xl prose-h3:text-xl prose-p:text-zinc-400 prose-p:leading-relaxed prose-a:text-orange-500 prose-a:no-underline hover:prose-a:text-orange-400 prose-strong:text-zinc-200 prose-li:text-zinc-400 prose-table:border-zinc-800 prose-th:border-zinc-800 prose-th:bg-zinc-900 prose-th:text-[10px] prose-th:font-black prose-th:uppercase prose-th:tracking-widest prose-th:text-zinc-500 prose-td:border-zinc-800 prose-td:text-zinc-400 prose-hr:border-zinc-800 print:prose-p:text-black print:prose-headings:text-black print:prose-li:text-black">
      <MDXRemote source={source} components={mdxComponents} />
    </div>
  );
}
