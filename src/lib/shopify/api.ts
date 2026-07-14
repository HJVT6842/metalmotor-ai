/**
 * Typed Storefront operations. Each function maps the raw GraphQL shape into
 * the flat domain types in `./types`. This stage exposes a single read:
 * resolve a product by handle to obtain its price, availability and variant id.
 */

import { storefrontFetch } from "./client";
import { PRODUCT_BY_HANDLE_QUERY } from "./queries";
import type { Money, ProductVariant, ShopifyProduct } from "./types";

type RawMoney = { amount: string; currencyCode: string };

function toMoney(raw: RawMoney): Money {
  return { amount: raw.amount, currencyCode: raw.currencyCode };
}

/** Resolve a product by handle → its default purchasable variant + price. */
export async function getProductByHandle(
  handle: string,
): Promise<ShopifyProduct | null> {
  const data = await storefrontFetch<{
    product: {
      id: string;
      handle: string;
      title: string;
      availableForSale: boolean;
      variants: {
        edges: {
          node: {
            id: string;
            title: string;
            availableForSale: boolean;
            price: RawMoney;
          };
        }[];
      };
    } | null;
  }>(PRODUCT_BY_HANDLE_QUERY, { handle });

  if (!data.product) return null;

  const variantNode = data.product.variants.edges[0]?.node ?? null;
  const variant: ProductVariant | null = variantNode
    ? {
        id: variantNode.id,
        title: variantNode.title,
        availableForSale: variantNode.availableForSale,
        price: toMoney(variantNode.price),
      }
    : null;

  return {
    id: data.product.id,
    handle: data.product.handle,
    title: data.product.title,
    availableForSale: data.product.availableForSale,
    variant,
  };
}
