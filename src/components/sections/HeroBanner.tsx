"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { getImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

import { MediaBadge } from "@/components/ui/MediaBadge";
import { HERO_SLIDES, resolveHeroSlide } from "@/data/hero-slides";
import { useIsDesktop } from "@/lib/useIsDesktop";

/** Premium crossfade timing: each frame held, then an 800ms fade to the next. */
const HOLD_MS = 6000;
const FADE_MS = 800;

/**
 * Desktop breakpoint = Tailwind `sm` (640px). At or above it the 16:9 desktop
 * frame is used (a <picture> <source>); below it the vertical mobile asset (the
 * <img> default). The browser downloads ONLY the matching source.
 */
const DESKTOP_MEDIA = "(min-width: 640px)";

/**
 * Precomputed once: each slide → optimized <picture> props via getImageProps.
 * Native art direction: desktop 16:9 as a <source media>, vertical mobile asset
 * as the <img> default — so each device fetches a single image (no double
 * download) and the HTML preload scanner can pick the LCP frame early. The entry
 * frame is eager (LCP); the rest stay lazy.
 */
const FRAMES = HERO_SLIDES.map((slide, idx) => {
  const { desktopSrc, mobileSrc } = resolveHeroSlide(slide);
  const common = { alt: "", fill: true as const, sizes: "100vw", quality: 82 };
  const { props: desktop } = getImageProps({ ...common, src: desktopSrc, priority: idx === 0 });
  const { props: mobile } = getImageProps({ ...common, src: mobileSrc, priority: idx === 0 });
  return { id: slide.id, desktop, mobile };
});

/**
 * Full-bleed hero background: auto-crossfading reference frames (no slider, no
 * controls) with a slow Ken Burns zoom and scroll parallax. Per-device art
 * direction (16:9 desktop / vertical mobile) avoids the mobile crop. All frames
 * are stacked and cross-faded by opacity, so there is no layout shift (CLS 0).
 * Heavily overlaid so foreground text stays AA-readable. Respects
 * prefers-reduced-motion.
 */
export function HeroBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
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

  // Scroll parallax + Ken Burns run on desktop only. On iOS Safari the address
  // bar collapsing on scroll fires continuous resize/scroll events that make
  // the scroll-driven transform jitter, and the animated zoom compounds it.
  const animate = isDesktop && !reduceMotion;

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div style={animate ? { y } : undefined} className="absolute inset-0" aria-hidden>
        {/* Ken Burns: subtle continuous zoom across the whole stack. */}
        <motion.div
          className="absolute inset-0"
          animate={animate ? { scale: [1.04, 1.12, 1.04] } : undefined}
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
              <picture>
                {/* Desktop 16:9 — only fetched at >=640px. */}
                <source
                  media={DESKTOP_MEDIA}
                  srcSet={frame.desktop.srcSet}
                  sizes={frame.desktop.sizes}
                />
                {/* Vertical mobile (default) — only fetched below 640px. */}
                {/* eslint-disable-next-line @next/next/no-img-element -- art direction via <picture> uses getImageProps, not <Image>. */}
                <img
                  {...frame.mobile}
                  alt=""
                  className="object-cover object-center"
                />
              </picture>
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
