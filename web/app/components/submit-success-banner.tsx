"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { trackEvent } from "@/lib/gtag";
import { useTranslation } from "@/lib/i18n/locale-context";

type Props = {
  /** Path of the video page (e.g. /v/abc123) for building share URL */
  path: string;
};

export function SubmitSuccessBanner({ path }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const t = useTranslation();

  function handleCopy() {
    const url = typeof window !== "undefined" ? `${window.location.origin}${path}` : "";
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      trackEvent("share_click", { method: "copy_link", content_type: "video", item_id: path });
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
        {"\u{1F389}"} {t.banner.videoAdded}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-xl gradient-bg px-3 py-1.5 font-bold text-white hover:opacity-90 transition-all active:scale-95"
        >
          {copied ? t.banner.copied : t.banner.copyLink}
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="text-purple-600 font-semibold hover:text-purple-800 hover:underline transition-colors"
        >
          {t.banner.dismiss}
        </button>
      </div>
    </div>
  );
}
