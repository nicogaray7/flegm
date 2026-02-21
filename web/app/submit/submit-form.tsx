"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitVideo } from "@/actions/submit";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-[var(--accent)] px-4 py-2.5 font-semibold text-[var(--background)] hover:opacity-90 disabled:opacity-50 transition-opacity"
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
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[var(--foreground)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-colors"
          required
        />
      </div>
      {state?.error && (
        <p className="text-sm text-red-400" role="alert">{state.error}</p>
      )}
      <SubmitButton />
    </form>
  );
}
