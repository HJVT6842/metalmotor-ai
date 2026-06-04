import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Modern formats for real raster photos (when added under /images/real/**).
    formats: ["image/avif", "image/webp"],
    // Allow next/image to serve our own local SVG reference assets, locked down
    // with a strict CSP so an SVG can never execute scripts.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox; style-src 'unsafe-inline';",
  },
};

export default nextConfig;
