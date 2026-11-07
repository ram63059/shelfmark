/**
 * The six scoring checks that evaluate a single Shopify product
 * for AI shopping readiness.
 */

import type {
  CheckDefinition,
  CheckName,
  CheckResult,
  ShopifyProduct,
} from "@/lib/scoring/types";
import {
  ATTRIBUTE_WORDS,
  GENERIC_OPTION_NAMES,
  GENERIC_TAGS,
  PRODUCT_NOUNS,
  PROMOTIONAL_WORDS,
  SPEC_KEYWORDS,
} from "@/lib/scoring/dictionaries";
import { stripHtml, wordCount } from "@/lib/scoring/htmlUtils";

// ---------------------------------------------------------------------------
// Check definitions (exported so aggregate can reference weights/labels)
// ---------------------------------------------------------------------------

export const CHECK_DEFINITIONS: readonly CheckDefinition[] = [
  { name: "titleClarity", weight: 25, label: "Title clarity" },
  { name: "descriptionDepth", weight: 25, label: "Description depth" },
  { name: "keyDetails", weight: 20, label: "Key details present" },
  { name: "productTypeTags", weight: 10, label: "Product type & tags" },
  { name: "variantNaming", weight: 10, label: "Variant & option naming" },
  { name: "imageCoverage", weight: 10, label: "Image coverage" },
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Tokenize a string into lowercase words (strips punctuation). */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/['']/g, "'") // normalize curly apostrophes
    .split(/[\s/,;:|()\[\]{}"]+/)
    .map((w) => w.replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, ""))
    .filter((w) => w.length > 0);
}

/** Check whether any token in `words` exists in the given set. */
function hasAnyMatch(words: readonly string[], dict: ReadonlySet<string>): boolean {
  return words.some((w) => dict.has(w));
}

/** Count how many tokens in `words` exist in the given set. */
function countMatches(words: readonly string[], dict: ReadonlySet<string>): number {
  const seen = new Set<string>();
  let count = 0;
  for (const w of words) {
    if (dict.has(w) && !seen.has(w)) {
      seen.add(w);
      count++;
    }
  }
  return count;
}

/** Check if a variant title is purely a code (e.g. "SKU12345", "X-100"). */
function isCodeLike(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  // Mostly digits / uppercase with dashes, no vowels → code-like
  const alphaOnly = trimmed.replace(/[^a-zA-Z]/g, "");
  if (alphaOnly.length === 0) return true; // purely numeric/symbols
  // If the string is very short and all-caps with numbers, treat as code
  const hasLowerCase = /[a-z]/.test(trimmed);
  const hasDigit = /\d/.test(trimmed);
  if (!hasLowerCase && hasDigit && trimmed.length <= 12) return true;
  return false;
}

// ---------------------------------------------------------------------------
// 1. Title Clarity (weight 25)
// ---------------------------------------------------------------------------

export function checkTitleClarity(product: ShopifyProduct): CheckResult {
  const title = product.title.trim();
  const words = tokenize(title);

  // Fail: under 3 words
  if (words.length < 3) {
    return {
      check: "titleClarity",
      outcome: "fail",
      reason: `Title "${title}" has fewer than 3 words.`,
    };
  }

  // Check for product noun
  const hasNoun = hasAnyMatch(words, PRODUCT_NOUNS);

  if (!hasNoun) {
    return {
      check: "titleClarity",
      outcome: "fail",
      reason: `Title "${title}" has no recognizable product noun (e.g., shirt, phone, mug).`,
    };
  }

  // Check for descriptive attribute
  const hasAttribute = hasAnyMatch(words, ATTRIBUTE_WORDS);

  if (!hasAttribute) {
    return {
      check: "titleClarity",
      outcome: "warn",
      reason: `Title "${title}" names the product but lacks a descriptive attribute (material, color, size, etc.).`,
    };
  }

  return {
    check: "titleClarity",
    outcome: "pass",
    reason: "Title states the product and includes at least one descriptive attribute.",
  };
}

