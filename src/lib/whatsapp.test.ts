import { describe, expect, it } from "vitest";

import {
  buildWhatsAppUrl,
  normalizeNumber,
  quotationMessage,
} from "@/lib/whatsapp";

describe("normalizeNumber", () => {
  it("strips spaces, plus signs and punctuation", () => {
    expect(normalizeNumber("+56 9 1234 5678")).toBe("56912345678");
  });

  it("returns empty string when no digits present", () => {
    expect(normalizeNumber("abc-")).toBe("");
  });
});

describe("buildWhatsAppUrl", () => {
  it("builds a bare wa.me link when no message", () => {
    expect(buildWhatsAppUrl("+56 9 1234 5678")).toBe(
      "https://wa.me/56912345678",
    );
  });

  it("appends a URL-encoded text query for messages", () => {
    const url = buildWhatsAppUrl("56912345678", "Hola, cotización");
    expect(url).toBe("https://wa.me/56912345678?text=Hola%2C%20cotizaci%C3%B3n");
  });

  it("ignores whitespace-only messages", () => {
    expect(buildWhatsAppUrl("56912345678", "   ")).toBe(
      "https://wa.me/56912345678",
    );
  });
});

describe("quotationMessage", () => {
  it("includes the service name when provided", () => {
    expect(quotationMessage("corte láser")).toContain("corte láser");
  });

  it("falls back to a generic message", () => {
    expect(quotationMessage()).toMatch(/cotización/i);
  });
});
