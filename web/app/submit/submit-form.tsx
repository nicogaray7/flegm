"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitVideo } from "@/actions/submit";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
    >
      {pending ? "Submitting…" : "Submit"}
    </button>
  );
}

export function SubmitForm() {
  const [state, formAction] = useFormState(submitVideo, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
          YouTube URL
        </label>
        <input
          id="url"
          name="url"
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>
      {state?.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
      <SubmitButton />
    </form>
  );
}
