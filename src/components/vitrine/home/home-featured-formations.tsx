import Link from "next/link";
import { VITRINE_IMAGES } from "@/lib/vitrine/images";
import { VitrineImage } from "@/components/vitrine/vitrine-image";
import { Section } from "@/components/vitrine/section";

const FEATURED = [
  {
    title: "Formation DGESP",
    excerpt:
      "Parcours certifiant 282 h vers le titre Dirigeant d'Entreprise de Sécurité Privée (RNCP 36654).",
    href: "/formation-dgesp",
    duration: "282 h",
    lieu: "Toulouse + distanciel",
    image: VITRINE_IMAGES.formation,
  },
  {
    title: "VAE dirigeant DGESP",
    excerpt:
      "Valorisez votre expérience terrain pour obtenir le titre sans repasser par la formation initiale complète.",
    href: "/vae-dgesp",
    duration: "Sur mesure",
    lieu: "Toulouse",
    image: VITRINE_IMAGES.vae,
  },
  {
    title: "Financement CPF & OPCO",
    excerpt:
      "Éligibilité Qualiopi, montage CPF, prises en charge employeur et dispositifs France Travail.",
    href: "/financements",
    duration: "Accompagnement",
    lieu: "À distance",
    image: VITRINE_IMAGES.financements.cpf,
  },
  {
    title: "E-learning & classes virtuelles",
    excerpt:
      "Plateforme Dokeos, classes virtuelles et ressources pédagogiques complémentaires au présentiel.",
    href: "/e-learning",
    duration: "Continu",
    lieu: "En ligne",
    image: VITRINE_IMAGES.elearning,
  },
  {
    title: "Notre centre",
    excerpt:
      "Visitez nos locaux à Toulouse : salles, coworking, visioconférence et accueil stagiaires.",
    href: "/notre-centre",
    duration: "Sur RDV",
    lieu: "31100 Toulouse",
    image: VITRINE_IMAGES.centre,
  },
  {
    title: "Contact & conseil",
    excerpt:
      "Échange avec un conseiller pour définir votre parcours DGESP, VAE ou financement.",
    href: "/contact",
    duration: "Gratuit",
    lieu: "Toulouse",
    image: VITRINE_IMAGES.contact,
  },
] as const;

export function HomeFeaturedFormations() {
  return (
    <Section
      id="formations-phares"
      title="Nos formations phares"
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
                sizes="(min-width: 900px) 33vw, 50vw"
              />
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
    </Section>
  );
}
