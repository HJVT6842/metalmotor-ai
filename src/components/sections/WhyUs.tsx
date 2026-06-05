import type { ComponentType, SVGProps } from "react";

import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { Section, SectionHeading } from "@/components/ui/Section";
import {
  BadgeIcon,
  ClockIcon,
  GaugeIcon,
  HeadsetIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "@/components/ui/icons";

type Reason = {
  readonly icon: ComponentType<SVGProps<SVGSVGElement>>;
  readonly title: string;
  readonly description: string;
};

const REASONS: readonly Reason[] = [
  {
    icon: ClockIcon,
    title: "Cotización rápida",
    description:
      "Respondemos la mayoría de las solicitudes en menos de 24 horas.",
  },
  {
    icon: BadgeIcon,
    title: "Fabricación personalizada",
    description:
      "Desde una pieza única hasta producción en serie, según tu proyecto.",
  },
  {
    icon: GaugeIcon,
    title: "Corte de precisión",
    description:
      "Corte láser de fibra y plegado CNC para tolerancias exactas.",
  },
  {
    icon: HeadsetIcon,
    title: "Atención directa",
    description:
      "Hablas directo con quienes fabrican tu pedido, sin intermediarios.",
  },
  {
    icon: TruckIcon,
    title: "Entrega comprometida",
    description:
      "Plazos claros y entrega coordinada: despacho o retiro de tu pedido.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Asesoría técnica",
    description:
      "Te ayudamos a optimizar tu diseño CAD para fabricación y ahorro de material.",
  },
];

/** "Por qué nuestros clientes nos eligen" — trust section placed before the form. */
export function WhyUs() {
  return (
    <Section id="confianza" className="bg-steel-900/40">
      <SectionHeading
        eyebrow="Confianza"
        title={
          <>
            Por qué nuestros clientes{" "}
            <span className="text-gradient-brand">nos eligen</span>
          </>
        }
        description="Tecnología, oficio y respuesta rápida para que tu proyecto salga perfecto."
      />

      <Stagger
        className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        stagger={0.07}
      >
        {REASONS.map((reason) => {
          const Icon = reason.icon;
          return (
            <StaggerItem key={reason.title}>
              <article className="group flex h-full gap-4 rounded-2xl border border-white/10 bg-steel-900/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400 ring-1 ring-inset ring-brand-500/30 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{reason.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-steel-400">
                    {reason.description}
                  </p>
                </div>
              </article>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
