"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitVideo } from "@/actions/submit";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 font-semibold text-white hover:bg-emerald-600 disabled:opacity-50 transition-colors"
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
        <label htmlFor="url" className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
          YouTube URL
        </label>
        <input
          id="url"
          name="url"
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full rounded-lg border border-[var(--border)] bg-zinc-50 px-3 py-2.5 text-[var(--foreground)] placeholder-[var(--muted-light)] focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-colors"
          required
        />
      </div>
      {state?.error && (
        <p className="text-sm text-red-600" role="alert">{state.error}</p>
      )}
      <SubmitButton />
    </form>
  );
}
