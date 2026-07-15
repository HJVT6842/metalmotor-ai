/**
 * Inventory abstraction (Sprint 03.6.1). Decouples "what the UI needs to know
 * about stock" from "where the numbers come from". Components depend on this
 * source-agnostic shape only — never on Shopify.
 *
 * A future source (ERP, Supabase, propietary API, MetalMotor inventory) just
 * needs to implement `InventoryProvider`; no visual component changes.
 */

import { type Product, type StockStatus } from "@/data/home-products";

export type Inventory = {
  /** Editorial/base status used as the fallback pill when quantity is unknown. */
  readonly status: StockStatus;
  /** Units in stock, or `null` when unknown (never fabricated). */
  readonly quantity: number | null;
  /** Whether the product is purchasable right now. */
  readonly available: boolean;
};

/** A swappable inventory source. Shopify is the current implementation. */
export interface InventoryProvider {
  readonly getInventory: (product: Product) => Promise<Inventory>;
}
