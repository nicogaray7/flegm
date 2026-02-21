"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

type Props = {
  /** Path of the video page (e.g. /v/abc123) for building share URL */
  path: string;
};

export function SubmitSuccessBanner({ path }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const url = typeof window !== "undefined" ? `${window.location.origin}${path}` : "";
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDismiss() {
    router.replace(pathname ?? path);
  }

  return (
    <div
      role="status"
      className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-3 text-sm"
      aria-live="polite"
    >
      <p className="font-medium text-[var(--accent)]">
        Video added. Share it?
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-xl bg-[var(--accent)] px-3 py-1.5 font-medium text-[var(--background)] hover:opacity-90 transition-opacity"
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="text-[var(--muted)] hover:text-[var(--foreground)] hover:underline"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
