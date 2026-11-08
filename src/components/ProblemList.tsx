"use client";

import { useState } from "react";
import {
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Wrench,
  HelpCircle,
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
      <div className="glass-panel p-6 rounded-2xl border border-line text-center text-sm text-muted">
        No critical problems identified across audited listings.
      </div>
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
  const isFail = problem.severity === "fail";

  const Icon = isFail ? XCircle : AlertTriangle;
  const colorClass = isFail ? "text-fail" : "text-warn";
  const badgeBg = isFail ? "bg-fail-bg text-fail border-fail/30" : "bg-warn-bg text-warn border-warn/30";

  return (
    <div className="glass-panel rounded-2xl border border-line overflow-hidden shadow-sm hover:border-line-strong transition-all">
      <div className="p-5 sm:p-6 space-y-4">
        {/* Top Header: Badge & Summary */}
        <div className="flex items-start gap-3.5">
          <div className="mt-0.5 shrink-0">
            <Icon className={`w-5 h-5 ${colorClass}`} aria-hidden="true" />
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badgeBg}`}>
                {isFail ? "Critical Issue" : "Optimization Warning"}
              </span>
              <span className="text-xs font-semibold text-muted">
                {problem.checkName}
              </span>
            </div>

            <h4 className="text-base sm:text-lg font-bold text-ink">
              {problem.summary}
            </h4>
          </div>
        </div>

        {/* Why it matters & How to fix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-surface/50 border border-line text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-ink">
              <HelpCircle className="w-3.5 h-3.5 text-muted" aria-hidden="true" />
              <span>Why AI assistants care</span>
            </div>
            <p className="text-muted leading-relaxed">{problem.whyItMatters}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-brand-light/40 border border-brand/20 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-brand">
              <Wrench className="w-3.5 h-3.5 text-brand" aria-hidden="true" />
              <span>How to fix manually</span>
            </div>
            <p className="text-ink leading-relaxed">{problem.howToFix}</p>
          </div>
        </div>
      </div>

      {/* Expandable list of affected products */}
      {problem.affectedProducts.length > 0 && (
        <div className="border-t border-line bg-surface/30">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="w-full px-5 py-3 flex items-center justify-between text-xs font-semibold text-muted hover:text-ink transition-colors cursor-pointer"
            aria-expanded={expanded}
          >
            <span>
              View {problem.affectedProducts.length} affected product listing
              {problem.affectedProducts.length !== 1 ? "s" : ""}
            </span>
            {expanded ? (
              <ChevronUp className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          {expanded && (
            <div className="px-5 pb-4 pt-1 space-y-2 divide-y divide-line/40">
              {problem.affectedProducts.slice(0, 15).map((product, i) => (
                <div key={i} className="pt-2 flex items-center justify-between gap-4">
                  <span className="text-xs text-ink truncate font-medium">
                    {product.title}
                  </span>
                  <a
                    href={`https://${storeDomain}/products/${product.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-brand hover:underline shrink-0 font-medium"
                  >
                    <span>View listing</span>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                </div>
              ))}
              {problem.affectedProducts.length > 15 && (
                <p className="text-[11px] text-muted pt-2">
                  and {problem.affectedProducts.length - 15} additional listings...
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
