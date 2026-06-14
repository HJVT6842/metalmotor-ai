"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { MediaBadge } from "@/components/ui/MediaBadge";
import { getMediaById } from "@/data/media";
import { HERO_ROTATION_IDS } from "@/data/hero-rotation";

/** Premium crossfade timing: each frame held, then an 800ms fade to the next. */
const HOLD_MS = 6000;
const FADE_MS = 800;

/** Resolved once: each rotation id → its active-render media asset. */
const FRAMES = HERO_ROTATION_IDS.map((id) => getMediaById(id)).filter(
  (m): m is NonNullable<ReturnType<typeof getMediaById>> => Boolean(m?.src),
);

/**
 * Full-bleed hero background: auto-crossfading reference frames (no slider, no
 * controls) with a slow Ken Burns zoom and scroll parallax. All frames are
 * stacked and cross-faded by opacity, so there is no layout shift (CLS 0) and
 * the crossfade is smooth. Only the entry frame is `priority` (LCP); the rest
 * load lazily. Heavily overlaid so foreground text stays AA-readable. Carries an
 * "Imagen referencial" badge (honesty rule). Respects prefers-reduced-motion.
 */
export function HeroBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (reduceMotion || FRAMES.length <= 1) return;
    const id = setInterval(
      () => setCurrent((p) => (p + 1) % FRAMES.length),
      HOLD_MS + FADE_MS,
    );
    return () => clearInterval(id);
  }, [reduceMotion]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0" aria-hidden>
        {/* Ken Burns: subtle continuous zoom across the whole stack. */}
        <motion.div
          className="absolute inset-0"
          animate={reduceMotion ? undefined : { scale: [1.04, 1.12, 1.04] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        >
          {FRAMES.map((frame, idx) => (
            <motion.div
              key={frame.id}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: idx === current ? 1 : 0 }}
              transition={{ duration: FADE_MS / 1000, ease: "easeInOut" }}
            >
              <Image
                src={frame.src}
                alt=""
                fill
                priority={idx === 0}
                sizes="100vw"
                quality={82}
                className="object-cover object-center"
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Readability overlays — lighter so the real photo reads, text stays AA. */}
      <div className="absolute inset-0 bg-steel-950/55" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-r from-steel-950 via-steel-950/60 to-steel-950/15"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-steel-950 to-transparent"
        aria-hidden
      />

      <div className="absolute bottom-5 left-4 z-10">
        <MediaBadge status="reference" />
      </div>
    </div>
  );
}
