import { describe, expect, it } from "vitest";

import { contactSchema, toLeadRecord } from "@/lib/validation";

const valid = {
  name: "Juan Pérez",
  email: "juan@example.com",
  phone: "+56 9 1234 5678",
  service: "Corte láser CNC de fibra",
  message: "Necesito cotizar 10 piezas en acero de 3mm.",
};

describe("contactSchema", () => {
  it("accepts a valid payload", () => {
    const result = contactSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = contactSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects a too-short message", () => {
    const result = contactSchema.safeParse({ ...valid, message: "hola" });
    expect(result.success).toBe(false);
  });

  it("allows empty optional phone and service", () => {
    const result = contactSchema.safeParse({
      ...valid,
      phone: "",
      service: "",
    });
    expect(result.success).toBe(true);
  });
});

describe("toLeadRecord", () => {
  it("maps empty optionals to null and sets the source", () => {
    const input = contactSchema.parse({ ...valid, phone: "", service: "" });
    const lead = toLeadRecord(input);
    expect(lead.phone).toBeNull();
    expect(lead.service).toBeNull();
    expect(lead.source).toBe("website_contact_form");
    expect(lead.email).toBe("juan@example.com");
  });

  it("does not mutate the input object", () => {
    const input = contactSchema.parse(valid);
    const snapshot = JSON.stringify(input);
    toLeadRecord(input);
    expect(JSON.stringify(input)).toBe(snapshot);
  });
});
