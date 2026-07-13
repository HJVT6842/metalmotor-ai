import type { Metadata } from "next";

import { CategoryBlocks } from "@/components/productos/CategoryBlocks";
import { FeaturedProductsShowcase } from "@/components/productos/FeaturedProductsShowcase";
import { MadeByMetalMotor } from "@/components/productos/MadeByMetalMotor";
import { ProductsHero } from "@/components/productos/ProductsHero";

export const metadata: Metadata = {
  title: "Productos | Diseñados y fabricados por MetalMotor",
  description:
    "Productos en acero diseñados y fabricados por MetalMotor: parrillas, fogones, planchas, accesorios y piezas de diseño para el hogar, quinchos y exteriores.",
  alternates: { canonical: "/productos" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "/productos",
    siteName: "Metal Motor",
    title: "Productos | Diseñados y fabricados por MetalMotor",
    description:
      "Diseño en acero para el hogar, quinchos y exteriores. Fabricación nacional.",
  },
};

/**
 * /productos — brand experience for the new retail line.
 * hero → visual categories → featured products → fabrication backing.
 */
export default function ProductosPage() {
  return (
    <>
      <ProductsHero />
      <CategoryBlocks />
      <FeaturedProductsShowcase />
      <MadeByMetalMotor />
    </>
  );
}
