"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/gtag";

type Props = {
  href: string;
  source: "header" | "hero";
  className?: string;
  children: React.ReactNode;
};

export function SubmitIntentLink({ href, source, className, children }: Props) {
  function handleClick() {
    trackEvent("submit_intent", { source });
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
