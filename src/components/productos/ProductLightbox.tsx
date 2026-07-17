"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";

import { CloseIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type ProductLightboxProps = {
  readonly images: readonly string[];
  readonly alt: string;
  /** Active index, or null when closed. */
  readonly index: number | null;
  readonly onClose: () => void;
  readonly onIndexChange: (index: number) => void;
};

/** How far the click-to-zoom magnifies the full-size photo. */
const ZOOM = 2.4;

/**
 * Full-screen product photo viewer. Aspect-ratio agnostic (object-contain, so
 * no crop or distortion), loads the photo at full width for real detail, and
 * adds click-to-zoom with cursor panning. Keyboard: Esc closes, ←/→ navigate.
 *
 * Productos-specific on purpose — the shared ui/Lightbox is bound to the
 * industrial MediaAsset model (badges, licensing) and crops with object-cover.
 */
export function ProductLightbox({
  images,
  alt,
  index,
  onClose,
  onIndexChange,
}: ProductLightboxProps) {
  const open = index !== null;
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const handleClose = useCallback(() => {
    setZoomed(false);
    onClose();
  }, [onClose]);

  const go = useCallback(
    (step: number) => {
      if (index === null) return;
      setZoomed(false);
      onIndexChange((index + step + images.length) % images.length);
    },
    [index, images.length, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
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
  }, [open, go, handleClose]);

  const src = index !== null ? (images[index] ?? "") : "";
  const hasMultiple = images.length > 1;

  const handleMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setOrigin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const navButton =
    "flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/20";

  return (
    <AnimatePresence>
      {open && src ? (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col bg-steel-950"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <div
            className="flex items-center justify-between px-4 py-4 sm:px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-sm tabular-nums text-steel-300">
              {(index ?? 0) + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Cerrar"
              className={navButton}
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <div
            className="relative flex flex-1 items-center justify-center gap-3 px-4 pb-2 sm:gap-6 sm:px-8"
            onClick={(e) => e.stopPropagation()}
          >
            {hasMultiple ? (
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Anterior"
                className={cn(navButton, "shrink-0")}
              >
                ‹
              </button>
            ) : null}

            <motion.div
              key={index}
              className={cn(
                "relative h-full max-h-[78vh] w-full max-w-5xl overflow-hidden rounded-2xl",
                zoomed ? "cursor-zoom-out" : "cursor-zoom-in",
              )}
              onMouseMove={handleMove}
              onClick={() => setZoomed((z) => !z)}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="absolute inset-0 transition-transform duration-200 ease-out"
                style={{
                  transform: `scale(${zoomed ? ZOOM : 1})`,
                  transformOrigin: `${origin.x}% ${origin.y}%`,
                }}
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="100vw"
                  quality={82}
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>

            {hasMultiple ? (
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Siguiente"
                className={cn(navButton, "shrink-0")}
              >
                ›
              </button>
            ) : null}
          </div>

          <p
            className="pb-5 pt-2 text-center text-xs text-steel-500"
            onClick={(e) => e.stopPropagation()}
          >
            {zoomed
              ? "Clic para alejar · mueve el cursor para explorar"
              : "Clic en la imagen para acercar"}
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
