import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface/80 mt-28">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-3">
            <Link
              href="/"
              className="text-lg font-bold text-ink hover:text-brand transition-colors inline-block"
            >
              Shelfmark
            </Link>
            <p className="text-xs text-muted leading-relaxed max-w-xs">
              Independent e-commerce catalog intelligence and AI readiness scores
              for Shopify merchants.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
              Product
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/methodology"
                  className="text-muted hover:text-ink transition-colors"
                >
                  Scoring Methodology
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted hover:text-ink transition-colors"
                >
                  About the Project
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
              Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted hover:text-ink transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted hover:text-ink transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
              Contact
            </h4>
            <p className="text-xs text-muted">
              Questions or partner inquiries:
            </p>
            <a
              href="mailto:hello@shelfmark.app"
              className="text-xs text-brand font-semibold hover:underline block"
            >
              hello@shelfmark.app
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-line text-xs text-muted space-y-2">
          <p className="leading-relaxed">
            Shelfmark is an independent analysis tool and is not affiliated with
            or endorsed by Shopify, OpenAI, Google or Microsoft. Shopify is a
            registered trademark of Shopify Inc.
          </p>
          <p className="text-[11px] text-muted/70">
            &copy; 2026 Shelfmark. All rights reserved. Built for modern merchants.
          </p>
        </div>
      </div>
    </footer>
  );
}
