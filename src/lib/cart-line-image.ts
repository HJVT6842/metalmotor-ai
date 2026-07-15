/**
 * Resolves the thumbnail shown for a cart line, preferring the local editorial
 * photo over whatever Shopify returns.
 *
 * Priority (see Sprint 03.6.2):
 *   1. Local editorial image from `home-products.ts`, matched by the product
 *      handle (the same `shopifyHandle` that links the record to Shopify).
 *   2. The Shopify image URL received on the cart line.
 *   3. `null` → the caller renders a neutral graphite poster (never broken
 *      alt text).
 *
 * Handles never resolve to a per-product hardcoded path here: the mapping is
 * derived once from the catalogue, so adding a product needs no change.
 */

import { PRODUCTS } from "@/data/home-products";
import type { CartLineImage } from "@/lib/shopify/types";

/** handle → first editorial image path, built once from the catalogue. */
const LOCAL_IMAGE_BY_HANDLE: ReadonlyMap<string, string> = new Map(
  PRODUCTS.flatMap((p) =>
    p.shopifyHandle && p.images.length > 0
      ? [[p.shopifyHandle, p.images[0]] as const]
      : [],
  ),
);

/**
 * Returns the best available thumbnail source for a cart line, or `null` when
 * neither a local nor a Shopify image is available.
 */
export function resolveCartLineImage(
  handle: string,
  shopifyImage: CartLineImage | null,
): string | null {
  const local = handle ? LOCAL_IMAGE_BY_HANDLE.get(handle) : undefined;
  if (local) return local;
  if (shopifyImage?.url) return shopifyImage.url;
  return null;
}
