import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { WhatsAppCta } from "@/components/WhatsAppCta";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Media } from "@/components/ui/Media";
import { ArrowRightIcon } from "@/components/ui/icons";
import { getMediaById } from "@/data/media";

type Featured = {
  readonly mediaId: string;
  readonly name: string;
  readonly blurb: string;
};

const FEATURED: readonly Featured[] = [
  {
    mediaId: "prod-celosias",
    name: "Celosías Decorativas",
    blurb: "Control solar, privacidad y diseño arquitectónico a medida.",
  },
  {
    mediaId: "prod-paneles",
    name: "Paneles Metálicos",
    blurb: "Revestimientos perforados para fachadas e interiores.",
  },
  {
    mediaId: "prod-portones",
    name: "Portones",
    blurb: "Portones robustos y seguros, fabricados para durar.",
  },
  {
    mediaId: "svc-corte-laser",
    name: "Corte Láser CNC",
    blurb: "Corte de precisión en acero, inoxidable y aluminio.",
  },
];

/**
 * Conversion-first featured products, directly below the hero. Large industrial
 * photography, hover zoom, a WhatsApp CTA and a link to the contact form.
 */
export function FeaturedProducts() {
  return (
    <Section id="destacados" className="bg-steel-950">
      <SectionHeading
        eyebrow="Productos Destacados"
        title={
          <>
            Nuestros{" "}
            <span className="text-gradient-brand">Productos Destacados</span>
          </>
        }
        description="Lo que más nos piden. Cotiza en segundos por WhatsApp o solicita tu presupuesto."
      />

      <Stagger
        className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        stagger={0.08}
      >
        {FEATURED.map((item, i) => {
          const media = getMediaById(item.mediaId);
          return (
            <StaggerItem key={item.mediaId}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-steel-900/50 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/50 hover:shadow-[0_0_44px_-12px_rgba(249,115,22,0.55)]">
                <a
                  href="#contacto"
                  aria-label={`Solicitar ${item.name}`}
                  className="relative block h-60 overflow-hidden sm:h-64"
                >
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
                    <Media
                      src={media?.src ?? ""}
                      alt={media?.alt ?? item.name}
                      index={i}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      status={media?.status ?? "reference"}
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-steel-950 via-steel-950/30 to-transparent" />
                  <h3 className="absolute inset-x-0 bottom-0 p-4 text-lg font-bold text-white">
                    {item.name}
                  </h3>
                </a>

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-sm leading-relaxed text-steel-400">
                    {item.blurb}
                  </p>
                  <div className="mt-auto flex flex-col gap-2 pt-5">
                    <WhatsAppCta
                      label="Cotizar por WhatsApp"
                      service={item.name}
                      size="md"
                      className="w-full"
                    />
                    <a
                      href="#contacto"
                      className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-brand-400 transition-colors hover:text-brand-300"
                    >
                      Solicitar presupuesto
                      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </article>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
