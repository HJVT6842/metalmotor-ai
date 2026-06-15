import { getMediaById } from "@/data/media";

/**
 * Hero slides with per-device art direction.
 *
 * Each slide pairs a DESKTOP frame (16:9, resolved from the active-render
 * catalogue) with a VERTICAL mobile asset (4:5 / 9:16). The desktop frame must
 * be an active render (see ACTIVE_RENDERS); the mobile asset is a hero-only
 * art-direction variant that lives by path (not a catalogue id), so it never
 * pollutes ALL_MEDIA / /creditos.
 *
 * SAFE FALLBACK: a slide's mobile view is only used once its id is listed in
 * ACTIVE_MOBILE_HERO (i.e. the vertical .webp has actually been dropped). Until
 * then `resolveHeroSlide` returns the desktop src for mobile too, so production
 * never points at a missing file. Activation is a one-line edit, mirroring the
 * ACTIVE_RENDERS pattern. hero-slides.test.ts guards the wiring.
 */
export type HeroSlide = {
  readonly id: string;
  /** Catalogue id of the 16:9 desktop frame (must be an active render). */
  readonly desktopMediaId: string;
  /** Path of the vertical mobile .webp (used only when the id is activated). */
  readonly mobileSrc: string;
};

export const HERO_SLIDES: readonly HeroSlide[] = [
  {
    id: "hero-workshop",
    desktopMediaId: "hero-workshop",
    mobileSrc: "/images/reference/hero/hero-workshop-mobile.webp",
  },
  {
    id: "hero-celosias",
    desktopMediaId: "prod-celosias",
    mobileSrc: "/images/reference/hero/prod-celosias-mobile.webp",
  },
];

/**
 * Slide ids whose vertical mobile .webp exists and should be served on mobile.
 * EMPTY = every slide falls back to its desktop frame on mobile (safe default;
 * no missing-file 404). Add an id here ONLY after dropping its mobile .webp.
 */
export const ACTIVE_MOBILE_HERO: ReadonlySet<string> = new Set<string>([
  // "hero-workshop",
  // "hero-celosias",
]);

/** Resolve a slide to its desktop and mobile srcs, with the safe fallback. */
export function resolveHeroSlide(slide: HeroSlide): {
  readonly desktopSrc: string;
  readonly mobileSrc: string;
} {
  const desktopSrc = getMediaById(slide.desktopMediaId)?.src ?? "";
  const mobileSrc = ACTIVE_MOBILE_HERO.has(slide.id) ? slide.mobileSrc : desktopSrc;
  return { desktopSrc, mobileSrc };
}
