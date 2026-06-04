import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/vitrine/page-hero";
import { Section } from "@/components/vitrine/section";
import { VitrineImage } from "@/components/vitrine/vitrine-image";
import { VITRINE_IMAGES } from "@/lib/vitrine/images";

export const metadata: Metadata = {
  title: "VAE Dirigeant Entreprise Sécurité Privée DGESP | Toulouse",
  description:
    "VAE DGESP à Toulouse — étapes, public éligible, guide PDF et accompagnement conseiller F2M Consulting.",
};

export default function VaeDgespPage() {
  return (
    <>
      <PageHero
        title="VAE — Dirigeant Entreprise Sécurité Privée"
        lead="Valorisez votre expérience professionnelle pour obtenir le titre RNCP 36654 sans repasser par une formation complète."
        image={VITRINE_IMAGES.vae}
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "VAE DGESP" },
        ]}
      >
        <Link className="btn btn-gold" href="/contact">
          Demander le guide VAE
        </Link>
      </PageHero>

      <Section variant="light" title="Les étapes de votre VAE">
        <div className="stepper" style={{ marginTop: "2rem" }}>
          <div className="stepper-item"><span className="step-num">1</span><h3>Recevabilité</h3><p>Entretien et analyse de votre parcours (1 an minimum d&apos;activité dirigeante).</p></div>
          <div className="stepper-item"><span className="step-num">2</span><h3>Livret 1</h3><p>Dossier de faisabilité déposé auprès du certificateur.</p></div>
          <div className="stepper-item"><span className="step-num">3</span><h3>Livret 2</h3><p>Description détaillée des activités et preuves.</p></div>
          <div className="stepper-item"><span className="step-num">4</span><h3>Oral de validation</h3><p>Mise en situation devant le jury — accompagnement F2M.</p></div>
          <div className="stepper-item"><span className="step-num">5</span><h3>Certification</h3><p>Délivrance du titre et démarches CNAPS associées.</p></div>
        </div>
      </Section>

      <Section variant="navy">
        <div className="media-band" style={{ marginBottom: "2.5rem" }}>
          <div className="prose">
            <h2>Valoriser votre expérience terrain</h2>
            <p>
              La VAE DGESP permet de faire reconnaître vos compétences de dirigeant sans reprendre
              l&apos;intégralité du parcours formation — accompagnement sur mesure à Toulouse.
            </p>
          </div>
          <div className="media-band-img-wrap">
            <VitrineImage
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80"
              alt="Accompagnement professionnel pour la validation des acquis"
              width={800}
              height={600}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        </div>
        <div className="content-grid sidebar">
          <article className="prose">
            <h2>Public éligible</h2>
            <ul>
              <li>Dirigeants ou responsables d&apos;entreprise SSP avec expérience significative</li>
              <li>Repreneurs souhaitant officialiser leurs compétences</li>
              <li>Professionnels en reconversion vers le management SSP</li>
            </ul>
            <p>Durée moyenne d&apos;accompagnement : 6 à 18 mois selon profil.</p>
          </article>
          <aside className="sidebar-box">
            <h3>Parler à un conseiller</h3>
            <p>Étude gratuite de votre éligibilité VAE à Toulouse.</p>
            <Link className="btn btn-gold" href="/contact" style={{ width: "100%", display: "block", textAlign: "center" }}>
              Prendre rendez-vous
            </Link>
            <p style={{ marginTop: "1rem" }}>
              <Link href="/formation-dgesp">Formation complète DGESP</Link>
            </p>
          </aside>
        </div>
      </Section>
    </>
  );
}
