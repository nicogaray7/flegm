"use client";

import Link from "next/link";
import { sendGAEvent } from "@next/third-parties/google";

type Props = {
  href: string;
  source: "header" | "hero";
  className?: string;
  children: React.ReactNode;
};

export function SubmitIntentLink({ href, source, className, children }: Props) {
  function handleClick() {
    sendGAEvent("event", "submit_intent", { source });
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
