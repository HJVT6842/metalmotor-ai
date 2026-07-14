/**
 * Typed Storefront operations. Each function maps the raw GraphQL shape into
 * the flat domain types in `./types`. This stage exposes a single read:
 * resolve a product by handle to obtain its price, availability and variant id.
 */

import { ShopifyError, storefrontFetch } from "./client";
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
} from "./queries";
import type {
  Cart,
  CartLine,
  Money,
  ProductVariant,
  ShopifyProduct,
} from "./types";

type RawMoney = { amount: string; currencyCode: string };

/** Cart mutations/reads must never be cached (see storefrontFetch). */
const NO_CACHE = 0;

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
            quantityAvailable: number | null;
            price: RawMoney;
          };
        }[];
      };
    } | null;
    // Read at the default ISR window, tolerating field-level errors: if the
    // token can't read `quantityAvailable`, that field comes back null while
    // price/availability still resolve.
  }>(PRODUCT_BY_HANDLE_QUERY, { handle }, 300, true);

  if (!data.product) return null;

  const variantNode = data.product.variants.edges[0]?.node ?? null;
  const variant: ProductVariant | null = variantNode
    ? {
        id: variantNode.id,
        title: variantNode.title,
        availableForSale: variantNode.availableForSale,
        quantityAvailable: variantNode.quantityAvailable ?? null,
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

// ── Cart ─────────────────────────────────────────────────────────────────────

type RawCartNode = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: RawMoney };
  lines: {
    edges: {
      node: {
        id: string;
        quantity: number;
        cost: { totalAmount: RawMoney };
        merchandise: {
          id: string;
          title: string;
          price: RawMoney;
          image: { url: string; altText: string | null } | null;
          product: { title: string };
        };
      };
    }[];
  };
};

type CartMutationResult = {
  cart: RawCartNode | null;
  userErrors: { field: string[] | null; message: string }[];
};

function mapCart(node: RawCartNode): Cart {
  const lines: CartLine[] = node.lines.edges.map(({ node: line }) => ({
    id: line.id,
    quantity: line.quantity,
    variantId: line.merchandise.id,
    variantTitle: line.merchandise.title,
    productTitle: line.merchandise.product.title,
    unitPrice: toMoney(line.merchandise.price),
    linePrice: toMoney(line.cost.totalAmount),
    image: line.merchandise.image
      ? {
          url: line.merchandise.image.url,
          altText: line.merchandise.image.altText,
        }
      : null,
  }));

  return {
    id: node.id,
    checkoutUrl: node.checkoutUrl,
    totalQuantity: node.totalQuantity,
    subtotal: toMoney(node.cost.subtotalAmount),
    lines,
  };
}

/** Throw the first user error, or return the cart node. */
function unwrap(result: CartMutationResult, operation: string): RawCartNode {
  if (result.userErrors.length > 0) {
    throw new ShopifyError(
      "graphql",
      `${operation}: ${result.userErrors.map((e) => e.message).join("; ")}`,
    );
  }
  if (!result.cart) {
    throw new ShopifyError("graphql", `${operation}: carrito no devuelto.`);
  }
  return result.cart;
}

/** Create a cart, optionally seeded with a first variant + quantity. */
export async function createCart(
  variantId?: string,
  quantity = 1,
): Promise<Cart> {
  const lines = variantId
    ? [{ merchandiseId: variantId, quantity }]
    : undefined;
  const data = await storefrontFetch<{ cartCreate: CartMutationResult }>(
    CART_CREATE_MUTATION,
    { lines },
    NO_CACHE,
  );
  return mapCart(unwrap(data.cartCreate, "cartCreate"));
}

/** Add a variant line to an existing cart. */
export async function addLine(
  cartId: string,
  variantId: string,
  quantity = 1,
): Promise<Cart> {
  const data = await storefrontFetch<{ cartLinesAdd: CartMutationResult }>(
    CART_LINES_ADD_MUTATION,
    { cartId, lines: [{ merchandiseId: variantId, quantity }] },
    NO_CACHE,
  );
  return mapCart(unwrap(data.cartLinesAdd, "cartLinesAdd"));
}

/** Set the quantity of an existing line. */
export async function updateLineQuantity(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<Cart> {
  const data = await storefrontFetch<{ cartLinesUpdate: CartMutationResult }>(
    CART_LINES_UPDATE_MUTATION,
    { cartId, lines: [{ id: lineId, quantity }] },
    NO_CACHE,
  );
  return mapCart(unwrap(data.cartLinesUpdate, "cartLinesUpdate"));
}

/** Remove one or more lines from the cart. */
export async function removeLines(
  cartId: string,
  lineIds: readonly string[],
): Promise<Cart> {
  const data = await storefrontFetch<{ cartLinesRemove: CartMutationResult }>(
    CART_LINES_REMOVE_MUTATION,
    { cartId, lineIds: [...lineIds] },
    NO_CACHE,
  );
  return mapCart(unwrap(data.cartLinesRemove, "cartLinesRemove"));
}

/**
 * Fetch a cart by id. Returns `null` when the id no longer resolves (expired or
 * already checked out) so callers can discard the stale id and start fresh.
 */
export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await storefrontFetch<{ cart: RawCartNode | null }>(
    CART_QUERY,
    { id: cartId },
    NO_CACHE,
  );
  return data.cart ? mapCart(data.cart) : null;
}
