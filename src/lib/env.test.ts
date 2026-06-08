import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { getNotificationsEnv } from "@/lib/env";

const KEYS = [
  "RESEND_API_KEY",
  "NOTIFICATIONS_TO_EMAIL",
  "NOTIFICATIONS_FROM_EMAIL",
] as const;

describe("getNotificationsEnv (B1)", () => {
  const original: Record<string, string | undefined> = {};

  beforeEach(() => {
    for (const k of KEYS) {
      original[k] = process.env[k];
      delete process.env[k];
    }
  });

  afterEach(() => {
    for (const k of KEYS) {
      if (original[k] === undefined) delete process.env[k];
      else process.env[k] = original[k];
    }
  });

  it("reports not-configured when RESEND_API_KEY is missing", () => {
    const result = getNotificationsEnv();
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missing).toContain("RESEND_API_KEY");
    }
  });

  it("applies default recipient and sender when only the key is set", () => {
    process.env.RESEND_API_KEY = "re_test_key";
    const result = getNotificationsEnv();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.env.resendApiKey).toBe("re_test_key");
      expect(result.env.toEmail).toBe("cotizaciones@metalmotor.cl");
      expect(result.env.fromEmail).toBe("onboarding@resend.dev");
    }
  });

  it("allows overriding recipient and sender via env", () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.NOTIFICATIONS_TO_EMAIL = "ventas@metalmotor.cl";
    process.env.NOTIFICATIONS_FROM_EMAIL = "notificaciones@metalmotor.cl";
    const result = getNotificationsEnv();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.env.toEmail).toBe("ventas@metalmotor.cl");
      expect(result.env.fromEmail).toBe("notificaciones@metalmotor.cl");
    }
  });
});
