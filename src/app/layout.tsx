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
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "corte láser CNC",
    "fabricación metálica",
    "paneles decorativos",
    "celosías",
    "plegado CNC",
    "soldadura MIG TIG",
    "diseño CAD",
    "Santiago",
    "Chile",
  ],
  applicationName: SITE.name,
  authors: [{ name: SITE.legalName }],
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
  },
};

/** JSON-LD structured data for local SEO / GEO / AEO. */
function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE.legalName,
    description: SITE.description,
    url: SITE.url,
    email: SITE.email,
    areaServed: SITE.address.country,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      addressCountry: "CL",
    },
    makesOffer: [
      "Corte láser CNC de fibra",
      "Paneles decorativos",
      "Celosías",
      "Plegado CNC",
      "Soldadura MIG/TIG",
      "Diseño CAD",
    ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
  };
  return (
    <script
      type="application/ld+json"
      // JSON-LD must be a raw script payload; content is fully static/trusted.
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
      <body className="flex min-h-full flex-col bg-white">
        <StructuredData />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
