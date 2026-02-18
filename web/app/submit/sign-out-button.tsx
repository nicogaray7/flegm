"use client";

import { useTransition } from "react";
import { signOut } from "@/actions/auth";

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => signOut())}
      disabled={isPending}
      className="text-xs font-medium text-slate-500 hover:text-slate-700 disabled:opacity-50"
    >
      {isPending ? "Signing out…" : "Sign out"}
    </button>
  );
}
