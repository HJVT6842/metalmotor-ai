import { Catalog } from "@/components/sections/Catalog";
import { ContactSection } from "@/components/sections/ContactSection";
import { Hero } from "@/components/sections/Hero";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";

/** Landing page: composed from independent, self-contained sections. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Catalog />
      <Process />
      <ContactSection />
    </>
  );
}
