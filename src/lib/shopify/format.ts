/**
 * Formats a Storefront `Money` value using the currency it carries, localised
 * for Chile. Used by the cart drawer, where the amount is authoritative (from
 * Shopify) and its currency is dynamic.
 */

import type { Money } from "./types";

export function formatMoney(money: Money): string {
  const amount = Number(money.amount);
  if (Number.isNaN(amount)) return money.amount;

  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: money.currencyCode,
    maximumFractionDigits: 0,
  }).format(amount);
}
