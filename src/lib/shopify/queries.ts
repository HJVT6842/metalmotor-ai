/**
 * GraphQL documents for the Storefront API. Kept as plain strings (no codegen,
 * no extra deps). This stage only reads a product by handle to source its
 * price, availability and variant id — no cart mutations yet.
 */

/** Resolve a product by handle, exposing its first purchasable variant. */
export const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      availableForSale
      variants(first: 1) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;
