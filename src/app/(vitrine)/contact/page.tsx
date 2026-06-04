import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/vitrine/contact-form";
import { MapEmbed } from "@/components/vitrine/map-embed";
import { PageHero } from "@/components/vitrine/page-hero";
import { Section } from "@/components/vitrine/section";
import { F2M_SITE } from "@/lib/vitrine/site-config";
import { VITRINE_IMAGES } from "@/lib/vitrine/images";

export const metadata: Metadata = {
  title: "Contact F2M Consulting — Centre de formation Toulouse",
  description:
    "Contactez F2M Consulting à Toulouse — formulaire, téléphone 06 47 27 55 75, horaires, accès bus L4, carte.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contactez F2M Consulting"
        lead="Premier échange par téléphone recommandé — puis complétez le formulaire pour votre projet DGESP ou VAE."
        image={VITRINE_IMAGES.contact}
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Contact" },
        ]}
      >
        <div className="contact-cta-bar">
          <a className="btn btn-gold btn-primary-glow" href={`tel:${F2M_SITE.phoneTel}`}>
            📞 Appeler le {F2M_SITE.phone}
          </a>
          <a className="btn btn-outline" href={`mailto:${F2M_SITE.email}`}>
            Écrire un email
          </a>
        </div>
      </PageHero>

      <Section variant="light">
        <div className="content-grid sidebar">
          <ContactForm />
          <aside className="sidebar-box">
            <h3>Coordonnées</h3>
            <address style={{ fontStyle: "normal", lineHeight: 1.8 }}>
              {F2M_SITE.address.full}
              <br />
              <a href={`tel:${F2M_SITE.phoneTel}`}>{F2M_SITE.phone}</a>
              <br />
              <a href={`mailto:${F2M_SITE.email}`}>{F2M_SITE.email}</a>
            </address>
            <h3>Horaires</h3>
            <p>
              Lun–Ven : 9h–18h
              <br />
              <em>Sur rendez-vous le samedi</em>
            </p>
            <h3>Transports</h3>
            <p>
              Bus <strong>ligne 4</strong> — arrêt à proximité
            </p>
            <MapEmbed />
            <p style={{ marginTop: "1rem" }}>
              <Link className="btn btn-gold" href="/formation-dgesp" style={{ width: "100%", display: "block", textAlign: "center" }}>
                Formation DGESP
              </Link>
            </p>
          </aside>
        </div>
      </Section>
    </>
  );
}
