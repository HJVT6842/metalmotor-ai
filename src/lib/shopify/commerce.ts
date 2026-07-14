/**
 * Server-side resolver that makes Shopify the source of truth for a product's
 * price, availability and variant id — WITHOUT changing any component. It maps
 * the Storefront response back into the exact shapes the frozen UI already
 * consumes (`number | null` price for `formatPrice`, `StockStatus` for
 * `StockPill`), so the PDP swaps data, not markup.
 *
 * Scope (Sprint 03.2): price + availability + variant id only. Editorial
 * content, images, benefits and specs stay local in `home-products.ts`.
 *
 * Degradation: if the product has no `shopifyHandle`, Shopify is unconfigured
 * (safe mode), or the fetch fails, it returns the local values untouched — the
 * page always renders.
 */

import { type Product, type StockStatus } from "@/data/home-products";

import { getProductByHandle } from "./api";
import { isShopifyConfigured } from "./env";

export type CommerceData = {
  /** CLP amount for `formatPrice`; null → "Precio a confirmar". */
  readonly price: number | null;
  /** Mapped to the existing pill states — used as the fallback pill. */
  readonly stockStatus: StockStatus;
  /** Purchasable right now (Shopify `availableForSale`, or local heuristic). */
  readonly available: boolean;
  /**
   * Units in stock from Shopify, or `null` when unknown (token lacks inventory
   * scope, or local fallback). Drives the dynamic stock indicator; null keeps
   * the current "Disponible" behavior. Never fabricated.
   */
  readonly quantityAvailable: number | null;
  /** Shopify variant id (used by the cart). */
  readonly variantId: string | null;
  /** Where the numbers came from — useful for logging / debugging. */
  readonly source: "shopify" | "local";
};

/**
 * Availability → existing pill state, without adding a new `StockStatus`:
 * - available  → keep the product's editorial status (Disponible /
 *   Fabricación a pedido), so the delivery nuance is preserved.
 * - unavailable → "coming_soon" ("Muy pronto"), the closest not-buyable state.
 */
function mapStatus(available: boolean, local: StockStatus): StockStatus {
  return available ? local : "coming_soon";
}

export async function resolveCommerce(product: Product): Promise<CommerceData> {
  const local: CommerceData = {
    price: product.price,
    stockStatus: product.stockStatus,
    available: product.stockStatus !== "coming_soon",
    quantityAvailable: null,
    variantId: null,
    source: "local",
  };

  if (!product.shopifyHandle || !isShopifyConfigured()) {
    return local;
  }

  try {
    const shopify = await getProductByHandle(product.shopifyHandle);
    const variant = shopify?.variant;
    if (!variant) return local;

    const amount = Number(variant.price.amount);

    return {
      price: Number.isNaN(amount) ? product.price : Math.round(amount),
      stockStatus: mapStatus(variant.availableForSale, product.stockStatus),
      available: variant.availableForSale,
      quantityAvailable: variant.quantityAvailable,
      variantId: variant.id,
      source: "shopify",
    };
  } catch (error) {
    console.error(
      `Shopify: no se pudo resolver "${product.shopifyHandle}", usando datos locales.`,
      error,
    );
    return local;
  }
}
