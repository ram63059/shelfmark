"use client";

import { useState } from "react";
import { Link2, Download, Check, X as XIcon, Share2 } from "lucide-react";

interface ShareBlockProps {
  domain: string;
  score: number;
  grade: string;
  ogImageUrl: string;
}

export function ShareBlock({
  domain,
  score,
  grade,
  ogImageUrl,
}: ShareBlockProps) {
  const [copied, setCopied] = useState(false);
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const reportUrl = `${siteUrl}/report/${domain}`;
  const shareText = `My store ${domain} scored ${score}/100 for AI Shopping Readiness. Check your store:`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(reportUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = reportUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareX = () => {
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(reportUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownloadImage = () => {
    const link = document.createElement("a");
    link.href = ogImageUrl;
    link.download = `shelfmark-${domain}.png`;
    link.click();
  };

  return (
    <div className="glass-panel border border-line rounded-2xl overflow-hidden shadow-lg space-y-4 p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-ink">
            Official Readiness Card
          </h3>
          <p className="text-xs text-muted">
            Shareable 1200&times;630 image card formatted for X, LinkedIn, and Reddit.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-surface border border-line hover:border-line-strong text-ink shadow-sm transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-pass" aria-hidden="true" />
                <span>Link Copied</span>
              </>
            ) : (
              <>
                <Link2 className="w-4 h-4" aria-hidden="true" />
                <span>Copy link</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleShareX}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-surface border border-line hover:border-line-strong text-ink shadow-sm transition-all cursor-pointer"
          >
            <XIcon className="w-4 h-4" aria-hidden="true" />
            <span>Share on X</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadImage}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-brand hover:bg-brand-hover text-white shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>Download PNG</span>
          </button>
        </div>
      </div>

      {/* Card Preview */}
      <div className="rounded-xl overflow-hidden border border-line bg-surface max-w-lg mx-auto shadow-inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ogImageUrl}
          alt={`Readiness badge for ${domain}`}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
      </div>
    </div>
  );
}
