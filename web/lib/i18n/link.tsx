"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/locale-context";

type Props = Omit<React.ComponentProps<typeof Link>, "href"> & {
  href: string;
};

/**
 * Link that prefixes href with current locale (e.g. /leaderboard → /fr/leaderboard).
 * Use for client components. For server components, use getServerDictionary().locale and build href manually.
 */
export function LocaleLink({ href, ...rest }: Props) {
  const { locale } = useLocale();
  const localizedHref = href.startsWith("/") && !href.startsWith("//")
    ? `/${locale}${href === "/" ? "" : href}`
    : href;
  return <Link href={localizedHref} {...rest} />;
}
