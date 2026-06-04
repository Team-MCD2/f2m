import { CertificationsBlock } from "@/components/vitrine/certifications-block";
import { FaqAccordion } from "@/components/vitrine/faq-accordion";
import { HomeHero } from "@/components/vitrine/home-hero";
import { HomeCentreSection } from "@/components/vitrine/home/home-centre-section";
import { HomeContactBand } from "@/components/vitrine/home/home-contact-band";
import { HomeFeaturedFormations } from "@/components/vitrine/home/home-featured-formations";
import { HomeGallery } from "@/components/vitrine/home/home-gallery";
import { HomeValues } from "@/components/vitrine/home/home-values";
import { Section } from "@/components/vitrine/section";
import { StatsCounters } from "@/components/vitrine/home/stats-counters";
import { TestimonialsSection } from "@/components/vitrine/testimonials-section";

export default function HomePage() {
  return (
    <>
      <HomeHero />

      <HomeFeaturedFormations />

      <HomeCentreSection />

      <HomeGallery />

      <HomeValues />

      <Section
        id="stats"
        variant="navy"
        title="Résultats 2024"
        subtitle="Des indicateurs qui témoignent de la qualité de notre accompagnement à Toulouse."
        className="reveal-on-scroll"
      >
        <StatsCounters />
      </Section>

      <Section
        id="testimonials"
        variant="light"
        title="Ils nous font confiance"
        subtitle="Témoignages de dirigeants et stagiaires formés à Toulouse."
      >
        <TestimonialsSection />
      </Section>

      <CertificationsBlock />

      <Section variant="navy" id="faq" title="FAQ — Formation DGESP Toulouse">
        <FaqAccordion />
      </Section>

      <HomeContactBand />
    </>
  );
}
