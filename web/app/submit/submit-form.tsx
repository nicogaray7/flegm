"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitVideo } from "@/actions/submit";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl gradient-bg px-4 py-3 font-bold text-white hover:opacity-90 disabled:opacity-50 transition-all active:scale-[0.98]"
    >
      {pending ? "Dropping..." : "Drop it"}
    </button>
  );
}

export function SubmitForm() {
  const [state, formAction] = useFormState(submitVideo, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="url" className="block text-sm font-bold text-[var(--foreground)] mb-1.5">
          YouTube URL
        </label>
        <input
          id="url"
          name="url"
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          className="input-field"
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
