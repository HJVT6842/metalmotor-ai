import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartTrigger } from "@/components/cart/CartTrigger";
import { CartProvider } from "@/context/CartProvider";
import { isShopifyConfigured } from "@/lib/shopify/env";

/**
 * Commerce shell for the Productos section only. Mounting the cart here (rather
 * than in the global root layout) keeps the site Header, navigation, sitemap
 * and the industrial pages completely untouched, while giving every product
 * route access to the cart.
 *
 * `enabled` is resolved on the server (server-only Shopify env) and passed to
 * the client provider, so the private token is never read client-side. In safe
 * mode (`enabled === false`) the provider stays inert and the drawer/trigger
 * render nothing.
 */
export default function ProductosLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const enabled = isShopifyConfigured();

  return (
    <CartProvider enabled={enabled}>
      {children}
      <CartDrawer />
      <CartTrigger />
    </CartProvider>
  );
}
