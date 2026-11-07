import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Shelfmark plain-language privacy policy.",
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-xs text-muted">Last updated: March 2026</p>
      </div>

      <div className="space-y-6 text-sm text-muted leading-relaxed prose-width">
        <h2 className="text-lg font-semibold text-ink">1. Information we collect</h2>
        <p>
          Shelfmark reads only publicly available product data published by
          Shopify stores via their public listings feed (e.g. products.json). We
          do not access private order data, customer records, revenue, or
          account credentials.
        </p>

        <h2 className="text-lg font-semibold text-ink pt-4">2. Waitlist emails</h2>
        <p>
          If you voluntarily provide your email address to receive notification
          about our upcoming Shopify app, we store your email address and
          associated store domain in our secure database. We do not sell, rent,
          or share your contact information with third parties. You may
          unsubscribe at any time by contacting hello@shelfmark.app.
        </p>

        <h2 className="text-lg font-semibold text-ink pt-4">3. Scan caching & rate limiting</h2>
        <p>
          To prevent server overload and rate-limit abuse, we record your IP
          address alongside scan timestamps, and cache report results for 24
          hours. We do not use third-party analytics trackers or advertising
          pixels.
        </p>

        <h2 className="text-lg font-semibold text-ink pt-4">4. Contact us</h2>
        <p>
          If you have questions about this policy or wish to request data
          deletion, please email hello@shelfmark.app.
        </p>
      </div>
    </div>
  );
}
