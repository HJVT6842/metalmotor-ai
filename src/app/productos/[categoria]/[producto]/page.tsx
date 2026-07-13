import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/productos/Breadcrumbs";
import { MadeByMetalMotor } from "@/components/productos/MadeByMetalMotor";
import { ProductActions } from "@/components/productos/ProductActions";
import { ProductBenefits } from "@/components/productos/ProductBenefits";
import { ProductGallery } from "@/components/productos/ProductGallery";
import { ProductSpecs } from "@/components/productos/ProductSpecs";
import { RelatedProducts } from "@/components/productos/RelatedProducts";
import { StockPill } from "@/components/productos/StockPill";
import { Container } from "@/components/ui/Container";
import { ClockIcon } from "@/components/ui/icons";
import {
  formatPrice,
  getAllProducts,
  getCategoryBySlug,
  getProductBySlug,
  getRelatedProducts,
} from "@/data/home-products";

// Only known category/product pairs render; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProducts().map((p) => ({
    categoria: p.categorySlug,
    producto: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string; producto: string }>;
}): Promise<Metadata> {
  const { categoria, producto } = await params;
  const product = getProductBySlug(categoria, producto);
  if (!product) return {};
  const path = `/productos/${categoria}/${producto}`;
  const title = `${product.name} | MetalMotor`;
  return {
    title,
    description: product.shortDescription,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "es_CL",
      url: path,
      siteName: "Metal Motor",
      title,
      description: product.shortDescription,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ categoria: string; producto: string }>;
}) {
  const { categoria, producto } = await params;
  const product = getProductBySlug(categoria, producto);
  if (!product) notFound();

  const category = getCategoryBySlug(categoria);
  const related = getRelatedProducts(product);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Productos", href: "/productos" },
          {
            label: category?.name ?? "Categoría",
            href: `/productos/${categoria}`,
          },
          { label: product.name },
        ]}
      />

      <Container className="pb-14 pt-2 sm:pb-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} alt={product.name} />

          <div className="flex flex-col lg:pt-4">
            {category ? (
              <p className="mb-5 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-brand-400">
                <span className="h-px w-6 bg-brand-500" aria-hidden />
                {category.name}
              </p>
            ) : null}

            <h1 className="text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-steel-300">
              {product.shortDescription}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
              <span className="text-3xl font-semibold text-white">
                {formatPrice(product.price)}
              </span>
              <StockPill status={product.stockStatus} />
            </div>

            <p className="mt-3 inline-flex items-center gap-2 text-sm text-steel-400">
              <ClockIcon className="h-4 w-4 text-brand-400" />
              Entrega estimada: {product.deliveryTime}
            </p>

            <div className="mt-8">
              <ProductActions product={product} />
            </div>

            <p className="mt-4 max-w-md text-xs leading-relaxed text-steel-500">
              Precio referencial. Confirmamos el valor final y el despacho por
              WhatsApp.
            </p>
          </div>
        </div>

        <div className="mt-12 sm:mt-16">
          <ProductBenefits product={product} />
        </div>
      </Container>

      <Container className="pb-20 sm:pb-28">
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Especificaciones
        </h2>
        <div className="mt-6">
          <ProductSpecs product={product} />
        </div>
      </Container>

      <MadeByMetalMotor />
      <RelatedProducts products={related} />
    </>
  );
}
