import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/vitrine/page-hero";
import { Section } from "@/components/vitrine/section";
import { VitrineImage } from "@/components/vitrine/vitrine-image";
import { F2M_SITE } from "@/lib/vitrine/site-config";
import { VITRINE_IMAGES } from "@/lib/vitrine/images";

export const metadata: Metadata = {
  title: "E-learning & LMS Dokeos",
  description:
    "Connexion LMS Dokeos F2M — classes virtuelles, guide de prise en main, compatible mobile pour la formation DGESP.",
};

const E_LEARNING_CARDS = [
  {
    title: "Classes virtuelles",
    description: "Sessions live avec formateurs — replays disponibles sur la plateforme.",
    image: VITRINE_IMAGES.elearningCards.classes,
    fallback: VITRINE_IMAGES.elearningCards.classesFallback,
    alt: "Classe virtuelle en visioconférence",
  },
  {
    title: "Guide de prise en main",
    description: "Tutoriel PDF et vidéo envoyés à l'inscription — assistance technique par email.",
    image: VITRINE_IMAGES.elearningCards.guide,
    fallback: VITRINE_IMAGES.elearningCards.guideFallback,
    alt: "Guide de prise en main formation en ligne",
  },
  {
    title: "Compatible mobile",
    description: "Consultez vos cours depuis smartphone ou tablette (iOS / Android).",
    image: VITRINE_IMAGES.elearningCards.mobile,
    fallback: VITRINE_IMAGES.elearningCards.mobileFallback,
    alt: "Consultation des cours sur smartphone",
  },
] as const;

export default function ELearningPage() {
  return (
    <>
      <PageHero
        title="E-learning & plateforme LMS"
        lead="Accédez à vos modules DGESP sur Dokeos — classes virtuelles, ressources téléchargeables et suivi pédagogique."
        image={VITRINE_IMAGES.elearning}
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "E-learning" },
        ]}
      >
        <a
          className="btn btn-gold btn-primary-glow"
          href={F2M_SITE.lmsUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          Connexion LMS Dokeos
        </a>
      </PageHero>

      <Section variant="light" className="reveal-on-scroll">
        <div className="media-band reveal-on-scroll" data-reveal style={{ marginBottom: "2.5rem" }}>
          <div className="media-band-img-wrap">
            <VitrineImage
              src={VITRINE_IMAGES.elearning}
              alt="Formation en ligne sur ordinateur portable — plateforme LMS Dokeos"
              width={900}
              height={675}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
          <div>
            <h2>Plateforme Dokeos F2M</h2>
            <p>
              Modules DGESP accessibles 24h/24, classes virtuelles intégrées et suivi
              pédagogique personnalisé — compatible mobile et tablette.
            </p>
            <a className="btn btn-gold" href={F2M_SITE.lmsUrl} rel="noopener noreferrer" target="_blank">
              Se connecter au LMS
            </a>
          </div>
        </div>
        <div className="cards-grid reveal-on-scroll reveal-stagger">
          {E_LEARNING_CARDS.map((card) => (
            <article key={card.title} className="card card--media">
              <VitrineImage
                src={card.image}
                fallback={card.fallback}
                alt={card.alt}
                width={600}
                height={338}
                className="card-media"
              />
              <div className="card-body">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="reveal-on-scroll" data-reveal style={{ marginTop: "2rem", textAlign: "center" }}>
          <Link className="btn btn-brand" href="/formation-dgesp">
            Découvrir la formation DGESP
          </Link>
          <Link className="btn btn-gold" href="/contact" style={{ marginLeft: "0.5rem" }}>
            Besoin d&apos;accès ?
          </Link>
        </p>
      </Section>
    </>
  );
}
