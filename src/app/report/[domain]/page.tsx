import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ScoreBlock } from "@/components/ScoreBlock";
import { AutoFixBanner } from "@/components/AutoFixBanner";
import { ProblemList } from "@/components/ProblemList";
import { AiSeesComparison } from "@/components/AiSeesComparison";
import { CheckTable } from "@/components/CheckTable";
import { ShareBlock } from "@/components/ShareBlock";
import { normalizeDomain, fetchProducts } from "@/lib/shopify/fetchProducts";
import { buildStoreReport } from "@/lib/scoring/aggregate";
import { extractAiFacts } from "@/lib/scoring/extractFacts";
import { generateProductSuggestions } from "@/lib/ai/suggest";
import { getCachedScan, cacheScan } from "@/lib/db/queries";
import type { ShopifyProduct } from "@/lib/shopify/types";
import { RotateCcw, Sparkles, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface ReportPageProps {
  params: Promise<{ domain: string }>;
}

export async function generateMetadata({
  params,
}: ReportPageProps): Promise<Metadata> {
  const { domain } = await params;
  const decoded = decodeURIComponent(domain);
  return {
    title: `${decoded} — AI Shopping Readiness Score`,
    description: `Readiness score and optimization breakdown for ${decoded} in AI shopping assistants.`,
    openGraph: {
      title: `${decoded} — AI Shopping Readiness Score`,
      description: `Readiness score and optimization breakdown for ${decoded} in AI shopping assistants.`,
      images: [
        {
          url: `/api/og/${encodeURIComponent(decoded)}`,
          width: 1200,
          height: 630,
          alt: `Shelfmark readiness score for ${decoded}`,
        },
      ],
    },
  };
}

async function getOrGenerateReport(rawDomain: string) {
  const domain = normalizeDomain(rawDomain);

  // Check 24-hour cache first
  const cached = await getCachedScan(domain);
  if (cached) {
    try {
      const data = JSON.parse(cached.report_json);
      return { report: data, cached: true };
    } catch {
      // Continue to fresh scan
    }
  }

  // Fetch live products
  const fetchResult = await fetchProducts(domain);
  if (!fetchResult.success) {
    return { error: fetchResult.error, errorType: fetchResult.errorType };
  }

  const products = fetchResult.products;
  const report = buildStoreReport(products as unknown as ShopifyProduct[]);

  const weakestScores = report.lowestScoringProducts;
  const weakestFullProducts = weakestScores
    .map((item) => products.find((p) => p.id === item.productId))
    .filter((p): p is (typeof products)[0] => Boolean(p));

  const weakestComparisons = weakestFullProducts.map((p) => {
    const ps = weakestScores.find((ws) => ws.productId === p.id);
    return {
      id: p.id,
      title: p.title,
      handle: p.handle,
      price: p.variants?.[0]?.price ? `$${p.variants[0].price}` : "",
      image: p.images?.[0]?.src || null,
      productType: p.product_type || "None",
      description: p.body_html || "",
      score: ps?.score ?? 0,
      extractedFacts: extractAiFacts(p as unknown as ShopifyProduct),
    };
  });

  const aiSuggestions = await generateProductSuggestions(weakestFullProducts);

  const problemWhyAndFix: Record<string, { why: string; fix: string }> = {
    titleClarity: {
      why: "AI assistants use product titles as the primary anchor for matching shopper queries.",
      fix: "Include what the product is (noun) plus at least one concrete attribute (color, material, size).",
    },
    descriptionDepth: {
      why: "Thin or promotional copy gives AI models nothing factual to cite when answering shopper questions.",
      fix: "Write at least 120 words detailing materials, measurements, use cases, and care instructions.",
    },
    keyDetails: {
      why: "Shoppers ask AI assistants specific questions about dimensions, materials, and compatibility.",
      fix: "Add concrete specifications (material, dimensions, weight, ingredients, compatibility).",
    },
    productTypeTags: {
      why: "Category taxonomies help AI models understand exactly where your product fits in search hierarchies.",
      fix: "Assign a standard product type and 3–5 specific descriptive tags.",
    },
    variantNaming: {
      why: "Generic option names like 'Title' or 'Option 1' break AI product configuration and price checks.",
      fix: "Rename option titles to standard terms (Size, Color, Material) with clear values.",
    },
    imageCoverage: {
      why: "Visual AI models rely on descriptive alt text and multiple angles to verify product appearance.",
      fix: "Add 2 or more high-resolution photos and descriptive alt text explaining what is shown.",
    },
  };

  const formattedProblems = report.topProblems.map((prob) => {
    const affectedProducts = products
      .filter((prod) => {
        const scored = report.lowestScoringProducts.find((p) => p.productId === prod.id);
        const checkRes = scored?.checks.find((c) => c.check === prob.check);
        return checkRes && (checkRes.outcome === prob.outcome || checkRes.outcome === "fail");
      })
      .slice(0, 20)
      .map((p) => ({ title: p.title, handle: p.handle }));

    const guidance = problemWhyAndFix[prob.check] || {
      why: "Incomplete product metadata reduces AI assistant recommendation accuracy.",
      fix: "Review and enrich your product details in Shopify admin.",
    };

    const outcomeText = prob.outcome === "fail" ? "critical issues" : "warnings";

    return {
      checkName: prob.label,
      severity: prob.outcome,
      count: prob.affectedCount,
      total: report.totalProducts,
      summary: `${prob.affectedCount} of ${report.totalProducts} products have ${outcomeText} with ${prob.label.toLowerCase()}`,
      whyItMatters: guidance.why,
      howToFix: guidance.fix,
      affectedProducts,
    };
  });

  const fullReportPayload = {
    domain,
    productCount: report.totalProducts,
    overallScore: report.overallScore,
    grade: report.grade,
    gradeDescription: getGradeDescription(report.grade),
    scannedAt: new Date().toISOString(),
    topProblems: formattedProblems,
    checkSummaries: report.checkSummaries.map((s) => ({
      name: s.label,
      weight: CHECK_WEIGHTS[s.check] ?? 15,
      passCount: s.passCount,
      warnCount: s.warnCount,
      failCount: s.failCount,
      total: s.totalProducts,
      description: getCheckDescription(s.check),
    })),
    weakestProducts: weakestComparisons,
    aiSuggestions,
  };

  await cacheScan(domain, JSON.stringify(fullReportPayload), report.totalProducts);

  return { report: fullReportPayload, cached: false };
}

const CHECK_WEIGHTS: Record<string, number> = {
  titleClarity: 25,
  descriptionDepth: 25,
  keyDetails: 20,
  productTypeTags: 10,
  variantNaming: 10,
  imageCoverage: 10,
};

function getGradeDescription(grade: string): string {
  switch (grade) {
    case "Ready":
      return "AI shopping assistants can reliably parse, understand, and recommend your products to shoppers.";
    case "Almost ready":
      return "AI assistants understand most of your catalog, but missing specifications prevent high-confidence recommendations.";
    case "Needs work":
      return "Significant gaps in titles, descriptions, and variant details make it difficult for AI assistants to recommend your products.";
    case "Hard for AI to recommend":
      return "Critical product details are missing across your catalog. AI assistants are likely to bypass your products for clearer competitors.";
    default:
      return "Product catalog readiness evaluated for AI shopping assistants.";
  }
}

function getCheckDescription(check: string): string {
  switch (check) {
    case "titleClarity":
      return "Clear nouns and descriptive attributes so AI models understand what you sell.";
    case "descriptionDepth":
      return "Factual, detailed text over 120 words without heavy promotional filler.";
    case "keyDetails":
      return "Concrete specifications like materials, dimensions, weight, and care instructions.";
    case "productTypeTags":
      return "Accurate categorization and meaningful tags for search hierarchy mapping.";
    case "variantNaming":
      return "Legible option names (Size, Color) rather than internal SKU codes or default labels.";
    case "imageCoverage":
      return "Multiple clear product photos with descriptive alternative text.";
    default:
      return "";
  }
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { domain } = await params;
  const decodedDomain = decodeURIComponent(domain);

  const result = await getOrGenerateReport(decodedDomain);

  if ("error" in result) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-fail-bg border border-fail/30 flex items-center justify-center mx-auto text-fail">
          <RotateCcw className="w-6 h-6" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-ink">Store Scan Failed</h1>
        <p className="text-base text-muted max-w-md mx-auto">{result.error}</p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl shadow-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Try another store address
          </Link>
        </div>
      </div>
    );
  }

  const { report } = result;
  const formattedDate = new Date(report.scannedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const ogImageUrl = `/api/og/${encodeURIComponent(report.domain)}`;

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* 1. Header Navigation & Store Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
              {report.domain}
            </h1>
            <span className="text-xs px-3 py-1 rounded-full glass-panel border border-line text-muted font-semibold">
              {report.productCount} products audited
            </span>
          </div>
          <p className="text-xs text-muted">
            Audited on {formattedDate} &bull; Public Shopify Product Feed
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-line rounded-xl hover:bg-surface transition-colors"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            Scan another store
          </Link>
        </div>
      </div>

      {/* 2. Score block Showcase */}
      <section>
        <ScoreBlock
          score={report.overallScore}
          grade={report.grade}
          gradeDescription={report.gradeDescription}
        />
      </section>

      {/* 3. ⭐ PROMINENT AUTO-FIX HIGHLIGHT BANNER (Right below score) ⭐ */}
      <section className="animate-score">
        <AutoFixBanner
          domain={report.domain}
          problemCount={report.topProblems.length}
          highlighted={true}
        />
      </section>

      {/* 4. Priority Problems List */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold text-brand uppercase tracking-wider">
            Prioritized Action List
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink mt-1">
            Top issues blocking AI recommendations
          </h2>
          <p className="mt-1 text-sm text-muted">
            Ranked by total catalog impact (affected listings &times; signal weight).
          </p>
        </div>

        <ProblemList
          problems={report.topProblems}
          storeDomain={report.domain}
        />
      </section>

      {/* 5. What AI Sees: 5 Weakest Products Comparison */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold text-brand uppercase tracking-wider">
            Diagnostic Inspection
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink mt-1">
            What AI sees in your lowest-scoring products
          </h2>
          <p className="mt-1 text-sm text-muted">
            Side-by-side comparison: what shoppers see vs. the structured
            attributes extracted by AI search crawlers.
          </p>
        </div>

        <AiSeesComparison
          products={report.weakestProducts}
          storeDomain={report.domain}
        />
      </section>

      {/* 6. AI Rewrite suggestions (if Gemini is configured) */}
      {report.aiSuggestions && report.aiSuggestions.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand" aria-hidden="true" />
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
              AI rewrite suggestions
            </h2>
          </div>
          <p className="text-sm text-muted">
            Factual enhancements generated for your weakest products. Fill
            bracketed placeholders like <span className="text-warn font-mono font-semibold">[add material]</span> before publishing to Shopify.
          </p>

          <div className="space-y-6">
            {report.aiSuggestions.map(
              (
                s: {
                  productId: number;
                  originalTitle: string;
                  originalDescription: string;
                  suggestion: {
                    title: string;
                    description: string;
                    keyDetails: string[];
                    faqs: { q: string; a: string }[];
                  };
                },
                i: number
              ) => (
                <div
                  key={i}
                  className="glass-panel border border-line rounded-2xl p-6 sm:p-7 space-y-4 shadow-lg"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-line">
                    <span className="text-xs font-bold text-muted uppercase tracking-wider">
                      Product #{i + 1}: {s.originalTitle}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-light text-brand font-semibold">
                      AI Preview &bull; Review before publishing
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-semibold text-muted block mb-1">
                        Suggested Title
                      </span>
                      <p className="text-base font-bold text-ink">
                        {renderWithPlaceholders(s.suggestion.title)}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-muted block mb-1">
                        Suggested Description
                      </span>
                      <p className="text-sm text-ink leading-relaxed">
                        {renderWithPlaceholders(s.suggestion.description)}
                      </p>
                    </div>

                    {s.suggestion.keyDetails?.length > 0 && (
                      <div>
                        <span className="text-xs font-semibold text-muted block mb-1.5">
                          Extracted Specifications
                        </span>
                        <ul className="list-disc list-inside text-xs text-ink space-y-1">
                          {s.suggestion.keyDetails.map((kd, idx) => (
                            <li key={idx}>{renderWithPlaceholders(kd)}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* 7. Catalog-Wide Check Breakdown */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold text-brand uppercase tracking-wider">
            Full Audit Results
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink mt-1">
            Check breakdown table
          </h2>
          <p className="mt-1 text-sm text-muted">
            Catalog-wide results across all six deterministic readiness signals.
          </p>
        </div>

        <div className="glass-panel border border-line rounded-2xl p-6 shadow-lg">
          <CheckTable checks={report.checkSummaries} />
        </div>
      </section>

      {/* 8. Share Your Score */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-bold text-brand uppercase tracking-wider">
            Shareable Card
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink mt-1">
            Share your Shelfmark score
          </h2>
        </div>
        <ShareBlock
          domain={report.domain}
          score={report.overallScore}
          grade={report.grade}
          ogImageUrl={ogImageUrl}
        />
      </section>
    </div>
  );
}

function renderWithPlaceholders(text: string) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return parts.map((part, index) => {
    if (part.startsWith("[") && part.endsWith("]")) {
      return (
        <span
          key={index}
          className="bg-warn-bg text-warn px-2 py-0.5 rounded border border-warn/30 font-mono text-xs font-bold inline-block"
        >
          {part}
        </span>
      );
    }
    return part;
  });
}
