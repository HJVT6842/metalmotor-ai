import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Modern formats for real raster photos (when added under /images/real/**).
    formats: ["image/avif", "image/webp"],
    // Next 16 restricts image quality to `[75]` by default; our media primitives
    // request 82, so allow it (otherwise the optimizer 400s and photos would
    // fall back to the placeholder). See next v16 upgrade notes → qualities.
    qualities: [75, 82],
    // Allow next/image to serve our own local SVG reference assets, locked down
    // with a strict CSP so an SVG can never execute scripts.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox; style-src 'unsafe-inline';",
  },
};

export default nextConfig;
