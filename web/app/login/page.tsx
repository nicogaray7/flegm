import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { LoginScreen } from "@/app/components/login-screen";

export const metadata = {
  title: "Log in",
  description: "Log in to Flegm to submit, upvote, and discover the top YouTube videos.",
};

type Props = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { next } = await searchParams;
    redirect(next?.startsWith("/") && !next.startsWith("//") ? next : "/");
  }

  const { next } = await searchParams;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Header />
      <main className="flex-1">
        <LoginScreen next={next} context="login" variant="login" />
      </main>
      <Footer />
    </div>
  );
}
