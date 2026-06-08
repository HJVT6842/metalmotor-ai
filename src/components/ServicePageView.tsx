import Link from "next/link";

import { ServiceViewTracker } from "@/components/analytics/ServiceViewTracker";
import { WhatsAppCta } from "@/components/WhatsAppCta";
import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { MediaBadge } from "@/components/ui/MediaBadge";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";
import { getMediaById } from "@/data/media";
import { getServicePage, type ServicePage } from "@/data/service-pages";
import { SITE } from "@/data/site";

function ServiceJsonLd({ page }: { readonly page: ServicePage }) {
  const url = `${SITE.url}/${page.slug}`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: page.name,
        serviceType: page.name,
        description: page.metaDescription,
        url,
        image: `${SITE.url}${getMediaById(page.mediaId)?.src ?? "/icon.svg"}`,
        provider: { "@id": `${SITE.url}/#organization` },
        areaServed: [
          ...SITE.serviceCities.map((name) => ({ "@type": "City", name })),
          { "@type": "Country", name: "Chile" },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE.url },
          { "@type": "ListItem", position: 2, name: page.name, item: url },
        ],
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** SEO landing template for a single service. Additive — reuses existing UI. */
export function ServicePageView({ page }: { readonly page: ServicePage }) {
  const media = getMediaById(page.mediaId);

  return (
    <>
      <ServiceJsonLd page={page} />
      <ServiceViewTracker slug={page.slug} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-steel-950">
        <div className="absolute inset-0">
          <Media
            src={media?.src ?? ""}
            alt={media?.alt ?? page.name}
            sizes="100vw"
            priority
            showBadge={false}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-steel-950 via-steel-950/80 to-steel-950/40" />
        <Container className="relative py-20 sm:py-28">
          <nav aria-label="Migas" className="mb-4 text-sm text-steel-400">
            <Link href="/" className="hover:text-white">
              Inicio
            </Link>
            <span className="px-2">/</span>
            <span className="text-steel-300">{page.name}</span>
          </nav>
          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            {page.name} <span className="text-gradient-brand">a medida</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-steel-300">
            {page.intro[0]}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <WhatsAppCta label="Cotizar por WhatsApp" service={page.name} size="lg" />
            <Link
              href="/#contacto"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 px-7 py-3.5 text-base font-semibold text-white ring-1 ring-inset ring-white/15 backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              Solicitar presupuesto
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
          <div className="mt-6">
            <MediaBadge status={media?.status ?? "reference"} />
          </div>
        </Container>
      </section>

      {/* Detalle */}
      <section className="bg-steel-900/40 py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            {page.intro.slice(1).map((p) => (
              <p key={p} className="text-lg leading-relaxed text-steel-300">
                {p}
              </p>
            ))}
            <p className="mt-6 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-steel-400">
              {SITE.coverage}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-steel-900/60 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white">¿Qué incluye?</h2>
            <ul className="mt-4 space-y-3">
              {page.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-steel-200">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <WhatsAppCta
                label="Cotizar este servicio"
                service={page.name}
                size="md"
                className="w-full"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Servicios relacionados (enlazado interno) */}
      <section className="bg-steel-950 py-16 sm:py-20">
        <Container>
          <h2 className="text-2xl font-bold text-white">Servicios relacionados</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {page.related.map((slug) => {
              const rel = getServicePage(slug);
              if (!rel) return null;
              return (
                <Link
                  key={slug}
                  href={`/${slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-steel-200 transition-colors hover:border-brand-500/40 hover:text-white"
                >
                  {rel.name}
                  <ArrowRightIcon className="h-4 w-4 text-brand-400" />
                </Link>
              );
            })}
          </div>
          <p className="mt-8">
            <Link
              href="/"
              className="text-sm font-semibold text-brand-400 hover:text-brand-300"
            >
              ← Volver al inicio
            </Link>
          </p>
        </Container>
      </section>
    </>
  );
}
