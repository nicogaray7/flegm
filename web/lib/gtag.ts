/**
 * Thin wrapper around window.gtag for type-safe event tracking.
 * Works with our custom Analytics component (no dependency on @next/third-parties).
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params ?? {});
}

export function setUserId(userId: string | null) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("set", { user_id: userId ?? undefined });
}
