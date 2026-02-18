"use client";

import { useTransition } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { signInWithGoogle } from "@/actions/auth";

type Props = { next?: string; context?: string };

export function SignInButton({ next, context = "submit" }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    sendGAEvent("event", "sign_in_start", { from_context: context });
    startTransition(() => signInWithGoogle(next));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="rounded bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800 disabled:opacity-50 inline-flex items-center gap-2"
    >
      {isPending ? "Redirecting…" : "Sign in with Google"}
    </button>
  );
}
