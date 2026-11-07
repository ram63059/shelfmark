"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, AlertCircle } from "lucide-react";

type ScanStatus =
  | { step: "idle" }
  | { step: "finding-feed"; message: string }
  | { step: "reading-products"; message: string }
  | { step: "checking"; message: string }
  | { step: "building-report"; message: string }
  | { step: "error"; message: string };

export function ScanForm() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<ScanStatus>({ step: "idle" });
  const router = useRouter();
  const abortRef = useRef<AbortController | null>(null);

  const isScanning =
    status.step !== "idle" && status.step !== "error";

  const handleScan = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = url.trim();
      if (!trimmed) return;

      // Abort any in-progress scan
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        setStatus({ step: "finding-feed", message: "Finding your product feed" });

        const res = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: trimmed }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          const message =
            data?.error || "Something went wrong. Check the URL and try again.";
          setStatus({ step: "error", message });
          return;
        }

        // Stream-like progress simulation based on response
        setStatus({
          step: "reading-products",
          message: "Reading products",
        });

        const data = await res.json();

        if (data.productCount) {
          setStatus({
            step: "checking",
            message: `Checking ${data.productCount} products`,
          });
        }

        // Small delay for visual feedback
        await new Promise((r) => setTimeout(r, 400));

        setStatus({
          step: "building-report",
          message: "Building your report",
        });

        await new Promise((r) => setTimeout(r, 300));

        // Navigate to report
        router.push(`/report/${data.domain}`);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setStatus({
          step: "error",
          message: "Could not connect. Check your internet and try again.",
        });
      }
    },
    [url, router]
  );

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleScan} className="relative">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (status.step === "error") {
                  setStatus({ step: "idle" });
                }
              }}
              placeholder="yourstore.com"
              disabled={isScanning}
              className="w-full h-13 pl-12 pr-4 text-base bg-paper border border-line rounded-lg shadow-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand disabled:opacity-60 transition-all"
              aria-label="Store URL"
              autoComplete="url"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>
          <button
            type="submit"
            disabled={isScanning || !url.trim()}
            className="h-13 px-6 bg-brand text-white font-medium rounded-lg hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                Scanning
              </>
            ) : (
              "Scan my store"
            )}
          </button>
        </div>
      </form>

      {/* Progress indicator */}
      {isScanning && (
        <div className="mt-4 flex items-center gap-3 text-sm text-muted animate-score">
          <div className="flex gap-1">
            <span
              className="w-1.5 h-1.5 rounded-full bg-brand animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="w-1.5 h-1.5 rounded-full bg-brand animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="w-1.5 h-1.5 rounded-full bg-brand animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
          {"message" in status ? status.message : ""}
        </div>
      )}

      {/* Error message */}
      {status.step === "error" && (
        <div className="mt-4 flex items-start gap-3 p-4 bg-fail-bg rounded-lg border border-fail/20">
          <AlertCircle
            className="w-5 h-5 text-fail shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm text-ink">{status.message}</p>
            <button
              onClick={() => setStatus({ step: "idle" })}
              className="mt-2 text-sm text-brand font-medium hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Trust text */}
      <p className="mt-4 text-center text-xs text-muted">
        Free. No signup. We only read your public product listings.
      </p>
    </div>
  );
}
