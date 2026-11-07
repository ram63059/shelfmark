/**
 * TypeScript types for the Shelfmark scoring engine.
 *
 * Covers Shopify product shapes, per-check results,
 * per-product scores, and store-level report data.
 */

// ---------------------------------------------------------------------------
// Shopify product shapes (subset relevant to scoring)
// ---------------------------------------------------------------------------

export interface ShopifyImage {
  readonly id: number;
  readonly src: string;
  readonly alt: string | null;
}

export interface ShopifyVariant {
  readonly id: number;
  readonly title: string;
  readonly option1: string | null;
  readonly option2: string | null;
  readonly option3: string | null;
}

export interface ShopifyOption {
  readonly id?: number;
  readonly name: string;
  readonly position?: number;
  readonly values: readonly string[];
}

export interface ShopifyProduct {
  readonly id: number;
  readonly title: string;
  readonly body_html: string | null;
  readonly product_type: string;
  readonly tags: string | readonly string[];
  readonly images: readonly ShopifyImage[];
  readonly variants: readonly ShopifyVariant[];
  readonly options: readonly ShopifyOption[];
  readonly handle: string;
  readonly vendor: string;
}

// ---------------------------------------------------------------------------
// Check-level types
// ---------------------------------------------------------------------------

/** Every check resolves to one of these outcomes. */
export type CheckOutcome = "pass" | "warn" | "fail";

/** Name string for each of the six checks. */
export type CheckName =
  | "titleClarity"
  | "descriptionDepth"
  | "keyDetails"
  | "productTypeTags"
  | "variantNaming"
  | "imageCoverage";

/** Result of a single check against a single product. */
export interface CheckResult {
  readonly check: CheckName;
  readonly outcome: CheckOutcome;
  readonly reason: string;
}

/** Static metadata about a check. */
export interface CheckDefinition {
  readonly name: CheckName;
  readonly weight: number;
  readonly label: string;
}

// ---------------------------------------------------------------------------
// Per-product scoring
// ---------------------------------------------------------------------------

export interface ProductScore {
  readonly productId: number;
  readonly productTitle: string;
  readonly handle: string;
  readonly score: number; // 0–100
  readonly checks: readonly CheckResult[];
}

// ---------------------------------------------------------------------------
// Store-level report
// ---------------------------------------------------------------------------

export type Grade =
  | "Ready"
  | "Almost ready"
  | "Needs work"
  | "Hard for AI to recommend";

/** Summary of a single check across the entire store. */
export interface CheckSummary {
  readonly check: CheckName;
  readonly label: string;
  readonly totalProducts: number;
  readonly passCount: number;
  readonly warnCount: number;
  readonly failCount: number;
}

/** A ranked problem in the store-level report. */
export interface RankedProblem {
  readonly check: CheckName;
  readonly label: string;
  readonly affectedCount: number;
  readonly weight: number;
  readonly impactScore: number; // affectedCount × weight
  readonly outcome: "warn" | "fail";
}

export interface StoreReport {
  readonly overallScore: number; // 0–100, rounded
  readonly grade: Grade;
  readonly totalProducts: number;
  readonly checkSummaries: readonly CheckSummary[];
  readonly topProblems: readonly RankedProblem[];
  readonly lowestScoringProducts: readonly ProductScore[];
}
