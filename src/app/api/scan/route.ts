import { NextRequest, NextResponse } from "next/server";
import { fetchProducts, normalizeDomain } from "@/lib/shopify/fetchProducts";
import { buildStoreReport } from "@/lib/scoring/aggregate";
import { extractAiFacts } from "@/lib/scoring/extractFacts";
import { generateProductSuggestions } from "@/lib/ai/suggest";
import {
  getCachedScan,
  cacheScan,
  checkRateLimit,
  recordScanEvent,
} from "@/lib/db/queries";
import type { ShopifyProduct } from "@/lib/shopify/types";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawUrl = body?.url || body?.domain;

    if (!rawUrl || typeof rawUrl !== "string") {
      return NextResponse.json(
        { error: "Please enter a store URL to scan." },
        { status: 400 }
      );
    }

    const domain = normalizeDomain(rawUrl);

    // Rate limit check: max 10 scans per IP per hour
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const { allowed } = await checkRateLimit(clientIp);
    if (!allowed) {
      return NextResponse.json(
        {
          error:
            "Scan rate limit reached (10 scans per hour). Please try again later.",
        },
        { status: 429 }
      );
    }

    // Check 24-hour cache
    const cached = await getCachedScan(domain);
    if (cached) {
      try {
        const parsedReport = JSON.parse(cached.report_json);
        return NextResponse.json({
          ...parsedReport,
          cached: true,
          scannedAt: cached.scanned_at,
        });
      } catch {
        // Cache corrupted, continue fresh scan
      }
    }

    // Fetch products
    const fetchResult = await fetchProducts(domain);

    if (!fetchResult.success) {
      return NextResponse.json(
        { error: fetchResult.error, errorType: fetchResult.errorType },
        { status: 400 }
      );
    }

    const products = fetchResult.products;

    // Run scoring engine
    // Convert to scoring product format (compatible)
    const report = buildStoreReport(products as unknown as ShopifyProduct[]);

    // Find the 5 weakest products and extract structured facts for "What AI sees"
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

    // Generate AI suggestions for the 2 lowest-scoring products (if Gemini is configured)
    const aiSuggestions = await generateProductSuggestions(weakestFullProducts);

    // Map top problems with affected product handles for merchant links
    const checkNameMap: Record<string, string> = {
      titleClarity: "Title clarity",
      descriptionDepth: "Description depth",
      keyDetails: "Key details present",
      productTypeTags: "Product type & tags",
      variantNaming: "Variant & option naming",
      imageCoverage: "Image coverage",
    };

    const problemWhyAndFix: Record<
      string,
      { why: string; fix: string }
    > = {
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
      // Find products that failed or warned on this check
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

    // Record scan event & cache report
    await recordScanEvent(clientIp, domain);
    await cacheScan(domain, JSON.stringify(fullReportPayload), report.totalProducts);

    return NextResponse.json(fullReportPayload);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
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
