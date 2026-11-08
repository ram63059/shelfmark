import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-line">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 text-ink hover:opacity-90 transition-opacity group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-emerald-700 flex items-center justify-center text-white shadow-md shadow-brand/20 group-hover:scale-105 transition-transform">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M8 9H16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M8 13H13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-ink">
                Shelfmark
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-light text-brand border border-brand/20">
                Free
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-6">
            <Link
              href="/methodology"
              className="text-sm font-medium text-muted hover:text-ink transition-colors"
            >
              Methodology
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted hover:text-ink transition-colors"
            >
              About
            </Link>
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-lg bg-brand hover:bg-brand-hover text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1"
            >
              <span>Scan store</span>
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
            </Link>
          </nav>

          {/* Mobile menu button */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

function MobileMenu() {
  return (
    <div className="sm:hidden">
      <details className="relative">
        <summary className="flex items-center justify-center w-10 h-10 rounded-xl text-muted hover:text-ink hover:bg-surface border border-line transition-colors cursor-pointer list-none">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line x1="3" y1="5" x2="17" y2="5" />
            <line x1="3" y1="10" x2="17" y2="10" />
            <line x1="3" y1="15" x2="17" y2="15" />
          </svg>
          <span className="sr-only">Menu</span>
        </summary>
        <div className="absolute right-0 top-12 w-52 glass-panel border border-line rounded-2xl shadow-2xl py-2 z-50 divide-y divide-line">
          <div className="py-1">
            <Link
              href="/"
              className="block px-4 py-2 text-sm font-medium text-ink hover:bg-surface transition-colors"
            >
              Scan a store
            </Link>
            <Link
              href="/methodology"
              className="block px-4 py-2 text-sm font-medium text-muted hover:text-ink hover:bg-surface transition-colors"
            >
              Methodology
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-sm font-medium text-muted hover:text-ink hover:bg-surface transition-colors"
            >
              About
            </Link>
          </div>
          <div className="py-1">
            <Link
              href="/privacy"
              className="block px-4 py-1.5 text-xs text-muted hover:text-ink transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="block px-4 py-1.5 text-xs text-muted hover:text-ink transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </details>
    </div>
  );
}
