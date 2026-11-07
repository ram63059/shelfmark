/**
 * Aggregate scoring: per-product scores, store-level report,
 * grade bands, and top-problems ranking.
 */

import type {
  CheckOutcome,
  CheckSummary,
  Grade,
  ProductScore,
  RankedProblem,
  ShopifyProduct,
  StoreReport,
} from "@/lib/scoring/types";
import { CHECK_DEFINITIONS, runAllChecks } from "@/lib/scoring/checks";

// ---------------------------------------------------------------------------
// Outcome → numeric multiplier
// ---------------------------------------------------------------------------

const OUTCOME_MULTIPLIER: Record<CheckOutcome, number> = {
  pass: 1,
  warn: 0.5,
  fail: 0,
};

// ---------------------------------------------------------------------------
// Grade bands
// ---------------------------------------------------------------------------

export function gradeFromScore(score: number): Grade {
  if (score >= 85) return "Ready";
  if (score >= 65) return "Almost ready";
  if (score >= 40) return "Needs work";
  return "Hard for AI to recommend";
}

// ---------------------------------------------------------------------------
// Per-product scoring
// ---------------------------------------------------------------------------

export function scoreProduct(product: ShopifyProduct): ProductScore {
  const checks = runAllChecks(product);

  const totalWeight = CHECK_DEFINITIONS.reduce((sum, d) => sum + d.weight, 0);

  let earnedWeight = 0;
  for (const result of checks) {
    const def = CHECK_DEFINITIONS.find((d) => d.name === result.check);
    if (def) {
      earnedWeight += def.weight * OUTCOME_MULTIPLIER[result.outcome];
    }
  }

  const score = Math.round((earnedWeight / totalWeight) * 100);

  return {
    productId: product.id,
    productTitle: product.title,
    handle: product.handle,
    score,
    checks,
  };
}

// ---------------------------------------------------------------------------
// Store-level aggregation
// ---------------------------------------------------------------------------

export function buildStoreReport(products: readonly ShopifyProduct[]): StoreReport {
  if (products.length === 0) {
    return {
      overallScore: 0,
      grade: "Hard for AI to recommend",
      totalProducts: 0,
      checkSummaries: [],
      topProblems: [],
      lowestScoringProducts: [],
    };
  }

  // Score every product
  const productScores = products.map(scoreProduct);

  // Overall score = average of product scores, rounded
  const overallScore = Math.round(
    productScores.reduce((sum, ps) => sum + ps.score, 0) / productScores.length,
  );

  const grade = gradeFromScore(overallScore);

  // Per-check summaries
  const checkSummaries: CheckSummary[] = CHECK_DEFINITIONS.map((def) => {
    let passCount = 0;
    let warnCount = 0;
    let failCount = 0;

    for (const ps of productScores) {
      const result = ps.checks.find((c) => c.check === def.name);
      if (result) {
        switch (result.outcome) {
          case "pass":
            passCount++;
            break;
          case "warn":
            warnCount++;
            break;
          case "fail":
            failCount++;
            break;
        }
      }
    }

    return {
      check: def.name,
      label: def.label,
      totalProducts: products.length,
      passCount,
      warnCount,
      failCount,
    };
  });

  // Top problems: ranked by (affected products × weight)
  // Both warn and fail count as "affected", but we rank them separately
  const problems: RankedProblem[] = [];

  for (const summary of checkSummaries) {
    const def = CHECK_DEFINITIONS.find((d) => d.name === summary.check);
    if (!def) continue;

    if (summary.failCount > 0) {
      problems.push({
        check: summary.check,
        label: summary.label,
        affectedCount: summary.failCount,
        weight: def.weight,
        impactScore: summary.failCount * def.weight,
        outcome: "fail",
      });
    }

    if (summary.warnCount > 0) {
      problems.push({
        check: summary.check,
        label: summary.label,
        affectedCount: summary.warnCount,
        weight: def.weight,
        impactScore: summary.warnCount * def.weight,
        outcome: "warn",
      });
    }
  }

  // Sort by impact descending, then by weight descending as tiebreaker
  problems.sort((a, b) => {
    if (b.impactScore !== a.impactScore) return b.impactScore - a.impactScore;
    return b.weight - a.weight;
  });

  const topProblems = problems.slice(0, 5);

  // 5 lowest-scoring products with their failed checks
  const lowestScoringProducts = [...productScores]
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);

  return {
    overallScore,
    grade,
    totalProducts: products.length,
    checkSummaries,
    topProblems,
    lowestScoringProducts,
  };
}
