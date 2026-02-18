"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

function safeRedirectPath(raw: string | undefined, fallback = "/submit"): string {
  if (!raw) return fallback;
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : fallback;
}

export async function signInWithGoogle(next?: string) {
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";
  const redirectPath = safeRedirectPath(next);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectPath)}`,
    },
  });
  if (error) throw error;
  if (data.url) redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/submit");
}
