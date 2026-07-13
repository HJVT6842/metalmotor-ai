"use client";

import { useState } from "react";

import { ProductLightbox } from "@/components/productos/ProductLightbox";
import { ProductMedia } from "@/components/productos/ProductMedia";
import { ZoomInIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const MAIN_SIZES = "(max-width: 1024px) 100vw, 50vw";
/** Placeholder slots shown while a product has no real photos yet. */
const PLACEHOLDER_SLOTS = 4;

/**
 * Product image gallery. Uses real `images` when present; otherwise renders
 * premium gradient placeholders (varied per slot) so the layout is complete
 * before photography lands. Selecting a thumbnail swaps the main view.
 *
 * Aspect-ratio agnostic by design — see <ProductMedia>. Every photo (horizontal,
 * vertical, square, detail or ambience) shows whole via `object-contain` against
 * a neutral graphite frame, so the gallery never crops or distorts and keeps a
 * consistent height from product to product regardless of source resolution.
 */
export function ProductGallery({
  images,
  alt,
}: {
  readonly images: readonly string[];
  readonly alt: string;
}) {
  const hasPhotos = images.length > 0;
  const slots = hasPhotos
    ? images
    : Array.from({ length: PLACEHOLDER_SLOTS }, () => "");
  const [active, setActive] = useState(0);
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);

  const mainClassName =
    "shadow-2xl shadow-black/40 ring-1 ring-inset ring-white/10";

  return (
    <div>
      {hasPhotos ? (
        <button
          type="button"
          onClick={() => setZoomIndex(active)}
          aria-label="Ampliar imagen a pantalla completa"
          className="group/zoom block w-full cursor-zoom-in"
        >
          <ProductMedia
            src={slots[active] ?? ""}
            alt={alt}
            index={active}
            frame="landscape"
            rounded="rounded-3xl"
            sizes={MAIN_SIZES}
            className={mainClassName}
            priority
          >
            <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-steel-950/60 px-3 py-1.5 text-xs font-medium text-white opacity-0 ring-1 ring-inset ring-white/15 backdrop-blur-sm transition-opacity duration-300 group-hover/zoom:opacity-100">
              <ZoomInIcon className="h-4 w-4" />
              Ampliar
            </span>
          </ProductMedia>
        </button>
      ) : (
        <ProductMedia
          src={slots[active] ?? ""}
          alt={alt}
          index={active}
          frame="landscape"
          rounded="rounded-3xl"
          sizes={MAIN_SIZES}
          className={mainClassName}
          priority
        />
      )}

      {slots.length > 1 ? (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:mt-5 sm:grid-cols-5">
          {slots.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1}`}
              aria-pressed={i === active}
              className={cn(
                "rounded-xl transition-all",
                i === active
                  ? "ring-2 ring-brand-500"
                  : "opacity-70 ring-1 ring-white/10 hover:opacity-100",
              )}
            >
              <ProductMedia
                src={src}
                alt=""
                index={i}
                frame="square"
                rounded="rounded-xl"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      ) : null}

      {hasPhotos ? (
        <ProductLightbox
          images={images}
          alt={alt}
          index={zoomIndex}
          onClose={() => setZoomIndex(null)}
          onIndexChange={(i) => {
            setZoomIndex(i);
            setActive(i);
          }}
        />
      ) : null}
    </div>
  );
}
