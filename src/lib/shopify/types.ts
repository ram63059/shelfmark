/** Types for Shopify public product JSON feed */

export interface ShopifyImage {
  id: number;
  product_id: number;
  position: number;
  alt: string | null;
  width: number;
  height: number;
  src: string;
}

export interface ShopifyVariant {
  id: number;
  product_id: number;
  title: string;
  price: string;
  compare_at_price: string | null;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  sku: string;
  available: boolean;
}

export interface ShopifyOption {
  name: string;
  position: number;
  values: string[];
}

export interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  body_html: string | null;
  vendor: string;
  product_type: string;
  tags: string[];
  images: ShopifyImage[];
  variants: ShopifyVariant[];
  options: ShopifyOption[];
  created_at: string;
  updated_at: string;
  published_at: string;
}

export interface FetchProductsResult {
  success: true;
  domain: string;
  products: ShopifyProduct[];
  totalFetched: number;
}

export interface FetchProductsError {
  success: false;
  error: string;
  errorType: "not-shopify" | "blocked" | "no-products" | "timeout" | "unknown";
}

export type FetchResult = FetchProductsResult | FetchProductsError;
