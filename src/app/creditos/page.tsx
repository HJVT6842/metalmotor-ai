import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { ALL_MEDIA } from "@/data/media";

export const metadata: Metadata = {
  title: "Créditos de imágenes",
  description:
    "Atribución de las imágenes referenciales utilizadas en el sitio de Metal Motor Services SpA.",
  robots: { index: false, follow: true },
};

/** Image attribution page — fulfills CC-BY / CC-BY-SA attribution requirements. */
export default function CreditosPage() {
  const referenced = ALL_MEDIA.filter((m) => m.status === "reference" && m.credit);
  // De-duplicate by source so the same photo is listed once.
  const unique = Array.from(
    new Map(referenced.map((m) => [m.source ?? m.id, m])).values(),
  );

  return (
    <Container className="py-20 sm:py-28">
      <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Créditos de imágenes
      </h1>
      <p className="mt-4 max-w-2xl text-steel-300">
        Las imágenes marcadas como <strong>“Imagen referencial”</strong> son
        fotografías con licencia de uso comercial obtenidas de Wikimedia Commons.
        No corresponden a trabajos realizados por Metal Motor Services SpA y se
        reemplazarán por fotografías propias. A continuación, la atribución de
        cada autor y licencia.
      </p>

      <ul className="mt-10 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-steel-900/50">
        {unique.map((m) => (
          <li key={m.source ?? m.id} className="flex flex-col gap-1 p-5 text-sm">
            <span className="font-semibold text-white">{m.title}</span>
            <span className="text-steel-400">
              Autor: {m.credit}
              {" · "}
              Licencia:{" "}
              {m.licenseUrl ? (
                <a
                  href={m.licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer license"
                  className="text-brand-400 hover:text-brand-300"
                >
                  {m.license}
                </a>
              ) : (
                <span>{m.license}</span>
              )}
            </span>
            {m.source ? (
              <a
                href={m.source}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit text-xs text-steel-500 hover:text-steel-300"
              >
                Ver original en Wikimedia Commons →
              </a>
            ) : null}
          </li>
        ))}
      </ul>

      <p className="mt-8">
        <Link
          href="/"
          className="text-sm font-semibold text-brand-400 hover:text-brand-300"
        >
          ← Volver al inicio
        </Link>
      </p>
    </Container>
  );
}
