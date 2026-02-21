import { createClient } from "@/lib/supabase/server";
import { SubmitForm } from "./submit-form";
import { GaEvent } from "@/app/components/ga-event";
import { Header } from "@/app/components/header";
import { LoginScreen } from "@/app/components/login-screen";
import { Footer } from "@/app/components/footer";

export const metadata = {
  title: "Submit a video",
  description:
    "Add a YouTube video to the Flegm leaderboard. Submit, upvote, and discover the top videos.",
};

type Props = { searchParams: Promise<{ next?: string; from?: string }> };

export default async function SubmitPage({ searchParams }: Props) {
  const { next, from } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const subline =
      from === "upvote"
        ? "Sign in to upvote your faves"
        : from === "comment"
          ? "Sign in to join the convo"
          : "Sign in to drop a video";
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
            <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Drop a video</h1>
            <p className="text-[var(--muted)] text-sm mt-1">
              Paste a YouTube link and let the community decide if it&apos;s fire
            </p>
          </div>
          <SubmitForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
