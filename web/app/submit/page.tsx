import { createClient } from "@/lib/supabase/server";
import { SubmitForm } from "./submit-form";
import { SignInButton } from "./sign-in-button";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";

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
      <div className="prismatic-bg min-h-screen">
        <Header />
        <main className="relative z-10 flex-1 px-4 pt-16 pb-12 max-w-lg mx-auto">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              {from === "upvote"
                ? "Sign in to upvote"
                : from === "comment"
                  ? "Sign in to comment"
                  : "Submit a video"}
            </h1>
            <p className="text-zinc-500 text-sm mb-6">{message}</p>
            <SignInButton next={next} context={from ?? "submit"} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="prismatic-bg min-h-screen">
      <Header />
      <main className="relative z-10 flex-1 px-4 pt-16 pb-12 max-w-lg mx-auto">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Submit a video</h1>
          <p className="text-zinc-500 text-sm mb-6">
            Paste a YouTube URL. If it&apos;s already in the database, you&apos;ll be taken
            to its page. Otherwise we&apos;ll fetch details and add it.
          </p>
          <SubmitForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
