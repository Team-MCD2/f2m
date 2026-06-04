import Link from "next/link";
import { CardRibbon } from "@/components/vitrine/card-ribbon";
import { VITRINE_IMAGES } from "@/lib/vitrine/images";
import { VitrineImage } from "@/components/vitrine/vitrine-image";
import { VitrineImageZoom } from "@/components/vitrine/vitrine-image-zoom";
import { Section } from "@/components/vitrine/section";

const F = VITRINE_IMAGES.featured;

type FeaturedFormation = {
  title: string;
  excerpt: string;
  href: string;
  duration: string;
  lieu: string;
  image: string;
  fallback: string;
  imageAlt: string;
  ribbonLabel?: string;
};

const FEATURED: FeaturedFormation[] = [
  {
    title: "Formation DGESP",
    excerpt:
      "Parcours certifiant 282 h vers le titre Dirigeant d'Entreprise de Sécurité Privée (RNCP 36654).",
    href: "/formation-dgesp",
    duration: "282 h",
    lieu: "Toulouse + distanciel",
    image: F.formation,
    fallback: F.formationFallback,
    imageAlt:
      "Stagiaires en formation DGESP — management et sécurité privée à Toulouse",
    ribbonLabel: "RNCP 36654",
  },
  {
    title: "VAE dirigeant DGESP",
    excerpt:
      "Valorisez votre expérience terrain pour obtenir le titre sans repasser par la formation initiale complète.",
    href: "/vae-dgesp",
    duration: "Sur mesure",
    lieu: "Toulouse",
    image: F.vae,
    fallback: F.vaeFallback,
    imageAlt: "Accompagnement VAE DGESP pour dirigeants de la sécurité privée",
    ribbonLabel: "Niveau 5",
  },
  {
    title: "Financement CPF & OPCO",
    excerpt:
      "Éligibilité Qualiopi, montage CPF, prises en charge employeur et dispositifs France Travail.",
    href: "/financements",
    duration: "Accompagnement",
    lieu: "À distance",
    image: F.financements,
    fallback: F.financementsFallback,
    imageAlt: "Conseil financement formation professionnelle CPF et OPCO",
  },
];

export function HomeFeaturedFormations() {
  return (
    <Section
      id="formations-phares"
      title="Nos formations phares"
      subtitle="Trois parcours essentiels pour dirigeants et professionnels de la sécurité privée."
      className="reveal-on-scroll"
    >
      <div className="home-featured-grid reveal-on-scroll reveal-stagger">
        {FEATURED.map((item) => (
          <article
            key={item.href}
            className={
              item.ribbonLabel
                ? "home-featured-card home-formation-card card-with-ribbon"
                : "home-featured-card home-formation-card"
            }
          >
            {item.ribbonLabel ? <CardRibbon label={item.ribbonLabel} /> : null}
            <Link href={item.href} className="home-featured-card-media">
              <VitrineImageZoom>
                <VitrineImage
                  src={item.image}
                  fallback={item.fallback}
                  alt={item.imageAlt}
                  width={640}
                  height={400}
                  sizes="(min-width: 900px) 33vw, 50vw"
                />
              </VitrineImageZoom>
            </Link>
            <div className="home-featured-card-body">
              <h3>
                <Link href={item.href}>{item.title}</Link>
              </h3>
              <ul className="home-featured-meta" aria-label="Informations pratiques">
                <li>
                  <strong>Durée</strong> {item.duration}
                </li>
                <li>
                  <strong>Lieu</strong> {item.lieu}
                </li>
              </ul>
              <p>{item.excerpt}</p>
              <Link className="home-featured-link" href={item.href}>
                Voir la formation →
              </Link>
            </div>
          </article>
        ))}
      </div>
      <p className="home-featured-cta">
        <Link className="btn btn-brand" href="/formation-dgesp">
          Voir toutes nos formations
        </Link>
      </p>
    </Section>
  );
}
