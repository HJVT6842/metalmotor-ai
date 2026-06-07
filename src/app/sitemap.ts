import type { MetadataRoute } from "next";

import { SERVICE_PAGES } from "@/data/service-pages";
import { SITE } from "@/data/site";

/** Sitemap: home + dedicated SEO service pages. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.url,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...SERVICE_PAGES.map((page) => ({
      url: `${SITE.url}/${page.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
