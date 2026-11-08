"use client";

import { useEffect, useState, useRef } from "react";
import { CheckCircle, AlertTriangle, XCircle, Shield, Award } from "lucide-react";

interface ScoreBlockProps {
  score: number;
  grade: string;
  gradeDescription: string;
}

export function ScoreBlock({ score, grade, gradeDescription }: ScoreBlockProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const hasAnimated = useRef(false);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReducedMotion || hasAnimated.current) {
      setDisplayScore(score);
      return;
    }

    hasAnimated.current = true;
    const duration = 1000;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [score, prefersReducedMotion]);

  const isReady = grade === "Ready";
  const isAlmostReady = grade === "Almost ready";
  const isNeedsWork = grade === "Needs work";

  const colorClass = isReady
    ? "text-pass"
    : isAlmostReady || isNeedsWork
    ? "text-warn"
    : "text-fail";

  const ringBg = isReady
    ? "border-pass/30 bg-pass-bg"
    : isAlmostReady || isNeedsWork
    ? "border-warn/30 bg-warn-bg"
    : "border-fail/30 bg-fail-bg";

  const borderGradient = isReady
    ? "from-emerald-500/20 via-transparent to-transparent"
    : isAlmostReady || isNeedsWork
    ? "from-amber-500/20 via-transparent to-transparent"
    : "from-rose-500/20 via-transparent to-transparent";

  return (
    <div className={`relative overflow-hidden rounded-3xl glass-panel border border-line p-6 sm:p-10 shadow-2xl`}>
      {/* Top subtle gradient highlight */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${borderGradient}`}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Left: Large Visual Score Gauge */}
        <div className="flex items-center gap-6">
          <div
            className={`w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-2 ${ringBg} flex flex-col items-center justify-center shrink-0 shadow-inner`}
          >
            <span className="text-5xl sm:text-6xl font-black tabular-nums tracking-tight text-ink leading-none">
              {displayScore}
            </span>
            <span className="text-xs font-semibold text-muted tracking-wider uppercase mt-1">
              out of 100
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${ringBg} ${colorClass} border`}
              >
                {isReady ? (
                  <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
                ) : isAlmostReady || isNeedsWork ? (
                  <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                )}
                {grade}
              </span>
              <span className="text-xs text-muted font-medium">
                AI Shopping Readiness
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
              {isReady
                ? "Excellent AI Readability"
                : isAlmostReady
                ? "Near AI-Ready &bull; Minor Missing Specs"
                : isNeedsWork
                ? "Catalog Needs Specification Enrichment"
                : "High Risk of Omission in AI Search"}
            </h3>

            <p className="text-sm text-muted max-w-xl leading-relaxed">
              {gradeDescription}
            </p>
          </div>
        </div>

        {/* Right: Quick Benchmark Pill */}
        <div className="w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-line pt-4 md:pt-0 md:pl-8 flex flex-col justify-center space-y-1 text-xs text-muted">
          <div className="flex items-center gap-2 text-ink font-semibold">
            <Award className="w-4 h-4 text-brand" aria-hidden="true" />
            <span>Benchmark Status</span>
          </div>
          <p className="tabular-nums">Top 10% Shopify Stores score 85+</p>
          <p className="text-[11px] text-muted/80">Independent heuristic audit</p>
        </div>
      </div>
    </div>
  );
}
