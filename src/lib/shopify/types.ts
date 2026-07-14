/**
 * Minimal TypeScript surface for the Storefront API responses we consume.
 * Only the fields the site actually reads are modelled — deliberately small,
 * so it stays honest about what the frontend depends on. In this stage that is
 * only product price, availability and variant id (no cart yet).
 */

export type Money = {
  readonly amount: string;
  readonly currencyCode: string;
};

/** A single purchasable variant of a product. */
export type ProductVariant = {
  readonly id: string;
  readonly title: string;
  readonly availableForSale: boolean;
  readonly price: Money;
};

/** A product resolved by handle, with the variant that carries price/stock. */
export type ShopifyProduct = {
  readonly id: string;
  readonly handle: string;
  readonly title: string;
  readonly availableForSale: boolean;
  /** First / default purchasable variant — enough for a single-variant SKU. */
  readonly variant: ProductVariant | null;
};

// ── Cart ─────────────────────────────────────────────────────────────────────

/** Product image shown inside a cart line. */
export type CartLineImage = {
  readonly url: string;
  readonly altText: string | null;
};

/** One line in the cart, flattened to what the drawer renders. */
export type CartLine = {
  readonly id: string;
  readonly quantity: number;
  readonly variantId: string;
  readonly variantTitle: string;
  readonly productTitle: string;
  readonly unitPrice: Money;
  readonly linePrice: Money;
  readonly image: CartLineImage | null;
};

/** The full cart the provider keeps in memory. */
export type Cart = {
  readonly id: string;
  readonly checkoutUrl: string;
  readonly totalQuantity: number;
  readonly subtotal: Money;
  readonly lines: readonly CartLine[];
};
