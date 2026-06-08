"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import {
  pageview,
  trackEmailClick,
  trackPhoneClick,
  trackWhatsappClick,
} from "@/lib/analytics";

/**
 * App-wide analytics wiring with zero design/UX impact:
 * - Sends a GA4 page_view on client-side route changes (the initial load is
 *   already counted by the gtag config).
 * - Delegates clicks on WhatsApp (wa.me), mailto: and tel: links to the right
 *   conversion event — so every existing CTA is tracked without editing it.
 */
export function AnalyticsListener() {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    pageview(pathname);
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as Element | null;
      const link = target?.closest?.("a");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      if (href.includes("wa.me/") || href.includes("api.whatsapp.com")) {
        trackWhatsappClick();
      } else if (href.startsWith("mailto:")) {
        trackEmailClick();
      } else if (href.startsWith("tel:")) {
        trackPhoneClick();
      }
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
