import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createEmailChannel } from "@/lib/notifications/email-resend";
import type { LeadNotification } from "@/lib/notifications/types";

const notification: LeadNotification = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Juan Pérez",
  email: "juan@example.com",
  phone: null,
  service: null,
  message: "Necesito cotizar 10 piezas en acero de 3mm.",
  source: "website_contact_form",
  receivedAt: "2026-06-03T12:00:00.000Z",
};

const ENV_KEYS = [
  "RESEND_API_KEY",
  "NOTIFICATIONS_TO_EMAIL",
  "NOTIFICATIONS_FROM_EMAIL",
] as const;

describe("createEmailChannel (B4)", () => {
  const original: Record<string, string | undefined> = {};

  beforeEach(() => {
    for (const k of ENV_KEYS) {
      original[k] = process.env[k];
      delete process.env[k];
    }
  });

  afterEach(() => {
    for (const k of ENV_KEYS) {
      if (original[k] === undefined) delete process.env[k];
      else process.env[k] = original[k];
    }
  });

  it("is not configured when RESEND_API_KEY is missing", () => {
    const channel = createEmailChannel();
    expect(channel.name).toBe("email");
    expect(channel.isConfigured).toBe(false);
  });

  it("sends via the deliverer with the rendered template and returns ok", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    const deliver = vi.fn().mockResolvedValue({ id: "email_123", error: null });
    const channel = createEmailChannel(deliver);

    expect(channel.isConfigured).toBe(true);
    const result = await channel.send(notification);

    expect(deliver).toHaveBeenCalledTimes(1);
    const msg = deliver.mock.calls[0][0];
    expect(msg.to).toBe("jantonio.vasquez.t@gmail.com");
    expect(msg.from).toBe("onboarding@resend.dev");
    expect(msg.subject).toContain("Juan Pérez");
    expect(msg.html).toContain("juan@example.com");
    expect(msg.text).toContain("Necesito cotizar");
    expect(result).toEqual({ ok: true, channel: "email", id: "email_123" });
  });

  it("maps a delivery error to ok:false without throwing", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    const deliver = vi
      .fn()
      .mockResolvedValue({ id: null, error: "Resend rejected" });
    const channel = createEmailChannel(deliver);

    const result = await channel.send(notification);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.channel).toBe("email");
      expect(result.error).toContain("Resend rejected");
    }
  });

  it("catches a thrown delivery error without propagating", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    const deliver = vi.fn().mockRejectedValue(new Error("network down"));
    const channel = createEmailChannel(deliver);

    const result = await channel.send(notification);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("network down");
    }
  });
});
