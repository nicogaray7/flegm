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
      className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm"
      aria-live="polite"
    >
      <p className="font-bold text-purple-800">
        {"\u{1F389}"} Video added! Share it with your friends
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-xl gradient-bg px-3 py-1.5 font-bold text-white hover:opacity-90 transition-all active:scale-95"
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="text-purple-600 font-semibold hover:text-purple-800 hover:underline transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
