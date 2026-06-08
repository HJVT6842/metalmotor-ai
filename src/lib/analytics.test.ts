import { afterEach, describe, expect, it, vi } from "vitest";

import {
  track,
  trackQuoteSubmit,
  trackServiceView,
  trackWhatsappClick,
} from "@/lib/analytics";

type WinLike = { gtag: ReturnType<typeof vi.fn>; location: { pathname: string; href: string } };

function withWindow(): WinLike {
  const win: WinLike = {
    gtag: vi.fn(),
    location: { pathname: "/corte-laser-cnc", href: "https://www.metalmotor.cl/corte-laser-cnc" },
  };
  (globalThis as unknown as { window: WinLike }).window = win;
  return win;
}

afterEach(() => {
  delete (globalThis as unknown as { window?: unknown }).window;
  vi.restoreAllMocks();
});

describe("analytics (SSR-safe)", () => {
  it("no-ops without window (server) and never throws", () => {
    expect(() => trackWhatsappClick()).not.toThrow();
    expect(() => track("any_event")).not.toThrow();
  });

  it("no-ops when gtag is not present", () => {
    (globalThis as unknown as { window: object }).window = {
      location: { pathname: "/", href: "https://x" },
    };
    expect(() => trackWhatsappClick()).not.toThrow();
  });

  it("sends click_whatsapp with common params", () => {
    const win = withWindow();
    trackWhatsappClick({ source_page: "/" });
    expect(win.gtag).toHaveBeenCalledTimes(1);
    const [type, name, params] = win.gtag.mock.calls[0];
    expect(type).toBe("event");
    expect(name).toBe("click_whatsapp");
    expect(params).toMatchObject({ page_path: "/corte-laser-cnc", source_page: "/" });
    expect(typeof params.timestamp).toBe("string");
  });

  it("sends submit_quote_form", () => {
    const win = withWindow();
    trackQuoteSubmit({ service: "Corte Láser CNC" });
    const [, name, params] = win.gtag.mock.calls[0];
    expect(name).toBe("submit_quote_form");
    expect(params.service).toBe("Corte Láser CNC");
  });

  it("sends page_service_view with service_slug", () => {
    const win = withWindow();
    trackServiceView("portones-metalicos");
    const [, name, params] = win.gtag.mock.calls[0];
    expect(name).toBe("page_service_view");
    expect(params.service_slug).toBe("portones-metalicos");
  });
});
