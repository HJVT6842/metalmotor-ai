import { Capacidad } from "@/components/sections/Capacidad";
import { ContactSection } from "@/components/sections/ContactSection";
import { Faq } from "@/components/sections/Faq";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { Hero } from "@/components/sections/Hero";
import { Portfolio } from "@/components/sections/Portfolio";
import { Process } from "@/components/sections/Process";
import { Testimonials } from "@/components/sections/Testimonials";
import { Trust } from "@/components/sections/Trust";
import { WhatWeCanMake } from "@/components/sections/WhatWeCanMake";
import { WhatsAppSection } from "@/components/sections/WhatsAppSection";
import { WhyUs } from "@/components/sections/WhyUs";
import { Workshop } from "@/components/sections/Workshop";

/**
 * Landing page — conversion funnel:
 * hero → featured products → social proof → what we make → capacity →
 * gallery → process → workshop → testimonials → FAQ → trust → WhatsApp → form.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <Trust />
      <WhatWeCanMake />
      <Capacidad />
      <Portfolio />
      <Process />
      <Workshop />
      <Testimonials />
      <Faq />
      <WhyUs />
      <WhatsAppSection />
      <ContactSection />
    </>
  );
}
