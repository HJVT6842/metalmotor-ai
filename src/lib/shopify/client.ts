/**
 * Reusable Shopify Storefront GraphQL client.
 *
 * Single responsibility: execute a query against the Storefront API and return
 * typed `data`, distinguishing three failure classes so callers can degrade
 * gracefully:
 *   - not configured  → Shopify env missing (safe mode)
 *   - HTTP error       → transport / auth / rate-limit
 *   - GraphQL errors   → top-level errors returned with 200
 *
 * No new dependencies: uses the platform `fetch`. The API version comes from
 * the environment (`getShopifyEnv`), never hardcoded at the call site. Reads
 * are cached with time-based revalidation (ISR) so product price/availability
 * refresh on an interval without making every page dynamic.
 */

import { getShopifyEnv } from "./env";

export class ShopifyError extends Error {
  readonly kind: "not_configured" | "http" | "graphql";
  readonly status?: number;

  constructor(
    kind: ShopifyError["kind"],
    message: string,
    status?: number,
  ) {
    super(message);
    this.name = "ShopifyError";
    this.kind = kind;
    this.status = status;
  }
}

type GraphQLResponse<T> = {
  readonly data?: T;
  readonly errors?: readonly { readonly message: string }[];
};

/** Default revalidation window (seconds) for cached Storefront reads. */
const DEFAULT_REVALIDATE = 300;

/**
 * Runs a GraphQL document against the Storefront API.
 *
 * @param revalidate Seconds to cache the response (Next ISR). Defaults to 300.
 * @throws {ShopifyError} when Shopify is unconfigured, the HTTP call fails, or
 *         the API returns top-level GraphQL errors.
 */
export async function storefrontFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  revalidate: number = DEFAULT_REVALIDATE,
): Promise<T> {
  const result = getShopifyEnv();
  if (!result.ok) {
    throw new ShopifyError(
      "not_configured",
      `Shopify no está configurado (faltan: ${result.missing.join(", ")}).`,
    );
  }

  const { endpoint, token } = result.env;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Private Headless-channel token → server-only header. Never send the
        // public `X-Shopify-Storefront-Access-Token` header with this token.
        "Shopify-Storefront-Private-Token": token,
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables }),
      // Time-based revalidation keeps price/availability fresh (ISR).
      next: { revalidate },
    });
  } catch (cause) {
    throw new ShopifyError(
      "http",
      `No se pudo contactar a Shopify: ${(cause as Error).message}`,
    );
  }

  if (!response.ok) {
    throw new ShopifyError(
      "http",
      `Shopify respondió ${response.status} ${response.statusText}.`,
      response.status,
    );
  }

  const payload = (await response.json()) as GraphQLResponse<T>;

  if (payload.errors && payload.errors.length > 0) {
    const message = payload.errors.map((e) => e.message).join("; ");
    throw new ShopifyError("graphql", `Error GraphQL: ${message}`);
  }

  if (!payload.data) {
    throw new ShopifyError("graphql", "Respuesta de Shopify sin datos.");
  }

  return payload.data;
}
