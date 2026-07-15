/**
 * Inventory layer entry point — the single swap point for the data source.
 *
 * To move inventory off Shopify (ERP, Supabase, own API, MetalMotor inventory)
 * later, implement `InventoryProvider` and point `inventoryProvider` at it.
 * No visual component changes are needed: components consume `Inventory` only.
 */

import { type Product } from "@/data/home-products";

import { shopifyInventoryProvider } from "./shopify";
import { type Inventory, type InventoryProvider } from "./types";

export { type Inventory, type InventoryProvider };

/** Active inventory source. Swap this line to change the origin. */
export const inventoryProvider: InventoryProvider = shopifyInventoryProvider;

/** Convenience wrapper used by the UI/composition layer. */
export function getInventory(product: Product): Promise<Inventory> {
  return inventoryProvider.getInventory(product);
}
