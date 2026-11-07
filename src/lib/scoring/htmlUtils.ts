/**
 * Utility for stripping HTML from Shopify `body_html` fields.
 */

/**
 * Remove all HTML tags, decode common entities, and collapse whitespace.
 * Returns clean plain text suitable for word-count and content analysis.
 */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";

  let text = html;

  // Replace block-level tags with spaces so words don't merge
  text = text.replace(/<\/(p|div|br|li|ul|ol|h[1-6]|tr|td|th|blockquote|section|article|header|footer|aside|nav|main|figure|figcaption|details|summary|table|thead|tbody|tfoot)>/gi, " ");
  text = text.replace(/<br\s*\/?>/gi, " ");

  // Strip remaining tags
  text = text.replace(/<[^>]*>/g, "");

  // Decode common HTML entities
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&nbsp;": " ",
    "&ndash;": "–",
    "&mdash;": "—",
    "&lsquo;": "\u2018",
    "&rsquo;": "\u2019",
    "&ldquo;": "\u201C",
    "&rdquo;": "\u201D",
    "&hellip;": "…",
    "&trade;": "™",
    "&reg;": "®",
    "&copy;": "©",
  };

  for (const [entity, char] of Object.entries(entities)) {
    text = text.replaceAll(entity, char);
  }

  // Decode numeric entities (decimal and hex)
  text = text.replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) =>
    String.fromCharCode(parseInt(hex, 16)),
  );
  text = text.replace(/&#(\d+);/g, (_, dec: string) =>
    String.fromCharCode(parseInt(dec, 10)),
  );

  // Collapse whitespace
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

/**
 * Count the number of words in a plain-text string.
 * Splits on whitespace and filters empty tokens.
 */
export function wordCount(text: string): number {
  if (!text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}
