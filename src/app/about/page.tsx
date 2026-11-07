import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Database, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Shelfmark: our mission, how we handle store data, and our privacy commitments.",
};

export default function AboutPage() {
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
          About Shelfmark
        </h1>
        <p className="text-lg text-muted leading-relaxed prose-width">
          Shelfmark is an independent e-commerce intelligence utility built to
          help independent Shopify merchants thrive as AI assistants transform
          product search.
        </p>
      </div>

      <div className="space-y-6 text-sm text-muted leading-relaxed prose-width">
        <p>
          Since March 2026, major conversational assistants &mdash; including
          ChatGPT Search, Microsoft Copilot, and Google AI Mode &mdash; have
          begun acting as shopping agents. When shoppers ask for recommendations,
          these models parse product listings for concrete facts, exact
          specifications, materials, and sizing.
        </p>
        <p>
          Most Shopify stores have titles written for visual browsing (&ldquo;The
          Aura&rdquo;) and descriptions filled with marketing romance copy rather
          than structured specifications. AI assistants struggle to comprehend
          these products, defaulting to larger retailers with comprehensive
          spec sheets.
        </p>
        <p>
          Shelfmark provides merchants with a fast, objective audit of their
          catalog readiness, highlighting exactly what to enrich so AI engines
          can recommend their inventory.
        </p>
      </div>

      <div className="pt-8 border-t border-line space-y-6">
        <h2 className="text-xl font-bold text-ink">Data & Privacy Commitments</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="border border-line rounded-xl p-5 bg-paper space-y-2">
            <ShieldCheck className="w-5 h-5 text-brand" aria-hidden="true" />
            <h3 className="font-semibold text-ink text-sm">Public data only</h3>
            <p className="text-xs text-muted leading-relaxed">
              We only read what is publicly visible in your store&rsquo;s standard
              public feed. We never access private admin data or sales figures.
            </p>
          </div>

          <div className="border border-line rounded-xl p-5 bg-paper space-y-2">
            <Database className="w-5 h-5 text-brand" aria-hidden="true" />
            <h3 className="font-semibold text-ink text-sm">No third-party trackers</h3>
            <p className="text-xs text-muted leading-relaxed">
              Zero tracking pixels, ad cookies, or third-party behavioral
              trackers. We count basic scan events directly in our database.
            </p>
          </div>

          <div className="border border-line rounded-xl p-5 bg-paper space-y-2">
            <Lock className="w-5 h-5 text-brand" aria-hidden="true" />
            <h3 className="font-semibold text-ink text-sm">No account needed</h3>
            <p className="text-xs text-muted leading-relaxed">
              Anyone can scan a public store without signing up, entering credit
              card details, or installing software.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
