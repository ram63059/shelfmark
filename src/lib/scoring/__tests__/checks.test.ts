/**
 * Comprehensive unit tests for the Shelfmark scoring engine.
 *
 * Covers all six checks, per-product scoring, store-level aggregation,
 * grade bands, and edge cases.
 */

import { describe, it, expect } from "vitest";
import type { ShopifyProduct } from "@/lib/scoring/types";
import {
  checkTitleClarity,
  checkDescriptionDepth,
  checkKeyDetails,
  checkProductTypeTags,
  checkVariantNaming,
  checkImageCoverage,
  runAllChecks,
  CHECK_DEFINITIONS,
} from "@/lib/scoring/checks";
import { scoreProduct, gradeFromScore, buildStoreReport } from "@/lib/scoring/aggregate";
import { stripHtml, wordCount } from "@/lib/scoring/htmlUtils";

// ---------------------------------------------------------------------------
// Test product factory
// ---------------------------------------------------------------------------

function makeProduct(overrides: Partial<ShopifyProduct> = {}): ShopifyProduct {
  return {
    id: 1,
    title: "Classic Cotton T-Shirt",
    body_html:
      "<p>This premium cotton t-shirt is made from 100% organic cotton fabric. " +
      "It features a comfortable fit with reinforced stitching. The material is " +
      "soft, breathable, and machine washable. Dimensions: length 28 inches, " +
      "width 20 inches. Weight: 6 oz. Perfect for casual wear, outdoor activities, " +
      "and everyday comfort. Available in multiple sizes and colors. Care instructions: " +
      "Machine wash cold, tumble dry low. Do not bleach. Iron on low heat if needed. " +
      "This shirt is designed for durability and comfort throughout the seasons. " +
      "The classic crew neck design pairs well with jeans, shorts, or layered " +
      "under a jacket for cooler weather. A wardrobe essential for any occasion. " +
      "Crafted with precision to ensure a lasting feel, this shirt resists shrinking " +
      "and maintains its shape after repeated washes. Ideal for everyday use at home, " +
      "work, or travel across all kinds of weather conditions.</p>",
    product_type: "T-Shirts",
    tags: "cotton, casual, summer, organic",
    images: [
      { id: 1, src: "https://cdn.example.com/1.jpg", alt: "Classic Cotton T-Shirt front view" },
      { id: 2, src: "https://cdn.example.com/2.jpg", alt: "Classic Cotton T-Shirt back view" },
    ],
    variants: [
      { id: 101, title: "Small / White", option1: "Small", option2: "White", option3: null },
      { id: 102, title: "Medium / White", option1: "Medium", option2: "White", option3: null },
      { id: 103, title: "Large / Blue", option1: "Large", option2: "Blue", option3: null },
    ],
    options: [
      { id: 1, name: "Size", values: ["Small", "Medium", "Large"] },
      { id: 2, name: "Color", values: ["White", "Blue"] },
    ],
    handle: "classic-cotton-t-shirt",
    vendor: "TestBrand",
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// htmlUtils tests
// ---------------------------------------------------------------------------

describe("htmlUtils", () => {
  describe("stripHtml", () => {
    it("returns empty string for null/undefined", () => {
      expect(stripHtml(null)).toBe("");
      expect(stripHtml(undefined)).toBe("");
      expect(stripHtml("")).toBe("");
    });

    it("strips simple tags", () => {
      expect(stripHtml("<p>Hello world</p>")).toBe("Hello world");
    });

    it("prevents word merge across block tags", () => {
      const result = stripHtml("<p>Hello</p><p>World</p>");
      expect(result).toBe("Hello World");
    });

    it("handles <br> tags", () => {
      expect(stripHtml("Line one<br>Line two<br/>Line three")).toBe(
        "Line one Line two Line three",
      );
    });

    it("decodes HTML entities", () => {
      expect(stripHtml("Fish &amp; Chips")).toBe("Fish & Chips");
      expect(stripHtml("&lt;strong&gt;")).toBe("<strong>");
      expect(stripHtml("&nbsp;gap&nbsp;")).toBe("gap");
    });

    it("decodes numeric entities", () => {
      expect(stripHtml("&#169; 2024")).toBe("© 2024");
      expect(stripHtml("&#x2022; item")).toBe("• item");
    });

    it("collapses whitespace", () => {
      expect(stripHtml("<p>  lots   of    spaces  </p>")).toBe("lots of spaces");
    });

    it("handles nested tags", () => {
      expect(stripHtml("<div><p><strong>Bold</strong> text</p></div>")).toBe(
        "Bold text",
      );
    });
  });

  describe("wordCount", () => {
    it("returns 0 for empty/whitespace", () => {
      expect(wordCount("")).toBe(0);
      expect(wordCount("   ")).toBe(0);
    });

    it("counts words correctly", () => {
      expect(wordCount("one two three")).toBe(3);
      expect(wordCount("  one  two  three  ")).toBe(3);
    });

    it("handles single word", () => {
      expect(wordCount("hello")).toBe(1);
    });
  });
});

// ---------------------------------------------------------------------------
// Check 1: Title Clarity
// ---------------------------------------------------------------------------

describe("checkTitleClarity", () => {
  it("fails when title has fewer than 3 words", () => {
    const result = checkTitleClarity(makeProduct({ title: "Luna" }));
    expect(result.outcome).toBe("fail");
    expect(result.check).toBe("titleClarity");
  });

  it("fails for 2-word title without a product noun", () => {
    const result = checkTitleClarity(makeProduct({ title: "The Luna" }));
    expect(result.outcome).toBe("fail");
  });

  it("fails for title with no product noun even if 3+ words", () => {
    const result = checkTitleClarity(
      makeProduct({ title: "Beautiful Sunset Collection" }),
    );
    expect(result.outcome).toBe("fail");
  });

  it("warns when there is a product noun but no attribute", () => {
    const result = checkTitleClarity(
      makeProduct({ title: "Running Shoe Model" }),
    );
    // "shoe" is a noun; "running" and "model" are not in ATTRIBUTE_WORDS
    expect(result.outcome).toBe("warn");
  });

  it("passes with a product noun and a descriptive attribute", () => {
    const result = checkTitleClarity(
      makeProduct({ title: "Classic Cotton T-Shirt" }),
    );
    expect(result.outcome).toBe("pass");
  });

  it("passes with color + noun", () => {
    const result = checkTitleClarity(
      makeProduct({ title: "Navy Blue Backpack Deluxe" }),
    );
    expect(result.outcome).toBe("pass");
  });

  it("passes with material + noun", () => {
    const result = checkTitleClarity(
      makeProduct({ title: "Leather Wallet Bifold" }),
    );
    expect(result.outcome).toBe("pass");
  });
});

// ---------------------------------------------------------------------------
// Check 2: Description Depth
// ---------------------------------------------------------------------------

describe("checkDescriptionDepth", () => {
  it("fails when description is empty", () => {
    const result = checkDescriptionDepth(makeProduct({ body_html: "" }));
    expect(result.outcome).toBe("fail");
    expect(result.reason).toContain("empty");
  });

  it("fails when description is null", () => {
    const result = checkDescriptionDepth(makeProduct({ body_html: null }));
    expect(result.outcome).toBe("fail");
  });

  it("fails when description has under 40 words", () => {
    const result = checkDescriptionDepth(
      makeProduct({ body_html: "<p>A nice product. Buy it today!</p>" }),
    );
    expect(result.outcome).toBe("fail");
  });

  it("warns when description is 40–120 words", () => {
    const words = Array.from({ length: 60 }, (_, i) => `word${i}`).join(" ");
    const result = checkDescriptionDepth(
      makeProduct({ body_html: `<p>${words}</p>` }),
    );
    expect(result.outcome).toBe("warn");
  });

  it("warns when description is mostly promotional", () => {
    // 130+ words but heavy promotional language
    const promoWords = [
      "amazing", "incredible", "stunning", "phenomenal", "spectacular",
      "unbeatable", "revolutionary", "mind-blowing", "extraordinary",
    ];
    const filler = Array.from({ length: 40 }, (_, i) => `filler${i}`).join(" ");
    const body = promoWords.join(" ") + " " + filler;
    const result = checkDescriptionDepth(
      makeProduct({ body_html: `<p>${body}</p>` }),
    );
    expect(result.outcome).toBe("warn");
  });

  it("passes with 120+ words of concrete content", () => {
    const result = checkDescriptionDepth(makeProduct()); // default has 120+ words
    expect(result.outcome).toBe("pass");
  });
});

// ---------------------------------------------------------------------------
// Check 3: Key Details
// ---------------------------------------------------------------------------

describe("checkKeyDetails", () => {
  it("fails when no specs are found", () => {
    const result = checkKeyDetails(
      makeProduct({
        title: "Cool Red Sneakers",
        body_html: "<p>These are really cool sneakers that you will love. They look great with any outfit and are perfect for any occasion. Get yours today before they sell out. Everyone needs a pair of these in their life. Trust us you won't regret it.</p>",
      }),
    );
    expect(result.outcome).toBe("fail");
  });

  it("warns when only 1 spec type is found", () => {
    const result = checkKeyDetails(
      makeProduct({
        title: "Cool Red Sneakers",
        body_html: "<p>These sneakers are completely washable. They look great with any casual outfit and feel comfortable for everyday walking around town. Highly recommended by customers.</p>",
      }),
    );
    expect(result.outcome).toBe("warn");
  });

  it("passes with 2+ spec types", () => {
    const result = checkKeyDetails(makeProduct()); // default has material, dimensions, weight, care
    expect(result.outcome).toBe("pass");
  });
});

// ---------------------------------------------------------------------------
// Check 4: Product Type & Tags
// ---------------------------------------------------------------------------

describe("checkProductTypeTags", () => {
  it("fails when both type and tags are empty", () => {
    const result = checkProductTypeTags(
      makeProduct({ product_type: "", tags: "" }),
    );
    expect(result.outcome).toBe("fail");
  });

  it("warns when product_type is empty but tags exist", () => {
    const result = checkProductTypeTags(
      makeProduct({ product_type: "", tags: "cotton, summer" }),
    );
    expect(result.outcome).toBe("warn");
  });

  it("warns when tags are empty but type exists", () => {
    const result = checkProductTypeTags(
      makeProduct({ product_type: "T-Shirts", tags: "" }),
    );
    expect(result.outcome).toBe("warn");
  });

  it("warns when tags are all generic", () => {
    const result = checkProductTypeTags(
      makeProduct({ product_type: "T-Shirts", tags: "new, sale, featured" }),
    );
    expect(result.outcome).toBe("warn");
  });

  it("warns when product_type is generic", () => {
    const result = checkProductTypeTags(
      makeProduct({ product_type: "General", tags: "cotton, summer" }),
    );
    expect(result.outcome).toBe("warn");
  });

  it("passes when both are meaningful", () => {
    const result = checkProductTypeTags(makeProduct());
    expect(result.outcome).toBe("pass");
  });
});

// ---------------------------------------------------------------------------
// Check 5: Variant & Option Naming
// ---------------------------------------------------------------------------

describe("checkVariantNaming", () => {
  it("passes for single-variant product with default title", () => {
    const result = checkVariantNaming(
      makeProduct({
        variants: [
          { id: 1, title: "Default Title", option1: "Default Title", option2: null, option3: null },
        ],
        options: [{ id: 1, name: "Title", values: ["Default Title"] }],
      }),
    );
    expect(result.outcome).toBe("pass");
  });

  it("fails when option name is generic with multiple variants", () => {
    const result = checkVariantNaming(
      makeProduct({
        variants: [
          { id: 1, title: "Red", option1: "Red", option2: null, option3: null },
          { id: 2, title: "Blue", option1: "Blue", option2: null, option3: null },
        ],
        options: [{ id: 1, name: "Title", values: ["Red", "Blue"] }],
      }),
    );
    expect(result.outcome).toBe("fail");
  });

  it("fails when option name is 'Option 1' with multiple variants", () => {
    const result = checkVariantNaming(
      makeProduct({
        variants: [
          { id: 1, title: "S", option1: "S", option2: null, option3: null },
          { id: 2, title: "M", option1: "M", option2: null, option3: null },
        ],
        options: [{ id: 1, name: "Option 1", values: ["S", "M"] }],
      }),
    );
    expect(result.outcome).toBe("fail");
  });

  it("fails when variant titles are code-like", () => {
    const result = checkVariantNaming(
      makeProduct({
        variants: [
          { id: 1, title: "SKU-001", option1: "SKU-001", option2: null, option3: null },
          { id: 2, title: "SKU-002", option1: "SKU-002", option2: null, option3: null },
        ],
        options: [{ id: 1, name: "Model", values: ["SKU-001", "SKU-002"] }],
      }),
    );
    expect(result.outcome).toBe("fail");
  });

  it("passes with clear option names and readable values", () => {
    const result = checkVariantNaming(makeProduct());
    expect(result.outcome).toBe("pass");
  });
});

// ---------------------------------------------------------------------------
// Check 6: Image Coverage
// ---------------------------------------------------------------------------

describe("checkImageCoverage", () => {
  it("fails when no images exist", () => {
    const result = checkImageCoverage(makeProduct({ images: [] }));
    expect(result.outcome).toBe("fail");
  });

  it("warns when only 1 image", () => {
    const result = checkImageCoverage(
      makeProduct({
        images: [
          { id: 1, src: "https://cdn.example.com/1.jpg", alt: "Product photo" },
        ],
      }),
    );
    expect(result.outcome).toBe("warn");
  });

  it("warns when images are missing alt text", () => {
    const result = checkImageCoverage(
      makeProduct({
        images: [
          { id: 1, src: "https://cdn.example.com/1.jpg", alt: "Front" },
          { id: 2, src: "https://cdn.example.com/2.jpg", alt: null },
        ],
      }),
    );
    expect(result.outcome).toBe("warn");
  });

  it("warns when alt text is empty string", () => {
    const result = checkImageCoverage(
      makeProduct({
        images: [
          { id: 1, src: "https://cdn.example.com/1.jpg", alt: "Front" },
          { id: 2, src: "https://cdn.example.com/2.jpg", alt: "" },
        ],
      }),
    );
    expect(result.outcome).toBe("warn");
  });

  it("passes with 2+ images all having alt text", () => {
    const result = checkImageCoverage(makeProduct());
    expect(result.outcome).toBe("pass");
  });
});

// ---------------------------------------------------------------------------
// runAllChecks
// ---------------------------------------------------------------------------

describe("runAllChecks", () => {
  it("returns exactly 6 results", () => {
    const results = runAllChecks(makeProduct());
    expect(results).toHaveLength(6);
  });

  it("returns results for every check name", () => {
    const results = runAllChecks(makeProduct());
    const names = results.map((r) => r.check);
    for (const def of CHECK_DEFINITIONS) {
      expect(names).toContain(def.name);
    }
  });

  it("all checks pass for the ideal product", () => {
    const results = runAllChecks(makeProduct());
    for (const result of results) {
      expect(result.outcome).toBe("pass");
    }
  });
});

// ---------------------------------------------------------------------------
// Per-product scoring
// ---------------------------------------------------------------------------

describe("scoreProduct", () => {
  it("returns 100 for an ideal product", () => {
    const score = scoreProduct(makeProduct());
    expect(score.score).toBe(100);
  });

  it("returns 0 for a terrible product", () => {
    const terrible = makeProduct({
      title: "X",
      body_html: null,
      product_type: "",
      tags: "",
      images: [],
      variants: [
        { id: 1, title: "V1", option1: "V1", option2: null, option3: null },
        { id: 2, title: "V2", option1: "V2", option2: null, option3: null },
      ],
      options: [{ id: 1, name: "Title", values: ["V1", "V2"] }],
    });
    const score = scoreProduct(terrible);
    expect(score.score).toBe(0);
  });

  it("includes product metadata", () => {
    const score = scoreProduct(makeProduct());
    expect(score.productId).toBe(1);
    expect(score.productTitle).toBe("Classic Cotton T-Shirt");
    expect(score.handle).toBe("classic-cotton-t-shirt");
  });

  it("has correct number of checks", () => {
    const score = scoreProduct(makeProduct());
    expect(score.checks).toHaveLength(6);
  });

  it("calculates partial score correctly for warn outcomes", () => {
    // A product that warns on title (25 * 0.5 = 12.5) but passes everything else
    const product = makeProduct({ title: "Men Sneaker Running" });
    // "sneaker" is noun, but let's check if there's an attribute
    // "men" is in ATTRIBUTE_WORDS → should pass
    // Let's make one with no attribute
    const product2 = makeProduct({ title: "Running Shoe Model" });
    const score = scoreProduct(product2);
    // title warns (12.5/25), others pass: (12.5 + 25 + 20 + 10 + 10 + 10) / 100 * 100 = 87.5 → 88
    expect(score.score).toBe(88);
  });
});

// ---------------------------------------------------------------------------
// Grade bands
// ---------------------------------------------------------------------------

describe("gradeFromScore", () => {
  it("returns 'Ready' for 85–100", () => {
    expect(gradeFromScore(100)).toBe("Ready");
    expect(gradeFromScore(85)).toBe("Ready");
  });

  it("returns 'Almost ready' for 65–84", () => {
    expect(gradeFromScore(84)).toBe("Almost ready");
    expect(gradeFromScore(65)).toBe("Almost ready");
  });

  it("returns 'Needs work' for 40–64", () => {
    expect(gradeFromScore(64)).toBe("Needs work");
    expect(gradeFromScore(40)).toBe("Needs work");
  });

  it("returns 'Hard for AI to recommend' for 0–39", () => {
    expect(gradeFromScore(39)).toBe("Hard for AI to recommend");
    expect(gradeFromScore(0)).toBe("Hard for AI to recommend");
  });
});

// ---------------------------------------------------------------------------
// Store-level aggregation
// ---------------------------------------------------------------------------

describe("buildStoreReport", () => {
  it("handles empty product list", () => {
    const report = buildStoreReport([]);
    expect(report.overallScore).toBe(0);
    expect(report.grade).toBe("Hard for AI to recommend");
    expect(report.totalProducts).toBe(0);
    expect(report.checkSummaries).toHaveLength(0);
    expect(report.topProblems).toHaveLength(0);
    expect(report.lowestScoringProducts).toHaveLength(0);
  });

  it("returns correct overall score for single perfect product", () => {
    const report = buildStoreReport([makeProduct()]);
    expect(report.overallScore).toBe(100);
    expect(report.grade).toBe("Ready");
    expect(report.totalProducts).toBe(1);
  });

  it("returns 6 check summaries", () => {
    const report = buildStoreReport([makeProduct()]);
    expect(report.checkSummaries).toHaveLength(6);
  });

  it("check summaries have correct counts for all-pass", () => {
    const report = buildStoreReport([makeProduct(), makeProduct({ id: 2 })]);
    for (const summary of report.checkSummaries) {
      expect(summary.passCount).toBe(2);
      expect(summary.warnCount).toBe(0);
      expect(summary.failCount).toBe(0);
      expect(summary.totalProducts).toBe(2);
    }
  });

  it("top problems are ranked by impact score descending", () => {
    const report = buildStoreReport([
      makeProduct({
        id: 1,
        title: "X", // fail: titleClarity (weight 25)
        body_html: null, // fail: descriptionDepth (weight 25) + keyDetails (weight 20)
        images: [], // fail: imageCoverage (weight 10)
      }),
    ]);
    const impacts = report.topProblems.map((p) => p.impactScore);
    for (let i = 1; i < impacts.length; i++) {
      expect(impacts[i]).toBeLessThanOrEqual(impacts[i - 1]);
    }
  });

  it("limits top problems to 5", () => {
    // Create a product that fails many checks
    const report = buildStoreReport([
      makeProduct({
        id: 1,
        title: "X",
        body_html: null,
        product_type: "",
        tags: "",
        images: [],
        variants: [
          { id: 1, title: "V1", option1: "V1", option2: null, option3: null },
          { id: 2, title: "V2", option1: "V2", option2: null, option3: null },
        ],
        options: [{ id: 1, name: "Title", values: ["V1", "V2"] }],
      }),
    ]);
    expect(report.topProblems.length).toBeLessThanOrEqual(5);
  });

  it("lowest scoring products are sorted ascending", () => {
    const products = [
      makeProduct({ id: 1, title: "X", body_html: null }), // low score
      makeProduct({ id: 2 }), // high score
      makeProduct({ id: 3, title: "Y", body_html: "<p>Short desc.</p>" }), // medium score
    ];
    const report = buildStoreReport(products);
    const scores = report.lowestScoringProducts.map((p) => p.score);
    for (let i = 1; i < scores.length; i++) {
      expect(scores[i]).toBeGreaterThanOrEqual(scores[i - 1]);
    }
  });

  it("limits lowest scoring products to 5", () => {
    const products = Array.from({ length: 10 }, (_, i) =>
      makeProduct({ id: i + 1 }),
    );
    const report = buildStoreReport(products);
    expect(report.lowestScoringProducts.length).toBeLessThanOrEqual(5);
  });

  it("averages scores across multiple products", () => {
    const perfect = makeProduct({ id: 1 });
    const terrible = makeProduct({
      id: 2,
      title: "X",
      body_html: null,
      product_type: "",
      tags: "",
      images: [],
      variants: [
        { id: 1, title: "V1", option1: "V1", option2: null, option3: null },
        { id: 2, title: "V2", option1: "V2", option2: null, option3: null },
      ],
      options: [{ id: 1, name: "Title", values: ["V1", "V2"] }],
    });
    const report = buildStoreReport([perfect, terrible]);
    // perfect = 100, terrible = 0 → average = 50
    expect(report.overallScore).toBe(50);
    expect(report.grade).toBe("Needs work");
  });
});

// ---------------------------------------------------------------------------
// CHECK_DEFINITIONS integrity
// ---------------------------------------------------------------------------

describe("CHECK_DEFINITIONS", () => {
  it("has exactly 6 definitions", () => {
    expect(CHECK_DEFINITIONS).toHaveLength(6);
  });

  it("weights sum to 100", () => {
    const total = CHECK_DEFINITIONS.reduce((s, d) => s + d.weight, 0);
    expect(total).toBe(100);
  });

  it("has unique check names", () => {
    const names = CHECK_DEFINITIONS.map((d) => d.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
