"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { MediaBadge } from "@/components/ui/MediaBadge";
import { HERO_MEDIA } from "@/data/media";

/**
 * Full-bleed hero background: crossfading reference banners with a slow Ken
 * Burns zoom and scroll parallax. Heavily overlaid so foreground text stays
 * AA-readable. Carries an "Imagen referencial" badge (honesty rule).
 */
export function HeroBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % HERO_MEDIA.length), 5500);
    return () => clearInterval(id);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  const item = HERO_MEDIA[i];

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0" aria-hidden>
        <AnimatePresence>
          <motion.div
            key={item.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1.16 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.4 },
              scale: { duration: 7, ease: "linear" },
            }}
          >
            <Image
              src={item.src}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Readability overlays */}
      <div className="absolute inset-0 bg-steel-950/72" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-r from-steel-950 via-steel-950/70 to-steel-950/20"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-steel-950 to-transparent"
        aria-hidden
      />

      <div className="absolute bottom-5 left-4 z-10">
        <MediaBadge status="reference" />
      </div>
    </div>
  );
}