// ---------------------------------------------------------------------------
// 2. Description Depth (weight 25)
// ---------------------------------------------------------------------------

export function checkDescriptionDepth(product: ShopifyProduct): CheckResult {
  const plainText = stripHtml(product.body_html);
  const wc = wordCount(plainText);

  if (wc < 40) {
    return {
      check: "descriptionDepth",
      outcome: "fail",
      reason:
        wc === 0
          ? "Description is empty."
          : `Description has only ${wc} word${wc === 1 ? "" : "s"} (minimum 40).`,
    };
  }

  // Check promotional ratio
  const words = tokenize(plainText);
  const promoCount = countMatches(words, PROMOTIONAL_WORDS);
  const promoRatio = words.length > 0 ? promoCount / words.length : 0;
  const isMostlyPromo = promoRatio > 0.15 && promoCount >= 4;

  if (wc <= 120 || isMostlyPromo) {
    const reasons: string[] = [];
    if (wc <= 120) {
      reasons.push(`Description has ${wc} words (40–120 range)`);
    }
    if (isMostlyPromo) {
      reasons.push("heavy on promotional language with few concrete facts");
    }
    return {
      check: "descriptionDepth",
      outcome: "warn",
      reason: reasons.join("; ") + ".",
    };
  }

  return {
    check: "descriptionDepth",
    outcome: "pass",
    reason: `Description has ${wc} words with concrete content.`,
  };
}

// ---------------------------------------------------------------------------
// 3. Key Details Present (weight 20)
// ---------------------------------------------------------------------------

export function checkKeyDetails(product: ShopifyProduct): CheckResult {
  const plainText = stripHtml(product.body_html);
  const combined = `${product.title} ${plainText}`;
  const words = tokenize(combined);

  const specCount = countMatches(words, SPEC_KEYWORDS);

  if (specCount === 0) {
    return {
      check: "keyDetails",
      outcome: "fail",
      reason: "No concrete specs found (material, dimensions, weight, ingredients, care, etc.).",
    };
  }

  if (specCount === 1) {
    return {
      check: "keyDetails",
      outcome: "warn",
      reason: "Only 1 type of spec detail found; consider adding more (dimensions, material, care, etc.).",
    };
  }

  return {
    check: "keyDetails",
    outcome: "pass",
    reason: `Found ${specCount} types of spec details.`,
  };
}

// ---------------------------------------------------------------------------
// 4. Product Type & Tags (weight 10)
// ---------------------------------------------------------------------------

export function checkProductTypeTags(product: ShopifyProduct): CheckResult {
  const hasType = (product.product_type || "").trim().length > 0;
  const rawTags = (
    Array.isArray(product.tags)
      ? product.tags
      : typeof product.tags === "string"
      ? product.tags.split(",")
      : []
  )
    .map((t) => String(t).trim().toLowerCase())
    .filter((t) => t.length > 0);
  const hasTags = rawTags.length > 0;

  if (!hasType && !hasTags) {
    return {
      check: "productTypeTags",
      outcome: "fail",
      reason: "Both product type and tags are empty.",
    };
  }

  // Check for generic tags
  const meaningfulTags = rawTags.filter((t) => !GENERIC_TAGS.has(t));
  const hasGenericType = hasType && GENERIC_TAGS.has(product.product_type.trim().toLowerCase());

  const typeOk = hasType && !hasGenericType;
  const tagsOk = meaningfulTags.length > 0;

  if (!typeOk || !tagsOk) {
    const issues: string[] = [];
    if (!hasType) issues.push("product type is missing");
    else if (hasGenericType) issues.push("product type is generic");
    if (!hasTags) issues.push("tags are missing");
    else if (!tagsOk) issues.push("tags are generic");
    return {
      check: "productTypeTags",
      outcome: "warn",
      reason: issues.join(" and ").replace(/^\w/, (c) => c.toUpperCase()) + ".",
    };
  }

  return {
    check: "productTypeTags",
    outcome: "pass",
    reason: "Product type and tags are both meaningful.",
  };
}

