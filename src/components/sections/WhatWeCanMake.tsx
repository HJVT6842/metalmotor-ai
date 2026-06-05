import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Media } from "@/components/ui/Media";
import { getMediaById } from "@/data/media";
import { SITE } from "@/data/site";
import { buildWhatsAppUrl, quotationMessage } from "@/lib/whatsapp";

type Category = {
  readonly mediaId: string;
  readonly name: string;
};

const CATEGORIES: readonly Category[] = [
  { mediaId: "prod-celosias", name: "Celosías decorativas" },
  { mediaId: "prod-paneles", name: "Paneles decorativos" },
  { mediaId: "prod-portones", name: "Portones metálicos" },
  { mediaId: "svc-corte-laser", name: "Corte láser CNC" },
  { mediaId: "prod-piezas", name: "Piezas industriales" },
  { mediaId: "prod-custom", name: "Fabricación a medida" },
];

/** "¿Qué podemos fabricar?" — large image-dominant category cards + WhatsApp CTA. */
export function WhatWeCanMake() {
  return (
    <Section id="fabricamos" className="bg-steel-900/40">
      <SectionHeading
        eyebrow="¿Qué podemos fabricar?"
        title={
          <>
            Fabricamos soluciones metálicas{" "}
            <span className="text-gradient-brand">a medida</span>
          </>
        }
        description="Desde piezas industriales hasta proyectos arquitectónicos completos."
      />

      <Stagger
        className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        stagger={0.08}
      >
        {CATEGORIES.map((cat, i) => {
          const media = getMediaById(cat.mediaId);
          const href = buildWhatsAppUrl(
            SITE.whatsappNumber,
            quotationMessage(cat.name),
          );
          return (
            <StaggerItem key={cat.mediaId}>
              <article className="group relative h-80 overflow-hidden rounded-2xl border border-white/10">
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
                  <Media
                    src={media?.src ?? ""}
                    alt={media?.alt ?? cat.name}
                    index={i}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    status={media?.status ?? "reference"}
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-steel-950 via-steel-950/40 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="text-xl font-bold text-white">{cat.name}</h3>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Cotizar ${cat.name} por WhatsApp`}
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_30px_-6px_rgba(249,115,22,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:from-brand-400 hover:to-brand-500"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Cotizar por WhatsApp
                  </a>
                </div>
              </article>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
