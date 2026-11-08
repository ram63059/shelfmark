import { ScanForm } from "@/components/ScanForm";
import { AiAssistantsBanner } from "@/components/AiAssistantsBanner";
import { AutoFixBanner } from "@/components/AutoFixBanner";
import { InteractiveChatPreview } from "@/components/InteractiveChatPreview";
import { BentoGrid } from "@/components/BentoGrid";
import { FaqSection } from "@/components/FaqSection";
import {
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Tag,
  Zap,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-grid-pattern selection:bg-brand selection:text-white">
      {/* Ambient background glowing orbs */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-7xl h-[700px] overflow-hidden opacity-30 dark:opacity-25"
        aria-hidden="true"
      >
        <div className="absolute top-[-15%] left-[20%] w-[550px] h-[550px] rounded-full bg-emerald-500/25 blur-[140px]" />
        <div className="absolute top-[-10%] right-[15%] w-[500px] h-[500px] rounded-full bg-cyan-500/20 blur-[140px]" />
      </div>

      <div className="relative space-y-28 sm:space-y-36 py-12 sm:py-24">
        {/* ─── 1. Hero Section ─── */}
        <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Top Pill Beacon */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-brand/30 text-xs font-semibold tracking-wide text-ink shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-brand animate-ping" />
              <span className="text-brand font-bold">NEW IN 2026</span>
              <span className="text-muted">&bull;</span>
              <span>ChatGPT, Copilot &amp; Gemini Now Recommend Shopify Products</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-ink leading-[1.1]">
                See your store the way{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  AI shopping assistants
                </span>{" "}
                do.
              </h1>
              <p className="text-lg sm:text-xl text-muted leading-relaxed max-w-2xl mx-auto font-normal">
                AI search engines don&rsquo;t read pictures. They recommend the
                products whose feeds have concrete specifications. Get your free
                readiness score in 60 seconds.
              </p>
            </div>

            {/* AI Assistant Icons & Status */}
            <div className="pt-1">
              <AiAssistantsBanner />
            </div>

            {/* Scan Form Input Box */}
            <div className="pt-4">
              <ScanForm />
            </div>
          </div>
        </section>

        {/* ─── 2. Interactive AI Decision Simulator ─── */}
        <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <span className="text-xs font-bold text-brand uppercase tracking-wider">
              Live Query Simulation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
              Why AI assistants recommend your competitors
            </h2>
            <p className="text-sm text-muted">
              Here is what happens when a shopper asks conversational AI for a product recommendation:
            </p>
          </div>

          <InteractiveChatPreview />
        </section>

        {/* ─── 3. ⭐ PROMINENT AUTO-FIX FEATURE CARD ⭐ ─── */}
        <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <AutoFixBanner />
        </section>

        {/* ─── 4. The "What AI Sees" Live Spec Sheet Showcase ─── */}
        <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold text-brand uppercase tracking-wider">
              Before &amp; After Diagnostic
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
              What shoppers see vs. what AI reads
            </h2>
            <p className="text-sm text-muted">
              Romance marketing copy looks great on a screen, but leaves AI models with zero structured facts to cite.
            </p>
          </div>

          <div className="glass-panel rounded-3xl overflow-hidden border border-line shadow-2xl max-w-4xl mx-auto">
            {/* Card top bar */}
            <div className="px-6 py-4 bg-surface/90 border-b border-line flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-fail"></span>
                <span className="text-sm font-bold text-ink">
                  Heritage Waxed Canvas Field Jacket
                </span>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-warn-bg text-warn border border-warn/30 font-bold tabular-nums">
                Score: 42 / 100 &bull; Needs Work
              </span>
            </div>

            {/* Two Column Diagnostic */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-line">
              {/* Left: What Shoppers See */}
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted uppercase tracking-wider">
                    Storefront Appearance
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-pass-bg text-pass font-semibold">
                    Visually complete
                  </span>
                </div>

                <div className="rounded-2xl border border-line p-5 bg-surface/60 space-y-4">
                  {/* Visual mockup of the jacket */}
                  <div className="relative h-44 rounded-xl bg-gradient-to-br from-amber-950/20 via-stone-900/40 to-emerald-950/20 border border-line flex flex-col items-center justify-center overflow-hidden">
                    <div className="w-16 h-16 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center mb-2 shadow-inner">
                      <Tag className="w-7 h-7 text-brand" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-bold text-ink">
                      Waxed Field Jacket
                    </span>
                    <span className="text-[11px] text-muted">
                      Olive Drab &bull; 4 Photos &bull; In Stock
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-extrabold text-ink text-sm">
                        The Heritage Waxed Jacket
                      </p>
                      <p className="text-sm font-bold text-ink">$285.00</p>
                    </div>
                    <p className="text-xs text-muted leading-relaxed line-clamp-3">
                      &ldquo;An iconic, timeless companion for your daily adventures. Handcrafted with unmatched passion and rugged charm for discerning explorers.&rdquo;
                    </p>
                  </div>
                </div>

                <p className="text-xs text-muted leading-relaxed">
                  Notice that while the photo and emotional copy appeal to humans, no concrete specifications are provided.
                </p>
              </div>

              {/* Right: What AI Reads */}
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted uppercase tracking-wider">
                    AI Assistant Extracted Spec Sheet
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-fail-bg text-fail font-semibold">
                    Critical gaps
                  </span>
                </div>

                <div className="rounded-2xl border border-line bg-surface/40 divide-y divide-line text-xs">
                  <div className="flex items-center justify-between py-2.5 px-4">
                    <span className="font-semibold text-muted">Product Type</span>
                    <span className="text-ink font-bold">Apparel</span>
                  </div>

                  <div className="flex items-start justify-between py-2.5 px-4 gap-2">
                    <span className="font-semibold text-muted shrink-0">Material</span>
                    <span className="text-fail font-bold text-right flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      Missing (wax oz omitted)
                    </span>
                  </div>

                  <div className="flex items-start justify-between py-2.5 px-4 gap-2">
                    <span className="font-semibold text-muted shrink-0">Sizing &amp; Fit</span>
                    <span className="text-fail font-bold text-right flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      Missing (no chest/sleeve specs)
                    </span>
                  </div>

                  <div className="flex items-start justify-between py-2.5 px-4 gap-2">
                    <span className="font-semibold text-muted shrink-0">Waterproof Rating</span>
                    <span className="text-fail font-bold text-right flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      Missing (unverified)
                    </span>
                  </div>

                  <div className="flex items-start justify-between py-2.5 px-4 gap-2">
                    <span className="font-semibold text-muted shrink-0">Care Guide</span>
                    <span className="text-fail font-bold text-right flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      Missing (re-waxing steps omitted)
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-fail-bg/30 border border-fail/20 text-xs text-ink space-y-1">
                  <p className="font-bold text-fail">
                    Recommendation Failure:
                  </p>
                  <p className="text-muted leading-relaxed">
                    AI models cannot answer &ldquo;is this jacket waterproof?&rdquo; with confidence, so they recommend a competitor brand whose feed states exact waterproof ratings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 5. Bento Grid of 6 Heuristics ─── */}
        <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-brand uppercase tracking-wider">
              Scoring Pillars
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-ink">
              The 6 signals AI shopping models evaluate
            </h2>
            <p className="text-sm sm:text-base text-muted">
              Every signal is deterministic, rule-based, and weighted by its importance to AI recommendation confidence.
            </p>
          </div>

          <BentoGrid />

          <div className="text-right pt-2">
            <Link
              href="/methodology"
              className="text-sm font-bold text-brand hover:underline inline-flex items-center gap-1.5"
            >
              Read full mathematical methodology &amp; weights
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* ─── 6. Three Plain Steps ─── */}
        <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-brand uppercase tracking-wider">
              Zero Install
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
              How Shelfmark works
            </h2>
            <p className="text-sm text-muted">
              Get an instant audit without sharing store passwords or modifying code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel rounded-3xl p-8 border border-line space-y-4 shadow-sm hover:border-line-strong transition-all">
              <span className="w-10 h-10 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-black text-lg">
                1
              </span>
              <h3 className="text-lg font-bold text-ink">Paste your store URL</h3>
              <p className="text-sm text-muted leading-relaxed">
                Enter your public domain or .myshopify.com address. No accounts,
                credit cards, or admin passwords required.
              </p>
            </div>

            <div className="glass-panel rounded-3xl p-8 border border-line space-y-4 shadow-sm hover:border-line-strong transition-all">
              <span className="w-10 h-10 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-black text-lg">
                2
              </span>
              <h3 className="text-lg font-bold text-ink">
                We inspect public feeds
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Our bot reads the public product listings feed that search engines
                and AI crawlers read, auditing up to 1,000 items.
              </p>
            </div>

            <div className="glass-panel rounded-3xl p-8 border border-line space-y-4 shadow-sm hover:border-line-strong transition-all">
              <span className="w-10 h-10 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-black text-lg">
                3
              </span>
              <h3 className="text-lg font-bold text-ink">
                Receive prioritized fixes
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Get your 0–100 score, ranked problem list, and side-by-side
                visual comparisons of your weakest listings.
              </p>
            </div>
          </div>
        </section>

        {/* ─── 7. Interactive FAQ ─── */}
        <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-brand uppercase tracking-wider">
              Answers For Merchants
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
              Frequently asked questions
            </h2>
            <p className="text-sm text-muted">
              Everything you need to know about AI shopping readiness and data privacy.
            </p>
          </div>

          <FaqSection />
        </section>

        {/* ─── 8. Bottom Action Banner ─── */}
        <section className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-3xl p-8 sm:p-14 border border-brand/30 text-center space-y-6 relative overflow-hidden shadow-2xl">
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10"
              aria-hidden="true"
            />

            <div className="relative z-10 space-y-3 max-w-xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-ink">
                Ready to see what AI sees?
              </h2>
              <p className="text-sm sm:text-base text-muted">
                Audit your Shopify store in 60 seconds. Free forever, no signup required.
              </p>
            </div>

            <div className="relative z-10 pt-2">
              <ScanForm />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
