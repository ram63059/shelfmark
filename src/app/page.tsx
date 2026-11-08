import { ScanForm } from "@/components/ScanForm";
import { AiAssistantsBanner } from "@/components/AiAssistantsBanner";
import { AutoFixBanner } from "@/components/AutoFixBanner";
import {
  AlertTriangle,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  FileText,
  Tag,
  Sliders,
  Image as ImageIcon,
  Check,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-grid-pattern">
      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-7xl h-[600px] overflow-hidden opacity-30 dark:opacity-20"
        aria-hidden="true"
      >
        <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] rounded-full bg-emerald-500/20 blur-[120px]" />
        <div className="absolute top-[-10%] right-[20%] w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-[120px]" />
      </div>

      <div className="relative space-y-24 sm:space-y-32 py-12 sm:py-20">
        {/* 1. Hero Section */}
        <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            {/* AI Assistant Icons Banner */}
            <div className="animate-float">
              <AiAssistantsBanner />
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink leading-[1.12]">
                See your store the way{" "}
                <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
                  AI shopping assistants
                </span>{" "}
                do.
              </h1>
              <p className="text-lg sm:text-xl text-muted leading-relaxed prose-width mx-auto font-normal">
                ChatGPT, Microsoft Copilot, and Google AI Mode can now recommend
                Shopify products directly to buyers. They recommend the ones
                they understand. Get your free store readiness score in 60
                seconds.
              </p>
            </div>

            {/* Scan Form Input */}
            <div className="pt-2">
              <ScanForm />
            </div>
          </div>

          {/* 2. Realistic "What AI Sees" Showcase */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-surface border border-line text-muted shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-brand" aria-hidden="true" />
                Live Diagnostic Sample &bull; Northfield Supply Co. (Demo)
              </span>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden border border-line shadow-2xl">
              {/* Card top bar */}
              <div className="px-5 sm:px-6 py-3.5 bg-surface/90 border-b border-line flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-fail/80"></span>
                  <span className="text-sm font-semibold text-ink">
                    Heritage Waxed Canvas Field Jacket
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-warn-bg text-warn border border-warn/30 font-semibold tabular-nums">
                    Score: 42 / 100
                  </span>
                </div>
              </div>

              {/* Two Column Diagnostic */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-line">
                {/* Left: What Shoppers See */}
                <div className="p-6 sm:p-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted uppercase tracking-wider">
                      What shoppers see
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-pass-bg text-pass font-medium">
                      High visual appeal
                    </span>
                  </div>

                  <div className="rounded-xl border border-line p-4 bg-surface/60 space-y-3">
                    {/* Visual mockup of the jacket */}
                    <div className="relative h-44 rounded-lg bg-gradient-to-br from-amber-950/20 via-stone-900/30 to-emerald-950/20 border border-line flex flex-col items-center justify-center overflow-hidden">
                      <div className="w-16 h-16 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center mb-2">
                        <Tag className="w-7 h-7 text-brand" aria-hidden="true" />
                      </div>
                      <span className="text-xs font-medium text-ink">
                        Waxed Field Jacket
                      </span>
                      <span className="text-[11px] text-muted">
                        Olive Drab &bull; 4 Photos &bull; In Stock
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-ink text-sm">
                          The Heritage Waxed Jacket
                        </p>
                        <p className="text-sm font-semibold text-ink">$285.00</p>
                      </div>
                      <p className="text-xs text-muted leading-relaxed line-clamp-3">
                        &ldquo;An iconic, timeless companion for your daily
                        adventures. Handcrafted with unmatched passion and rugged
                        charm. The pinnacle of craftsmanship for discerning
                        explorers.&rdquo;
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-muted leading-relaxed">
                    Shoppers appreciate the romance copy, but language models
                    find zero factual attributes to answer buyer queries.
                  </p>
                </div>

                {/* Right: What AI Reads */}
                <div className="p-6 sm:p-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted uppercase tracking-wider">
                      What an AI assistant reads
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-fail-bg text-fail font-medium">
                      Omitted specifications
                    </span>
                  </div>

                  <div className="rounded-xl border border-line bg-surface/40 divide-y divide-line text-xs">
                    <div className="flex items-center justify-between py-2.5 px-3.5">
                      <span className="font-medium text-muted">Product Type</span>
                      <span className="text-ink font-semibold">Apparel</span>
                    </div>

                    <div className="flex items-start justify-between py-2.5 px-3.5 gap-2">
                      <span className="font-medium text-muted shrink-0">Material</span>
                      <span className="text-fail font-semibold text-right flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        Missing (wax weight & cotton oz omitted)
                      </span>
                    </div>

                    <div className="flex items-start justify-between py-2.5 px-3.5 gap-2">
                      <span className="font-medium text-muted shrink-0">Sizing & Fit</span>
                      <span className="text-fail font-semibold text-right flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        Missing (no chest or sleeve inches)
                      </span>
                    </div>

                    <div className="flex items-start justify-between py-2.5 px-3.5 gap-2">
                      <span className="font-medium text-muted shrink-0">Waterproof Rating</span>
                      <span className="text-fail font-semibold text-right flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        Missing (omitted from feed)
                      </span>
                    </div>

                    <div className="flex items-start justify-between py-2.5 px-3.5 gap-2">
                      <span className="font-medium text-muted shrink-0">Care Guide</span>
                      <span className="text-fail font-semibold text-right flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        Missing (re-waxing steps omitted)
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-fail-bg/40 border border-fail/20 text-xs text-ink space-y-1">
                    <p className="font-semibold text-fail">
                      Assistant Recommendation Failure:
                    </p>
                    <p className="text-muted leading-relaxed">
                      When a shopper asks &ldquo;recommend a water-resistant waxed
                      jacket for 40&deg;F weather,&rdquo; ChatGPT bypasses this
                      listing because temperature and fabric specs are missing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. High-Impact Auto-Fix Feature Card */}
        <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <AutoFixBanner />
        </section>

        {/* 4. What We Check Grid */}
        <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold text-brand uppercase tracking-wider">
              Transparent Heuristics
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink mt-1">
              The 6 signals AI shopping models evaluate
            </h2>
            <p className="mt-2 text-base text-muted">
              We inspect public feeds deterministically against the exact data
              structures conversational search engines use to answer buyer prompts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Check 1 */}
            <div className="glass-panel p-6 rounded-2xl border border-line space-y-3 hover:border-line-strong transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <FileText className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-surface border border-line text-muted">
                  Weight: 25%
                </span>
              </div>
              <h3 className="text-lg font-bold text-ink">Title clarity</h3>
              <p className="text-sm text-muted leading-relaxed">
                Requires a concrete product noun plus descriptive attributes
                (material, color, audience). Creative names without nouns fail.
              </p>
            </div>

            {/* Check 2 */}
            <div className="glass-panel p-6 rounded-2xl border border-line space-y-3 hover:border-line-strong transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500">
                  <Layers className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-surface border border-line text-muted">
                  Weight: 25%
                </span>
              </div>
              <h3 className="text-lg font-bold text-ink">Description depth</h3>
              <p className="text-sm text-muted leading-relaxed">
                Strips HTML and verifies 120+ words of factual content. Flags thin
                copy and heavy promotional fluff with few concrete facts.
              </p>
            </div>

            {/* Check 3 */}
            <div className="glass-panel p-6 rounded-2xl border border-line space-y-3 hover:border-line-strong transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                  <Shield className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-surface border border-line text-muted">
                  Weight: 20%
                </span>
              </div>
              <h3 className="text-lg font-bold text-ink">Key details present</h3>
              <p className="text-sm text-muted leading-relaxed">
                Inspects for concrete specs: materials, dimensions, weight,
                ingredients, compatibility, and care instructions.
              </p>
            </div>

            {/* Check 4 */}
            <div className="glass-panel p-6 rounded-2xl border border-line space-y-3 hover:border-line-strong transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                  <Tag className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-surface border border-line text-muted">
                  Weight: 10%
                </span>
              </div>
              <h3 className="text-lg font-bold text-ink">Product type & tags</h3>
              <p className="text-sm text-muted leading-relaxed">
                Ensures standard taxonomy classification and 3+ meaningful tags
                for AI search ontology mapping.
              </p>
            </div>

            {/* Check 5 */}
            <div className="glass-panel p-6 rounded-2xl border border-line space-y-3 hover:border-line-strong transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <Sliders className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-surface border border-line text-muted">
                  Weight: 10%
                </span>
              </div>
              <h3 className="text-lg font-bold text-ink">Variant & option naming</h3>
              <p className="text-sm text-muted leading-relaxed">
                Flags default &ldquo;Title&rdquo; or &ldquo;Option 1&rdquo; and SKU codes so
                AI models can verify size/color availability.
              </p>
            </div>

            {/* Check 6 */}
            <div className="glass-panel p-6 rounded-2xl border border-line space-y-3 hover:border-line-strong transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                  <ImageIcon className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-surface border border-line text-muted">
                  Weight: 10%
                </span>
              </div>
              <h3 className="text-lg font-bold text-ink">Image coverage</h3>
              <p className="text-sm text-muted leading-relaxed">
                Requires multiple photos and descriptive alternative text so
                multimodal AI engines can verify product appearance.
              </p>
            </div>
          </div>

          <div className="mt-6 text-right">
            <Link
              href="/methodology"
              className="text-sm font-semibold text-brand hover:underline inline-flex items-center gap-1.5"
            >
              Explore our complete scoring methodology
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* 5. How It Works */}
        <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold text-brand uppercase tracking-wider">
              Zero Friction
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink mt-1">
              Three steps to catalog readiness
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel rounded-2xl p-7 border border-line space-y-4">
              <span className="text-2xl font-black text-brand tabular-nums">
                01
              </span>
              <h3 className="text-lg font-bold text-ink">Enter your store URL</h3>
              <p className="text-sm text-muted leading-relaxed">
                Paste your store domain or .myshopify.com address. No accounts,
                passwords, or app installs required.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-7 border border-line space-y-4">
              <span className="text-2xl font-black text-brand tabular-nums">
                02
              </span>
              <h3 className="text-lg font-bold text-ink">
                We audit public feeds
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Our bot reads the public product listings feed that search
                engines and AI bots crawl, scanning up to 1,000 items.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-7 border border-line space-y-4">
              <span className="text-2xl font-black text-brand tabular-nums">
                03
              </span>
              <h3 className="text-lg font-bold text-ink">
                Receive prioritized fixes
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Get your 0–100 Shelfmark score, ranked priority fixes, and
                side-by-side diagnostic views of your weakest listings.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Why This Matters Now Callout */}
        <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-brand/20 relative overflow-hidden">
            <div className="max-w-3xl space-y-4">
              <span className="text-xs font-bold text-brand uppercase tracking-wider">
                The Shift in E-Commerce
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
                Why product data completeness is the new SEO
              </h2>
              <p className="text-sm sm:text-base text-muted leading-relaxed">
                Shoppers no longer just type keywords into search boxes. They ask
                conversational questions: &ldquo;find me a breathable organic
                cotton running shirt with thumbholes under $50.&rdquo;
              </p>
              <p className="text-sm sm:text-base text-muted leading-relaxed">
                If your listings lack materials, measurements, or concrete specs,
                AI assistants cannot confirm that your product satisfies the
                buyer&rsquo;s request. Complete product specifications are the single
                strongest ranking factor in AI commerce.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
