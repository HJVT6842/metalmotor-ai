"use client";

import { useState } from "react";

import { Container } from "@/components/ui/Container";
import { Lightbox } from "@/components/ui/Lightbox";
import { Media } from "@/components/ui/Media";
import { SectionHeading } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { SHOWCASE_MEDIA } from "@/data/media";

// Varied aspect ratios → Pinterest-style masonry rhythm.
const ASPECTS = [
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[4/5]",
  "aspect-[5/4]",
  "aspect-[4/5]",
  "aspect-[3/4]",
];

/** "Trabajos y proyectos" — masonry gallery (CSS columns) with lightbox. */
export function Portfolio() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const items = SHOWCASE_MEDIA;

  return (
    <section
      id="trabajos"
      className="scroll-mt-20 border-y border-white/5 bg-steel-900/40 py-20 sm:py-24 lg:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow="Trabajos y proyectos"
          title={
            <>
              Capacidades en <span className="text-gradient-brand">imágenes</span>
            </>
          }
          description="Imágenes referenciales de nuestras capacidades. Pronto incorporaremos fotografías reales de trabajos propios."
        />

        <div className="mt-12 columns-2 gap-4 [column-fill:_balance] lg:columns-3">
          {items.map((item, i) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setLightbox(i)}
              aria-label={`Ampliar: ${item.title}`}
              className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-white/10 text-left transition-all duration-300 hover:border-brand-500/40 hover:shadow-[0_0_40px_-12px_rgba(249,115,22,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <div className={cn("relative w-full", ASPECTS[i % ASPECTS.length])}>
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
                  <Media
                    src={item.src}
                    alt={item.alt}
                    index={i}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    status={item.status}
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-steel-950 via-steel-950/25 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 opacity-90 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
                    {item.category}
                  </span>
                  <h3 className="mt-0.5 text-base font-bold text-white">
                    {item.title}
                  </h3>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Container>

      <Lightbox
        items={items}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onIndexChange={setLightbox}
      />
    </section>
  );
}
