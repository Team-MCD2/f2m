import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/vitrine/page-hero";
import { Section } from "@/components/vitrine/section";
import { VitrineImage } from "@/components/vitrine/vitrine-image";
import { F2M_SITE } from "@/lib/vitrine/site-config";
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

const FAQ = [
  { q: "Qu'est-ce que le titre DGESP ?", a: "Le RNCP 36654 niveau 5 certifie le dirigeant d'entreprise de sécurité privée." },
  { q: "Durée et rythme ?", a: "282 h sur 8 à 12 mois selon votre profil." },
  { q: "Financement ?", a: "CPF, OPCO, France Travail — voir la page Financements." },
  { q: "VAE possible ?", a: "Oui — consultez la page VAE DGESP." },
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

      <Section variant="light">
        <div className="content-grid sidebar">
          <article>
            <h2>Témoignage — Bastien</h2>
            <blockquote className="card" style={{ borderLeft: "4px solid var(--gold-500)", display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
              <VitrineImage
                src={VITRINE_IMAGES.avatars[1]}
                alt="Portrait de Bastien, dirigeant SSP"
                width={72}
                height={72}
                style={{ borderRadius: "50%", border: "3px solid var(--gold-500)", flexShrink: 0 }}
              />
              <div>
                <p>« Grâce à F2M, j&apos;ai structuré mon parcours DGESP tout en gérant mon activité. L&apos;e-learning Dokeos et les sessions à Toulouse étaient complémentaires. »</p>
                <p><strong>— Bastien, dirigeant SSP</strong></p>
              </div>
            </blockquote>
            <h2 style={{ marginTop: "2rem" }}>E-learning &amp; LMS</h2>
            <p>
              Accédez à vos modules 24h/24 sur{" "}
              <a href={F2M_SITE.lmsUrl} rel="noopener noreferrer" target="_blank">
                lmsdokeos
              </a>{" "}
              — compatible mobile, classes virtuelles intégrées.
            </p>
          </article>
          <aside className="sidebar-box">
            <p><Link className="btn btn-gold" href="/e-learning" style={{ width: "100%", display: "block", textAlign: "center" }}>Connexion LMS</Link></p>
            <p><Link className="btn btn-navy" href="/contact" style={{ width: "100%", marginTop: "0.5rem", display: "block", textAlign: "center" }}>Candidater</Link></p>
          </aside>
        </div>
      </Section>

      <Section variant="navy" id="faq" title="FAQ — Formation DGESP Toulouse">
        <div style={{ marginTop: "1.5rem" }}>
          {FAQ.map((item) => (
            <details key={item.q} className="accordion-item" style={{ marginBottom: "0.75rem" }}>
              <summary className="accordion-trigger">{item.q}</summary>
              <div className="accordion-panel">{item.a}</div>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
