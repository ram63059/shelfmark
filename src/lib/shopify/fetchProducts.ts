import type {
  ShopifyProduct,
  FetchResult,
} from "./types";

const USER_AGENT = "ShelfmarkBot/1.0 (+https://shelfmark.app/about)";
const TIMEOUT_MS = 10_000;
const MAX_PAGES = 4;
const PAGE_SIZE = 250;

/**
 * Normalize a user-entered URL into just the hostname.
 * Accepts: brand.com, https://www.brand.com/collections/x, brand.myshopify.com
 */
export function normalizeDomain(input: string): string {
  let cleaned = input.trim().toLowerCase();

  // If no protocol, add one so URL parser works
  if (!cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
    cleaned = `https://${cleaned}`;
  }

  try {
    const url = new URL(cleaned);
    let host = url.hostname;

    // Strip www.
    if (host.startsWith("www.")) {
      host = host.slice(4);
    }

    return host;
  } catch {
    // If URL parsing fails, try to extract just the domain part
    const match = cleaned.match(
      /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/
    );
    if (match) {
      return match[1].toLowerCase();
    }
    return cleaned.replace(/[^a-zA-Z0-9.-]/g, "").toLowerCase();
  }
}

/**
 * Fetch products from a Shopify store's public JSON feed.
 * Fetches up to MAX_PAGES pages (1000 products max).
 */
export async function fetchProducts(rawUrl: string): Promise<FetchResult> {
  const domain = normalizeDomain(rawUrl);

  if (!domain || domain.length < 3 || !domain.includes(".")) {
    return {
      success: false,
      error: `"${rawUrl}" doesn't look like a valid store address. Enter something like yourstore.com or yourstore.myshopify.com.`,
      errorType: "not-shopify",
    };
  }

  const allProducts: ShopifyProduct[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = `https://${domain}/products.json?limit=${PAGE_SIZE}&page=${page}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const res = await fetch(url, {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.status === 401 || res.status === 403) {
        return {
          success: false,
          error:
            "This store's product feed isn't public, so we can't scan it from outside. The upcoming Shelfmark app will scan it from inside your Shopify admin.",
          errorType: "blocked",
        };
      }

      if (res.status === 404 || res.status >= 500) {
        if (page === 1) {
          return {
            success: false,
            error: `We couldn't find a public product feed at ${domain}. Shelfmark works with Shopify stores. Check the address, or try your .myshopify.com address.`,
            errorType: "not-shopify",
          };
        }
        break; // Subsequent pages returning 404 means we've read all products
      }

      if (!res.ok) {
        if (page === 1) {
          return {
            success: false,
            error: `We couldn't find a public product feed at ${domain}. Shelfmark works with Shopify stores. Check the address, or try your .myshopify.com address.`,
            errorType: "not-shopify",
          };
        }
        break;
      }

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("json") && !contentType.includes("javascript")) {
        if (page === 1) {
          return {
            success: false,
            error: `We couldn't find a public product feed at ${domain}. Shelfmark works with Shopify stores. Check the address, or try your .myshopify.com address.`,
            errorType: "not-shopify",
          };
        }
        break;
      }

      const data = await res.json();

      if (!data.products || !Array.isArray(data.products)) {
        if (page === 1) {
          return {
            success: false,
            error: `We couldn't find a public product feed at ${domain}. Shelfmark works with Shopify stores. Check the address, or try your .myshopify.com address.`,
            errorType: "not-shopify",
          };
        }
        break;
      }

      const products = data.products as ShopifyProduct[];
      allProducts.push(...products);

      // If we got fewer than PAGE_SIZE, we've reached the end
      if (products.length < PAGE_SIZE) {
        break;
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        return {
          success: false,
          error: `The connection to ${domain} timed out. The store might be slow or blocking automated requests. Try again in a moment.`,
          errorType: "timeout",
        };
      }

      if (page === 1) {
        // Check if it's a DNS/network error
        const message =
          err instanceof Error ? err.message : "Unknown error";
        if (
          message.includes("ENOTFOUND") ||
          message.includes("getaddrinfo") ||
          message.includes("dns")
        ) {
          return {
            success: false,
            error: `We couldn't find a public product feed at ${domain}. Shelfmark works with Shopify stores. Check the address, or try your .myshopify.com address.`,
            errorType: "not-shopify",
          };
        }
        return {
          success: false,
          error: `Something went wrong connecting to ${domain}. Check the address and try again.`,
          errorType: "unknown",
        };
      }
      break;
    }
  }

  if (allProducts.length === 0) {
    return {
      success: false,
      error: `We connected to ${domain} but found zero products. The store might be empty or the product feed might be disabled.`,
      errorType: "no-products",
    };
  }

  return {
    success: true,
    domain,
    products: allProducts,
    totalFetched: allProducts.length,
  };
}
