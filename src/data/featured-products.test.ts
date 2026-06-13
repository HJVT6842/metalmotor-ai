import { describe, expect, it } from "vitest";

import { FEATURED_PRODUCTS } from "@/data/featured-products";
import { getMediaById } from "@/data/media";
import { ACTIVE_RENDERS } from "@/data/render-manifest";

describe("featured products media wiring", () => {
  it("every main mediaId resolves in the catalogue", () => {
    for (const product of FEATURED_PRODUCTS) {
      expect(getMediaById(product.mediaId)).toBeDefined();
    }
  });

  it("every hover image is an ACTIVE render (never Wikimedia / unactivated)", () => {
    for (const product of FEATURED_PRODUCTS) {
      if (!product.hoverMediaId) continue;
      expect(getMediaById(product.hoverMediaId)).toBeDefined();
      expect(ACTIVE_RENDERS.has(product.hoverMediaId)).toBe(true);
    }
  });

  it("hover image always differs from the main image", () => {
    for (const product of FEATURED_PRODUCTS) {
      if (!product.hoverMediaId) continue;
      expect(product.hoverMediaId).not.toBe(product.mediaId);
    }
  });
});
