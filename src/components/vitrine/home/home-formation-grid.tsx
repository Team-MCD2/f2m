import Link from "next/link";
import { VITRINE_IMAGES } from "@/lib/vitrine/images";
import { VitrineImage } from "@/components/vitrine/vitrine-image";
import { Section } from "@/components/vitrine/section";

const FORMATION_LINKS = [
  {
    label: "Formation DGESP",
    href: "/formation-dgesp",
    desc: "282 h · Titre RNCP niveau 5",
    image: VITRINE_IMAGES.formation,
    fallback: VITRINE_IMAGES.formationFallback,
  },
  {
    label: "VAE DGESP",
    href: "/vae-dgesp",
    desc: "Validation des acquis",
    image: VITRINE_IMAGES.vae,
  },
  {
    label: "Financements",
    href: "/financements",
    desc: "CPF, OPCO, France Travail",
    image: VITRINE_IMAGES.finance,
  },
  {
    label: "E-learning",
    href: "/e-learning",
    desc: "Classes virtuelles & LMS",
    image: VITRINE_IMAGES.elearning,
  },
  {
    label: "Notre centre",
    href: "/notre-centre",
    desc: "Toulouse · Occitanie",
    image: VITRINE_IMAGES.centre,
  },
  {
    label: "Contact",
    href: "/contact",
    desc: "Devis & rendez-vous",
    image: VITRINE_IMAGES.contact,
  },
] as const;

export function HomeFormationGrid() {
  return (
    <Section
      id="nos-formations"
      variant="light"
      title="Nos formations & parcours"
      subtitle="Accédez directement aux dispositifs proposés par F2M Consulting à Toulouse."
    >
      <div className="home-formation-grid">
        {FORMATION_LINKS.map((item) => (
          <Link key={item.href} href={item.href} className="home-formation-tile">
            <span className="home-formation-tile-img">
              <VitrineImage
                src={item.image}
                fallback={"fallback" in item ? item.fallback : undefined}
                alt=""
                width={400}
                height={260}
                sizes="(min-width: 768px) 200px, 45vw"
              />
            </span>
            <span className="home-formation-tile-body">
              <strong>{item.label}</strong>
              <span>{item.desc}</span>
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}
