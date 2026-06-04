import type { Metadata } from "next";
import Link from "next/link";
import { MapEmbed } from "@/components/vitrine/map-embed";
import { PageHero } from "@/components/vitrine/page-hero";
import { Section } from "@/components/vitrine/section";
import { VitrineImage } from "@/components/vitrine/vitrine-image";
import { F2M_SITE } from "@/lib/vitrine/site-config";
import { VITRINE_IMAGES } from "@/lib/vitrine/images";

export const metadata: Metadata = {
  title: "Notre Centre de Formation à Toulouse",
  description:
    "Découvrez F2M Consulting à Toulouse : équipe, intervenants, valeurs depuis 2012, accessibilité PMR et plan d'accès ligne 4.",
};

const TEAM = [
  {
    name: "Laurence Gilabert",
    role: "Gérante · Direction pédagogique et administrative.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    alt: "Laurence Gilabert, direction pédagogique F2M",
  },
  {
    name: "Formateurs experts",
    role: "Intervenants CNAPS, droit, gestion d'entreprise et QHSE.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
    alt: "Équipe de formateurs experts en sécurité privée",
  },
  {
    name: "Conseillers VAE",
    role: "Accompagnement personnalisé du dossier à la soutenance.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
    alt: "Conseillers VAE accompagnant un candidat",
  },
] as const;

const GALLERY = [
  { src: VITRINE_IMAGES.gallery.cours, alt: "Salle de cours équipée pour la formation DGESP", label: "Salles de cours" },
  { src: VITRINE_IMAGES.gallery.coworking, alt: "Espace de travail collaboratif au centre F2M", label: "Espace coworking" },
  { src: VITRINE_IMAGES.gallery.accueil, alt: "Accueil des stagiaires F2M Consulting Toulouse", label: "Accueil stagiaires" },
  { src: VITRINE_IMAGES.gallery.visio, alt: "Salle de visioconférence pour classes virtuelles", label: "Visioconférence" },
] as const;

export default function NotreCentrePage() {
  return (
    <>
      <PageHero
        title="Notre centre de formation à Toulouse"
        lead="Depuis 2012, F2M Consulting forme les dirigeants de la sécurité privée en Occitanie — équipe pédagogique, locaux accessibles et valeurs d'exigence."
        image={VITRINE_IMAGES.centre}
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Notre Centre" },
        ]}
      />

      <Section variant="light" title="Équipe & intervenants" subtitle="Des professionnels du secteur SSP et du management au service de votre réussite." className="reveal-on-scroll">
        <div className="cards-grid reveal-on-scroll reveal-stagger">
          {TEAM.map((member) => (
            <article key={member.name} className="card card--media">
              <VitrineImage src={member.image} alt={member.alt} width={600} height={338} className="card-media" />
              <div className="card-body">
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section variant="navy" title="Galerie du centre" className="reveal-on-scroll">
        <div className="gallery-grid reveal-on-scroll reveal-stagger" style={{ marginTop: "1.5rem" }}>
          {GALLERY.map((item) => (
            <figure key={item.label} className="gallery-item">
              <VitrineImage src={item.src} alt={item.alt} width={600} height={450} className="gallery-photo" />
              <figcaption>{item.label}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section variant="light" className="reveal-on-scroll">
        <div className="content-grid sidebar reveal-on-scroll" data-reveal>
          <article className="prose">
            <h2>Accessibilité PMR</h2>
            <p>
              Notre centre est situé au <strong>1er étage avec ascenseur</strong>. Places de
              stationnement adaptées sur demande. Contactez-nous pour préparer votre venue en
              toute sérénité.
            </p>
            <h2>Valeurs &amp; histoire depuis 2012</h2>
            <p>
              F2M Consulting est né de la volonté d&apos;offrir une formation DGESP exigeante,
              ancrée dans le terrain et conforme aux exigences Qualiopi et France Compétences.
            </p>
            <ul>
              <li><strong>Exigence</strong> — Préparation rigoureuse aux épreuves</li>
              <li><strong>Proximité</strong> — Suivi individualisé à Toulouse et à distance</li>
              <li><strong>Éthique</strong> — Respect de la déontologie SSP</li>
            </ul>
            <p>
              <Link className="btn btn-gold" href="/formation-dgesp">Formation DGESP</Link>{" "}
              <Link className="btn btn-navy" href="/contact">Contact</Link>
            </p>
          </article>
          <aside className="sidebar-box">
            <h3>Plan d&apos;accès</h3>
            <p>{F2M_SITE.address.full}</p>
            <p><strong>Bus :</strong> Ligne 4 — arrêt proche</p>
            <p><a href={`tel:${F2M_SITE.phoneTel}`}>{F2M_SITE.phone}</a></p>
            <MapEmbed />
          </aside>
        </div>
      </Section>
    </>
  );
}
