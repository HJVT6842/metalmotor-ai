import { describe, expect, it } from "vitest";

import {
  ALL_MEDIA,
  mediaBadgeLabel,
  SHOWCASE_MEDIA,
} from "@/data/media";

describe("mediaBadgeLabel (honesty rule)", () => {
  it("labels reference assets 'Imagen referencial'", () => {
    expect(mediaBadgeLabel("reference")).toBe("Imagen referencial");
  });

  it("labels real assets 'Trabajo realizado'", () => {
    expect(mediaBadgeLabel("real")).toBe("Trabajo realizado");
  });
});

describe("media catalogue integrity", () => {
  it("never labels a reference asset as completed work", () => {
    for (const asset of ALL_MEDIA) {
      if (asset.status === "reference") {
        expect(mediaBadgeLabel(asset.status)).not.toBe("Trabajo realizado");
      }
    }
  });

  it("gives every asset a license note and a replacement path", () => {
    for (const asset of ALL_MEDIA) {
      expect(asset.license.length).toBeGreaterThan(0);
      expect(asset.replacementPath.startsWith("/images/real/")).toBe(true);
    }
  });

  it("showcase assets are all reference for now", () => {
    expect(SHOWCASE_MEDIA.every((m) => m.status === "reference")).toBe(true);
  });
});
