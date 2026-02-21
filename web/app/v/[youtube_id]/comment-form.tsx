"use client";

import { useFormStatus, useFormState } from "react-dom";
import { sendGAEvent } from "@next/third-parties/google";
import { addComment } from "@/actions/comments";

type Props = {
  youtubeId: string;
  videoUuid: string;
  parentId: string | null;
  parentAuthor?: string;
  onCancel?: () => void;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-200 disabled:opacity-50 transition-colors"
    >
      {pending ? "Posting..." : "Post"}
    </button>
  );
}

export function CommentForm({
  youtubeId,
  videoUuid,
  parentId,
  parentAuthor,
  onCancel,
}: Props) {
  const [state, formAction] = useFormState(
    async (_: { error?: string } | null, formData: FormData) => {
      const content = formData.get("content") as string;
      const res = await addComment(youtubeId, videoUuid, content, parentId);
      if (!res.error) {
        sendGAEvent("event", "comment_submit", {
          video_id: videoUuid,
          is_reply: parentId !== null,
        });
      }
      return res;
    },
    null
  );

  return (
    <form action={formAction} className="mt-2 space-y-2">
      <input type="hidden" name="parentId" value={parentId ?? ""} />
      <textarea
        name="content"
        rows={2}
        maxLength={2000}
        placeholder={parentAuthor ? `Reply to ${parentAuthor}...` : "Add a comment..."}
        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-emerald-500/50 focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-colors"
        required
      />
      {state?.error && (
        <p className="text-sm text-red-400">{state.error}</p>
      )}
      <div className="flex items-center gap-2">
        <SubmitButton />
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-3 py-1.5 text-sm text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
