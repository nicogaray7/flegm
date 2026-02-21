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
        className="inline-flex flex-col items-center gap-0.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--muted)] transition-colors hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)] min-w-[56px]"
      >
        <UpvoteIcon filled={false} />
        <span className="text-xs tabular-nums">{state.count}</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`inline-flex flex-col items-center gap-0.5 rounded-xl border px-3 py-2 text-sm font-semibold transition-all min-w-[56px] ${
        state.upvoted
          ? "border-[var(--accent)] bg-[var(--accent)]/20 text-[var(--accent)]"
          : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
      }`}
    >
      <UpvoteIcon filled={state.upvoted} />
      <span className="text-xs tabular-nums">{state.count}</span>
    </button>
  );
}
