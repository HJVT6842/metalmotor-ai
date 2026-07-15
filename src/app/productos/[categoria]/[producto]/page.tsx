import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/productos/Breadcrumbs";
import { ProductActions } from "@/components/productos/ProductActions";
import { ProductBenefits } from "@/components/productos/ProductBenefits";
import { ProductGallery } from "@/components/productos/ProductGallery";
import { ProductSpecs } from "@/components/productos/ProductSpecs";
import { RelatedProducts } from "@/components/productos/RelatedProducts";
import { StockIndicator } from "@/components/productos/StockIndicator";
import { TrustSeals } from "@/components/productos/TrustSeals";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon, ClockIcon } from "@/components/ui/icons";
import {
  DELIVERY,
  formatPrice,
  getAllProducts,
  getCategoryBySlug,
  getProductBySlug,
  getRelatedProducts,
} from "@/data/home-products";
import { getInventory } from "@/lib/inventory";
import { resolveCommerce } from "@/lib/shopify/commerce";

// Only known category/product pairs render; anything else 404s.
export const dynamicParams = false;

// Refresh Shopify-sourced price/availability on an interval (ISR).
export const revalidate = 300;

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
  // Price comes from Shopify (commerce); stock comes through the source-agnostic
  // inventory provider. Both share one memoized fetch. Each falls back to local
  // data when Shopify is unconfigured or a fetch fails.
  const commerce = await resolveCommerce(product);
  const inventory = await getInventory(product);

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

      <Container className="pb-16 pt-4 sm:pb-20 sm:pt-2">
        <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <ProductGallery images={product.images} alt={product.name} />
          </div>

          <div className="flex flex-col lg:col-span-4 lg:pt-2">
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

            <div className="mt-10 flex flex-col items-start gap-3">
              <span className="text-3xl font-semibold text-white">
                {formatPrice(commerce.price)}
              </span>
              <StockIndicator
                stockStatus={inventory.status}
                stockQuantity={inventory.quantity}
                stockAvailable={inventory.available}
              />
            </div>

            <p className="mt-3 inline-flex items-center gap-2 text-sm text-steel-400">
              <ClockIcon className="h-4 w-4 text-brand-400" />
              Entrega estimada: {DELIVERY[product.deliveryTier].eta}
            </p>

            <div className="mt-8">
              <ProductActions
                product={product}
                soldOut={!inventory.available}
              />
            </div>

            <p className="mt-4 max-w-md text-xs leading-relaxed text-steel-500">
              Despacho a todo Chile. El costo se calcula automáticamente durante
              el checkout.
            </p>
          </div>
        </div>

        <div className="mt-16 sm:mt-20">
          <ProductBenefits product={product} />
        </div>
      </Container>

      <Container className="border-t border-white/10 py-16 sm:py-20">
        <div className="max-w-4xl">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Fabricado por MetalMotor
          </h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-steel-300 sm:text-xl">
            <p>
              Diseñado y fabricado en Chile mediante corte CNC, plegado de
              precisión y soldadura MIG/TIG. Construido en acero de alta calidad
              para durar años.
            </p>
            <p>
              Su diseño armable facilita el transporte, almacenamiento y montaje
              sin comprometer resistencia ni estabilidad.
            </p>
            <p>
              Cada producto es desarrollado y fabricado íntegramente por
              MetalMotor.
            </p>
          </div>
        </div>

        <TrustSeals className="mt-10 sm:mt-12" />

        <div className="mt-10 max-w-4xl sm:mt-12">
          <p className="text-base font-medium text-steel-200 sm:text-lg">
            Todo lo que ves se fabrica en nuestro propio taller, de principio a
            fin: cortamos, plegamos, soldamos y armamos cada pieza en Chile.
          </p>
          <a
            href="#"
            className="group mt-4 inline-flex items-center gap-2 text-base font-semibold text-brand-400 transition-colors hover:text-brand-300"
          >
            Conoce nuestro proceso
            <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </Container>

      <Container className="border-t border-white/10 py-16 sm:py-20">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Especificaciones
        </h2>
        <div className="mt-8">
          <ProductSpecs product={product} />
        </div>
      </Container>

      <RelatedProducts products={related} />
    </>
  );
}
