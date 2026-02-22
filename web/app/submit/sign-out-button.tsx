"use client";

import { useTransition } from "react";
import { signOut } from "@/actions/auth";
import { useTranslation } from "@/lib/i18n/locale-context";

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();
  const t = useTranslation();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => signOut())}
      disabled={isPending}
      className="text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-50 transition-colors"
    >
      {isPending ? t.auth.signingOut : t.auth.signOut}
    </button>
  );
}
