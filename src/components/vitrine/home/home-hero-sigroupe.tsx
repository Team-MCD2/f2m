import Link from "next/link";
import { HeroVideoBackground } from "@/components/vitrine/hero-video-background";
import { VITRINE_IMAGES } from "@/lib/vitrine/images";

const HERO_FAMILIES = [
  { label: "DGESP", href: "/formation-dgesp" },
  { label: "VAE", href: "/vae-dgesp" },
  { label: "Financements", href: "/financements" },
  { label: "Notre centre", href: "/notre-centre" },
  { label: "E-learning", href: "/e-learning" },
] as const;

export function HomeHeroSigroupe() {
  const poster = VITRINE_IMAGES.toulouse;

  return (
    <section className="hero hero--sigroupe" aria-label="Présentation F2M Consulting">
      <HeroVideoBackground poster={poster} />
      <div className="hero-overlay" aria-hidden="true" />
      <div className="container hero-content">
        <div className="hero-badges">
          <span className="badge">Qualiopi</span>
          <span className="badge">RNCP 36654 — Niv. 5</span>
          <span className="badge">Toulouse · Occitanie</span>
        </div>
        <h1>
          F2M Consulting — Centre de formation DGESP &amp; sécurité privée à Toulouse
        </h1>
        <p className="lead">
          Accompagnement des dirigeants et professionnels vers le titre{" "}
          <strong>Dirigeant d&apos;Entreprise de Sécurité Privée</strong>.
          <br />
          Formation initiale, VAE et financements (CPF, OPCO, France Travail).
        </p>
        <div className="hero-cta">
          <Link className="btn btn-gold btn-primary-glow" href="/formation-dgesp">
            Nos formations
          </Link>
          <Link className="btn btn-outline btn-outline-light" href="/contact">
            Prendre rendez-vous
          </Link>
        </div>
        <ul className="hero-families" aria-label="Parcours et services">
          {HERO_FAMILIES.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
