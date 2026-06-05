"use client";

import { motion } from "framer-motion";

import { WhatsAppCta } from "@/components/WhatsAppCta";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon } from "@/components/ui/icons";
import { EASE_OUT } from "@/components/animations/variants";

const STATS = [
  { value: "+500", label: "Proyectos" },
  { value: "0,5–20 mm", label: "Espesores" },
  { value: "24h", label: "Respuesta" },
] as const;

// Deterministic positions (no Math.random → SSR-stable, no hydration drift).
const PARTICLES = [
  { x: "8%", y: "22%", d: 7, delay: 0 },
  { x: "20%", y: "70%", d: 9, delay: 1.2 },
  { x: "35%", y: "40%", d: 6, delay: 0.6 },
  { x: "62%", y: "28%", d: 8, delay: 2 },
  { x: "78%", y: "62%", d: 10, delay: 0.3 },
  { x: "88%", y: "35%", d: 7, delay: 1.6 },
  { x: "50%", y: "80%", d: 9, delay: 0.9 },
] as const;

const headlineWords = [
  { text: "Celosías,", grad: false },
  { text: "Portones", grad: false },
  { text: "y", grad: false },
  { text: "Corte", grad: true },
  { text: "Láser", grad: true },
  { text: "CNC", grad: true },
  { text: "a", grad: false },
  { text: "Medida", grad: false },
] as const;

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[74vh] items-center overflow-hidden bg-steel-950 sm:min-h-[78vh]"
    >
      {/* Crossfading reference banner (parallax + Ken Burns) */}
      <HeroBanner />

      {/* Engineering grid */}
      <div className="bg-grid absolute inset-0" aria-hidden />

      {/* Motion gradient blobs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-brand-600/25 blur-[120px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-brand-500/15 blur-[120px]"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Laser beam sweep */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-0 h-full w-px bg-gradient-to-b from-transparent via-brand-400 to-transparent"
        initial={{ left: "-5%", opacity: 0 }}
        animate={{ left: ["-5%", "105%"], opacity: [0, 0.9, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
      />

      {/* Industrial particles / sparks */}
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="pointer-events-none absolute h-1 w-1 rounded-full bg-brand-400"
          style={{ left: p.x, top: p.y }}
          animate={{ y: [0, -18, 0], opacity: [0.2, 1, 0.2] }}
          transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        />
      ))}

      {/* Bottom fade into next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-steel-950 to-transparent"
      />

      <Container className="relative py-24">
        <div className="max-w-4xl">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-brand-300 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
            Metal Motor Services SpA · Chile
          </motion.span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.06] tracking-tight text-white sm:mt-8 sm:text-6xl lg:text-7xl">
            {headlineWords.map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.15 + i * 0.07 }}
                className={`inline-block ${w.grad ? "text-gradient-brand" : ""}`}
              >
                {w.text}
                {i < headlineWords.length - 1 ? " " : ""}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.85 }}
            className="mt-5 max-w-xl text-lg leading-relaxed text-steel-300 sm:mt-6 sm:max-w-2xl sm:text-xl"
          >
            Transformamos planos e ideas en piezas metálicas de calidad
            industrial.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 1 }}
            className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row"
          >
            <WhatsAppCta label="Cotizar por WhatsApp" size="lg" />
            <LinkButton href="#contacto" variant="ghost" size="lg">
              Solicitar Presupuesto
              <ArrowRightIcon className="h-5 w-5" />
            </LinkButton>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-12 grid max-w-xl grid-cols-3 gap-4 sm:mt-16 sm:gap-6"
          >
            {STATS.map((s) => (
              <div key={s.label} className="border-l-2 border-brand-500/70 pl-4">
                <dt className="text-xl font-bold text-white sm:text-2xl">
                  {s.value}
                </dt>
                <dd className="text-sm text-steel-400">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </Container>
    </section>
  );
}
