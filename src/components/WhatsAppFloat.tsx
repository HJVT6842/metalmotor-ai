import { WhatsAppIcon } from "@/components/ui/icons";
import { SITE } from "@/data/site";
import { buildWhatsAppUrl, quotationMessage } from "@/lib/whatsapp";

/** Persistent floating WhatsApp button with attention pulse and hover label. */
export function WhatsAppFloat() {
  const href = buildWhatsAppUrl(SITE.whatsappNumber, quotationMessage());
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Cotizar por WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-0 rounded-full"
    >
      {/* Hover label (desktop) */}
      <span className="pointer-events-none mr-0 max-w-0 overflow-hidden whitespace-nowrap rounded-full text-sm font-semibold text-white opacity-0 transition-all duration-300 group-hover:mr-3 group-hover:max-w-[200px] group-hover:opacity-100">
        <span className="rounded-full bg-steel-900 px-4 py-2 shadow-lg ring-1 ring-white/10">
          Cotiza por WhatsApp
        </span>
      </span>

      <span className="relative flex h-14 w-14 items-center justify-center">
        {/* Attention pulse */}
        <span
          aria-hidden
          className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-40"
        />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform group-hover:scale-105 group-focus-visible:scale-105">
          <WhatsAppIcon className="h-7 w-7" />
        </span>
      </span>
    </a>
  );
}
