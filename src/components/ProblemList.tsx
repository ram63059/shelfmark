"use client";

import { useState } from "react";
import {
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";

interface Problem {
  checkName: string;
  severity: "fail" | "warn";
  count: number;
  total: number;
  summary: string;
  whyItMatters: string;
  howToFix: string;
  affectedProducts: Array<{
    title: string;
    handle: string;
  }>;
}

interface ProblemListProps {
  problems: Problem[];
  storeDomain: string;
}

export function ProblemList({ problems, storeDomain }: ProblemListProps) {
  if (problems.length === 0) {
    return (
      <p className="text-sm text-muted">No major problems found.</p>
    );
  }

  return (
    <div className="space-y-4">
      {problems.map((problem, i) => (
        <ProblemCard key={i} problem={problem} storeDomain={storeDomain} />
      ))}
    </div>
  );
}

function ProblemCard({
  problem,
  storeDomain,
}: {
  problem: Problem;
  storeDomain: string;
}) {
  const [expanded, setExpanded] = useState(false);

  const Icon = problem.severity === "fail" ? XCircle : AlertTriangle;
  const colorClass =
    problem.severity === "fail" ? "text-fail" : "text-warn";
  const bgClass =
    problem.severity === "fail"
      ? "bg-fail-bg border-fail/20"
      : "bg-warn-bg border-warn/20";

  return (
    <div className={`rounded-xl border ${bgClass}`}>
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Icon
            className={`w-5 h-5 shrink-0 mt-0.5 ${colorClass}`}
            aria-hidden="true"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-ink">{problem.summary}</p>
            <p className="mt-1 text-sm text-muted">{problem.whyItMatters}</p>
            <p className="mt-1 text-sm text-muted">
              <span className="font-medium text-ink">Fix:</span>{" "}
              {problem.howToFix}
            </p>
          </div>
        </div>
      </div>

      {/* Expandable product list */}
      {problem.affectedProducts.length > 0 && (
        <div className="border-t border-line/50">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-4 sm:px-5 py-3 flex items-center justify-between text-sm text-muted hover:text-ink transition-colors"
            aria-expanded={expanded}
          >
            <span>
              {problem.affectedProducts.length} affected product
              {problem.affectedProducts.length !== 1 ? "s" : ""}
            </span>
            {expanded ? (
              <ChevronUp className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          {expanded && (
            <div className="px-4 sm:px-5 pb-4 space-y-1.5">
              {problem.affectedProducts.slice(0, 20).map((product, i) => (
                <a
                  key={i}
                  href={`https://${storeDomain}/products/${product.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted hover:text-brand transition-colors group"
                >
                  <span className="truncate">{product.title}</span>
                  <ExternalLink
                    className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-hidden="true"
                  />
                </a>
              ))}
              {problem.affectedProducts.length > 20 && (
                <p className="text-xs text-muted pt-1">
                  and {problem.affectedProducts.length - 20} more
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
