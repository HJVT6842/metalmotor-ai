import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the server boundaries so the route is tested in isolation.
const { getSupabaseAdmin, notifyNewLead } = vi.hoisted(() => ({
  getSupabaseAdmin: vi.fn(),
  notifyNewLead: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({ getSupabaseAdmin }));
vi.mock("@/lib/notifications", () => ({ notifyNewLead }));

import { POST } from "@/app/api/contact/route";

const VALID = {
  name: "Juan Pérez",
  email: "juan@example.com",
  phone: "+56 9 1234 5678",
  service: "Corte láser CNC de fibra",
  message: "Necesito cotizar 10 piezas en acero de 3mm.",
};

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

/** Supabase client whose insert→select→single resolves to a persisted row. */
function fakeSupabase(insertSingle: ReturnType<typeof vi.fn>) {
  return {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({ single: insertSingle })),
      })),
    })),
  };
}

describe("POST /api/contact — notification wiring (B6)", () => {
  beforeEach(() => {
    getSupabaseAdmin.mockReset();
    notifyNewLead.mockReset();
    notifyNewLead.mockResolvedValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("(i) persists a valid lead and dispatches exactly one notification with the id", async () => {
    const insertSingle = vi
      .fn()
      .mockResolvedValue({ data: { id: "lead-uuid-1" }, error: null });
    getSupabaseAdmin.mockReturnValue(fakeSupabase(insertSingle));

    const res = await POST(makeRequest(VALID));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(insertSingle).toHaveBeenCalledTimes(1);
    expect(notifyNewLead).toHaveBeenCalledTimes(1);
    expect(notifyNewLead.mock.calls[0][0]).toMatchObject({
      id: "lead-uuid-1",
      email: "juan@example.com",
    });
  });

  it("(ii) keeps the lead and still returns ok when notification fails", async () => {
    const insertSingle = vi
      .fn()
      .mockResolvedValue({ data: { id: "lead-uuid-2" }, error: null });
    getSupabaseAdmin.mockReturnValue(fakeSupabase(insertSingle));
    notifyNewLead.mockRejectedValue(new Error("smtp down"));

    const res = await POST(makeRequest(VALID));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(insertSingle).toHaveBeenCalledTimes(1); // lead persisted
  });

  it("(iii) never persists or notifies on a honeypot hit", async () => {
    const insertSingle = vi.fn();
    getSupabaseAdmin.mockReturnValue(fakeSupabase(insertSingle));

    // A filled honeypot must never reach persistence or notification, regardless
    // of whether it is rejected (422) or silently accepted.
    const res = await POST(makeRequest({ ...VALID, company: "spam-bot" }));
    await res.json();

    expect(insertSingle).not.toHaveBeenCalled();
    expect(notifyNewLead).not.toHaveBeenCalled();
  });

  it("(iv) does not notify when Supabase is unconfigured", async () => {
    getSupabaseAdmin.mockReturnValue(null);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const res = await POST(makeRequest(VALID));
    const json = await res.json();

    expect(json.ok).toBe(true);
    expect(notifyNewLead).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalled();
  });

  it("rejects an invalid payload with 422 and never notifies", async () => {
    getSupabaseAdmin.mockReturnValue(null);
    const res = await POST(makeRequest({ name: "x", email: "bad", message: "hi" }));
    expect(res.status).toBe(422);
    expect(notifyNewLead).not.toHaveBeenCalled();
  });
});
