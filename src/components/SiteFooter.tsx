import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-mist mt-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="text-lg font-semibold text-ink hover:text-brand transition-colors"
            >
              Shelfmark
            </Link>
            <p className="mt-2 text-sm text-muted prose-width">
              Free AI shopping readiness scores for Shopify stores.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-medium text-ink mb-3">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/methodology"
                  className="text-sm text-muted hover:text-ink transition-colors"
                >
                  Methodology
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted hover:text-ink transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-medium text-ink mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted hover:text-ink transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted hover:text-ink transition-colors"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-medium text-ink mb-3">Contact</h3>
            <a
              href="mailto:hello@shelfmark.app"
              className="text-sm text-muted hover:text-ink transition-colors"
            >
              hello@shelfmark.app
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 pt-6 border-t border-line">
          <p className="text-xs text-muted leading-relaxed">
            Shelfmark is an independent tool and is not affiliated with or
            endorsed by Shopify, OpenAI, Google or Microsoft. Shopify is a
            trademark of Shopify Inc.
          </p>
          <p className="text-xs text-muted mt-2">
            &copy; 2026 Shelfmark. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
