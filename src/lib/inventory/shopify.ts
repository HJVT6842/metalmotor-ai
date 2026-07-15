/**
 * Shopify implementation of `InventoryProvider`. It is the ONLY place in the
 * inventory layer that knows about Shopify: it reuses the existing Shopify
 * resolver and maps its result into the source-agnostic `Inventory` shape.
 *
 * Reuses `resolveCommerce` (memoized with React `cache`), so the page can ask
 * for price and inventory separately without triggering a second network call.
 */

import { type Product } from "@/data/home-products";
import { resolveCommerce } from "@/lib/shopify/commerce";

import { type Inventory, type InventoryProvider } from "./types";

export const shopifyInventoryProvider: InventoryProvider = {
  async getInventory(product: Product): Promise<Inventory> {
    const commerce = await resolveCommerce(product);
    return {
      status: commerce.stockStatus,
      quantity: commerce.quantityAvailable,
      available: commerce.available,
    };
  },
};
