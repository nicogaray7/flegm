import Link from "next/link";
import { EmailSignInForm } from "@/app/components/email-sign-in-form";
import { SignInButton } from "@/app/submit/sign-in-button";

type Props = {
  /** Redirect path after sign-in */
  next?: string;
  /** Context for analytics (e.g. "submit", "upvote", "comment") */
  context?: string;
  /** Optional subline below the headline */
  subline?: string;
  /** Headline variant: same layout as clip.farm/login */
  variant?: "welcome" | "signin" | "login";
};

const headlines = {
  welcome: "Welcome to Flegm",
  signin: "Sign in to Flegm",
  login: "Log in to Flegm",
} as const;

export function LoginScreen({
  next,
  context = "submit",
  subline,
  variant = "welcome",
}: Props) {
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
              or
            </span>
            <span className="absolute inset-0 flex items-center" aria-hidden>
              <span className="w-full border-t border-[var(--border)]" />
            </span>
          </div>
          <SignInButton
            next={next}
            context={context}
            label="Continue with Google"
            className="w-full justify-center py-3 text-base"
          />
        </div>

        <p className="text-center text-xs text-[var(--muted)] leading-relaxed">
          By continuing, you accept our{" "}
          <Link
            href="/terms"
            className="underline hover:text-purple-600 transition-colors"
          >
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline hover:text-purple-600 transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
