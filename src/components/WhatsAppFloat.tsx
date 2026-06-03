import { WhatsAppIcon } from "@/components/ui/icons";
import { SITE } from "@/data/site";
import { buildWhatsAppUrl, quotationMessage } from "@/lib/whatsapp";

/** Persistent floating WhatsApp button shown on every page. */
export function WhatsAppFloat() {
  const href = buildWhatsAppUrl(SITE.whatsappNumber, quotationMessage());
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
