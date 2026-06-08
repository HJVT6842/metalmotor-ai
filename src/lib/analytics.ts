/**
 * Centralized GA4 analytics helper.
 *
 * - No-ops on the server and when GA is not configured / gtag not loaded, so it
 *   is safe to call from anywhere (SSR + App Router compatible).
 * - The measurement ID comes only from NEXT_PUBLIC_GA_MEASUREMENT_ID (never
 *   hardcoded). Without it, nothing is sent and no script is injected.
 *
 * Common parameters attached to every event: page_path, source_page, timestamp.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";

export function isAnalyticsEnabled(): boolean {
  return GA_MEASUREMENT_ID.length > 0;
}

export type EventParams = Record<string, string | number | boolean | undefined>;

function currentPath(): string {
  if (typeof window === "undefined") return "";
  return window.location.pathname;
}

function nowIso(): string {
  return new Date().toISOString();
}

/** Low-level GA4 event sender. No-ops on server or when gtag is unavailable. */
export function track(event: string, params: EventParams = {}): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", event, {
    page_path: currentPath(),
    source_page: currentPath(),
    timestamp: nowIso(),
    ...params,
  });
}

/** Manual SPA page_view (used on client-side route changes). */
export function pageview(path: string): void {
  if (
    typeof window === "undefined" ||
    typeof window.gtag !== "function" ||
    !GA_MEASUREMENT_ID
  ) {
    return;
  }
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
  });
}

export function trackWhatsappClick(params: EventParams = {}): void {
  track("click_whatsapp", params);
}

export function trackQuoteSubmit(params: EventParams = {}): void {
  track("submit_quote_form", params);
}

export function trackContactSubmit(params: EventParams = {}): void {
  track("submit_contact_form", params);
}

export function trackServiceView(serviceSlug: string): void {
  track("page_service_view", { service_slug: serviceSlug });
}

export function trackPhoneClick(params: EventParams = {}): void {
  track("click_phone", params);
}

export function trackEmailClick(params: EventParams = {}): void {
  track("click_email", params);
}
