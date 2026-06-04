"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { TESTIMONIALS } from "@/data/testimonials";

function Stars({ rating }: { readonly rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={cn(
            "h-5 w-5",
            i < rating ? "fill-brand-400" : "fill-steel-700",
          )}
          aria-hidden
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15l-5.2 2.6 1-5.8L1.5 7.7l5.9-.9z" />
        </svg>
      ))}
    </div>
  );
}

const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
};

export function Testimonials() {
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const count = TESTIMONIALS.length;

  const paginate = useCallback(
    (step: number) => {
      setState(([i]) => [(i + step + count) % count, step]);
    },
    [count],
  );

  useEffect(() => {
    const id = setInterval(() => paginate(1), 6500);
    return () => clearInterval(id);
  }, [paginate]);

  const t = TESTIMONIALS[index];

  return (
    <section
      id="testimonios"
      className="scroll-mt-20 border-y border-white/5 bg-steel-900/40 py-20 sm:py-24 lg:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow="Testimonios"
          title={
            <>
              Lo que dicen{" "}
              <span className="text-gradient-brand">nuestros clientes</span>
            </>
          }
        />

        <div className="relative mx-auto mt-12 max-w-3xl">
          <div className="min-h-[18rem] rounded-3xl border border-white/10 bg-steel-900/60 p-8 sm:p-12">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.blockquote
                key={index}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4 }}
              >
                <Stars rating={t.rating} />
                <p className="mt-5 text-xl font-medium leading-relaxed text-white sm:text-2xl">
                  “{t.quote}”
                </p>
                <footer className="mt-6 flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/15 text-lg font-bold text-brand-400 ring-1 ring-inset ring-brand-500/30">
                    {t.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block font-semibold text-white">
                      {t.name}
                    </span>
                    <span className="block text-sm text-steel-400">
                      {t.role} · {t.company}, {t.location}
                    </span>
                  </span>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => paginate(-1)}
              aria-label="Testimonio anterior"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
            >
              ‹
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((item, i) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setState([i, i > index ? 1 : -1])}
                  aria-label={`Ir al testimonio ${i + 1}`}
                  aria-current={i === index}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === index ? "w-6 bg-brand-500" : "w-2 bg-steel-600",
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => paginate(1)}
              aria-label="Testimonio siguiente"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
            >
              ›
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
