"use client";

import { useState } from "react";

import { ProductMedia } from "@/components/productos/ProductMedia";
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
  const slots =
    images.length > 0
      ? images
      : Array.from({ length: PLACEHOLDER_SLOTS }, () => "");
  const [active, setActive] = useState(0);

  return (
    <div>
      <ProductMedia
        src={slots[active] ?? ""}
        alt={alt}
        index={active}
        frame="landscape"
        rounded="rounded-3xl"
        sizes={MAIN_SIZES}
        className="shadow-2xl shadow-black/40 ring-1 ring-inset ring-white/10"
        priority
      />

      {slots.length > 1 ? (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
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
    </div>
  );
}
