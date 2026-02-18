import { createClient } from "@/lib/supabase/server";
import { SubmitForm } from "./submit-form";
import { SignInButton } from "./sign-in-button";
import { Header } from "@/app/components/header";

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
      <div className="min-h-screen bg-white">
        <Header />
        <main className="min-h-screen p-8 max-w-lg mx-auto">
          <h1 className="text-2xl font-semibold mb-2">
            {from === "upvote"
              ? "Sign in to upvote"
              : from === "comment"
                ? "Sign in to comment"
                : "Submit a video"}
          </h1>
          <p className="text-gray-600 mb-6">{message}</p>
          <SignInButton next={next} context={from ?? "submit"} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="min-h-screen p-8 max-w-lg mx-auto">
        <h1 className="text-2xl font-semibold mb-2">Submit a video</h1>
        <p className="text-gray-600 mb-6">
          Paste a YouTube URL. If it&apos;s already in the database, you&apos;ll be taken
          to its page. Otherwise we&apos;ll fetch details and add it.
        </p>
        <SubmitForm />
      </main>
    </div>
  );
}
