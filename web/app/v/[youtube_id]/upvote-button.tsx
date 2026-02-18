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
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
      >
        <span aria-hidden>△</span>
        {state.count} upvote{state.count !== 1 ? "s" : ""}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
        state.upvoted
          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <span aria-hidden>{state.upvoted ? "▲" : "△"}</span>
      {state.count} upvote{state.count !== 1 ? "s" : ""}
    </button>
  );
}
