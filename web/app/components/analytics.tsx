"use client";

import Script from "next/script";
import { useConsent } from "@/lib/cookie-consent";

/**
 * Loads GA4 with Google Consent Mode v2.
 * - Sets default consent to "denied" before loading the script.
 * - The CookieConsentProvider updates consent when the user decides.
 */
export function Analytics({ gaId }: { gaId: string }) {
  const { consent } = useConsent();

  return (
    <>
      <Script
        id="gtag-consent-default"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'wait_for_update': 500
            });
          `,
        }}
      />
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
            gtag('consent', 'update', {
              'analytics_storage': '${consent.analytics ? "granted" : "denied"}',
              'ad_storage': '${consent.marketing ? "granted" : "denied"}',
              'ad_user_data': '${consent.marketing ? "granted" : "denied"}',
              'ad_personalization': '${consent.marketing ? "granted" : "denied"}'
            });
          `,
        }}
      />
    </>
  );
}
