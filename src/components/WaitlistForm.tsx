"use client";

import { useState } from "react";
import { Mail, Check, AlertCircle, Loader2 } from "lucide-react";

interface WaitlistFormProps {
  domain?: string;
}

export function WaitlistForm({ domain }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Honeypot field
  const [honeypot, setHoneypot] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) return;
    if (honeypot) return; // Bot detected

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), domain }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErrorMessage(
          data?.error || "Could not save your email. Try again."
        );
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMessage("Could not connect. Check your internet and try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 p-4 bg-pass-bg rounded-lg border border-pass/20">
        <Check className="w-5 h-5 text-pass shrink-0" aria-hidden="true" />
        <p className="text-sm text-ink">
          You are on the list. We will email you when the Shelfmark app is
          ready.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Mail
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="you@example.com"
            disabled={status === "submitting"}
            required
            className="w-full h-12 pl-12 pr-4 text-sm bg-paper border border-line rounded-lg placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand disabled:opacity-60 transition-all"
            aria-label="Email address"
            autoComplete="email"
          />
        </div>
        <button
          type="submit"
          disabled={status === "submitting" || !email.trim()}
          className="h-12 px-5 border-2 border-brand text-brand font-medium rounded-lg hover:bg-brand hover:text-white focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 whitespace-nowrap"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              Saving
            </>
          ) : (
            "Get notified"
          )}
        </button>
      </div>

      {/* Honeypot - hidden from real users */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="absolute opacity-0 h-0 w-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      />

      {status === "error" && (
        <div className="mt-3 flex items-center gap-2 text-sm text-fail">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          {errorMessage}
        </div>
      )}
    </form>
  );
}
