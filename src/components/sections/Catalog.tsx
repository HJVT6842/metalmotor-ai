import { WhatsAppCta } from "@/components/WhatsAppCta";
import { Section, SectionHeading } from "@/components/ui/Section";
import { CATALOG } from "@/data/catalog";

/** Showcase of representative fabricated products. */
export function Catalog() {
  return (
    <Section id="catalogo" className="bg-steel-50">
      <SectionHeading
        eyebrow="Catálogo"
        title="Productos y trabajos destacados"
        description="Ejemplos de lo que fabricamos. ¿Tienes un diseño propio? Lo producimos a medida."
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CATALOG.map((item) => (
          <article
            key={item.slug}
            className="flex flex-col overflow-hidden rounded-2xl border border-steel-200 bg-white"
          >
            {/* Placeholder visual until real product photography is added. */}
            <div
              aria-hidden
              className="flex h-44 items-center justify-center bg-gradient-to-br from-steel-800 to-steel-950"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-steel-400">
                {item.category}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-lg font-bold text-steel-900">{item.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-steel-600">
                {item.description}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-steel-100 px-2.5 py-1 text-xs font-medium text-steel-700"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl bg-steel-900 px-6 py-10 text-center">
        <h3 className="text-2xl font-bold text-white">
          ¿No encuentras lo que buscas?
        </h3>
        <p className="max-w-xl text-steel-300">
          Fabricamos a pedido según tus planos o ideas. Cuéntanos tu proyecto y
          te enviamos una cotización.
        </p>
        <WhatsAppCta label="Solicitar cotización a medida" />
      </div>
    </Section>
  );
}
