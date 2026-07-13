import { LinkButton } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { type Product } from "@/data/home-products";
import { SITE } from "@/data/site";
import { buildWhatsAppUrl, quotationMessage } from "@/lib/whatsapp";

/**
 * Two-button conversion path (no checkout yet, both routes go to WhatsApp):
 * a primary "Solicitar cotización" and a secondary direct-chat WhatsApp button,
 * each opening a pre-filled message in a new tab.
 */
export function ProductActions({ product }: { readonly product: Product }) {
  const service = `${product.name} (${product.sku})`;
  const quoteHref = buildWhatsAppUrl(
    SITE.whatsappNumber,
    quotationMessage(service),
  );
  const chatHref = buildWhatsAppUrl(
    SITE.whatsappNumber,
    `Hola Metal Motor, tengo una consulta sobre ${product.name}.`,
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <LinkButton
        href={quoteHref}
        target="_blank"
        rel="noopener noreferrer"
        variant="primary"
        size="lg"
        className="flex-1"
      >
        Solicitar cotización
      </LinkButton>
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
