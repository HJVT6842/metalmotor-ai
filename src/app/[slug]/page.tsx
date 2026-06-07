import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServicePageView } from "@/components/ServicePageView";
import { SERVICE_PAGES, getServicePage } from "@/data/service-pages";

// Only the known service slugs render; any other top-level path 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) return {};
  const path = `/${slug}`;
  return {
    title: { absolute: page.metaTitle },
    description: page.metaDescription,
    keywords: [...page.keywords],
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "es_CL",
      url: path,
      siteName: "Metal Motor",
      title: page.metaTitle,
      description: page.metaDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
    },
  };
}

export default async function ServiceRoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) notFound();
  return <ServicePageView page={page} />;
}
