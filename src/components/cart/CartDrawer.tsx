"use client";

/**
 * Side cart drawer, reusing the existing dark-graphite design language (glass
 * panel, steel tokens, brand accent) — no page redesign. Mobile-first: full
 * width on phones, a fixed-width panel on larger screens.
 *
 * Accessibility: role="dialog" + aria-modal, closes on Escape and on overlay
 * click, locks background scroll while open, and moves focus to the panel.
 *
 * Checkout is delegated entirely to Shopify: "Finalizar compra" navigates to
 * the cart's `checkoutUrl` (no custom checkout, no iframe, no Buy Button).
 */

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { CloseIcon, MinusIcon, PlusIcon, TrashIcon } from "@/components/ui/icons";
import { useCart } from "@/context/CartProvider";
import { formatMoney } from "@/lib/shopify/format";

export function CartDrawer() {
  const {
    enabled,
    isOpen,
    closeCart,
    cart,
    loading,
    error,
    subtotal,
    totalQuantity,
    updateQuantity,
    removeLine,
  } = useCart();

  const panelRef = useRef<HTMLDivElement>(null);

  // Escape to close.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  // Lock background scroll while open.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (isOpen) panelRef.current?.focus();
  }, [isOpen]);

  if (!enabled) return null;

  const lines = cart?.lines ?? [];
  const isEmpty = lines.length === 0;

  const onCheckout = () => {
    if (cart?.checkoutUrl) window.location.href = cart.checkoutUrl;
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeCart}
            aria-hidden
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Carrito de compra"
            tabIndex={-1}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 flex h-full w-full flex-col bg-steel-950/95 shadow-2xl outline-none ring-1 ring-inset ring-white/10 backdrop-blur-xl sm:max-w-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h2 className="text-lg font-semibold text-white">
                Tu carrito
                {totalQuantity > 0 ? (
                  <span className="ml-2 text-sm font-normal text-steel-400">
                    ({totalQuantity})
                  </span>
                ) : null}
              </h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Cerrar carrito"
                className="rounded-md p-2 text-steel-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {error ? (
                <p
                  className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}

              {isEmpty ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="text-base font-medium text-steel-200">
                    Tu carrito está vacío
                  </p>
                  <p className="mt-2 max-w-xs text-sm text-steel-400">
                    Agrega productos para continuar con tu compra.
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col gap-5">
                  {lines.map((line) => (
                    <li key={line.id} className="flex gap-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-steel-900 ring-1 ring-inset ring-white/10">
                        {line.image ? (
                          <Image
                            src={line.image.url}
                            alt={line.image.altText ?? line.productTitle}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        ) : null}
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                              {line.productTitle}
                            </p>
                            {line.variantTitle &&
                            line.variantTitle !== "Default Title" ? (
                              <p className="truncate text-xs text-steel-400">
                                {line.variantTitle}
                              </p>
                            ) : null}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeLine(line.id)}
                            disabled={loading}
                            aria-label={`Eliminar ${line.productTitle}`}
                            className="shrink-0 rounded-md p-1.5 text-steel-400 transition-colors hover:bg-white/5 hover:text-red-300 disabled:opacity-50"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="inline-flex items-center rounded-lg ring-1 ring-inset ring-white/15">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(line.id, line.quantity - 1)
                              }
                              disabled={loading}
                              aria-label="Disminuir cantidad"
                              className="p-2 text-steel-300 transition-colors hover:text-white disabled:opacity-50"
                            >
                              <MinusIcon className="h-4 w-4" />
                            </button>
                            <span className="min-w-[2ch] text-center text-sm font-medium text-white">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(line.id, line.quantity + 1)
                              }
                              disabled={loading}
                              aria-label="Aumentar cantidad"
                              className="p-2 text-steel-300 transition-colors hover:text-white disabled:opacity-50"
                            >
                              <PlusIcon className="h-4 w-4" />
                            </button>
                          </div>
                          <span className="text-sm font-semibold text-white">
                            {formatMoney(line.linePrice)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {!isEmpty ? (
              <div className="border-t border-white/10 px-5 py-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-steel-300">Subtotal</span>
                  <span className="text-lg font-semibold text-white">
                    {formatMoney(subtotal)}
                  </span>
                </div>
                <p className="mb-4 text-xs text-steel-500">
                  El envío y los impuestos se calculan en el checkout.
                </p>
                <button
                  type="button"
                  onClick={onCheckout}
                  disabled={loading || !cart?.checkoutUrl}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-7 py-3.5 text-base font-semibold text-white shadow-[0_8px_30px_-6px_rgba(249,115,22,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:from-brand-400 hover:to-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Procesando…" : "Finalizar compra"}
                </button>
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
