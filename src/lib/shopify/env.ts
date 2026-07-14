/**
 * Shopify Storefront API configuration, validated at the boundary.
 *
 * SERVER-ONLY. The access token is a PRIVATE Headless-channel token and must
 * never reach the client — hence there is NO `NEXT_PUBLIC_` prefix. Every
 * consumer of this module (see `commerce.ts`) runs on the server, so the token
 * is only ever read in a server context and is never serialised to the browser
 * or logged.
 *
 * Follows the same graceful-degradation contract as `@/lib/env`: instead of
 * throwing at import time, `getShopifyEnv()` returns a discriminated result so
 * the commerce surface can fall back to local data and the app still builds and
 * serves every page when Shopify is not yet configured (safe mode).
 */

/** Default API version; overridable via `SHOPIFY_STOREFRONT_API_VERSION`. */
const DEFAULT_API_VERSION = "2026-01";

export type ShopifyEnv = {
  readonly domain: string;
  readonly token: string;
  readonly apiVersion: string;
  readonly endpoint: string;
};

export type ShopifyEnvResult =
  | { readonly ok: true; readonly env: ShopifyEnv }
  | { readonly ok: false; readonly missing: readonly string[] };

/**
 * Normalise a store domain to the bare `xxx.myshopify.com` host, tolerating
 * common shorthand at the config boundary:
 *   - strips protocol and trailing slashes
 *   - `store.myshopify`  → `store.myshopify.com`  (missing TLD)
 *   - `store`            → `store.myshopify.com`  (bare store handle)
 */
function normalizeDomain(raw: string): string {
  let domain = raw.trim().replace(/^https?:\/\//, "").replace(/\/+$/, "");
  if (/\.myshopify$/i.test(domain)) {
    domain = `${domain}.com`;
  } else if (!domain.includes(".")) {
    domain = `${domain}.myshopify.com`;
  }
  return domain;
}

/**
 * Returns the validated Storefront configuration, or the list of missing
 * variables. Reads server-only env vars — never call from a client component.
 */
export function getShopifyEnv(): ShopifyEnvResult {
  const rawDomain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();

  const missing: string[] = [];
  if (!rawDomain) missing.push("SHOPIFY_STORE_DOMAIN");
  if (!token) missing.push("SHOPIFY_STOREFRONT_ACCESS_TOKEN");

  if (!rawDomain || !token) {
    return { ok: false, missing };
  }

  const domain = normalizeDomain(rawDomain);
  const apiVersion =
    process.env.SHOPIFY_STOREFRONT_API_VERSION?.trim() || DEFAULT_API_VERSION;

  return {
    ok: true,
    env: {
      domain,
      token,
      apiVersion,
      endpoint: `https://${domain}/api/${apiVersion}/graphql.json`,
    },
  };
}

/** Cheap boolean check for server code that only needs to know if commerce is live. */
export function isShopifyConfigured(): boolean {
  return getShopifyEnv().ok;
}
