import { ScanForm } from "@/components/ScanForm";
import { WaitlistForm } from "@/components/WaitlistForm";
import { AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-24 sm:space-y-32 py-12 sm:py-20">
      {/* Hero Section */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink leading-[1.1]">
            See your store the way AI shopping assistants do.
          </h1>
          <p className="text-lg sm:text-xl text-muted leading-relaxed prose-width mx-auto">
            ChatGPT, Copilot and Google AI Mode can now recommend Shopify
            products. They recommend the ones they understand. Get a free
            readiness score for your store in under a minute.
          </p>

          <div className="pt-4">
            <ScanForm />
          </div>
        </div>

        {/* Static demo of "What AI sees" */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Live sample output &mdash; Northfield Supply Co. (Demo)
            </span>
          </div>

          <div className="border border-line rounded-xl overflow-hidden shadow-sm bg-paper">
            <div className="px-4 sm:px-6 py-3 bg-mist border-b border-line flex items-center justify-between">
              <span className="text-sm font-medium text-ink">
                Waxed Canvas Field Jacket
              </span>
              <span className="text-xs tabular-nums text-muted">
                Score: 42/100
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-line">
              {/* Shopper view */}
              <div className="p-6">
                <h2 className="text-xs font-medium text-muted uppercase tracking-wide mb-4">
                  What shoppers see
                </h2>
                <div className="border border-line rounded-lg p-4 bg-mist/40 space-y-3">
                  <div className="h-40 bg-mist rounded flex items-center justify-center text-muted text-xs font-medium">
                    [Product Photo: Waxed Jacket]
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-ink text-sm">
                      The Heritage Waxed Jacket
                    </p>
                    <p className="text-xs text-muted">$285.00</p>
                    <p className="text-xs text-muted leading-relaxed pt-1">
                      An iconic timeless companion for your daily adventures.
                      Handcrafted with unmatched passion and rugged charm for
                      every season.
                    </p>
                  </div>
                </div>
              </div>

              {/* AI view */}
              <div className="p-6 space-y-1">
                <h2 className="text-xs font-medium text-muted uppercase tracking-wide mb-4">
                  What an AI assistant reads
                </h2>
                <div className="divide-y divide-line text-xs">
                  <div className="flex py-2">
                    <span className="w-32 font-medium text-muted">Product Type</span>
                    <span className="text-ink">Apparel</span>
                  </div>
                  <div className="flex py-2">
                    <span className="w-32 font-medium text-muted">Material</span>
                    <span className="text-fail/80 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                      Missing (wax weight / cotton ounces omitted)
                    </span>
                  </div>
                  <div className="flex py-2">
                    <span className="w-32 font-medium text-muted">Sizing & Fit</span>
                    <span className="text-fail/80 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                      Missing (no chest or sleeve measurements)
                    </span>
                  </div>
                  <div className="flex py-2">
                    <span className="w-32 font-medium text-muted">Water Resistance</span>
                    <span className="text-fail/80 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                      Missing (spec not stated in feed)
                    </span>
                  </div>
                  <div className="flex py-2">
                    <span className="w-32 font-medium text-muted">Care Guide</span>
                    <span className="text-fail/80 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                      Missing (re-waxing guidance omitted)
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-muted pt-3 leading-normal">
                  Result: AI assistants cannot verify water resistance, warmth,
                  or exact dimensions, causing them to recommend competitor
                  jackets with complete spec sheets instead.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What we check */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            What we check
          </h2>
          <p className="mt-2 text-base text-muted">
            Six deterministic signals weighted by how heavily AI language
            models depend on them to answer buyer queries.
          </p>
        </div>

        <div className="table-scroll border border-line rounded-xl bg-paper">
          <table className="w-full text-left text-sm">
            <thead className="bg-mist border-b border-line text-xs font-medium text-muted">
              <tr>
                <th className="py-3 px-6">Signal</th>
                <th className="py-3 px-6">What we inspect</th>
                <th className="py-3 px-6 text-right w-20">Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              <tr>
                <td className="py-4 px-6 font-medium text-ink">Title clarity</td>
                <td className="py-4 px-6 text-muted">
                  States the concrete product noun plus descriptive attributes
                  (material, color, audience).
                </td>
                <td className="py-4 px-6 text-right tabular-nums text-muted">25%</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-medium text-ink">Description depth</td>
                <td className="py-4 px-6 text-muted">
                  At least 120 words of factual information rather than thin
                  promotional filler.
                </td>
                <td className="py-4 px-6 text-right tabular-nums text-muted">25%</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-medium text-ink">Key details present</td>
                <td className="py-4 px-6 text-muted">
                  Concrete specifications including materials, dimensions,
                  weight, compatibility, and care.
                </td>
                <td className="py-4 px-6 text-right tabular-nums text-muted">20%</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-medium text-ink">Product type & tags</td>
                <td className="py-4 px-6 text-muted">
                  Standard category classification and meaningful tags for AI
                  hierarchy mapping.
                </td>
                <td className="py-4 px-6 text-right tabular-nums text-muted">10%</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-medium text-ink">Variant & option naming</td>
                <td className="py-4 px-6 text-muted">
                  Clear, human-readable option keys (Size, Color) rather than
                  internal SKUs or default titles.
                </td>
                <td className="py-4 px-6 text-right tabular-nums text-muted">10%</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-medium text-ink">Image coverage</td>
                <td className="py-4 px-6 text-muted">
                  Multiple photos per item and descriptive alt text explaining
                  appearance and details.
                </td>
                <td className="py-4 px-6 text-right tabular-nums text-muted">10%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-right">
          <Link
            href="/methodology"
            className="text-sm font-medium text-brand hover:underline inline-flex items-center gap-1"
          >
            Read our full scoring methodology
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            How it works
          </h2>
          <p className="mt-2 text-base text-muted">
            Fast, non-invasive auditing without giving away store passwords or
            private data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border border-line rounded-xl p-6 bg-paper space-y-3">
            <span className="text-xs font-bold text-brand uppercase tracking-wider">
              Step 01
            </span>
            <h3 className="text-lg font-semibold text-ink">Paste your store URL</h3>
            <p className="text-sm text-muted leading-relaxed">
              Enter your public domain or .myshopify.com address. No accounts,
              no logins, and no app installs required.
            </p>
          </div>

          <div className="border border-line rounded-xl p-6 bg-paper space-y-3">
            <span className="text-xs font-bold text-brand uppercase tracking-wider">
              Step 02
            </span>
            <h3 className="text-lg font-semibold text-ink">
              We read your public listings
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              We inspect the public products feed that search engines and AI
              web crawlers consume, scanning up to 1,000 items.
            </p>
          </div>

          <div className="border border-line rounded-xl p-6 bg-paper space-y-3">
            <span className="text-xs font-bold text-brand uppercase tracking-wider">
              Step 03
            </span>
            <h3 className="text-lg font-semibold text-ink">
              Get a prioritized fix list
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Receive your 0–100 Shelfmark score, ranked problems, and exact
              listings that need titles and descriptions updated.
            </p>
          </div>
        </div>
      </section>

      {/* Why this matters now */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="bg-mist border border-line rounded-2xl p-8 sm:p-12 max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Why this matters now
          </h2>
          <p className="text-base text-muted leading-relaxed prose-width">
            AI shopping assistants recommend products by answering conversational
            questions like &ldquo;find me a breathable organic cotton running shirt
            under $50.&rdquo; If your listings lack materials, dimensions, or
            concrete facts, language models cannot match your products to the
            shopper&rsquo;s requirements.
          </p>
          <p className="text-base text-muted leading-relaxed prose-width">
            Complete, structured product descriptions directly increase your
            visibility in ChatGPT, Microsoft Copilot, and Google AI Mode.
          </p>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Want this fixed automatically?
          </h2>
          <p className="text-sm sm:text-base text-muted leading-relaxed">
            We are building a Shopify app that generates factual, high-clarity
            rewrites for your weak listings so you can review and publish them
            in one click. Get notified when it launches.
          </p>
          <div className="pt-4 flex justify-center">
            <WaitlistForm />
          </div>
        </div>
      </section>
    </div>
  );
}
