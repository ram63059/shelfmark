"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "Does Shelfmark require installing an app or giving store permissions?",
    a: "No. Shelfmark is completely non-invasive. We only read the public product listings feed (products.json) that search engines, social media crawlers, and AI shopping bots already consume. No accounts, passwords, or admin access required.",
  },
  {
    q: "Why are AI shopping assistants recommending my competitors instead of me?",
    a: "Language models like ChatGPT and Google AI Mode prioritize factual certainty over creative copy. When a shopper asks for a 'breathable cotton shirt with UV protection under $40,' AI assistants only recommend products whose listings explicitly state those exact specifications. If your listing uses vague romance copy without specifications, the AI skips it to avoid hallucinations.",
  },
  {
    q: "Which AI shopping assistants use this product data?",
    a: "As of 2026, ChatGPT Search, Microsoft Copilot Shopping, Google AI Mode / Gemini, and Perplexity Shopping all actively parse e-commerce web feeds to make direct product recommendations to consumers.",
  },
  {
    q: "How does the upcoming Shopify app work?",
    a: "Our upcoming Shopify app integrates directly inside your Shopify admin. It analyzes your low-scoring listings, generates factual enrichments in your exact brand tone, highlights missing specs for your approval, and updates your catalog with 1 click.",
  },
  {
    q: "How often should I scan my store?",
    a: "Whenever you launch new collections or update product descriptions. Shelfmark caches reports for 24 hours to prevent server load, but you can re-scan anytime after making listing improvements.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {FAQS.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="glass-panel rounded-2xl border border-line overflow-hidden transition-all duration-200"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full px-6 py-5 flex items-center justify-between text-left text-sm sm:text-base font-bold text-ink hover:text-brand transition-colors cursor-pointer"
              aria-expanded={isOpen}
            >
              <span>{faq.q}</span>
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-brand shrink-0 ml-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted shrink-0 ml-4" aria-hidden="true" />
              )}
            </button>

            {isOpen && (
              <div className="px-6 pb-6 pt-1 text-sm text-muted leading-relaxed border-t border-line/50">
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
