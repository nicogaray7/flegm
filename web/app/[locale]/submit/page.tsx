import { createClient } from "@/lib/supabase/server";
import { SubmitForm } from "./submit-form";
import { GaEvent } from "@/app/components/ga-event";
import { Header } from "@/app/components/header";
import { LoginScreen } from "@/app/components/login-screen";
import { Footer } from "@/app/components/footer";
import { getServerDictionary } from "@/lib/i18n/server";
import { getAlternateLanguages, getCanonicalForLocale } from "@/lib/i18n/alternates";
import type { Locale } from "@/lib/i18n";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string; from?: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: "Drop a video",
    description:
      "Drop a YouTube video on the Flegm leaderboard. Upvote and discover the top videos.",
    alternates: {
      canonical: getCanonicalForLocale(locale as Locale, "submit"),
      languages: getAlternateLanguages("submit"),
    },
  };
}

export default async function SubmitPage({ params, searchParams }: Props) {
  const { next, from } = await searchParams;
  const { locale, t } = await getServerDictionary();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const subline =
      from === "upvote"
        ? t.submit.signInToUpvote
        : from === "comment"
          ? t.submit.signInToComment
          : t.submit.signInToSubmit;
    return (
      <div className="min-h-screen flex flex-col bg-[var(--background)]">
        <Header />
        <main className="flex-1">
          <LoginScreen
            next={next}
            context={from ?? "submit"}
            subline={subline}
            variant="signin"
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <GaEvent eventName="submit_form_view" />
      <Header />
      <main className="flex-1 px-4 py-12 max-w-lg mx-auto">
        <div className="card p-8">
          <div className="text-center mb-6">
            <span className="text-3xl mb-2 block">{"\u{1F3AC}"}</span>
            <h1 className="text-2xl font-extrabold text-[var(--foreground)]">{t.submit.title}</h1>
            <p className="text-[var(--muted)] text-sm mt-1">
              {t.submit.subtitle}
            </p>
          </div>
          <SubmitForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
