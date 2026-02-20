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
      className="text-xs font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors"
    >
      {isPending ? "Signing out…" : "Sign out"}
    </button>
  );
}
