"use client";

import { useState, useEffect } from "react";
import { Sparkles, CheckCircle2, XCircle, Bot, User, ArrowRight } from "lucide-react";

export function InteractiveChatPreview() {
  const [activeTab, setActiveTab] = useState<"query" | "decision">("decision");

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl glass-panel border border-line p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute -right-20 -bottom-20 w-80 h-80 bg-brand/10 rounded-full blur-3xl"
        aria-hidden="true"
      />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-line">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="text-xs font-mono text-muted pl-2">
            AI Assistant Decision Simulator &bull; 2026 Engine
          </span>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface border border-line text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("decision")}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTab === "decision"
                ? "bg-brand text-white shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            Recommendation Logic
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("query")}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTab === "query"
                ? "bg-brand text-white shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            Shopper Prompt
          </button>
        </div>
      </div>

      {/* Interactive Simulation View */}
      <div className="pt-6 space-y-6">
        {/* Shopper Prompt Bubble */}
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-surface border border-line flex items-center justify-center shrink-0 text-muted shadow-sm">
            <User className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="p-4 rounded-2xl bg-surface/80 border border-line text-sm max-w-xl shadow-sm">
            <p className="text-xs font-bold text-muted uppercase tracking-wider mb-1">
              Shopper asks ChatGPT:
            </p>
            <p className="text-ink font-medium">
              &ldquo;Find me a water-resistant merino wool travel jacket with zippered interior pockets under $300.&rdquo;
            </p>
          </div>
        </div>

        {/* AI Processing & Comparison */}
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0 text-brand shadow-sm">
            <Bot className="w-5 h-5" aria-hidden="true" />
          </div>

          <div className="space-y-4 flex-1">
            <div className="p-4 rounded-2xl bg-brand-light/30 border border-brand/30 text-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-brand uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>AI Parsing Public Shopify Listings</span>
              </div>
              <p className="text-ink text-xs sm:text-sm leading-relaxed">
                Evaluating candidate store feeds for explicit attributes: <span className="font-semibold text-brand">merino wool</span>, <span className="font-semibold text-brand">water-resistant</span>, and <span className="font-semibold text-brand">zippered pockets</span>.
              </p>
            </div>

            {/* Store A vs Store B Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Store B (Unprepared) */}
              <div className="p-4 rounded-2xl bg-fail-bg/30 border border-fail/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-fail uppercase tracking-wider flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" aria-hidden="true" />
                    Unprepared Store
                  </span>
                  <span className="text-xs font-mono text-muted">Score: 34</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-ink">Title: &ldquo;The Voyager&rdquo;</p>
                  <p className="text-[11px] text-muted line-clamp-2 mt-0.5">
                    &ldquo;Our signature companion for stylish globetrotters everywhere.&rdquo;
                  </p>
                </div>
                <div className="pt-1 text-[11px] text-fail space-y-1">
                  <p>&bull; Missing material noun (wool not stated)</p>
                  <p>&bull; Pockets unspecified in description</p>
                </div>
                <div className="pt-1 border-t border-fail/20 text-[11px] font-semibold text-muted">
                  Result: <span className="text-fail font-bold">Bypassed & Omitted</span>
                </div>
              </div>

              {/* Store A (Shelfmark Ready) */}
              <div className="p-4 rounded-2xl bg-pass-bg/30 border border-pass/30 space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-pass uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    Shelfmark Ready Store
                  </span>
                  <span className="text-xs font-mono text-pass font-bold">Score: 92</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-ink">
                    Title: &ldquo;Men&rsquo;s Water-Resistant Merino Wool Field Jacket&rdquo;
                  </p>
                  <p className="text-[11px] text-muted line-clamp-2 mt-0.5">
                    &ldquo;100% Merino wool with DWR water-resistant coating. Two zippered security pockets...&rdquo;
                  </p>
                </div>
                <div className="pt-1 text-[11px] text-pass space-y-1 font-medium">
                  <p>&bull; Exact spec matches buyer query</p>
                  <p>&bull; Pocket details verified in feed</p>
                </div>
                <div className="pt-1 border-t border-pass/20 text-[11px] font-semibold text-ink">
                  Result: <span className="text-pass font-bold">#1 Recommended Product</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
