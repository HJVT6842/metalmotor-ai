import { describe, expect, it } from "vitest";

import { HERO_ROTATION_IDS } from "@/data/hero-rotation";
import { getMediaById } from "@/data/media";
import { ACTIVE_RENDERS } from "@/data/render-manifest";

describe("hero rotation frames", () => {
  it("has at least two frames (otherwise the crossfade is a no-op)", () => {
    expect(HERO_ROTATION_IDS.length).toBeGreaterThanOrEqual(2);
  });

  it("every frame resolves to a media asset with a src", () => {
    for (const id of HERO_ROTATION_IDS) {
      expect(getMediaById(id)?.src).toBeTruthy();
    }
  });

  it("every frame is an ACTIVE render (never Wikimedia / unactivated)", () => {
    for (const id of HERO_ROTATION_IDS) {
      expect(ACTIVE_RENDERS.has(id)).toBe(true);
    }
  });

  it("frames are unique", () => {
    expect(new Set(HERO_ROTATION_IDS).size).toBe(HERO_ROTATION_IDS.length);
  });
});
