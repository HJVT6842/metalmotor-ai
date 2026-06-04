import { describe, expect, it } from "vitest";

import { renderNewLeadEmail } from "@/lib/notifications/templates/new-lead";
import type { LeadNotification } from "@/lib/notifications/types";

const base: LeadNotification = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Juan Pérez",
  email: "juan@example.com",
  phone: "+56 9 1234 5678",
  service: "Corte láser CNC de fibra",
  message: "Necesito cotizar 10 piezas en acero de 3mm.",
  source: "website_contact_form",
  receivedAt: "2026-06-03T12:00:00.000Z",
};

describe("renderNewLeadEmail (B3)", () => {
  it("puts the lead name in the subject", () => {
    const { subject } = renderNewLeadEmail(base);
    expect(subject).toContain("Juan Pérez");
    expect(subject.toLowerCase()).toContain("cotización");
  });

  it("includes email and message in both html and text", () => {
    const { html, text } = renderNewLeadEmail(base);
    for (const body of [html, text]) {
      expect(body).toContain("juan@example.com");
      expect(body).toContain("Necesito cotizar 10 piezas");
    }
  });

  it("renders 'No indicado' for null phone and service", () => {
    const { text } = renderNewLeadEmail({ ...base, phone: null, service: null });
    expect(text).toContain("No indicado");
  });

  it("does not mutate the input notification", () => {
    const snapshot = JSON.stringify(base);
    renderNewLeadEmail(base);
    expect(JSON.stringify(base)).toBe(snapshot);
  });
});
