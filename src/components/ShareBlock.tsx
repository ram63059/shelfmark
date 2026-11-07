"use client";

import { useState } from "react";
import { Link2, Share2, Download, Check, X as XIcon } from "lucide-react";

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
  const shareText = `My store scored ${score}/100 for AI shopping readiness. Check yours:`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(reportUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
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
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(reportUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownloadImage = () => {
    const link = document.createElement("a");
    link.href = ogImageUrl;
    link.download = `shelfmark-${domain}.png`;
    link.click();
  };

  return (
    <div className="border border-line rounded-xl overflow-hidden">
      {/* OG Image Preview */}
      <div className="bg-mist p-4 border-b border-line">
        <div className="aspect-[1200/630] max-w-md mx-auto bg-paper rounded-lg overflow-hidden border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ogImageUrl}
            alt={`Shelfmark score card for ${domain}: ${score}/100, ${grade}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>

      {/* Share buttons */}
      <div className="p-4 flex flex-wrap gap-3">
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-line rounded-lg hover:bg-mist transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-pass" aria-hidden="true" />
              Copied
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4" aria-hidden="true" />
              Copy link
            </>
          )}
        </button>

        <button
          onClick={handleShareX}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-line rounded-lg hover:bg-mist transition-colors"
        >
          <XIcon className="w-4 h-4" aria-hidden="true" />
          Share on X
        </button>

        <button
          onClick={handleDownloadImage}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-line rounded-lg hover:bg-mist transition-colors"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          Download image
        </button>
      </div>
    </div>
  );
}
