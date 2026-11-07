import { z } from "zod";
import type { ShopifyProduct } from "../shopify/types";
import { stripHtml } from "../scoring/htmlUtils";

export const AiSuggestionSchema = z.object({
  title: z.string(),
  description: z.string(),
  keyDetails: z.array(z.string()),
  faqs: z.array(
    z.object({
      q: z.string(),
      a: z.string(),
    })
  ),
});

export type AiSuggestion = z.infer<typeof AiSuggestionSchema>;

export interface ProductAiEnhancement {
  productId: number;
  originalTitle: string;
  originalDescription: string;
  suggestion: AiSuggestion;
}

/**
 * Generate AI-suggested improvements for a product using Google Gemini.
 * Never invents facts; uses bracketed placeholders like [add material] for missing data.
 */
async function callGemini(
  product: ShopifyProduct,
  apiKey: string
): Promise<AiSuggestion | null> {
  const plainDescription = stripHtml(product.body_html || "");
  const tagsStr = Array.isArray(product.tags)
    ? product.tags.join(", ")
    : product.tags || "";
  const optionsStr = product.options
    .map((o) => `${o.name}: ${o.values.join(", ")}`)
    .join(" | ");

  const systemInstruction = `You are an expert e-commerce catalog optimizer specializing in making Shopify listings legible and recommendable to AI shopping assistants (such as ChatGPT, Microsoft Copilot, and Google AI Mode).

AI shopping assistants need structured, factual, high-clarity data.
Rules:
1. Use ONLY facts directly present in the input data.
2. NEVER invent materials, dimensions, weights, ingredients, claims, or certifications.
3. If an essential fact is missing, include a clear bracketed placeholder such as [add material], [add dimensions], or [add care instructions] so the merchant can fill it in.
4. Output STRICT JSON only. Do not wrap in markdown or backticks if possible, or return pure valid JSON matching the schema:
{
  "title": "Descriptive Title with Product Type + Attributes or Placeholders",
  "description": "Clear 120+ word factual description highlighting specs, fit, and use cases.",
  "keyDetails": ["Detail 1", "Detail 2", "Detail 3"],
  "faqs": [
    {"q": "Question an AI or shopper would ask?", "a": "Answer based on available facts or placeholders"}
  ]
}`;

  const userPrompt = `Product input data:
Title: ${product.title}
Product Type: ${product.product_type || "None specified"}
Tags: ${tagsStr || "None"}
Options: ${optionsStr || "None"}
Current Description:
${plainDescription || "None provided"}`;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API returned status ${response.status}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) return null;

  const parsed = JSON.parse(rawText);
  return AiSuggestionSchema.parse(parsed);
}

/**
 * Generate suggestions for up to 2 products with retry.
 * Silently skips if GEMINI_API_KEY is not configured or if failures persist.
 */
export async function generateProductSuggestions(
  products: ShopifyProduct[]
): Promise<ProductAiEnhancement[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return [];
  }

  const targetProducts = products.slice(0, 2);
  const results: ProductAiEnhancement[] = [];

  for (const product of targetProducts) {
    let suggestion: AiSuggestion | null = null;

    // First attempt
    try {
      suggestion = await callGemini(product, apiKey);
    } catch {
      // Retry once on failure
      try {
        suggestion = await callGemini(product, apiKey);
      } catch {
        suggestion = null;
      }
    }

    if (suggestion) {
      results.push({
        productId: product.id,
        originalTitle: product.title,
        originalDescription: stripHtml(product.body_html || ""),
        suggestion,
      });
    }
  }

  return results;
}
