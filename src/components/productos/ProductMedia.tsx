"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

import { Poster } from "@/components/ui/Media";
import { cn } from "@/lib/cn";

/**
 * Aspect-ratio presets for the frame. The FRAME owns the shape and therefore
 * the visual height — never the photo. Any photo dropped in is shown whole
 * inside this box, so a catalogue of mixed ratios stays perfectly aligned.
 */
const FRAME = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  tall: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  wide: "aspect-[3/2]",
} as const;

type Frame = keyof typeof FRAME;
type Fit = "contain" | "cover";

type ProductMediaProps = {
  readonly src: string;
  readonly alt: string;
  /** Varies the placeholder gradient so a grid never looks flat. */
  readonly index?: number;
  readonly sizes?: string;
  readonly priority?: boolean;
  /**
   * How the photo fills the frame.
   * - `"contain"` (default): the whole photo is shown — never cropped, never
   *   distorted — letterboxed against the frame's neutral background. This is
   *   the catalogue default so no real product is ever partially lost.
   * - `"cover"`: fills the frame (may crop edges). Reserve for decorative
   *   ambience backdrops with text over them (e.g. category banners), never
   *   for a view whose job is to show one product accurately.
   */
  readonly fit?: Fit;
  /** Frame shape → drives the consistent visual height. Default `"landscape"`. */
  readonly frame?: Frame;
  /** Corner radius utility for the frame. */
  readonly rounded?: string;
  /**
   * Neutral background revealed by `object-contain` letterboxing. The design is
   * dark, so graphite (`bg-steel-900`) is the on-brand neutral; pass a lighter
   * token (e.g. `bg-steel-100`) where the surrounding surface calls for it.
   */
  readonly background?: string;
  /** Adds the shared hover zoom (used by cards / category banners). */
  readonly hoverZoom?: boolean;
  /** Extra classes on the frame (e.g. responsive aspect overrides, borders). */
  readonly className?: string;
  /** Overlays rendered above the image inside the frame (gradients, labels). */
  readonly children?: ReactNode;
};

/**
 * The definitive image primitive for the whole Productos catalogue.
 *
 * ARCHITECTURE: aspect ratio is a property of the FRAME, not of the photo. The
 * frame is a sized, rounded box with a neutral background; the photo is a
 * `next/image` fill placed inside with `object-contain` by default. The result
 * is fully independent of the source resolution — horizontal, vertical, square,
 * detail or ambience shots all display whole (no crop, no stretch) and every
 * frame keeps the same visual height so cards and galleries stay aligned.
 *
 * Adding a photo to the catalogue = drop the file under `/public/images/
 * productos/**` and add its path in `home-products.ts`. No per-product tuning,
 * no fixed resolution, no code change. When a declared path 404s (photo not
 * shot yet) it degrades to the same premium gradient <Poster>.
 *
 * Reused by: product hero + gallery, product cards (featured / related / grid)
 * and category banners — one component, no per-context hacks.
 *
 * Parent context: the frame is `relative`; drop children in as overlays.
 */
export function ProductMedia({
  src,
  alt,
  index = 0,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
  fit = "contain",
  frame = "landscape",
  rounded = "rounded-2xl",
  background = "bg-steel-900",
  hoverZoom = false,
  className,
  children,
}: ProductMediaProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        FRAME[frame],
        rounded,
        background,
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0",
          hoverZoom &&
            "transition-transform duration-700 ease-out motion-safe:group-hover:scale-105",
        )}
      >
        {showImage ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            quality={82}
            className={cn(
              fit === "contain" ? "object-contain" : "object-cover",
              "object-center",
            )}
            onError={() => setFailed(true)}
          />
        ) : (
          <Poster label={alt} index={index} />
        )}
      </div>

      {children}
    </div>
  );
}
