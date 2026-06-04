"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect } from "react";

import { Media } from "@/components/ui/Media";
import { MediaBadge } from "@/components/ui/MediaBadge";
import type { MediaAsset } from "@/data/media";

type LightboxProps = {
  readonly items: readonly MediaAsset[];
  /** Active index, or null when closed. */
  readonly index: number | null;
  readonly onClose: () => void;
  readonly onIndexChange: (index: number) => void;
};

/** Accessible modal gallery with keyboard nav and mobile drag-to-swipe. */
export function Lightbox({ items, index, onClose, onIndexChange }: LightboxProps) {
  const open = index !== null;

  const go = useCallback(
    (step: number) => {
      if (index === null) return;
      onIndexChange((index + step + items.length) % items.length);
    },
    [index, items.length, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, go, onClose]);

  const item = index !== null ? items[index] : null;

  return (
    <AnimatePresence>
      {open && item ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-steel-950/90 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20"
          >
            ×
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Anterior"
            className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20 sm:flex"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Siguiente"
            className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20 sm:flex"
          >
            ›
          </button>

          <motion.figure
            key={item.id}
            className="w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) go(1);
              else if (info.offset.x > 80) go(-1);
            }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-steel-900">
              <Media
                src={item.src}
                alt={item.alt}
                sizes="100vw"
                showBadge={false}
              />
            </div>
            <figcaption className="mt-4 flex flex-col items-center gap-2 text-center">
              <MediaBadge status={item.status} />
              <span className="text-lg font-semibold text-white">
                {item.title}
              </span>
              <span className="text-xs text-steel-500">
                {item.credit ? `${item.credit} · ` : ""}
                {item.license}
              </span>
            </figcaption>
          </motion.figure>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
