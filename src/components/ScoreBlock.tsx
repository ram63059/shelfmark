"use client";

import { useEffect, useState, useRef } from "react";
import { CheckCircle, AlertTriangle, XCircle, Shield } from "lucide-react";

interface ScoreBlockProps {
  score: number;
  grade: string;
  gradeDescription: string;
}

function getGradeColor(grade: string): string {
  switch (grade) {
    case "Ready":
      return "text-pass";
    case "Almost ready":
      return "text-warn";
    case "Needs work":
      return "text-warn";
    case "Hard for AI to recommend":
      return "text-fail";
    default:
      return "text-muted";
  }
}

function getGradeIcon(grade: string) {
  switch (grade) {
    case "Ready":
      return <CheckCircle className="w-6 h-6" aria-hidden="true" />;
    case "Almost ready":
      return <AlertTriangle className="w-6 h-6" aria-hidden="true" />;
    case "Needs work":
      return <AlertTriangle className="w-6 h-6" aria-hidden="true" />;
    case "Hard for AI to recommend":
      return <XCircle className="w-6 h-6" aria-hidden="true" />;
    default:
      return <Shield className="w-6 h-6" aria-hidden="true" />;
  }
}

function getGradeBg(grade: string): string {
  switch (grade) {
    case "Ready":
      return "bg-pass-bg border-pass/20";
    case "Almost ready":
      return "bg-warn-bg border-warn/20";
    case "Needs work":
      return "bg-warn-bg border-warn/20";
    case "Hard for AI to recommend":
      return "bg-fail-bg border-fail/20";
    default:
      return "bg-mist border-line";
  }
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
    const duration = 900;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [score, prefersReducedMotion]);

  return (
    <div
      className={`rounded-xl border p-6 sm:p-8 ${getGradeBg(grade)}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {/* Score number */}
        <div className="flex items-baseline gap-1">
          <span className="text-6xl sm:text-7xl font-bold tabular-nums tracking-tight text-ink">
            {displayScore}
          </span>
          <span className="text-2xl font-medium text-muted">/100</span>
        </div>

        {/* Grade */}
        <div className="flex-1">
          <div className={`flex items-center gap-2 ${getGradeColor(grade)}`}>
            {getGradeIcon(grade)}
            <span className="text-lg font-semibold">{grade}</span>
          </div>
          <p className="mt-1 text-sm text-muted prose-width">
            {gradeDescription}
          </p>
        </div>
      </div>
    </div>
  );
}
