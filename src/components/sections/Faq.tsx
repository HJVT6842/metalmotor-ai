import { Section, SectionHeading } from "@/components/ui/Section";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { FAQS } from "@/data/faq";

/** FAQPage JSON-LD — boosts SEO/AEO eligibility for FAQ rich results. */
function FaqJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Preguntas frecuentes — handles objections right before the final CTA. */
export function Faq() {
  return (
    <Section id="faq" className="bg-steel-950">
      <FaqJsonLd />
      <SectionHeading
        eyebrow="Preguntas frecuentes"
        title={
          <>
            Resolvemos tus <span className="text-gradient-brand">dudas</span>
          </>
        }
        description="Y si te queda alguna, escríbenos por WhatsApp: respondemos rápido."
      />
      <FaqAccordion />
    </Section>
  );
}
