import { redirect } from "next/navigation";
import { getLocale } from "@/lib/i18n/server";

/**
 * Root path "/" has no segment, so it doesn't match [locale].
 * Redirect to the user's preferred locale to avoid 404.
 * (Middleware normally does this; this is a fallback if the request hits the app.)
 */
export default async function RootPage() {
  const locale = await getLocale();
  redirect(`/${locale}`);
}
