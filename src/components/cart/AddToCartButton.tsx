"use client";

/**
 * Primary "Agregar al carrito" action for the PDP. Visually identical to the
 * former WhatsApp "Comprar ahora" primary (same `Button` primary, size lg,
 * full width inside a `flex-1` slot), so the frozen layout, dimensions and
 * position are preserved.
 *
 * UX polish (Sprint 03.5):
 * - Loading: disabled + spinner + "Agregando…" while Shopify responds, so a
 *   double-click can't fire two adds.
 * - Confirmation: for ~1s the label becomes "✓ Producto agregado al carrito"
 *   (a minimal in-button micro-interaction — no toast library), and the drawer
 *   opens. Errors surface inline without shifting the button.
 */

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { CartIcon, CheckIcon, SpinnerIcon } from "@/components/ui/icons";
import { useCart } from "@/context/CartProvider";

const CONFIRM_MS = 1200;

export function AddToCartButton({
  handle,
  className = "",
}: {
  readonly handle: string;
  readonly className?: string;
}) {
  const { addProduct, openCart, loading, error } = useCart();
  const [confirmed, setConfirmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const onClick = useCallback(async () => {
    const ok = await addProduct(handle);
    if (!ok) return;
    setConfirmed(true);
    openCart();
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setConfirmed(false), CONFIRM_MS);
  }, [addProduct, handle, openCart]);

  return (
    <div className={className}>
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={onClick}
        disabled={loading || confirmed}
        aria-live="polite"
      >
        {confirmed ? (
          <>
            <CheckIcon className="h-5 w-5" />
            Producto agregado al carrito
          </>
        ) : loading ? (
          <>
            <SpinnerIcon className="h-5 w-5" />
            Agregando…
          </>
        ) : (
          <>
            <CartIcon className="h-5 w-5" />
            Agregar al carrito
          </>
        )}
      </Button>
      {error ? (
        <p className="mt-2 text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
