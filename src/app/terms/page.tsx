import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Shelfmark plain-language terms of service.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-[800px] px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to home
      </Link>

      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink">
          Terms of Service
        </h1>
        <p className="text-xs text-muted">Last updated: March 2026</p>
      </div>

      <div className="space-y-6 text-sm text-muted leading-relaxed prose-width">
        <h2 className="text-lg font-semibold text-ink">1. Acceptance of terms</h2>
        <p>
          By using Shelfmark, you agree to these Terms. If you do not agree,
          please do not use the tool.
        </p>

        <h2 className="text-lg font-semibold text-ink pt-4">2. Nature of service</h2>
        <p>
          Shelfmark provides automated diagnostic audits of public product
          feeds to estimate readability for AI shopping assistants. Scores and
          recommendations are informational estimates based on standard heuristic
          rules. We do not guarantee specific search rankings or commercial
          sales increases.
        </p>

        <h2 className="text-lg font-semibold text-ink pt-4">3. Independent tool disclaimer</h2>
        <p>
          Shelfmark is an independent analysis tool and is not affiliated with,
          sponsored by, or endorsed by Shopify Inc., OpenAI, Google LLC, or
          Microsoft Corp. &ldquo;Shopify&rdquo; is a registered trademark of
          Shopify Inc.
        </p>

        <h2 className="text-lg font-semibold text-ink pt-4">4. Acceptable use</h2>
        <p>
          You agree not to automate or abuse our scanning endpoints with scripts
          designed to circumvent rate limits (10 scans per IP per hour) or degrade
          service availability for other merchants.
        </p>

        <h2 className="text-lg font-semibold text-ink pt-4">5. Disclaimer of warranties</h2>
        <p>
          Shelfmark is provided &ldquo;as is&rdquo; without warranties of any
          kind, either express or implied.
        </p>
      </div>
    </div>
  );
}
