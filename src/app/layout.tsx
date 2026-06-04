import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { SITE } from "@/data/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const KEYWORDS = [
  "corte laser cnc chile",
  "corte laser santiago",
  "celosias metalicas",
  "paneles decorativos metalicos",
  "fabricacion metalica",
  "corte laser fibra",
  "soldadura mig tig",
  "servicios cnc chile",
  "plegado cnc",
  "diseño cad",
  "ingeniería inversa",
  "portones y rejas metálicas",
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: KEYWORDS,
  applicationName: SITE.name,
  authors: [{ name: SITE.legalName }],
  creator: SITE.legalName,
  publisher: SITE.legalName,
  category: "Manufacturing",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

/** JSON-LD: LocalBusiness + manufacturing Organization for local SEO / GEO / AEO. */
function StructuredData() {
  const offers = [
    "Corte Láser CNC de Fibra",
    "Fabricación Metálica",
    "Paneles Metálicos Decorativos",
    "Celosías Metálicas",
    "Portones y Rejas",
    "Soldadura MIG",
    "Soldadura TIG",
    "Plegado CNC",
    "Piezas Metálicas a Medida",
    "Manufactura Industrial",
    "Diseño CAD",
    "Ingeniería Inversa",
  ];

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#organization`,
        name: SITE.legalName,
        alternateName: SITE.name,
        url: SITE.url,
        description: SITE.description,
        email: SITE.email,
        knowsAbout: KEYWORDS,
        areaServed: { "@type": "Country", name: "Chile" },
      },
      {
        "@type": "LocalBusiness",
        "@id": `${SITE.url}/#localbusiness`,
        name: SITE.legalName,
        image: `${SITE.url}/icon.svg`,
        url: SITE.url,
        email: SITE.email,
        priceRange: "$$",
        parentOrganization: { "@id": `${SITE.url}/#organization` },
        address: {
          "@type": "PostalAddress",
          addressLocality: SITE.address.city,
          addressRegion: SITE.address.region,
          addressCountry: "CL",
        },
        areaServed: { "@type": "Country", name: "Chile" },
        openingHours: "Mo-Fr 09:00-18:00",
        makesOffer: offers.map((name) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-CL"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-steel-950">
        <StructuredData />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
