"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/gtag";

/**
 * Fires sign_in_success when the URL has signed_in=1 (after auth redirect),
 * then removes the param from the URL so it does not fire again.
 */
export function SignInSuccessTracker() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    const signedIn = searchParams.get("signed_in");
    if (signedIn !== "1") return;

    fired.current = true;
    trackEvent("sign_in_success");

    const next = new URLSearchParams(searchParams);
    next.delete("signed_in");
    const query = next.toString();
    const url = pathname + (query ? `?${query}` : "");
    router.replace(url);
  }, [pathname, searchParams, router]);

  return null;
}
