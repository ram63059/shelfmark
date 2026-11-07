import { AlertTriangle, ImageOff } from "lucide-react";

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
    <div className="space-y-8">
      {products.map((product, i) => (
        <ComparisonCard
          key={i}
          product={product}
          storeDomain={storeDomain}
        />
      ))}
    </div>
  );
}

function ComparisonCard({
  product,
  storeDomain,
}: {
  product: ProductData;
  storeDomain: string;
}) {
  const missingFacts = Object.entries(product.extractedFacts).filter(
    ([, v]) => v === null
  );
  const presentFacts = Object.entries(product.extractedFacts).filter(
    ([, v]) => v !== null
  );

  return (
    <div className="border border-line rounded-xl overflow-hidden">
      {/* Product header */}
      <div className="px-4 sm:px-6 py-3 bg-mist border-b border-line flex items-center justify-between">
        <a
          href={`https://${storeDomain}/products/${product.handle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-ink hover:text-brand transition-colors truncate"
        >
          {product.title}
        </a>
        <span className="text-xs tabular-nums text-muted ml-3 shrink-0">
          Score: {product.score}/100
        </span>
      </div>

      {/* Two-column comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-line">
        {/* Left: What shoppers see */}
        <div className="p-4 sm:p-6">
          <h4 className="text-xs font-medium text-muted uppercase tracking-wide mb-4">
            What shoppers see
          </h4>
          <div className="flex flex-col items-center text-center">
            {product.image ? (
              <div className="w-32 h-32 rounded-lg bg-mist flex items-center justify-center overflow-hidden mb-3">
                {/* We use a plain img here since the image comes from external Shopify CDN */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-lg bg-mist flex items-center justify-center mb-3">
                <ImageOff
                  className="w-8 h-8 text-muted/40"
                  aria-hidden="true"
                />
              </div>
            )}
            <p className="text-sm font-medium text-ink">{product.title}</p>
            {product.price && (
              <p className="text-sm text-muted mt-1">{product.price}</p>
            )}
            {product.description && (
              <p className="text-xs text-muted mt-2 line-clamp-3 prose-width">
                {product.description.slice(0, 150)}
                {product.description.length > 150 ? "..." : ""}
              </p>
            )}
          </div>
        </div>

        {/* Right: What AI reads */}
        <div className="p-4 sm:p-6">
          <h4 className="text-xs font-medium text-muted uppercase tracking-wide mb-4">
            What an AI assistant reads
          </h4>
          <div className="space-y-0">
            {/* Present facts */}
            {presentFacts.map(([key, value]) => (
              <div
                key={key}
                className="flex border-b border-line last:border-b-0 py-2"
              >
                <span className="text-xs font-medium text-muted w-24 shrink-0">
                  {key}
                </span>
                <span className="text-xs text-ink">{value}</span>
              </div>
            ))}
            {/* Missing facts */}
            {missingFacts.map(([key]) => (
              <div
                key={key}
                className="flex border-b border-line last:border-b-0 py-2"
              >
                <span className="text-xs font-medium text-muted w-24 shrink-0">
                  {key}
                </span>
                <span className="text-xs text-fail/80 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                  Missing
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
