import Link from "next/link";
import { EmailSignInForm } from "@/app/components/email-sign-in-form";
import { SignInButton } from "@/app/submit/sign-in-button";
import { getServerDictionary } from "@/lib/i18n/server";

type Props = {
  next?: string;
  context?: string;
  subline?: string;
  variant?: "welcome" | "signin" | "login";
};

export async function LoginScreen({
  next,
  context = "submit",
  subline,
  variant = "welcome",
}: Props) {
  const { t } = await getServerDictionary();

  const headlines = {
    welcome: t.auth.welcomeTo,
    signin: t.auth.signInTo,
    login: t.auth.logInTo,
  } as const;
  const headline = headlines[variant];

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <span className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl gradient-bg text-2xl font-black text-white shadow-lg shadow-purple-500/20 mb-4">
            F
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-3xl">
            {headline}
          </h1>
          {subline && (
            <p className="mt-2 text-sm text-[var(--muted)]">{subline}</p>
          )}
        </div>

        <div className="space-y-4">
          <EmailSignInForm next={next} />
          <div className="relative">
            <span className="bg-[var(--background)] relative z-10 flex justify-center text-xs font-semibold text-[var(--muted)]">
              {t.auth.or}
            </span>
            <span className="absolute inset-0 flex items-center" aria-hidden>
              <span className="w-full border-t border-[var(--border)]" />
            </span>
          </div>
          <SignInButton
            next={next}
            context={context}
            label={t.auth.continueWithGoogle}
            className="w-full justify-center py-3 text-base"
          />
        </div>

        <p className="text-center text-xs text-[var(--muted)] leading-relaxed">
          {t.auth.byContAccept}{" "}
          <Link
            href="/terms"
            className="underline hover:text-purple-600 transition-colors"
          >
            {t.auth.termsOfUse}
          </Link>{" "}
          {t.auth.and}{" "}
          <Link
            href="/privacy"
            className="underline hover:text-purple-600 transition-colors"
          >
            {t.auth.privacyPolicy}
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
