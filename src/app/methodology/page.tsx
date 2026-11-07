import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How the Shelfmark AI Shopping Readiness Score works: every check, rule, weight, and signal explained.",
};

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-[800px] px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to home
      </Link>

      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink">
          Scoring Methodology
        </h1>
        <p className="text-base text-muted leading-relaxed">
          The Shelfmark AI Shopping Readiness Score (0&ndash;100) measures how
          reliably AI shopping assistants (ChatGPT Search, Microsoft Copilot,
          Google AI Mode) can parse, comprehend, and recommend your Shopify
          store&rsquo;s products.
        </p>
      </div>

      <div className="space-y-12 divide-y divide-line">
        {/* Check 1 */}
        <div className="pt-8 space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-bold text-ink">1. Title clarity</h2>
            <span className="text-sm font-semibold tabular-nums text-muted">
              Weight: 25%
            </span>
          </div>
          <p className="text-sm text-muted leading-relaxed">
            AI language models use product titles as primary semantic anchors.
            When a shopper asks for a &ldquo;navy blue merino wool cardigan,&rdquo;
            titles with clear nouns and attributes match directly.
          </p>
          <div className="bg-mist border border-line rounded-lg p-4 space-y-2 text-xs">
            <p>
              <strong className="text-fail font-semibold">Fail:</strong> Title
              has fewer than 3 words, or contains only a brand/creative name with
              no product noun (e.g. &ldquo;The Luna&rdquo;).
            </p>
            <p>
              <strong className="text-warn font-semibold">Warn:</strong> Product
              noun is present, but lacks descriptive attributes (material, color,
              size, or audience).
            </p>
            <p>
              <strong className="text-pass font-semibold">Pass:</strong> Clearly
              names what the item is and includes at least one descriptive
              attribute.
            </p>
          </div>
        </div>

        {/* Check 2 */}
        <div className="pt-8 space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-bold text-ink">
              2. Description depth
            </h2>
            <span className="text-sm font-semibold tabular-nums text-muted">
              Weight: 25%
            </span>
          </div>
          <p className="text-sm text-muted leading-relaxed">
            AI shopping agents answer detailed customer inquiries using product
            descriptions. Vague marketing fluff offers zero facts for an AI to
            cite.
          </p>
          <div className="bg-mist border border-line rounded-lg p-4 space-y-2 text-xs">
            <p>
              <strong className="text-fail font-semibold">Fail:</strong> Empty,
              missing, or under 40 plain-text words.
            </p>
            <p>
              <strong className="text-warn font-semibold">Warn:</strong> 40 to
              120 words, or heavy promotional adjectives (&ldquo;stunning,
              revolutionary, must-have&rdquo;) with few concrete facts.
            </p>
            <p>
              <strong className="text-pass font-semibold">Pass:</strong> Over 120
              words containing concrete facts, use cases, and specifications.
            </p>
          </div>
        </div>

        {/* Check 3 */}
        <div className="pt-8 space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-bold text-ink">
              3. Key details present
            </h2>
            <span className="text-sm font-semibold tabular-nums text-muted">
              Weight: 20%
            </span>
          </div>
          <p className="text-sm text-muted leading-relaxed">
            Inspects the title and description for concrete specification
            categories: materials, dimensions/size, weight, ingredients,
            compatibility, and care instructions.
          </p>
          <div className="bg-mist border border-line rounded-lg p-4 space-y-2 text-xs">
            <p>
              <strong className="text-fail font-semibold">Fail:</strong> Zero
              concrete specification types detected.
            </p>
            <p>
              <strong className="text-warn font-semibold">Warn:</strong> Only one
              specification type found.
            </p>
            <p>
              <strong className="text-pass font-semibold">Pass:</strong> Two or
              more specification categories explicitly documented.
            </p>
          </div>
        </div>

        {/* Check 4 */}
        <div className="pt-8 space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-bold text-ink">
              4. Product type & tags
            </h2>
            <span className="text-sm font-semibold tabular-nums text-muted">
              Weight: 10%
            </span>
          </div>
          <p className="text-sm text-muted leading-relaxed">
            Taxonomy classification helps search agents organize catalogs into
            standard commerce ontologies.
          </p>
          <div className="bg-mist border border-line rounded-lg p-4 space-y-2 text-xs">
            <p>
              <strong className="text-fail font-semibold">Fail:</strong> Both
              product_type and tags are completely empty.
            </p>
            <p>
              <strong className="text-warn font-semibold">Warn:</strong> Either
              type or tags is missing, or uses generic tags like &ldquo;sale&rdquo;
              or &ldquo;featured&rdquo;.
            </p>
            <p>
              <strong className="text-pass font-semibold">Pass:</strong> Both a
              standard product type and meaningful descriptive tags are present.
            </p>
          </div>
        </div>

        {/* Check 5 */}
        <div className="pt-8 space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-bold text-ink">
              5. Variant & option naming
            </h2>
            <span className="text-sm font-semibold tabular-nums text-muted">
              Weight: 10%
            </span>
          </div>
          <p className="text-sm text-muted leading-relaxed">
            Shoppers ask AI models to verify size and color availability. Generic
            labels break multi-attribute queries.
          </p>
          <div className="bg-mist border border-line rounded-lg p-4 space-y-2 text-xs">
            <p>
              <strong className="text-fail font-semibold">Fail:</strong> Generic
              option names like &ldquo;Option 1&rdquo; with multiple variants, or
              titles consisting solely of cryptic SKU codes.
            </p>
            <p>
              <strong className="text-pass font-semibold">Pass:</strong> Legible
              option headers (e.g. Size, Color, Volume) and human-readable
              values.
            </p>
          </div>
        </div>

        {/* Check 6 */}
        <div className="pt-8 space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-bold text-ink">6. Image coverage</h2>
            <span className="text-sm font-semibold tabular-nums text-muted">
              Weight: 10%
            </span>
          </div>
          <p className="text-sm text-muted leading-relaxed">
            Visual AI models cross-reference text with product imagery and
            alternative text descriptions.
          </p>
          <div className="bg-mist border border-line rounded-lg p-4 space-y-2 text-xs">
            <p>
              <strong className="text-fail font-semibold">Fail:</strong> No
              product images in the public feed.
            </p>
            <p>
              <strong className="text-warn font-semibold">Warn:</strong> Only a
              single image, or images missing alternative text.
            </p>
            <p>
              <strong className="text-pass font-semibold">Pass:</strong> Two or
              more images with descriptive alt text.
            </p>
          </div>
        </div>
      </div>

      {/* What we do NOT measure */}
      <div className="pt-8 border-t border-line space-y-4">
        <h2 className="text-xl font-bold text-ink">What we do not measure</h2>
        <p className="text-sm text-muted leading-relaxed prose-width">
          Shelfmark reads only public product feed data. We cannot and do not
          measure:
        </p>
        <ul className="list-disc list-inside text-sm text-muted space-y-1.5 prose-width">
          <li>Private store sales figures or revenue data</li>
          <li>Conversion rates or advertising performance</li>
          <li>Customer reviews, ratings, or third-party app widgets</li>
          <li>Unpublished draft products or password-protected pages</li>
        </ul>
        <p className="text-sm text-muted leading-relaxed prose-width pt-2">
          If a field is not exposed in your public store feed, our audit marks
          it not visible rather than penalizing your score.
        </p>
      </div>
    </div>
  );
}
