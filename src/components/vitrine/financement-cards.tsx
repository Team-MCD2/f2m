import { VITRINE_IMAGES } from "@/lib/vitrine/images";
import { VitrineImage } from "./vitrine-image";

const DISPOSITIFS = [
  {
    title: "CPF",
    description:
      "Compte Personnel de Formation — utilisation de vos droits sur Mon Compte Formation.",
    image: VITRINE_IMAGES.financements.cpf,
    fallback: VITRINE_IMAGES.financements.cpfFallback,
    alt: "Financement formation via le CPF",
  },
  {
    title: "France Travail",
    description: "AIF, POEI selon votre situation de demandeur d'emploi.",
    image: VITRINE_IMAGES.financements.franceTravail,
    fallback: VITRINE_IMAGES.financements.franceTravailFallback,
    alt: "Financement via France Travail",
  },
  {
    title: "OPCO",
    description: "Prise en charge par l'opérateur de compétences de votre branche.",
    image: VITRINE_IMAGES.financements.opco,
    fallback: VITRINE_IMAGES.financements.opcoFallback,
    alt: "Financement OPCO entreprise",
  },
  {
    title: "Entreprise",
    description:
      "Plan de développement des compétences pour vos salariés dirigeants.",
    image: VITRINE_IMAGES.financements.entreprise,
    fallback: VITRINE_IMAGES.financements.entrepriseFallback,
    alt: "Plan de formation entreprise",
  },
  {
    title: "Fonds propres",
    description:
      "Facilités de paiement — contactez-nous pour un devis personnalisé.",
    image: VITRINE_IMAGES.financements.personnel,
    fallback: VITRINE_IMAGES.financements.personnelFallback,
    alt: "Financement personnel fonds propres",
  },
] as const;

export function FinancementCards() {
  return (
    <div className="cards-grid">
      {DISPOSITIFS.map((item) => (
        <article key={item.title} className="card card--media">
          <VitrineImage
            src={item.image}
            fallback={item.fallback}
            alt={item.alt}
            width={600}
            height={338}
            className="card-media"
          />
          <div className="card-body">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
