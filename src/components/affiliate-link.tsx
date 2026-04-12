"use client";

import { ReactNode } from "react";

interface AffiliateLinkProps {
  href: string;
  merchant: "amazon" | "walmart" | "other";
  productId: string;
  productName: string;
  price?: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function AffiliateLink({
  href,
  merchant,
  productId,
  productName,
  price,
  className,
  children,
  ariaLabel,
}: AffiliateLinkProps) {
  const handleClick = () => {
    const numericPrice = price ? parseFloat(price.replace(/[^0-9.]/g, "")) : undefined;
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "affiliate_click", {
        merchant,
        product_id: productId,
        product_name: productName,
        value: numericPrice,
        currency: "USD",
      });
      window.gtag("event", "select_item", {
        item_list_id: merchant,
        items: [
          {
            item_id: productId,
            item_name: productName,
            item_brand: merchant,
            price: numericPrice,
          },
        ],
      });
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener"
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel}
      data-merchant={merchant}
      data-product-id={productId}
    >
      {children}
    </a>
  );
}
