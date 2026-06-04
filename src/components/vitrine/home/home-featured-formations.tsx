import Link from "next/link";
import { VITRINE_IMAGES } from "@/lib/vitrine/images";
import { VitrineImage } from "@/components/vitrine/vitrine-image";
import { Section } from "@/components/vitrine/section";

const FEATURED = [
  {
    title: "Formation DGESP — 282 h",
    excerpt:
      "Parcours certifiant vers le titre Dirigeant d'Entreprise de Sécurité Privée (RNCP 36654), en présentiel et distanciel à Toulouse.",
    href: "/formation-dgesp",
    cta: "Découvrir la formation",
    image: VITRINE_IMAGES.formation,
  },
  {
    title: "VAE dirigeant DGESP",
    excerpt:
      "Valorisez votre expérience terrain pour obtenir le titre sans repasser par la formation initiale complète.",
    href: "/vae-dgesp",
    cta: "En savoir plus sur la VAE",
    image: VITRINE_IMAGES.vae,
  },
  {
    title: "Financement CPF & OPCO",
    excerpt:
      "Éligibilité Qualiopi, montage CPF, prises en charge employeur et dispositifs France Travail.",
    href: "/financements",
    cta: "Voir les financements",
    image: VITRINE_IMAGES.financements.cpf,
  },
] as const;

export function HomeFeaturedFormations() {
  return (
    <Section
      id="formations-phares"
      title="Nos formations les plus demandées"
      subtitle="Des parcours structurés pour dirigeants et professionnels de la sécurité privée."
    >
      <div className="home-featured-grid">
        {FEATURED.map((item) => (
          <article key={item.href} className="home-featured-card">
            <Link href={item.href} className="home-featured-card-media">
              <VitrineImage
                src={item.image}
                alt=""
                width={640}
                height={400}
                sizes="(min-width: 900px) 33vw, 100vw"
              />
            </Link>
            <div className="home-featured-card-body">
              <h3>
                <Link href={item.href}>{item.title}</Link>
              </h3>
              <p>{item.excerpt}</p>
              <Link className="home-featured-link" href={item.href}>
                {item.cta} →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
