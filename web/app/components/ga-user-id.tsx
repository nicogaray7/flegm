"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { setUserId } from "@/lib/gtag";

/**
 * Syncs the authenticated user's ID to GA4 for cross-session analysis.
 * Uses onAuthStateChange so it reacts to sign-in/sign-out without a page reload.
 */
export function GaUserId() {
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
