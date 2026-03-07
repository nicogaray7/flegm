"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { submitVideo } from "@/actions/submit";
import { trackEvent } from "@/lib/gtag";
import { useTranslation } from "@/lib/i18n/locale-context";

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslation();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl gradient-bg px-4 py-3 font-bold text-white hover:opacity-90 disabled:opacity-50 transition-all active:scale-[0.98]"
    >
      {pending ? t.submit.buttonSubmitting : t.submit.buttonSubmit}
    </button>
  );
}

export function SubmitForm() {
  const [state, formAction] = useFormState(submitVideo, null);
  const t = useTranslation();
  const prevError = useRef(state?.error);

  useEffect(() => {
    if (state?.error && state.error !== prevError.current) {
      trackEvent("submit_error", { error: state.error });
    }
    prevError.current = state?.error;
  }, [state?.error]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="url" className="block text-sm font-bold text-[var(--foreground)] mb-1.5">
          {t.submit.label}
        </label>
        <input
          id="url"
          name="url"
          type="url"
          placeholder={t.submit.placeholder}
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
