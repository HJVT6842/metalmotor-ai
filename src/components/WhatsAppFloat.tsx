import { WhatsAppIcon } from "@/components/ui/icons";
import { SITE } from "@/data/site";
import { buildWhatsAppUrl, quotationMessage } from "@/lib/whatsapp";

/**
 * Persistent floating WhatsApp CTA. Round icon on mobile; a labelled pill on
 * larger screens for maximum conversion visibility. Includes an attention pulse.
 */
export function WhatsAppFloat() {
  const href = buildWhatsAppUrl(SITE.whatsappNumber, quotationMessage());
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Cotizar por WhatsApp"
      className="group fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] py-3 pl-3 pr-3 text-white shadow-[0_10px_30px_-6px_rgba(37,211,102,0.7)] transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] sm:pr-5"
    >
      <span className="relative flex h-8 w-8 items-center justify-center">
        <span
          aria-hidden
          className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40"
        />
        <WhatsAppIcon className="relative h-7 w-7" />
      </span>
      <span className="hidden text-sm font-bold sm:inline">
        Cotizar por WhatsApp
      </span>
    </a>
  );
}
