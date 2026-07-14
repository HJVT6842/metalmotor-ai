/**
 * Pure stock-display logic (Sprint 03.6). Single source of truth for the
 * dynamic inventory indicator, so the rules live in one testable place and are
 * never duplicated across components.
 *
 * Data comes exclusively from Shopify (see `resolveCommerce`). A `null`
 * quantity means "unknown" (e.g. the token lacks the inventory scope) — we fall
 * back to the local editorial status and NEVER fabricate a number.
 */

import { STOCK_LABEL, type StockStatus } from "@/data/home-products";

export type StockTone = "green" | "amber" | "orange" | "gray" | "brand";

export type StockDisplay = {
  readonly label: string;
  readonly tone: StockTone;
  /** True only when the product cannot be purchased (out of stock). */
  readonly soldOut: boolean;
};

/** Local editorial status → tone, used for the unknown-quantity fallback. */
const STATUS_TONE: Record<StockStatus, StockTone> = {
  in_stock: "green",
  made_to_order: "brand",
  coming_soon: "gray",
};

/**
 * Rules:
 *  - not available for sale        → "Agotado" (gray), soldOut
 *  - quantity unknown (null)       → local status pill (current behavior)
 *  - quantity 1                    → "Última unidad disponible" (orange)
 *  - quantity 2–5                  → "Solo quedan X unidades" (amber)
 *  - otherwise (>5, or oversell 0) → "Disponible" (green)
 */
export function resolveStockDisplay(
  available: boolean,
  quantityAvailable: number | null,
  fallbackStatus: StockStatus,
): StockDisplay {
  if (!available) {
    return { label: "Agotado", tone: "gray", soldOut: true };
  }
  if (quantityAvailable === null) {
    return {
      label: STOCK_LABEL[fallbackStatus],
      tone: STATUS_TONE[fallbackStatus],
      soldOut: false,
    };
  }
  if (quantityAvailable === 1) {
    return {
      label: "Última unidad disponible",
      tone: "orange",
      soldOut: false,
    };
  }
  if (quantityAvailable >= 2 && quantityAvailable <= 5) {
    return {
      label: `Solo quedan ${quantityAvailable} unidades`,
      tone: "amber",
      soldOut: false,
    };
  }
  return { label: "Disponible", tone: "green", soldOut: false };
}
