import { ContactSection } from "@/components/sections/ContactSection";
import { Hero } from "@/components/sections/Hero";
import { Portfolio } from "@/components/sections/Portfolio";
import { Process } from "@/components/sections/Process";
import { Products } from "@/components/sections/Products";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { Trust } from "@/components/sections/Trust";
import { WhatsAppSection } from "@/components/sections/WhatsAppSection";

/** Landing page: composed from independent, self-contained sections. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Trust />
      <Services />
      <Portfolio />
      <Products />
      <Process />
      <Testimonials />
      <WhatsAppSection />
      <ContactSection />
    </>
  );
}
