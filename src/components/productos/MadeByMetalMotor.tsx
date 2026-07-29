import { Reveal } from "@/components/animations/Reveal";
import { ProductMedia } from "@/components/productos/ProductMedia";
import { Section } from "@/components/ui/Section";

const PILLARS = [
  {
    title: "Corte láser CNC",
    body: "Precisión de taller industrial en cada pieza.",
  },
  {
    title: "Acero de verdad",
    body: "Carbono e inoxidable seleccionados para durar.",
  },
  {
    title: "Diseño propio",
    body: "Piezas pensadas, no copiadas. Líneas limpias.",
  },
  {
    title: "Fabricación en Chile",
    body: "Hecho en nuestro taller, de principio a fin.",
  },
] as const;

/**
 * Fabrication-backing block. The industrial process is the guarantee — so we
 * SHOW it: a real workshop shot (corte láser CNC) paired with the promise, then
 * the four pillars laid out with editorial air. Two-column above `lg`, stacked
 * image-first below. Image comes from existing assets (no stock).
 */
export function MadeByMetalMotor() {
  return (
    <Section className="border-y border-white/10 bg-steel-900/40">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* The proof: our own workshop. */}
        <Reveal className="relative order-last lg:order-first">
          <div
            className="pointer-events-none absolute -inset-5 -z-10 rounded-[2rem] bg-brand-500/15 blur-3xl"
            aria-hidden
          />
          <ProductMedia
            src="/images/reference/hero/hero-workshop.webp"
            alt="Taller MetalMotor — corte láser CNC en acero"
            fit="cover"
            frame="landscape"
            rounded="rounded-3xl"
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="border border-white/10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.85)]"
          >
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10"
              aria-hidden
            />
          </ProductMedia>
        </Reveal>

        {/* The promise. */}
        <Reveal>
          <p className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">
            <span className="h-px w-6 bg-brand-500" aria-hidden />
            Fabricado por MetalMotor
          </p>
          <h2 className="text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
            Respaldado por nuestro taller industrial.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-steel-300">
            Usamos el mismo corte láser CNC, la misma soldadura y el mismo acero
            con que fabricamos para la industria. Cada pieza se diseña y se produce
            en nuestro taller, en Chile.
          </p>
        </Reveal>
      </div>

      <dl className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 border-t border-white/10 pt-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:pt-14">
        {PILLARS.map((pillar, i) => (
          <div key={pillar.title}>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <dt className="mt-3 text-lg font-semibold text-white">
              {pillar.title}
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-steel-400">
              {pillar.body}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
