import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 sm:py-32 text-center space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wider text-muted">
          404 &bull; Not Found
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink">
          Page not found
        </h1>
        <p className="text-sm text-muted prose-width mx-auto">
          The page or store report you requested could not be located. Check the
          URL, or return home to run a new scan.
        </p>
      </div>

      <div className="pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand text-white font-medium rounded-lg hover:bg-brand-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
