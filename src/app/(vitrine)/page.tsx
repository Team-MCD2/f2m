import { CertificationsBlock } from "@/components/vitrine/certifications-block";
import { FaqAccordion } from "@/components/vitrine/faq-accordion";
import { HomeHero } from "@/components/vitrine/home-hero";
import { HomeCentreSection } from "@/components/vitrine/home/home-centre-section";
import { HomeContactBand } from "@/components/vitrine/home/home-contact-band";
import { HomeFeaturedFormations } from "@/components/vitrine/home/home-featured-formations";
import { HomeGallery } from "@/components/vitrine/home/home-gallery";
import { HomeValues } from "@/components/vitrine/home/home-values";
import { Section } from "@/components/vitrine/section";
import { TestimonialsCarousel } from "@/components/vitrine/testimonials-carousel";

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
      >
        <div className="stats-grid">
          <div className="stat-card">
            <strong>100%</strong>
            <span>Taux de réussite examen</span>
          </div>
          <div className="stat-card">
            <strong>95%</strong>
            <span>Stagiaires très satisfaits</span>
          </div>
          <div className="stat-card">
            <strong>57%</strong>
            <span>Retour à l&apos;emploi à 6 mois</span>
          </div>
          <div className="stat-card">
            <strong>12</strong>
            <span>Années d&apos;expérience depuis 2012</span>
          </div>
        </div>
      </Section>

      <Section
        id="testimonials"
        variant="light"
        title="Ils nous font confiance"
        subtitle="Témoignages de dirigeants et stagiaires formés à Toulouse."
      >
        <TestimonialsCarousel />
      </Section>

      <CertificationsBlock />

      <Section variant="navy" id="faq" title="FAQ — Formation DGESP Toulouse">
        <FaqAccordion />
      </Section>

      <HomeContactBand />
    </>
  );
}
