import { describe, expect, it } from "vitest";

import { resolveStockDisplay } from "./stock";

describe("resolveStockDisplay (Sprint 03.6)", () => {
  it("CASO 1 — stock > 5: Disponible (verde), sin cantidad", () => {
    expect(resolveStockDisplay(true, 8, "in_stock")).toEqual({
      label: "Disponible",
      tone: "green",
      soldOut: false,
    });
  });

  it("CASO 2 — stock 2–5: 🔥 Solo quedan X unidades disponibles (ámbar)", () => {
    expect(resolveStockDisplay(true, 5, "in_stock")).toEqual({
      label: "🔥 Solo quedan 5 unidades disponibles",
      tone: "amber",
      soldOut: false,
    });
    expect(resolveStockDisplay(true, 3, "in_stock").label).toBe(
      "🔥 Solo quedan 3 unidades disponibles",
    );
    expect(resolveStockDisplay(true, 2, "in_stock").label).toBe(
      "🔥 Solo quedan 2 unidades disponibles",
    );
  });

  it("CASO 3 — stock 1: ⚠️ Última unidad disponible (naranja)", () => {
    expect(resolveStockDisplay(true, 1, "in_stock")).toEqual({
      label: "⚠️ Última unidad disponible",
      tone: "orange",
      soldOut: false,
    });
  });

  it("CASO 4 — no disponible: Agotado (gris) y soldOut", () => {
    expect(resolveStockDisplay(false, 0, "in_stock")).toEqual({
      label: "Agotado",
      tone: "gray",
      soldOut: true,
    });
    expect(resolveStockDisplay(false, null, "in_stock").soldOut).toBe(true);
  });

  it("FALLBACK — cantidad desconocida (null) usa el estado local", () => {
    expect(resolveStockDisplay(true, null, "in_stock")).toEqual({
      label: "Disponible",
      tone: "green",
      soldOut: false,
    });
    expect(resolveStockDisplay(true, null, "made_to_order").tone).toBe("brand");
  });

  it("no inventa cantidades: disponible con 0 (oversell) → Disponible", () => {
    expect(resolveStockDisplay(true, 0, "in_stock").label).toBe("Disponible");
  });
});
