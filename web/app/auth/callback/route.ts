import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function safeRedirectPath(raw: string | null, fallback = "/"): string {
  if (!raw) return fallback;
  // Must be a relative path: starts with "/" but not "//"
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : fallback;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeRedirectPath(searchParams.get("next"), "/");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/submit?error=auth`);
}
