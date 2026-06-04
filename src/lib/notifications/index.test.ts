import { describe, expect, it, vi } from "vitest";

import { notifyNewLead } from "@/lib/notifications";
import type {
  LeadNotification,
  NotificationChannel,
  NotifyResult,
} from "@/lib/notifications/types";

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

function channel(
  name: string,
  isConfigured: boolean,
  send: (n: LeadNotification) => Promise<NotifyResult>,
): NotificationChannel {
  return { name, isConfigured, send };
}

describe("notifyNewLead dispatcher (B5)", () => {
  it("skips unconfigured channels and never calls their send", async () => {
    const send = vi.fn();
    const results = await notifyNewLead(notification, [
      channel("email", false, send),
    ]);
    expect(send).not.toHaveBeenCalled();
    expect(results).toEqual([]);
  });

  it("invokes a configured channel exactly once and returns its result", async () => {
    const send = vi
      .fn()
      .mockResolvedValue({ ok: true, channel: "email", id: "x" });
    const results = await notifyNewLead(notification, [
      channel("email", true, send),
    ]);
    expect(send).toHaveBeenCalledTimes(1);
    expect(results).toEqual([{ ok: true, channel: "email", id: "x" }]);
  });

  it("catches a throwing channel and reports ok:false (never propagates)", async () => {
    const throwing = channel("email", true, () => {
      throw new Error("boom");
    });
    let threw = false;
    let results: NotifyResult[] = [];
    try {
      results = await notifyNewLead(notification, [throwing]);
    } catch {
      threw = true;
    }
    expect(threw).toBe(false);
    expect(results[0].ok).toBe(false);
  });
});