// ---------------------------------------------------------------------------
// 5. Variant & Option Naming (weight 10)
// ---------------------------------------------------------------------------

export function checkVariantNaming(product: ShopifyProduct): CheckResult {
  const { variants, options } = product;

  // Single variant with default title → no variants to evaluate, pass
  if (
    variants.length <= 1 &&
    options.length === 1 &&
    GENERIC_OPTION_NAMES.has(options[0].name.toLowerCase().trim())
  ) {
    return {
      check: "variantNaming",
      outcome: "pass",
      reason: "Single-variant product; no option naming needed.",
    };
  }

  // Check option names
  const genericOptions = options.filter((o) =>
    GENERIC_OPTION_NAMES.has(o.name.toLowerCase().trim()),
  );

  if (genericOptions.length > 0 && variants.length > 1) {
    const names = genericOptions.map((o) => `"${o.name}"`).join(", ");
    return {
      check: "variantNaming",
      outcome: "fail",
      reason: `Option name${genericOptions.length > 1 ? "s" : ""} ${names} ${genericOptions.length > 1 ? "are" : "is"} generic/default with ${variants.length} variants.`,
    };
  }

  // Check variant titles for code-like values
  const codeLikeVariants = variants.filter(
    (v) =>
      v.title !== "Default Title" &&
      isCodeLike(v.title),
  );

  if (codeLikeVariants.length > 0 && variants.length > 1) {
    return {
      check: "variantNaming",
      outcome: "fail",
      reason: `${codeLikeVariants.length} variant${codeLikeVariants.length > 1 ? "s have" : " has"} code-like title${codeLikeVariants.length > 1 ? "s" : ""} (e.g., "${codeLikeVariants[0].title}").`,
    };
  }

  return {
    check: "variantNaming",
    outcome: "pass",
    reason: "Option names and variant values are clear and readable.",
  };
}

// ---------------------------------------------------------------------------
// 6. Image Coverage (weight 10)
// ---------------------------------------------------------------------------

export function checkImageCoverage(product: ShopifyProduct): CheckResult {
  const { images } = product;

  if (images.length === 0) {
    return {
      check: "imageCoverage",
      outcome: "fail",
      reason: "No product images.",
    };
  }

  const missingAlt = images.filter(
    (img) => !img.alt || img.alt.trim().length === 0,
  );

  if (images.length === 1 || missingAlt.length > 0) {
    const issues: string[] = [];
    if (images.length === 1) issues.push("only 1 image");
    if (missingAlt.length > 0)
      issues.push(
        `${missingAlt.length} image${missingAlt.length > 1 ? "s" : ""} missing alt text`,
      );
    return {
      check: "imageCoverage",
      outcome: "warn",
      reason: issues.join(", ").replace(/^\w/, (c) => c.toUpperCase()) + ".",
    };
  }

  return {
    check: "imageCoverage",
    outcome: "pass",
    reason: `${images.length} images, all with alt text.`,
  };
}

// ---------------------------------------------------------------------------
// Run all checks on one product
// ---------------------------------------------------------------------------

const CHECK_FNS: Record<CheckName, (p: ShopifyProduct) => CheckResult> = {
  titleClarity: checkTitleClarity,
  descriptionDepth: checkDescriptionDepth,
  keyDetails: checkKeyDetails,
  productTypeTags: checkProductTypeTags,
  variantNaming: checkVariantNaming,
  imageCoverage: checkImageCoverage,
};

export function runAllChecks(product: ShopifyProduct): readonly CheckResult[] {
  return CHECK_DEFINITIONS.map((def) => CHECK_FNS[def.name](product));
}
