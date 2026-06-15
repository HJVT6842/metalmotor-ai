import { describe, expect, it } from "vitest";

import {
  ACTIVE_MOBILE_HERO,
  HERO_SLIDES,
  resolveHeroSlide,
} from "@/data/hero-slides";
import { getMediaById } from "@/data/media";
import { ACTIVE_RENDERS } from "@/data/render-manifest";

describe("hero slides (per-device art direction)", () => {
  it("has at least two slides (otherwise the crossfade is a no-op)", () => {
    expect(HERO_SLIDES.length).toBeGreaterThanOrEqual(2);
  });

  it("every desktop frame is an ACTIVE render with a src", () => {
    for (const slide of HERO_SLIDES) {
      expect(getMediaById(slide.desktopMediaId)?.src).toBeTruthy();
      expect(ACTIVE_RENDERS.has(slide.desktopMediaId)).toBe(true);
    }
  });

  it("mobile src targets the hero reference dir as a .webp", () => {
    for (const slide of HERO_SLIDES) {
      expect(slide.mobileSrc.startsWith("/images/reference/hero/")).toBe(true);
      expect(slide.mobileSrc.endsWith(".webp")).toBe(true);
    }
  });

  it("mobile falls back to the desktop src until the slide is activated", () => {
    for (const slide of HERO_SLIDES) {
      const { desktopSrc, mobileSrc } = resolveHeroSlide(slide);
      if (ACTIVE_MOBILE_HERO.has(slide.id)) {
        expect(mobileSrc).toBe(slide.mobileSrc);
      } else {
        expect(mobileSrc).toBe(desktopSrc); // safe: never a missing-file 404
      }
    }
  });

  it("slide ids are unique", () => {
    expect(new Set(HERO_SLIDES.map((s) => s.id)).size).toBe(HERO_SLIDES.length);
  });
});
