import { ContactSection } from "@/components/sections/ContactSection";
import { Faq } from "@/components/sections/Faq";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { Hero } from "@/components/sections/Hero";
import { Portfolio } from "@/components/sections/Portfolio";
import { Process } from "@/components/sections/Process";
import { Products } from "@/components/sections/Products";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { Trust } from "@/components/sections/Trust";
import { WhatWeMake } from "@/components/sections/WhatWeMake";
import { WhatsAppSection } from "@/components/sections/WhatsAppSection";
import { WhyUs } from "@/components/sections/WhyUs";
import { Workshop } from "@/components/sections/Workshop";

/** Landing page: composed from independent, self-contained sections. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <Trust />
      <Services />
      <WhatWeMake />
      <Portfolio />
      <Products />
      <WhyUs />
      <Process />
      <Workshop />
      <Testimonials />
      <Faq />
      <WhatsAppSection />
      <ContactSection />
    </>
  );
}
