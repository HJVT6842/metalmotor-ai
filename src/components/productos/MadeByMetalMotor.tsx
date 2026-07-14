import { Reveal } from "@/components/animations/Reveal";
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
 * Quiet quality-backing block. The industrial process is the guarantee, not the
 * headline. Reused on the landing and on each product page.
 */
export function MadeByMetalMotor() {
  return (
    <Section className="border-y border-white/10 bg-steel-900/40">
      <Reveal className="max-w-2xl">
        <p className="mb-3 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.25em] text-brand-400">
          <span className="h-px w-8 bg-brand-500" aria-hidden />
          Fabricado por MetalMotor
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Respaldado por nuestro taller industrial.
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-steel-300">
          Cada producto nace del mismo corte láser CNC, la misma soldadura y el
          mismo acero con que fabricamos a la industria. Diseño propio, hecho en
          Chile.
        </p>
      </Reveal>

      <dl className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((pillar) => (
          <div key={pillar.title}>
            <dt className="text-base font-medium text-white">{pillar.title}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-steel-400">
              {pillar.body}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
