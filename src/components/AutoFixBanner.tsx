"use client";

import { useState } from "react";
import { Sparkles, Check, ArrowRight, ShieldCheck, Zap, Loader2 } from "lucide-react";

interface AutoFixBannerProps {
  domain?: string;
  problemCount?: number;
  highlighted?: boolean;
}

export function AutoFixBanner({
  domain,
  problemCount,
  highlighted = true,
}: AutoFixBannerProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), domain }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErrorMessage(data?.error || "Could not save your email. Try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMessage("Network error. Try again.");
      setStatus("error");
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        highlighted
          ? "border-brand/40 bg-gradient-to-b from-brand/10 via-surface/90 to-surface glow-card p-6 sm:p-8"
          : "border-line bg-surface p-6 sm:p-8"
      }`}
    >
      {/* Ambient background glow effect */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Left: Content */}
        <div className="max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-brand text-white shadow-sm">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              Shopify App &bull; Coming Soon
            </span>
            {domain && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-line text-muted font-medium">
                Optimized for {domain}
              </span>
            )}
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            {problemCount && problemCount > 0
              ? `Fix all ${problemCount} listing issues automatically.`
              : "Fix weak product listings automatically."}
          </h3>

          <p className="text-sm sm:text-base text-muted leading-relaxed">
            Don&rsquo;t spend hours rewriting hundreds of products by hand. Our
            upcoming official Shopify app enriches your titles, descriptions,
            and specs inside your Shopify admin with 1-click publishing.
          </p>

          {/* Value props badges */}
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted">
            <span className="flex items-center gap-1 font-medium text-ink">
              <Check className="w-4 h-4 text-brand" aria-hidden="true" />
              1-Click Bulk Rewrite
            </span>
            <span className="flex items-center gap-1 font-medium text-ink">
              <Zap className="w-4 h-4 text-brand" aria-hidden="true" />
              Maintains Brand Tone
            </span>
            <span className="flex items-center gap-1 font-medium text-ink">
              <ShieldCheck className="w-4 h-4 text-brand" aria-hidden="true" />
              Review Before Publishing
            </span>
          </div>
        </div>

        {/* Right: Prominent Email Capture */}
        <div className="w-full lg:w-auto shrink-0 min-w-[320px]">
          {status === "success" ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-pass-bg border border-pass/30 text-ink">
              <div className="w-8 h-8 rounded-full bg-pass/20 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 text-pass" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold">You&rsquo;re on the VIP list!</p>
                <p className="text-xs text-muted">
                  We&rsquo;ll email you early beta access when the Shopify app opens.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your merchant email..."
                  required
                  disabled={status === "loading"}
                  className="h-12 px-4 rounded-xl text-sm bg-paper border border-line text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand shadow-inner flex-1 transition-all"
                />
                <button
                  type="submit"
                  disabled={status === "loading" || !email.trim()}
                  className="h-12 px-6 rounded-xl bg-brand hover:bg-brand-hover text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all whitespace-nowrap disabled:opacity-50"
                >
                  {status === "loading" ? (
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <>
                      <span>Get early access</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </>
                  )}
                </button>
              </div>

              {status === "error" && (
                <p className="text-xs text-fail pl-1">{errorMessage}</p>
              )}

              <p className="text-[11px] text-muted text-center lg:text-left pl-1">
                Zero spam. Direct Shopify App Store launch notification only.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
