import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { LinkButton } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { type Product } from "@/data/home-products";
import { SITE } from "@/data/site";
import { isShopifyConfigured } from "@/lib/shopify/env";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Conversion path for the PDP. Three primary states, all keeping the frozen
 * styling (primary + ghost, `flex-1` row):
 *  - Shopify active & in stock → "Agregar al carrito" (Cart API).
 *  - Shopify active & sold out → "Consultar disponibilidad" (WhatsApp); the
 *    add-to-cart is intentionally removed while out of stock.
 *  - Otherwise (safe mode / not linked) → the original WhatsApp "Comprar ahora".
 * WhatsApp stays available as the secondary CTA in every state.
 *
 * Server Component: the server-only Shopify config check runs here; only the
 * product `handle` (never a token) crosses to the client add-to-cart button.
 * `soldOut` comes from Shopify availability (resolved in the page).
 */
export function ProductActions({
  product,
  soldOut = false,
}: {
  readonly product: Product;
  readonly soldOut?: boolean;
}) {
  const buyHref = buildWhatsAppUrl(
    SITE.whatsappNumber,
    `Hola Metal Motor, quiero comprar ${product.name} (${product.sku}).`,
  );
  const availabilityHref = buildWhatsAppUrl(
    SITE.whatsappNumber,
    `Hola Metal Motor, quiero consultar la disponibilidad de ${product.name} (${product.sku}).`,
  );
  const chatHref = buildWhatsAppUrl(
    SITE.whatsappNumber,
    `Hola Metal Motor, tengo una consulta sobre ${product.name}.`,
  );

  const shopifyActive = Boolean(product.shopifyHandle) && isShopifyConfigured();
  const canAddToCart = shopifyActive && !soldOut;

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {canAddToCart ? (
        <AddToCartButton
          handle={product.shopifyHandle as string}
          className="flex-1"
        />
      ) : shopifyActive && soldOut ? (
        <LinkButton
          href={availabilityHref}
          target="_blank"
          rel="noopener noreferrer"
          variant="primary"
          size="lg"
          className="flex-1"
        >
          Consultar disponibilidad
        </LinkButton>
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
