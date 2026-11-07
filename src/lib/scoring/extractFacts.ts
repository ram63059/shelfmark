import type { ShopifyProduct } from "./types";
import { stripHtml } from "./htmlUtils";

export interface ExtractedProductFacts {
  productType: string | null;
  material: string | null;
  dimensionsSize: string | null;
  weight: string | null;
  careInstructions: string | null;
  useCase: string | null;
}

const COMMON_MATERIALS = [
  "cotton", "organic cotton", "linen", "silk", "wool", "merino wool",
  "cashmere", "leather", "genuine leather", "vegan leather", "suede",
  "denim", "canvas", "polyester", "nylon", "spandex", "elastane",
  "rayon", "viscose", "modal", "bamboo", "fleece", "velvet",
  "stainless steel", "aluminum", "brass", "copper", "iron", "titanium",
  "solid wood", "oak", "walnut", "pine", "teak", "bamboo wood",
  "ceramic", "porcelain", "glass", "borosilicate glass",
  "silicone", "plastic", "recycled plastic", "rubber",
];

const CARE_TERMS = [
  "machine wash cold", "machine wash", "hand wash only", "hand wash",
  "dry clean only", "dry clean", "tumble dry low", "tumble dry",
  "air dry", "line dry", "do not bleach", "wipe clean", "dishwasher safe",
];

const USE_CASE_TERMS = [
  "running", "workout", "gym", "hiking", "travel", "everyday wear",
  "casual", "formal", "office", "outdoor", "indoor", "cooking",
  "sleeping", "gaming", "swimming", "cycling", "yoga",
];

/**
 * Extract structured facts that an AI shopping assistant would attempt to parse.
 * Returns null for any attribute not explicitly discovered in the product data.
 */
export function extractAiFacts(product: ShopifyProduct): Record<string, string | null> {
  const plainText = stripHtml(product.body_html || "").toLowerCase();
  const titleLower = product.title.toLowerCase();
  const combined = `${titleLower} ${plainText}`;

  // 1. Product Type
  let productType: string | null = null;
  if (product.product_type && product.product_type.trim().length > 0) {
    productType = product.product_type.trim();
  }

  // 2. Material
  let material: string | null = null;
  for (const m of COMMON_MATERIALS) {
    if (combined.includes(m)) {
      material = m.charAt(0).toUpperCase() + m.slice(1);
      break;
    }
  }

  // 3. Dimensions / Size
  let dimensionsSize: string | null = null;
  // Look for options
  const sizeOption = product.options.find(
    (o) => o.name.toLowerCase() === "size" || o.name.toLowerCase().includes("size")
  );
  if (sizeOption && sizeOption.values.length > 0) {
    dimensionsSize = sizeOption.values.slice(0, 4).join(", ") + (sizeOption.values.length > 4 ? "..." : "");
  } else {
    // Look for dimension patterns in text like 10" x 12" or 28 inches
    const dimMatch = combined.match(/\b\d+(\.\d+)?\s*(inches|inch|cm|mm|ft|oz|ml|l)\b/i);
    if (dimMatch) {
      dimensionsSize = dimMatch[0];
    }
  }

  // 4. Weight
  let weight: string | null = null;
  const weightMatch = combined.match(/\b\d+(\.\d+)?\s*(oz|ounce|ounces|lbs?|pounds?|kg|grams?|g)\b/i);
  if (weightMatch) {
    weight = weightMatch[0];
  }

  // 5. Care Instructions
  let careInstructions: string | null = null;
  for (const c of CARE_TERMS) {
    if (combined.includes(c)) {
      careInstructions = c.charAt(0).toUpperCase() + c.slice(1);
      break;
    }
  }

  // 6. Primary Use Case
  let useCase: string | null = null;
  for (const u of USE_CASE_TERMS) {
    if (combined.includes(u)) {
      useCase = u.charAt(0).toUpperCase() + u.slice(1);
      break;
    }
  }

  return {
    "Product Type": productType,
    "Material": material,
    "Size / Options": dimensionsSize,
    "Weight / Volume": weight,
    "Care Guide": careInstructions,
    "Intended Use": useCase,
  };
}
