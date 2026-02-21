"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitVideo } from "@/actions/submit";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-white px-4 py-2.5 font-semibold text-zinc-900 hover:bg-zinc-200 disabled:opacity-50 transition-colors"
    >
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}

export function SubmitForm() {
  const [state, formAction] = useFormState(submitVideo, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-zinc-400 mb-1.5">
          YouTube URL
        </label>
        <input
          id="url"
          name="url"
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-white placeholder-zinc-600 focus:border-emerald-500/50 focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-colors"
          required
        />
      </div>
      {state?.error && (
        <p className="text-sm text-red-400" role="alert">
          {state.error}
        </p>
      )}
      <SubmitButton />
    </form>
  );
}
