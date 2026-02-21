import { createClient } from "@/lib/supabase/server";
import { SubmitForm } from "./submit-form";
import { SignInButton } from "./sign-in-button";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";

export const metadata = {
  title: "Submit a video",
  description:
    "Add a YouTube video to the Flegm leaderboard. Submit, upvote, and discover the top videos.",
};

type Props = { searchParams: Promise<{ next?: string; from?: string }> };

const AUTH_WALL_MESSAGES: Record<string, string> = {
  upvote: "Sign in with Google to upvote.",
  comment: "Sign in with Google to comment.",
  submit: "Sign in with Google to submit a YouTube video.",
};

export default async function SubmitPage({ searchParams }: Props) {
  const { next, from } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const message =
      (from && AUTH_WALL_MESSAGES[from]) || AUTH_WALL_MESSAGES.submit;
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <main className="flex-1 px-4 py-12 max-w-lg mx-auto">
          <div className="card p-8">
            <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
              {from === "upvote"
                ? "Sign in to upvote"
                : from === "comment"
                  ? "Sign in to comment"
                  : "Submit a video"}
            </h1>
            <p className="text-[var(--muted)] text-sm mb-6">{message}</p>
            <SignInButton next={next} context={from ?? "submit"} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <main className="flex-1 px-4 py-12 max-w-lg mx-auto">
        <div className="card p-8">
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
