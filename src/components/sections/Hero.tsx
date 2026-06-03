import { WhatsAppCta } from "@/components/WhatsAppCta";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon } from "@/components/ui/icons";
import { SITE } from "@/data/site";

const STATS = [
  { value: "0,5–20 mm", label: "Espesores de corte" },
  { value: "CNC", label: "Corte y plegado" },
  { value: "MIG / TIG", label: "Soldadura certificada" },
] as const;

/** Above-the-fold hero with the core value proposition and primary CTAs. */
export function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-steel-950 text-white"
    >
      {/* Decorative industrial grid + spark gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-600/30 blur-3xl"
      />

      <Container className="relative py-20 sm:py-28 lg:py-32">
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full border border-steel-700 bg-steel-900/60 px-3 py-1 text-xs font-medium uppercase tracking-wider text-brand-400">
            {SITE.legalName}
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Corte láser CNC y{" "}
            <span className="text-brand-500">fabricación metálica</span> de
            precisión
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel-300">
            Transformamos tus planos en piezas reales: corte láser de fibra,
            paneles decorativos, celosías, plegado, soldadura y diseño CAD.
            Calidad industrial con acabado profesional.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <WhatsAppCta label="Cotizar por WhatsApp" size="lg" />
            <LinkButton href="#servicios" variant="ghost" size="lg" className="!text-white !ring-steel-600 hover:!bg-steel-800">
              Ver servicios
              <ArrowRightIcon className="h-5 w-5" />
            </LinkButton>
          </div>

          <dl className="mt-14 grid max-w-xl grid-cols-1 gap-6 sm:grid-cols-3">
            {STATS.map((stat) => (
              <div key={stat.label} className="border-l-2 border-brand-600 pl-4">
                <dt className="text-2xl font-bold text-white">{stat.value}</dt>
                <dd className="text-sm text-steel-400">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
