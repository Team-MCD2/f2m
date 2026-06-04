import Link from "next/link";
import { VITRINE_IMAGES } from "@/lib/vitrine/images";
import { HeroVideoBackground } from "./hero-video-background";

export function HomeHero() {
  const poster = VITRINE_IMAGES.toulouse;

  return (
    <section className="hero" aria-label="Présentation F2M Consulting">
      <HeroVideoBackground poster={poster} />
      <div className="hero-overlay" />
      <div className="container hero-content">
        <div className="hero-badges">
          <span className="badge">Qualiopi</span>
          <span className="badge">RNCP 36654 — Niv. 5</span>
          <span className="badge">Sécurité privée · Toulouse</span>
        </div>
        <h1>F2M Consulting — Centre de formation DGESP à Toulouse</h1>
        <p className="lead">
          Organisme certifié <strong>Qualiopi</strong>, titre{" "}
          <strong>RNCP 36654</strong> (niveau 5) — formation initiale, VAE et
          financements pour les dirigeants et professionnels de la{" "}
          <strong>sécurité privée</strong>.
        </p>
        <div className="hero-cta">
          <Link className="btn btn-gold btn-primary-glow" href="/formation-dgesp">
            Nos formations
          </Link>
          <Link className="btn btn-outline btn-outline-light" href="/contact">
            Demander un devis
          </Link>
        </div>
      </div>
    </section>
  );
}
