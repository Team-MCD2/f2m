import Link from "next/link";
import { CertificationsBlock } from "@/components/vitrine/certifications-block";
import { FaqAccordion } from "@/components/vitrine/faq-accordion";
import { HomeHero } from "@/components/vitrine/home-hero";
import { MapEmbed } from "@/components/vitrine/map-embed";
import { PortalCtaBand } from "@/components/vitrine/portal-cta-band";
import { Section } from "@/components/vitrine/section";
import { TestimonialsCarousel } from "@/components/vitrine/testimonials-carousel";
import { VitrineImage } from "@/components/vitrine/vitrine-image";
import { F2M_SITE } from "@/lib/vitrine/site-config";
import { TOULOUSE_IMAGE, VITRINE_IMAGES } from "@/lib/vitrine/images";

export default function HomePage() {
  return (
    <>
      <HomeHero />

      <PortalCtaBand />

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

      <Section id="intro" variant="light">
        <div className="media-band">
          <div>
            <h2 id="intro-title">Centre de formation à Toulouse</h2>
            <p>
              F2M Consulting accueille dirigeants et professionnels de la sécurité privée
              dans des locaux modernes, à deux pas du périphérique sud — formation
              présentielle et distanciel complémentaires.
            </p>
            <p>
              <Link className="btn btn-gold" href="/notre-centre">
                Visiter notre centre
              </Link>
            </p>
          </div>
          <div className="media-band-img-wrap">
            <VitrineImage
              src={TOULOUSE_IMAGE}
              fallback={TOULOUSE_IMAGE}
              alt="Vue de Toulouse — Garonne et centre-ville, ville d'accueil F2M Consulting"
              width={800}
              height={600}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        </div>
      </Section>

      <CertificationsBlock />

      <Section
        id="testimonials"
        variant="light"
        title="Ils nous font confiance"
        subtitle="Témoignages de dirigeants et stagiaires formés à Toulouse."
      >
        <TestimonialsCarousel />
      </Section>

      <Section variant="navy" id="faq" title="FAQ — Formation DGESP Toulouse">
        <FaqAccordion />
      </Section>

      <Section id="map-home" variant="navy">
        <div className="content-grid sidebar">
          <div>
            <h2 id="map-home-title">Nous trouver à Toulouse</h2>
            <p>
              <strong>{F2M_SITE.address.full}</strong>
            </p>
            <p>
              Accès bus ligne 4 · Parking à proximité · Centre accessible PMR —{" "}
              <Link href="/notre-centre">Plan d&apos;accès détaillé</Link>
            </p>
            <p>
              <a href={`tel:${F2M_SITE.phoneTel}`}>{F2M_SITE.phone}</a> ·{" "}
              <a href={`mailto:${F2M_SITE.email}`}>{F2M_SITE.email}</a>
            </p>
            <MapEmbed />
          </div>
          <aside className="sidebar-box">
            <h3>Double appel à l&apos;action</h3>
            <p>Choisissez la prochaine étape adaptée à votre projet professionnel.</p>
            <Link className="btn btn-gold" href="/formation-dgesp" style={{ width: "100%", marginBottom: "0.75rem", display: "block", textAlign: "center" }}>
              Formation DGESP
            </Link>
            <Link className="btn btn-navy" href="/contact" style={{ width: "100%", display: "block", textAlign: "center" }}>
              Nous contacter
            </Link>
          </aside>
        </div>
      </Section>
    </>
  );
}
