import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/productos/Breadcrumbs";
import { CategoryHero } from "@/components/productos/CategoryHero";
import { ProductGrid } from "@/components/productos/ProductGrid";
import { Section } from "@/components/ui/Section";
import {
  getAllCategories,
  getCategoryBySlug,
  getProductsByCategory,
} from "@/data/home-products";

// Only known category slugs render; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCategories().map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string }>;
}): Promise<Metadata> {
  const { categoria } = await params;
  const category = getCategoryBySlug(categoria);
  if (!category) return {};
  const path = `/productos/${category.slug}`;
  const title = `${category.name} | Productos MetalMotor`;
  return {
    title,
    description: category.description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "es_CL",
      url: path,
      siteName: "Metal Motor",
      title,
      description: category.description,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  const category = getCategoryBySlug(categoria);
  if (!category) notFound();

  const products = getProductsByCategory(category.slug);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Productos", href: "/productos" },
          { label: category.name },
        ]}
      />
      <CategoryHero category={category} count={products.length} />
      <Section className="bg-steel-950">
        <ProductGrid products={products} />
      </Section>
    </>
  );
}
