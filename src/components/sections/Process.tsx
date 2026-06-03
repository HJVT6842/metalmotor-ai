import { Section, SectionHeading } from "@/components/ui/Section";

const STEPS = [
  {
    n: "01",
    title: "Envías tu idea o plano",
    body: "Comparte tu archivo CAD, un boceto o simplemente describe tu proyecto por WhatsApp.",
  },
  {
    n: "02",
    title: "Cotizamos y asesoramos",
    body: "Revisamos factibilidad, material y plazos, y te entregamos una cotización clara.",
  },
  {
    n: "03",
    title: "Fabricamos con precisión",
    body: "Cortamos, plegamos y soldamos con maquinaria CNC y control de calidad.",
  },
  {
    n: "04",
    title: "Entregamos tu pieza",
    body: "Coordinamos la entrega o retiro de tu producto terminado, listo para instalar.",
  },
] as const;

/** Simple 4-step "how it works" timeline. */
export function Process() {
  return (
    <Section id="proceso" className="bg-white">
      <SectionHeading
        eyebrow="Cómo trabajamos"
        title="Un proceso simple, de la idea a la pieza"
      />

      <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step) => (
          <li
            key={step.n}
            className="relative rounded-2xl border border-steel-200 bg-steel-50 p-6"
          >
            <span className="text-3xl font-extrabold text-brand-500">
              {step.n}
            </span>
            <h3 className="mt-3 text-lg font-bold text-steel-900">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-steel-600">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
