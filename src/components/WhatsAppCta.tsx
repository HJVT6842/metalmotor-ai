import { LinkButton } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { SITE } from "@/data/site";
import { buildWhatsAppUrl, quotationMessage } from "@/lib/whatsapp";

type WhatsAppCtaProps = {
  readonly label?: string;
  readonly service?: string;
  readonly size?: "md" | "lg";
  readonly className?: string;
};

/**
 * Primary quotation CTA. Opens WhatsApp with a pre-filled message in a new tab.
 */
export function WhatsAppCta({
  label = "Cotizar por WhatsApp",
  service,
  size = "lg",
  className = "",
}: WhatsAppCtaProps) {
  const href = buildWhatsAppUrl(
    SITE.whatsappNumber,
    quotationMessage(service),
  );
  return (
    <LinkButton
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      variant="primary"
      size={size}
      className={className}
      aria-label={label}
    >
      <WhatsAppIcon className="h-5 w-5" />
      {label}
    </LinkButton>
  );
}
