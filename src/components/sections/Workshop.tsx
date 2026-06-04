import { Parallax } from "@/components/animations/Parallax";
import { Reveal } from "@/components/animations/Reveal";
import { WhatsAppCta } from "@/components/WhatsAppCta";
import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { MediaBadge } from "@/components/ui/MediaBadge";
import { CheckIcon } from "@/components/ui/icons";
import { WORKSHOP_MEDIA } from "@/data/media";

const HIGHLIGHTS = [
  "Maquinaria CNC de corte y plegado",
  "Soldadura MIG / TIG especializada",
  "Control de calidad en cada etapa",
  "Equipo técnico con experiencia industrial",
] as const;

const [machinery, atmosphere] = WORKSHOP_MEDIA;

/** Premium workshop / atmosphere section with parallax image collage. */
export function Workshop() {
  return (
    <section
      id="taller"
      className="relative scroll-mt-20 overflow-hidden bg-steel-900/40 py-20 sm:py-24 lg:py-28"
    >
      <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-brand-600/10 blur-[120px]"
      />

      <Container className="relative grid items-center gap-12 lg:grid-cols-2">
        {/* Copy */}
        <Reveal>
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">
            <span className="h-px w-6 bg-brand-500" aria-hidden />
            Nuestro Taller
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            Tecnología y oficio en un{" "}
            <span className="text-gradient-brand">mismo lugar</span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-steel-300">
            Fabricamos con maquinaria CNC y un equipo especializado, cuidando la
            precisión y la terminación de cada pieza.
          </p>

          <ul className="mt-6 space-y-3">
            {HIGHLIGHTS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-steel-200"
              >
                <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="mt-6 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-steel-400">
            Próximamente incorporaremos fotografías reales de nuestro taller y
            trabajos realizados.
          </p>

          <div className="mt-7">
            <WhatsAppCta label="Conversemos tu proyecto" size="lg" />
          </div>
        </Reveal>

        {/* Parallax image collage */}
        <div className="relative h-[420px] sm:h-[480px]">
          <Parallax offset={36} className="absolute right-0 top-0 w-[78%]">
            <figure className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                <Media
                  src={machinery.src}
                  alt={machinery.alt}
                  index={0}
                  sizes="(max-width: 1024px) 80vw, 40vw"
                  showBadge={false}
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-steel-950/60 to-transparent" />
              <div className="absolute left-3 top-3">
                <MediaBadge status={machinery.status} />
              </div>
            </figure>
          </Parallax>

          <Parallax
            offset={-28}
            className="absolute bottom-0 left-0 z-10 w-[55%]"
          >
            <figure className="group relative aspect-square overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-steel-950/60">
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                <Media
                  src={atmosphere.src}
                  alt={atmosphere.alt}
                  index={1}
                  sizes="(max-width: 1024px) 55vw, 28vw"
                  showBadge={false}
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-steel-950/60 to-transparent" />
              <div className="absolute left-3 top-3">
                <MediaBadge status={atmosphere.status} />
              </div>
            </figure>
          </Parallax>
        </div>
      </Container>
    </section>
  );
}
