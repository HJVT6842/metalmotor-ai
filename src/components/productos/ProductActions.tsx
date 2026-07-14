import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { LinkButton } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { type Product } from "@/data/home-products";
import { SITE } from "@/data/site";
import { isShopifyConfigured } from "@/lib/shopify/env";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Conversion path for the PDP. When the product is linked to Shopify and the
 * store is configured, the primary CTA becomes a real "Agregar al carrito"
 * (Shopify Cart API, via the cart drawer) with WhatsApp kept as the secondary
 * CTA. Otherwise it keeps the original WhatsApp "Comprar ahora" flow untouched
 * (safe mode / products not yet integrated). Styling, dimensions and position
 * are identical in both cases — same primary + ghost, same `flex-1` row.
 *
 * This is a Server Component: the server-only Shopify config check runs here,
 * and only the product `handle` (never any token) crosses to the client button.
 */
export function ProductActions({ product }: { readonly product: Product }) {
  const buyHref = buildWhatsAppUrl(
    SITE.whatsappNumber,
    `Hola Metal Motor, quiero comprar ${product.name} (${product.sku}).`,
  );
  const chatHref = buildWhatsAppUrl(
    SITE.whatsappNumber,
    `Hola Metal Motor, tengo una consulta sobre ${product.name}.`,
  );

  const canAddToCart = Boolean(product.shopifyHandle) && isShopifyConfigured();

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {canAddToCart ? (
        <AddToCartButton
          handle={product.shopifyHandle as string}
          className="flex-1"
        />
      ) : (
        <LinkButton
          href={buyHref}
          target="_blank"
          rel="noopener noreferrer"
          variant="primary"
          size="lg"
          className="flex-1"
        >
          Comprar ahora
        </LinkButton>
      )}
      <LinkButton
        href={chatHref}
        target="_blank"
        rel="noopener noreferrer"
        variant="ghost"
        size="lg"
        className="flex-1"
        aria-label="Consultar por WhatsApp"
      >
        <WhatsAppIcon className="h-5 w-5" />
        WhatsApp
      </LinkButton>
    </div>
  );
}
