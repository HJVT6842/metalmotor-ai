import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Media } from "@/components/ui/Media";
import { ArrowRightIcon, WhatsAppIcon } from "@/components/ui/icons";
import { getMediaById } from "@/data/media";
import { PRODUCTS } from "@/data/products";
import { SITE } from "@/data/site";
import { buildWhatsAppUrl, quotationMessage } from "@/lib/whatsapp";

/** Premium product cards with hover animation and a per-product WhatsApp CTA. */
export function Products() {
  return (
    <Section id="productos" className="bg-steel-950">
      <SectionHeading
        eyebrow="Productos"
        title={
          <>
            Soluciones metálicas{" "}
            <span className="text-gradient-brand">listas para tu proyecto</span>
          </>
        }
        description="Productos de catálogo y fabricación a medida con acabado profesional."
      />

      <Stagger
        className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        stagger={0.08}
      >
        {PRODUCTS.map((product, i) => {
          const href = buildWhatsAppUrl(
            SITE.whatsappNumber,
            quotationMessage(product.name),
          );
          const media = getMediaById(product.mediaId);
          return (
            <StaggerItem key={product.slug}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-steel-900/50 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-[0_0_40px_-12px_rgba(249,115,22,0.45)]">
                <div className="relative h-52 overflow-hidden">
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
                    <Media
                      src={media?.src ?? ""}
                      alt={media?.alt ?? product.name}
                      index={i}
                      status={media?.status ?? "reference"}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-steel-900/80 to-transparent" />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-bold text-white">{product.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-steel-400">
                    {product.description}
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-steel-300 ring-1 ring-inset ring-white/10"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-400 transition-colors hover:text-brand-300"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Cotizar
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
