import { describe, expect, it } from "vitest";

import { easeOutCubic } from "@/components/animations/Counter";

describe("easeOutCubic", () => {
  it("anchors at 0 and 1", () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
  });

  it("clamps out-of-range progress", () => {
    expect(easeOutCubic(-0.5)).toBe(0);
    expect(easeOutCubic(2)).toBe(1);
  });

  it("is ease-out (past the midpoint by t=0.5)", () => {
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5);
  });
});
