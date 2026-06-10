import { describe, expect, it } from "vitest";

import { ALL_MEDIA } from "@/data/media";
import {
  ACTIVE_RENDERS,
  RENDER_LICENSE,
  RENDER_MANIFEST,
} from "@/data/render-manifest";

describe("render manifest (Industrial Premium)", () => {
  it("every render path is a .webp under /images/reference/", () => {
    for (const entry of Object.values(RENDER_MANIFEST)) {
      expect(entry.src.startsWith("/images/reference/")).toBe(true);
      expect(entry.src.endsWith(".webp")).toBe(true);
      expect(entry.alt.length).toBeGreaterThan(0);
    }
  });

  it("only references ids that exist in the media catalogue", () => {
    const ids = new Set(ALL_MEDIA.map((m) => m.id));
    for (const id of Object.keys(RENDER_MANIFEST)) {
      expect(ids.has(id)).toBe(true);
    }
  });

  it("every active render is present in the manifest", () => {
    for (const id of ACTIVE_RENDERS) {
      expect(RENDER_MANIFEST[id]).toBeDefined();
    }
  });

  it("activated renders stay 'reference' and never become completed work", () => {
    for (const id of ACTIVE_RENDERS) {
      const asset = ALL_MEDIA.find((m) => m.id === id);
      expect(asset?.status).toBe("reference");
      expect(asset?.license).toBe(RENDER_LICENSE);
      // Renders carry no third-party attribution → excluded from /creditos.
      expect(asset?.credit).toBeUndefined();
    }
  });
});
