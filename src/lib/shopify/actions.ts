"use server";

/**
 * Server Actions: the ONLY bridge between the client cart and Shopify. All
 * Storefront calls run here on the server, so the private Headless token never
 * reaches the browser. Actions never throw across the boundary — they return a
 * serialisable discriminated result the client can render directly.
 *
 * The client passes a product `handle`; the variant is resolved server-side, so
 * the browser never needs (or sees) Shopify variant/pricing internals until
 * they come back inside the mapped `Cart`.
 */

import {
  addLine,
  createCart,
  getCart,
  getProductByHandle,
  removeLines,
  updateLineQuantity,
} from "./api";
import { ShopifyError } from "./client";
import { isShopifyConfigured } from "./env";
import type { Cart } from "./types";

export type CartResult =
  | { readonly ok: true; readonly cart: Cart }
  | { readonly ok: false; readonly error: string };

/** A cart that resolved to nothing (stale id) — client should discard it. */
export type CartFetchResult =
  | { readonly ok: true; readonly cart: Cart | null }
  | { readonly ok: false; readonly error: string };

function fail(err: unknown): { ok: false; error: string } {
  if (err instanceof ShopifyError) {
    if (err.kind === "not_configured") {
      return { ok: false, error: "La tienda no está disponible." };
    }
    return {
      ok: false,
      error: "No pudimos actualizar tu carrito. Intenta nuevamente.",
    };
  }
  console.error("Cart action error:", err);
  return { ok: false, error: "Ocurrió un error inesperado." };
}

/**
 * Resolve the product's variant by handle and add `quantity` to the cart,
 * creating the cart when `cartId` is null.
 */
export async function addToCartAction(
  cartId: string | null,
  handle: string,
  quantity = 1,
): Promise<CartResult> {
  if (!isShopifyConfigured()) {
    return { ok: false, error: "La tienda no está disponible." };
  }
  try {
    const product = await getProductByHandle(handle);
    if (!product?.variant) {
      return { ok: false, error: "Producto no disponible por ahora." };
    }
    if (!product.variant.availableForSale) {
      return { ok: false, error: "Este producto está agotado por ahora." };
    }
    const variantId = product.variant.id;
    const cart = cartId
      ? await addLine(cartId, variantId, quantity)
      : await createCart(variantId, quantity);
    return { ok: true, cart };
  } catch (err) {
    return fail(err);
  }
}

export async function updateCartLineAction(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<CartResult> {
  try {
    const cart =
      quantity <= 0
        ? await removeLines(cartId, [lineId])
        : await updateLineQuantity(cartId, lineId, quantity);
    return { ok: true, cart };
  } catch (err) {
    return fail(err);
  }
}

export async function removeCartLineAction(
  cartId: string,
  lineId: string,
): Promise<CartResult> {
  try {
    const cart = await removeLines(cartId, [lineId]);
    return { ok: true, cart };
  } catch (err) {
    return fail(err);
  }
}

/** Re-hydrate a cart by id on page load. */
export async function fetchCartAction(
  cartId: string,
): Promise<CartFetchResult> {
  if (!isShopifyConfigured()) {
    return { ok: false, error: "La tienda no está disponible." };
  }
  try {
    const cart = await getCart(cartId);
    return { ok: true, cart };
  } catch (err) {
    return fail(err);
  }
}
