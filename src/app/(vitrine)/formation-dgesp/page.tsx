import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/vitrine/page-hero";
import { Section } from "@/components/vitrine/section";
import { VitrineImage } from "@/components/vitrine/vitrine-image";
import { F2M_SITE } from "@/lib/vitrine/site-config";
import { FaqAccordion } from "@/components/vitrine/faq-accordion";
import { VITRINE_IMAGES } from "@/lib/vitrine/images";

export const metadata: Metadata = {
  title: "Formation Dirigeant Entreprise Sécurité Privée DGESP | Toulouse",
  description:
    "Formation DGESP RNCP 36654 niveau 5 à Toulouse — 282h, e-learning Dokeos, programme PDF, FAQ. Organisme Qualiopi F2M Consulting.",
};

const BLOCS = [
  { title: "Bloc 1 — Piloter l'entreprise SSP", text: "Stratégie, gestion financière, ressources humaines et conformité réglementaire." },
  { title: "Bloc 2 — Organiser les prestations", text: "Planification opérationnelle, qualité de service et relation client." },
  { title: "Bloc 3 — Encadrer les équipes", text: "Management, déontologie, prévention des risques professionnels." },
  { title: "Bloc 4 — Certification & jurys", text: "Préparation aux épreuves, dossier professionnel et soutenance." },
] as const;

export default function FormationDgespPage() {
  return (
    <>
      <PageHero
        title="Formation DGESP — RNCP 36654 Niveau 5"
        lead="Dirigeant d'Entreprise de Sécurité Privée · 282 heures · Présentiel Toulouse + e-learning LMS Dokeos."
        image={VITRINE_IMAGES.formation}
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Formation DGESP" },
        ]}
      >
        <Link className="btn btn-gold" href="/contact">
          Demander le programme
        </Link>
      </PageHero>

      <Section variant="light">
        <div className="media-band">
          <div className="media-band-img-wrap">
            <VitrineImage
              src={VITRINE_IMAGES.security}
              alt="Formation professionnelle en management et sécurité privée"
              width={800}
              height={600}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
          <div>
            <h2>Les 4 blocs de compétences</h2>
            <div className="accordion" style={{ marginTop: "1.5rem" }}>
              {BLOCS.map((bloc, i) => (
                <details key={bloc.title} className="accordion-item" open={i === 0}>
                  <summary className="accordion-trigger">{bloc.title}</summary>
                  <div className="accordion-panel">{bloc.text}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section variant="navy" title="Timeline — 282 heures">
        <div className="timeline" style={{ marginTop: "2rem" }}>
          <div className="timeline-item"><h3>Phase 1 — Positionnement (20 h)</h3><p>Entretien, analyse du parcours et plan de formation individualisé.</p></div>
          <div className="timeline-item"><h3>Phase 2 — Cœur de formation (200 h)</h3><p>Modules présentiel + classes virtuelles + ressources LMS.</p></div>
          <div className="timeline-item"><h3>Phase 3 — Professionnalisation (42 h)</h3><p>Mises en situation, études de cas sectorielles.</p></div>
          <div className="timeline-item"><h3>Phase 4 — Certification (20 h)</h3><p>Préparation jury, remise à niveau et suivi post-titre.</p></div>
        </div>
      </Section>

      <Section variant="light" title="Parcours &amp; plateforme">
        <div className="dgesp-dual-grid">
          <article className="card dgesp-testimonial-card">
            <h3>Témoignage — Bastien</h3>
            <blockquote className="dgesp-testimonial-quote">
              <VitrineImage
                src={VITRINE_IMAGES.avatars[1]}
                alt="Portrait de Bastien, dirigeant SSP"
                width={80}
                height={80}
                className="dgesp-testimonial-avatar"
              />
              <div>
                <p>
                  « Grâce à F2M, j&apos;ai structuré mon parcours DGESP tout en gérant mon
                  activité. L&apos;e-learning Dokeos et les sessions à Toulouse étaient
                  complémentaires. »
                </p>
                <p className="dgesp-testimonial-author">— Bastien, dirigeant SSP</p>
              </div>
            </blockquote>
            <Link className="btn btn-navy" href="/deposer-dossier">
              Déposer un dossier
            </Link>
          </article>

          <article className="card card--media dgesp-elearning-card">
            <div className="dgesp-elearning-media">
              <VitrineImage
                src={VITRINE_IMAGES.elearning}
                alt="Plateforme e-learning Dokeos — formation DGESP"
                width={600}
                height={338}
                className="card-media"
              />
            </div>
            <div className="card-body">
              <h3>E-learning &amp; LMS Dokeos</h3>
              <p>
                Modules 24h/24, classes virtuelles, replays et suivi pédagogique — compatible
                mobile et tablette.
              </p>
              <div className="dgesp-elearning-actions">
                <a
                  className="btn btn-gold"
                  href={F2M_SITE.lmsUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Connexion LMS
                </a>
                <Link className="btn btn-navy" href="/e-learning">
                  En savoir plus
                </Link>
                <Link className="btn btn-outline-dark" href="/connexion">
                  Espace candidat
                </Link>
              </div>
            </div>
          </article>
        </div>
      </Section>

      <Section variant="navy" id="faq" title="FAQ — Formation DGESP Toulouse">
        <FaqAccordion />
      </Section>
    </>
  );
}
