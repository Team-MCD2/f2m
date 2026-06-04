import Link from "next/link";
import { MapEmbed } from "@/components/vitrine/map-embed";
import { Section } from "@/components/vitrine/section";
import { F2M_SITE } from "@/lib/vitrine/site-config";

export function HomeContactBand() {
  return (
    <Section id="contact-accueil" variant="navy" className="section--align-left">
      <div className="content-grid sidebar home-contact-band">
        <div>
          <h2 id="contact-accueil-title">Nous trouver à Toulouse</h2>
          <p>
            <strong>{F2M_SITE.address.full}</strong>
          </p>
          <p>
            Accès bus ligne 4 · Parking à proximité · Centre accessible PMR —{" "}
            <Link href="/notre-centre">Plan d&apos;accès détaillé</Link>
          </p>
          <p>
            <a href={`tel:${F2M_SITE.phoneTel}`}>{F2M_SITE.phone}</a>
            {" · "}
            <a href={`mailto:${F2M_SITE.email}`}>{F2M_SITE.email}</a>
          </p>
          <MapEmbed />
        </div>
        <aside className="sidebar-box">
          <h3>Votre prochaine étape</h3>
          <p>Formation DGESP, VAE ou conseil personnalisé — nous vous orientons.</p>
          <Link
            className="btn btn-gold"
            href="/formation-dgesp"
            style={{ width: "100%", marginBottom: "0.75rem", display: "block", textAlign: "center" }}
          >
            Nos formations
          </Link>
          <Link
            className="btn btn-outline-light"
            href="/contact"
            style={{ width: "100%", display: "block", textAlign: "center" }}
          >
            Nous contacter
          </Link>
        </aside>
      </div>
    </Section>
  );
}
