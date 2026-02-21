import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

function safeRedirectPath(raw: string | null, fallback = "/submit"): string {
  if (!raw) return fallback;
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : fallback;
}

/**
 * Server-side magic link verification. Use this URL in your Supabase Magic Link
 * email template so the link works even when the browser or email client drops
 * the fragment (#access_token=...).
 *
 * In Supabase Dashboard: Authentication → Email Templates → Magic Link.
 * Set the link to:
 *   {{ .SiteURL }}/auth/verify-email?token_hash={{ .TokenHash }}&type=email&next=/submit
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") ?? "email";
  const next = safeRedirectPath(searchParams.get("next"), "/submit");
  const origin = request.nextUrl.origin;

  if (!tokenHash) {
    return NextResponse.redirect(`${origin}/submit?error=auth`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: type as "email" | "magiclink",
  });

  if (error) {
    return NextResponse.redirect(`${origin}/auth/confirm?error=invalid`);
  }

  const sep = next.includes("?") ? "&" : "?";
  return NextResponse.redirect(`${origin}${next}${sep}signed_in=1`);
}
