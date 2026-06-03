import type { MetadataRoute } from "next";

import { SITE } from "@/data/site";

/** Minimal sitemap for the single-page MVP. Extend as routes are added. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.url,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
