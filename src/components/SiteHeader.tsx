import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-ink hover:text-brand transition-colors"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect
                x="2"
                y="4"
                width="24"
                height="20"
                rx="3"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <line
                x1="7"
                y1="10"
                x2="21"
                y2="10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="7"
                y1="14"
                x2="17"
                y2="14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="7"
                y1="18"
                x2="13"
                y2="18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-lg font-semibold tracking-tight">
              Shelfmark
            </span>
          </Link>

          <nav className="hidden sm:flex items-center gap-6">
            <Link
              href="/methodology"
              className="text-sm text-muted hover:text-ink transition-colors"
            >
              Methodology
            </Link>
            <Link
              href="/about"
              className="text-sm text-muted hover:text-ink transition-colors"
            >
              About
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
        <summary className="flex items-center justify-center w-10 h-10 rounded-lg text-muted hover:text-ink hover:bg-mist transition-colors cursor-pointer list-none">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line x1="3" y1="5" x2="17" y2="5" />
            <line x1="3" y1="10" x2="17" y2="10" />
            <line x1="3" y1="15" x2="17" y2="15" />
          </svg>
          <span className="sr-only">Menu</span>
        </summary>
        <div className="absolute right-0 top-12 w-48 bg-paper border border-line rounded-xl shadow-lg py-2 z-50">
          <Link
            href="/methodology"
            className="block px-4 py-2 text-sm text-muted hover:text-ink hover:bg-mist transition-colors"
          >
            Methodology
          </Link>
          <Link
            href="/about"
            className="block px-4 py-2 text-sm text-muted hover:text-ink hover:bg-mist transition-colors"
          >
            About
          </Link>
          <Link
            href="/privacy"
            className="block px-4 py-2 text-sm text-muted hover:text-ink hover:bg-mist transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="block px-4 py-2 text-sm text-muted hover:text-ink hover:bg-mist transition-colors"
          >
            Terms
          </Link>
        </div>
      </details>
    </div>
  );
}
