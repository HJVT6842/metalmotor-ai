import type { MetadataRoute } from "next";

import { getAllCategories, getAllProducts } from "@/data/home-products";
import { SERVICE_PAGES } from "@/data/service-pages";
import { SITE } from "@/data/site";

/**
 * Sitemap: home + service pages + the /productos retail line.
 *
 * The product entries are derived from the local catalogue accessors, so when
 * the catalogue moves to Shopify the sitemap follows automatically — no edit
 * here needed.
 */
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
    // Productos landing
    {
      url: `${SITE.url}/productos`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    // Category pages
    ...getAllCategories().map((category) => ({
      url: `${SITE.url}/productos/${category.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Individual product pages
    ...getAllProducts().map((product) => ({
      url: `${SITE.url}/productos/${product.categorySlug}/${product.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
