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
        ? "Sign in with Google to upvote."
        : from === "comment"
          ? "Sign in with Google to comment."
          : "Sign in with Google to submit a YouTube video.";
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
      <main className="flex-1 px-4 py-8 pb-24 max-w-lg mx-auto sm:pb-8">
        <div className="card p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Submit a video</h1>
          <p className="text-[var(--muted)] text-sm mb-6">
            Paste a YouTube URL to add it to the leaderboard. If it&apos;s already there,
            you&apos;ll go straight to its page.
          </p>
          <SubmitForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
