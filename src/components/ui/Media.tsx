import Image from "next/image";

import { MediaBadge } from "@/components/ui/MediaBadge";
import type { MediaStatus } from "@/data/media";
import { cn } from "@/lib/cn";

const TONES: ReadonlyArray<readonly [string, string]> = [
  ["#1e293b", "#020617"],
  ["#0f172a", "#1c1917"],
  ["#1e293b", "#0c0a09"],
  ["#172033", "#020617"],
];

type PosterProps = {
  readonly label: string;
  readonly index?: number;
  readonly className?: string;
};

/** Inline-SVG fallback when no asset src is supplied. */
export function Poster({ label, index = 0, className }: PosterProps) {
  const [from, to] = TONES[index % TONES.length];
  const slug = label.replace(/[^a-zA-Z0-9]+/g, "").toLowerCase().slice(0, 10);
  const gid = `poster-${index}-${slug}`;
  return (
    <div className={cn("absolute inset-0", className)} aria-hidden>
      <svg
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id={`${gid}-bg`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={from} />
            <stop offset="1" stopColor={to} />
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill={`url(#${gid}-bg)`} />
        <circle cx="640" cy="140" r="180" fill="rgba(249,115,22,0.10)" />
      </svg>
    </div>
  );
}

type MediaProps = {
  readonly src: string;
  readonly alt: string;
  readonly index?: number;
  readonly className?: string;
  readonly sizes?: string;
  readonly priority?: boolean;
  /** When provided, an "Imagen referencial" / "Trabajo realizado" badge shows. */
  readonly status?: MediaStatus;
  readonly showBadge?: boolean;
};

/**
 * Optimized image fill, with an optional provenance badge. SVG reference assets
 * are served via next/image (allowed by next.config CSP); when real .webp photos
 * replace them under /images/real/**, optimization kicks in automatically.
 * Parent must be `relative`.
 */
export function Media({
  src,
  alt,
  index = 0,
  className,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
  status,
  showBadge = true,
}: MediaProps) {
  return (
    <>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          quality={82}
          className={cn("object-cover object-center", className)}
        />
      ) : (
        <Poster label={alt} index={index} className={className} />
      )}
      {status && showBadge ? (
        <div className="absolute left-3 top-3 z-10">
          <MediaBadge status={status} />
        </div>
      ) : null}
    </>
  );
}
