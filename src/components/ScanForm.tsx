"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, AlertCircle, ArrowRight, Sparkles } from "lucide-react";

type ScanStatus =
  | { step: "idle" }
  | { step: "finding-feed"; message: string }
  | { step: "reading-products"; message: string }
  | { step: "checking"; message: string }
  | { step: "building-report"; message: string }
  | { step: "error"; message: string };

const POPULAR_EXAMPLES = [
  "allbirds.com",
  "gymshark.com",
  "chubbieshorts.com",
];

export function ScanForm() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<ScanStatus>({ step: "idle" });
  const router = useRouter();
  const abortRef = useRef<AbortController | null>(null);

  const isScanning = status.step !== "idle" && status.step !== "error";

  const executeScan = useCallback(
    async (targetUrl: string) => {
      const trimmed = targetUrl.trim();
      if (!trimmed) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        setStatus({ step: "finding-feed", message: "Connecting to public product feed..." });

        const res = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: trimmed }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          const message =
            data?.error || "Could not scan store. Please check the URL and try again.";
          setStatus({ step: "error", message });
          return;
        }

        setStatus({
          step: "reading-products",
          message: "Parsing catalog specifications...",
        });

        const data = await res.json();

        if (data.productCount) {
          setStatus({
            step: "checking",
            message: `Evaluating ${data.productCount} products across 6 AI readiness signals...`,
          });
        }

        await new Promise((r) => setTimeout(r, 450));

        setStatus({
          step: "building-report",
          message: "Assembling your readiness score and priority fixes...",
        });

        await new Promise((r) => setTimeout(r, 350));

        router.push(`/report/${data.domain}`);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setStatus({
          step: "error",
          message: "Could not reach store feed. Check your connection and try again.",
        });
      }
    },
    [router]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeScan(url);
  };

  const handleExampleClick = (exampleDomain: string) => {
    setUrl(exampleDomain);
    executeScan(exampleDomain);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Search Input Container with Glowing Aura */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex flex-col sm:flex-row items-center p-1.5 rounded-2xl glass-panel border border-line hover:border-line-strong focus-within:border-brand/60 focus-within:ring-4 focus-within:ring-brand/10 transition-all duration-300 shadow-xl">
          <div className="relative flex-1 w-full flex items-center">
            <Search
              className="absolute left-4 w-5 h-5 text-muted/70 group-focus-within:text-brand transition-colors"
              aria-hidden="true"
            />
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (status.step === "error") setStatus({ step: "idle" });
              }}
              placeholder="Enter Shopify store (e.g. allbirds.com or yourstore.myshopify.com)"
              disabled={isScanning}
              className="w-full h-14 pl-12 pr-4 text-base bg-transparent text-ink placeholder:text-muted/50 focus:outline-none disabled:opacity-60 font-medium"
              aria-label="Shopify Store URL"
              autoComplete="url"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>

          <button
            type="submit"
            disabled={isScanning || !url.trim()}
            className="w-full sm:w-auto h-12 px-7 rounded-xl bg-gradient-to-r from-brand to-emerald-600 hover:from-brand-hover hover:to-emerald-700 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-brand/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap mt-2 sm:mt-0"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Auditing...</span>
              </>
            ) : (
              <>
                <span>Scan my store</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Progress state */}
      {isScanning && (
        <div className="p-4 rounded-xl glass-panel border border-brand/30 animate-score flex items-center gap-3 text-sm text-ink shadow-lg">
          <div className="relative flex h-3 w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-brand"></span>
          </div>
          <p className="flex-1 font-medium">
            {"message" in status ? status.message : "Scanning..."}
          </p>
        </div>
      )}

      {/* Error display */}
      {status.step === "error" && (
        <div className="flex items-start gap-3 p-4 bg-fail-bg border border-fail/30 rounded-xl text-left">
          <AlertCircle className="w-5 h-5 text-fail shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1">
            <p className="text-sm font-medium text-ink">{status.message}</p>
            <button
              type="button"
              onClick={() => setStatus({ step: "idle" })}
              className="mt-1 text-xs text-brand font-semibold hover:underline"
            >
              Try another store address
            </button>
          </div>
        </div>
      )}

      {/* Quick Example Store Pills */}
      {!isScanning && (
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted pt-1">
          <span className="flex items-center gap-1 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-brand" aria-hidden="true" />
            Try demo store:
          </span>
          {POPULAR_EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => handleExampleClick(example)}
              className="px-2.5 py-1 rounded-lg bg-surface border border-line hover:border-line-strong hover:text-ink text-muted transition-colors cursor-pointer"
            >
              {example}
            </button>
          ))}
        </div>
      )}

      <p className="text-center text-xs text-muted">
        100% Free &bull; No login &bull; Reads public listings only
      </p>
    </div>
  );
}
