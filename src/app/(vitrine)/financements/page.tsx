import type { Metadata } from "next";
import Link from "next/link";
import { CpfSimulator } from "@/components/vitrine/cpf-simulator";
import { FinancementCards } from "@/components/vitrine/financement-cards";
import { PageHero } from "@/components/vitrine/page-hero";
import { Section } from "@/components/vitrine/section";
import { VITRINE_IMAGES } from "@/lib/vitrine/images";

export const metadata: Metadata = {
  title: "Financer sa formation DGESP — CPF, France Travail, OPCO",
  description:
    "Financez votre formation DGESP : CPF, France Travail, OPCO, entreprise ou fonds propres. Simulateur CPF et aide au dossier F2M Toulouse.",
};

export default function FinancementsPage() {
  return (
    <>
      <PageHero
        title="Financer votre formation DGESP"
        lead="CPF, France Travail, OPCO, plan de développement entreprise ou fonds propres — nous vous aidons à monter votre dossier."
        image={VITRINE_IMAGES.finance}
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Financements" },
        ]}
      />

      <Section variant="light" className="reveal-on-scroll">
        <FinancementCards />
      </Section>

      <Section variant="navy" title="Simulateur CPF (indicatif)" className="reveal-on-scroll">
        <div className="reveal-on-scroll" data-reveal>
          <CpfSimulator />
        </div>
      </Section>

      <Section variant="light" title="Vos démarches en 4 étapes" className="reveal-on-scroll">
        <div className="stepper reveal-on-scroll" data-reveal style={{ marginTop: "1.5rem" }}>
          <div className="stepper-item">
            <span className="step-num">1</span>
            <h3>Entretien</h3>
            <p>Validation du projet et du dispositif adapté.</p>
          </div>
          <div className="stepper-item">
            <span className="step-num">2</span>
            <h3>Devis &amp; convention</h3>
            <p>Documents Qualiopi et calendrier prévisionnel.</p>
          </div>
          <div className="stepper-item">
            <span className="step-num">3</span>
            <h3>Dépôt dossier</h3>
            <p>Accompagnement CPF / OPCO / France Travail.</p>
          </div>
          <div className="stepper-item">
            <span className="step-num">4</span>
            <h3>Démarrage</h3>
            <p>Accès LMS et planning de formation.</p>
          </div>
        </div>
        <p className="reveal-on-scroll" data-reveal style={{ marginTop: "2rem", textAlign: "center" }}>
          <Link className="btn btn-gold btn-primary-glow" href="/contact">
            Aide au montage de dossier
          </Link>
          <Link className="btn btn-navy" href="/formation-dgesp" style={{ marginLeft: "0.5rem" }}>
            Formation DGESP
          </Link>
        </p>
      </Section>
    </>
  );
}
