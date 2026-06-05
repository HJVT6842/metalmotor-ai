import { Counter } from "@/components/animations/Counter";
import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Media } from "@/components/ui/Media";
import { ServiceGlyph } from "@/components/ui/icons";
import type { ServiceIcon } from "@/types";
import { getMediaById } from "@/data/media";

type Capability = { readonly title: string; readonly icon: ServiceIcon };

const CAPABILITIES: readonly Capability[] = [
  { title: "Corte Láser CNC Fibra", icon: "laser" },
  { title: "Plegado de precisión", icon: "fold" },
  { title: "Soldadura MIG", icon: "weld" },
  { title: "Soldadura TIG", icon: "weld" },
  { title: "Diseño CAD", icon: "cad" },
  { title: "Fabricación metálica integral", icon: "fabrication" },
];

type Stat = {
  readonly value?: number;
  readonly text?: string;
  readonly suffix?: string;
  readonly label: string;
};

const STATS: readonly Stat[] = [
  { value: 2000, suffix: " W", label: "Potencia láser" },
  { value: 20, suffix: " mm", label: "Espesor máximo" },
  { value: 24, suffix: " h", label: "Tiempo de respuesta" },
  { text: "A medida", label: "Fabricación" },
];

/** "Nuestra capacidad productiva" — capabilities grid + technical stat band. */
export function Capacidad() {
  const banner = getMediaById("svc-corte-laser");

  return (
    <Section id="capacidad" className="bg-steel-950">
      <SectionHeading
        eyebrow="Capacidad productiva"
        title={
          <>
            Tecnología y oficio para{" "}
            <span className="text-gradient-brand">cada proyecto</span>
          </>
        }
        description="Equipamiento CNC y procesos controlados de principio a fin."
      />

      <Stagger
        className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3"
        stagger={0.06}
      >
        {CAPABILITIES.map((cap) => (
          <StaggerItem key={cap.title}>
            <div className="flex h-full items-center gap-3 rounded-2xl border border-white/10 bg-steel-900/50 p-5 transition-colors duration-300 hover:border-brand-500/40">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400 ring-1 ring-inset ring-brand-500/30">
                <ServiceGlyph name={cap.icon} className="h-6 w-6" />
              </span>
              <span className="text-sm font-semibold text-white sm:text-base">
                {cap.title}
              </span>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      {/* Technical stats over an industrial photo */}
      <div className="relative mt-8 overflow-hidden rounded-3xl border border-white/10">
        <div className="absolute inset-0">
          <Media
            src={banner?.src ?? ""}
            alt={banner?.alt ?? "Corte láser CNC (imagen referencial)"}
            sizes="100vw"
            status={banner?.status ?? "reference"}
          />
        </div>
        <div className="absolute inset-0 bg-steel-950/80" />
        <dl className="relative grid grid-cols-2 gap-6 p-8 sm:p-10 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <dt className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {stat.text ? (
                  stat.text
                ) : (
                  <Counter value={stat.value ?? 0} suffix={stat.suffix} />
                )}
              </dt>
              <dd className="mt-1 text-sm font-medium text-steel-300">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
