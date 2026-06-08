import Script from "next/script";

import { GA_MEASUREMENT_ID } from "@/lib/analytics";

/**
 * Loads Google Analytics 4 via gtag.js — only when
 * NEXT_PUBLIC_GA_MEASUREMENT_ID is set. Renders nothing otherwise, so dev and
 * unconfigured environments stay clean. `send_page_view` is left on for the
 * initial load; SPA route changes are sent by <AnalyticsListener>.
 */
export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: true });
        `}
      </Script>
    </>
  );
}
