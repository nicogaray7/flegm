"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/gtag";

type Props = {
  eventName: string;
  params?: Record<string, string | number | boolean>;
};

/**
 * Fires a single GA4 event on mount. Use in Server Component pages to track
 * page-level events (video_view, channel_view, leaderboard_view).
 */
export function GaEvent({ eventName, params }: Props) {
  useEffect(() => {
    trackEvent(eventName, params);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
