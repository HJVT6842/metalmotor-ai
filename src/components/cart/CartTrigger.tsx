"use client";

/**
 * Floating cart button with a live item counter, scoped to the Productos
 * section only (mounted from `app/productos/layout.tsx`). It deliberately does
 * NOT live in the global Header, so site navigation, sitemap and the industrial
 * pages stay untouched. Sits above the WhatsApp float so both remain reachable.
 */

import { CartIcon } from "@/components/ui/icons";
import { useCart } from "@/context/CartProvider";

export function CartTrigger() {
  const { enabled, totalQuantity, openCart } = useCart();

  // Safe mode: no Shopify → no cart affordance at all.
  if (!enabled) return null;

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Abrir carrito${
        totalQuantity > 0 ? ` (${totalQuantity})` : ""
      }`}
      className="group fixed bottom-24 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-steel-900 text-white shadow-[0_10px_30px_-6px_rgba(0,0,0,0.7)] ring-1 ring-inset ring-white/15 backdrop-blur transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
    >
      <CartIcon className="h-6 w-6" />
      {totalQuantity > 0 ? (
        <span className="absolute -right-1 -top-1 inline-flex min-w-[1.35rem] items-center justify-center rounded-full bg-brand-500 px-1.5 py-0.5 text-xs font-bold text-white">
          {totalQuantity}
        </span>
      ) : null}
    </button>
  );
}
