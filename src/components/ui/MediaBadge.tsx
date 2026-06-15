import type { MediaStatus } from "@/data/media";

type MediaBadgeProps = {
  readonly status: MediaStatus;
  readonly className?: string;
};

/**
 * Per-image provenance badge — intentionally NOT rendered.
 *
 * The visible "Imagen referencial" overlay was removed in favour of a single
 * general disclaimer in the "Trabajos y Proyectos" section (see Portfolio.tsx).
 * The honesty rule itself still lives in `mediaBadgeLabel` (src/data/media.ts),
 * and every asset keeps its `status`/credit metadata untouched. This component
 * is kept as a no-op so existing callers compile without per-card changes; to
 * restore per-image badges, reinstate the JSX here.
 */
export function MediaBadge(_props: MediaBadgeProps): null {
  return null;
}
