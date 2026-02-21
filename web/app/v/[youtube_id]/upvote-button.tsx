"use client";

import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { toggleUpvote } from "@/actions/upvote";

type Props = {
  videoUuid: string;
  initialCount: number;
  initialUpvoted: boolean;
  signedIn: boolean;
  signInNext?: string;
};

function UpvoteIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="10" viewBox="0 0 12 8" fill="none" className="text-current">
      <path
        d="M6 0L11.196 7.5H0.804L6 0Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.5}
      />
    </svg>
  );
}

export function UpvoteButton({
  videoUuid,
  initialCount,
  initialUpvoted,
  signedIn,
  signInNext = "/submit",
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useOptimistic(
    { count: initialCount, upvoted: initialUpvoted },
    (prev, next: { count: number; upvoted: boolean }) => next
  );

  function handleClick() {
    if (!signedIn) return;
    startTransition(async () => {
      const willUpvote = !state.upvoted;
      setState({
        count: state.upvoted ? state.count - 1 : state.count + 1,
        upvoted: !state.upvoted,
      });
      const result = await toggleUpvote(videoUuid);
      if (result.error) {
        setState({ count: state.count, upvoted: state.upvoted });
      } else {
        sendGAEvent("event", "video_upvote", {
          video_id: videoUuid,
          action: willUpvote ? "upvote" : "undo",
        });
      }
    });
  }

  const authWallHref = `/submit?from=upvote&next=${encodeURIComponent(signInNext)}`;

  if (!signedIn) {
    return (
      <Link
        href={authWallHref}
        className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--muted)] transition-colors hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]"
      >
        <UpvoteIcon filled={false} />
        <span>{state.count}</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-all ${
        state.upvoted
          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
          : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]"
      }`}
    >
      <UpvoteIcon filled={state.upvoted} />
      <span>{state.count}</span>
    </button>
  );
}
