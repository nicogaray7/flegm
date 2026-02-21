"use client";

import { useFormStatus, useFormState } from "react-dom";
import { trackEvent } from "@/lib/gtag";
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
      className="rounded-xl gradient-bg px-4 py-1.5 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50 transition-all active:scale-95"
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
        trackEvent("comment_submit", {
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
        placeholder={parentAuthor ? `Reply to ${parentAuthor}...` : "Share your thoughts..."}
        className="input-field text-sm resize-none"
        required
      />
      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
      <div className="flex items-center gap-2">
        <SubmitButton />
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl px-3 py-1.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-zinc-100 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
