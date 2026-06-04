"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

import { Container } from "@/components/ui/Container";
import { Lightbox } from "@/components/ui/Lightbox";
import { Media } from "@/components/ui/Media";
import { SectionHeading } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { SHOWCASE_MEDIA } from "@/data/media";

const TALL = new Set(["svc-corte-laser", "svc-celosias"]);

export function Portfolio() {
  const categories = useMemo(
    () => ["Todos", ...new Set(SHOWCASE_MEDIA.map((m) => m.category))],
    [],
  );
  const [active, setActive] = useState<string>("Todos");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const items = useMemo(
    () =>
      active === "Todos"
        ? SHOWCASE_MEDIA
        : SHOWCASE_MEDIA.filter((m) => m.category === active),
    [active],
  );

  return (
    <section
      id="portafolio"
      className="scroll-mt-20 border-y border-white/5 bg-steel-900/40 py-20 sm:py-24 lg:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow="Showcase"
          title={
            <>
              Capacidades en{" "}
              <span className="text-gradient-brand">imágenes</span>
            </>
          }
          description="Visuales de referencia de nuestras capacidades. Pronto reemplazaremos estas imágenes por fotos reales de trabajos propios."
        />

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {categories.map((category) => {
            const selected = active === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setActive(category);
                  setLightbox(null);
                }}
                aria-pressed={selected}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  selected
                    ? "bg-brand-500 text-white"
                    : "bg-white/5 text-steel-300 ring-1 ring-inset ring-white/10 hover:bg-white/10 hover:text-white",
                )}
              >
                {category}
              </button>
            );
          })}
        </div>

        <motion.div
          layout
          className="mt-10 grid auto-rows-[210px] grid-cols-2 gap-4 sm:auto-rows-[240px] lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {items.map((item, i) => (
              <motion.button
                type="button"
                key={item.id}
                layout
                onClick={() => setLightbox(i)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                aria-label={`Ampliar: ${item.title}`}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-white/10 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                  TALL.has(item.id) && "row-span-2",
                )}
              >
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
                  <Media
                    src={item.src}
                    alt={item.alt}
                    index={i}
                    status={item.status}
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-steel-950 via-steel-950/20 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-5 opacity-90 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
                    {item.category}
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-white">
                    {item.title}
                  </h3>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
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
