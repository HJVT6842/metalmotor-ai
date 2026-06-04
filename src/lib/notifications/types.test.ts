import { describe, expect, it } from "vitest";

import { leadNotificationSchema } from "@/lib/notifications/types";

const valid = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Juan Pérez",
  email: "juan@example.com",
  phone: null,
  service: null,
  message: "Necesito cotizar 10 piezas en acero de 3mm.",
  source: "website_contact_form",
  receivedAt: "2026-06-03T12:00:00.000Z",
};

describe("leadNotificationSchema (B2)", () => {
  it("accepts a valid persisted lead notification", () => {
    expect(leadNotificationSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a missing id (notify requires a persisted lead)", () => {
    const { id: _omit, ...withoutId } = valid;
    void _omit;
    expect(leadNotificationSchema.safeParse(withoutId).success).toBe(false);
  });

  it("rejects a non-uuid id", () => {
    expect(
      leadNotificationSchema.safeParse({ ...valid, id: "not-a-uuid" }).success,
    ).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(
      leadNotificationSchema.safeParse({ ...valid, email: "nope" }).success,
    ).toBe(false);
  });
});
