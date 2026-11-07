import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ScoreBlock } from "@/components/ScoreBlock";
import { ProblemList } from "@/components/ProblemList";
import { AiSeesComparison } from "@/components/AiSeesComparison";
import { CheckTable } from "@/components/CheckTable";
import { WaitlistForm } from "@/components/WaitlistForm";
import { ShareBlock } from "@/components/ShareBlock";
import { normalizeDomain, fetchProducts } from "@/lib/shopify/fetchProducts";
import { buildStoreReport } from "@/lib/scoring/aggregate";
import { extractAiFacts } from "@/lib/scoring/extractFacts";
import { generateProductSuggestions } from "@/lib/ai/suggest";
import { getCachedScan, cacheScan } from "@/lib/db/queries";
import type { ShopifyProduct } from "@/lib/shopify/types";
import { RotateCcw, Sparkles } from "lucide-react";

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
      // Continue to fresh scan if cache parse failed
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
      <div className="mx-auto max-w-2xl px-4 py-20 text-center space-y-6">
        <h1 className="text-2xl font-bold text-ink">Store Scan Failed</h1>
        <p className="text-base text-muted">{result.error}</p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand text-white font-medium rounded-lg hover:bg-brand-hover transition-colors"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            Try another store
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
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              {report.domain}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-mist border border-line text-muted">
              {report.productCount} products scanned
            </span>
          </div>
          <p className="mt-1 text-xs text-muted">
            Scanned on {formattedDate} &bull; Public product listings feed
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-line rounded-lg hover:bg-mist transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Scan another
          </Link>
        </div>
      </div>

      {/* 2. Score block */}
      <section className="space-y-4">
        <ScoreBlock
          score={report.overallScore}
          grade={report.grade}
          gradeDescription={report.gradeDescription}
        />
      </section>

      {/* 3. Top problems */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
            Priority fixes
          </h2>
          <p className="mt-1 text-sm text-muted">
            The highest-impact issues preventing AI assistants from
            recommending your products.
          </p>
        </div>

        <ProblemList
          problems={report.topProblems}
          storeDomain={report.domain}
        />
      </section>

      {/* 4. What AI sees comparison */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
            What AI sees
          </h2>
          <p className="mt-1 text-sm text-muted">
            Side-by-side view of your 5 weakest products: how shoppers see them
            vs. the structured facts extracted by AI crawlers.
          </p>
        </div>

        <AiSeesComparison
          products={report.weakestProducts}
          storeDomain={report.domain}
        />
      </section>

      {/* 5. AI Rewrite suggestions (if generated) */}
      {report.aiSuggestions && report.aiSuggestions.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand" aria-hidden="true" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
              AI rewrite suggestions
            </h2>
          </div>
          <p className="text-sm text-muted">
            Suggested factual enhancements for your lowest-scoring products.
            Review placeholders before updating your Shopify catalog.
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
                  className="border border-line rounded-xl p-6 bg-paper space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-line">
                    <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                      Product #{i + 1}: {s.originalTitle}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-brand-light text-brand font-medium">
                      AI suggestion. Review before using.
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-medium text-muted block mb-1">
                        Suggested Title
                      </span>
                      <p className="text-sm font-semibold text-ink">
                        {renderWithPlaceholders(s.suggestion.title)}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-medium text-muted block mb-1">
                        Suggested Description
                      </span>
                      <p className="text-sm text-ink leading-relaxed">
                        {renderWithPlaceholders(s.suggestion.description)}
                      </p>
                    </div>

                    {s.suggestion.keyDetails?.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-muted block mb-1">
                          Key Specifications
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

      {/* 6. Full Check Breakdown Table */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
            Check breakdown
          </h2>
          <p className="mt-1 text-sm text-muted">
            Catalog-wide results across all six readiness checks.
          </p>
        </div>

        <div className="border border-line rounded-xl bg-paper p-4">
          <CheckTable checks={report.checkSummaries} />
        </div>
      </section>

      {/* 7. Automatic fixes email capture */}
      <section className="border border-line rounded-xl p-6 sm:p-8 bg-mist">
        <div className="max-w-xl space-y-3">
          <h2 className="text-xl font-bold text-ink">
            Want these issues fixed automatically?
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            We are building a Shopify app that generates factual, high-clarity
            rewrites directly inside your Shopify admin. Get notified when it
            launches.
          </p>
          <div className="pt-2">
            <WaitlistForm domain={report.domain} />
          </div>
        </div>
      </section>

      {/* 8. Share block */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-ink">Share your Shelfmark</h2>
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
          className="bg-warn-bg text-warn px-1.5 py-0.5 rounded border border-warn/30 font-mono text-xs font-semibold"
        >
          {part}
        </span>
      );
    }
    return part;
  });
}
