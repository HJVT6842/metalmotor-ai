"use client";

/**
 * Client-side cart state, backed by Shopify through Server Actions (the token
 * stays on the server). Only the cart *id* is persisted in localStorage; the
 * cart contents (prices, subtotal, availability) are always returned fresh by
 * the server so they can never drift. On mount we restore the id and hydrate;
 * if Shopify reports the id no longer resolves, we drop it and start clean.
 *
 * `enabled` is passed down from a Server Component (the productos layout), so
 * the client never reads server-only Shopify env directly. When false the
 * provider stays inert and the commerce UI hides itself.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  addToCartAction,
  fetchCartAction,
  removeCartLineAction,
  updateCartLineAction,
  type CartResult,
} from "@/lib/shopify/actions";
import type { Cart, Money } from "@/lib/shopify/types";

const STORAGE_KEY = "mm_cart_id";
const ZERO_CLP: Money = { amount: "0", currencyCode: "CLP" };

type CartContextValue = {
  readonly enabled: boolean;
  readonly cart: Cart | null;
  readonly loading: boolean;
  readonly error: string | null;
  readonly isOpen: boolean;
  readonly totalQuantity: number;
  readonly subtotal: Money;
  readonly addProduct: (handle: string, quantity?: number) => Promise<boolean>;
  readonly updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  readonly removeLine: (lineId: string) => Promise<void>;
  readonly openCart: () => void;
  readonly closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStoredId(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function persistId(id: string | null): void {
  try {
    if (id) window.localStorage.setItem(STORAGE_KEY, id);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable (private mode) — cart just won't persist */
  }
}

export function CartProvider({
  enabled,
  children,
}: {
  readonly enabled: boolean;
  readonly children: ReactNode;
}) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Prevents overlapping mutations from clobbering each other.
  const inFlight = useRef(false);

  // Restore the cart on mount (once), if an id is stored.
  useEffect(() => {
    if (!enabled) return;
    const storedId = readStoredId();
    if (!storedId) return;

    let cancelled = false;
    const restore = async () => {
      setLoading(true);
      const result = await fetchCartAction(storedId);
      if (cancelled) return;
      if (result.ok && result.cart) setCart(result.cart);
      else persistId(null); // stale / gone → discard
      setLoading(false);
    };
    void restore();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  /** Apply a CartResult to state, sharing error handling. */
  const apply = useCallback((result: CartResult): boolean => {
    if (result.ok) {
      setCart(result.cart);
      persistId(result.cart.id);
      return true;
    }
    setError(result.error);
    return false;
  }, []);

  const addProduct = useCallback(
    async (handle: string, quantity = 1): Promise<boolean> => {
      if (!enabled || inFlight.current) return false;
      inFlight.current = true;
      setLoading(true);
      setError(null);
      try {
        const result = await addToCartAction(readStoredId(), handle, quantity);
        return apply(result);
      } finally {
        inFlight.current = false;
        setLoading(false);
      }
    },
    [enabled, apply],
  );

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number): Promise<void> => {
      const id = cart?.id;
      if (!id || inFlight.current) return;
      inFlight.current = true;
      setLoading(true);
      setError(null);
      try {
        apply(await updateCartLineAction(id, lineId, quantity));
      } finally {
        inFlight.current = false;
        setLoading(false);
      }
    },
    [cart?.id, apply],
  );

  const removeLine = useCallback(
    async (lineId: string): Promise<void> => {
      const id = cart?.id;
      if (!id || inFlight.current) return;
      inFlight.current = true;
      setLoading(true);
      setError(null);
      try {
        apply(await removeCartLineAction(id, lineId));
      } finally {
        inFlight.current = false;
        setLoading(false);
      }
    },
    [cart?.id, apply],
  );

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(
    () => ({
      enabled,
      cart,
      loading,
      error,
      isOpen,
      totalQuantity: cart?.totalQuantity ?? 0,
      subtotal: cart?.subtotal ?? ZERO_CLP,
      addProduct,
      updateQuantity,
      removeLine,
      openCart,
      closeCart,
    }),
    [
      enabled,
      cart,
      loading,
      error,
      isOpen,
      addProduct,
      updateQuantity,
      removeLine,
      openCart,
      closeCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/** Access the cart context. Throws if used outside <CartProvider>. */
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de <CartProvider>.");
  }
  return ctx;
}
