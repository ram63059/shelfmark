import { AlertTriangle, ImageOff, ExternalLink } from "lucide-react";

interface ProductData {
  title: string;
  handle: string;
  price: string;
  image: string | null;
  productType: string;
  description: string;
  extractedFacts: Record<string, string | null>;
  score: number;
}

interface AiSeesComparisonProps {
  products: ProductData[];
  storeDomain: string;
}

export function AiSeesComparison({
  products,
  storeDomain,
}: AiSeesComparisonProps) {
  if (products.length === 0) return null;

  return (
    <div className="space-y-6">
      {products.map((product, i) => (
        <ComparisonCard
          key={i}
          product={product}
          storeDomain={storeDomain}
          rank={i + 1}
        />
      ))}
    </div>
  );
}

function ComparisonCard({
  product,
  storeDomain,
  rank,
}: {
  product: ProductData;
  storeDomain: string;
  rank: number;
}) {
  const missingFacts = Object.entries(product.extractedFacts).filter(
    ([, v]) => v === null
  );
  const presentFacts = Object.entries(product.extractedFacts).filter(
    ([, v]) => v !== null
  );

  return (
    <div className="glass-panel border border-line rounded-2xl overflow-hidden shadow-lg">
      {/* Top Header */}
      <div className="px-5 sm:px-6 py-3.5 bg-surface/80 border-b border-line flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-line text-muted">
            #{rank}
          </span>
          <a
            href={`https://${storeDomain}/products/${product.handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-ink hover:text-brand transition-colors truncate flex items-center gap-1.5"
          >
            <span>{product.title}</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-60" aria-hidden="true" />
          </a>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-fail-bg text-fail border border-fail/30 font-semibold tabular-nums">
            Readiness: {product.score} / 100
          </span>
        </div>
      </div>

      {/* Two Column Diagnostic */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-line">
        {/* Left: What shoppers see */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              What shoppers see
            </span>
            <span className="text-[11px] font-semibold text-muted">
              Visual storefront
            </span>
          </div>

          <div className="rounded-xl border border-line p-4 bg-surface/50 space-y-3">
            <div className="flex items-center gap-4">
              {product.image ? (
                <div className="w-20 h-20 rounded-lg bg-surface border border-line flex items-center justify-center overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-lg bg-surface border border-line flex items-center justify-center shrink-0">
                  <ImageOff className="w-6 h-6 text-muted/40" aria-hidden="true" />
                </div>
              )}

              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-sm font-bold text-ink truncate">
                  {product.title}
                </p>
                {product.price && (
                  <p className="text-xs font-semibold text-brand">
                    {product.price}
                  </p>
                )}
                <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-surface border border-line text-muted">
                  Type: {product.productType}
                </span>
              </div>
            </div>

            {product.description && (
              <p className="text-xs text-muted leading-relaxed line-clamp-3 border-t border-line/60 pt-2.5">
                {product.description.replace(/<[^>]*>/g, " ").slice(0, 160)}
                {product.description.length > 160 ? "..." : ""}
              </p>
            )}
          </div>
        </div>

        {/* Right: What AI reads */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              What an AI assistant extracts
            </span>
            <span className="text-[11px] font-semibold text-fail">
              {missingFacts.length} missing attributes
            </span>
          </div>

          <div className="rounded-xl border border-line bg-surface/40 divide-y divide-line text-xs">
            {presentFacts.map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-2 px-3">
                <span className="font-medium text-muted">{key}</span>
                <span className="font-semibold text-ink text-right">{value}</span>
              </div>
            ))}

            {missingFacts.map(([key]) => (
              <div key={key} className="flex items-center justify-between py-2 px-3">
                <span className="font-medium text-muted">{key}</span>
                <span className="font-semibold text-fail flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" aria-hidden="true" />
                  Missing from listing
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
