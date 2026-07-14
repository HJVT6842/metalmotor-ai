"use client";

/**
 * Primary "Agregar al carrito" action for the PDP. Visually identical to the
 * former WhatsApp "Comprar ahora" primary (same `Button` primary, size lg,
 * full width inside a `flex-1` slot), so the frozen layout, dimensions and
 * position are preserved.
 *
 * On click: adds the Shopify variant (resolved server-side from the handle),
 * shows a brief inline confirmation, and opens the drawer. Errors surface
 * inline without shifting the button.
 */

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { CartIcon, CheckIcon } from "@/components/ui/icons";
import { useCart } from "@/context/CartProvider";

const CONFIRM_MS = 1800;

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
        disabled={loading}
        aria-live="polite"
      >
        {confirmed ? (
          <>
            <CheckIcon className="h-5 w-5" />
            Agregado al carrito
          </>
        ) : (
          <>
            <CartIcon className="h-5 w-5" />
            {loading ? "Agregando…" : "Agregar al carrito"}
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
