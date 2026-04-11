import productsData from "@/data/products.json";

export interface ProductSpecs {
  weightCapacity?: string;
  footprint?: string;
  material?: string;
  [key: string]: string | undefined;
}

export interface Product {
  name: string;
  brand: string;
  price: string;
  image: string;
  specs: ProductSpecs;
  amazonLink: string;
  walmartLink: string;
  pros: string[];
  cons: string[];
}

const products = productsData as Record<string, Product>;

export function getProduct(productId: string): Product | null {
  return products[productId] ?? null;
}

export function getAllProducts(): Record<string, Product> {
  return products;
}
