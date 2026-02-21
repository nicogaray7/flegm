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
      className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm"
      aria-live="polite"
    >
      <p className="font-medium text-emerald-800">
        Video added. Share it?
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-lg bg-emerald-600 px-3 py-1.5 font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="text-emerald-700 hover:text-emerald-900 hover:underline"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
