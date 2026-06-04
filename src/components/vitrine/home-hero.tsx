import Link from "next/link";
import { VITRINE_IMAGES } from "@/lib/vitrine/images";
import { HERO_VIDEO } from "@/lib/vitrine/videos";
import { VitrineImage } from "./vitrine-image";

export function HomeHero() {
  const poster = VITRINE_IMAGES.toulouse;

  return (
    <section className="hero" aria-label="Présentation F2M Consulting">
      <div className="hero-video-wrap hero-parallax" aria-hidden="true">
        <VitrineImage
          src={poster}
          alt=""
          width={1920}
          height={1080}
          className="hero-poster-img"
          priority
        />
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
          preload="metadata"
        >
          <source src={HERO_VIDEO.local} type="video/mp4" />
          <source src={HERO_VIDEO.fallback} type="video/mp4" />
        </video>
      </div>
      <div className="hero-overlay" />
      <div className="container hero-content">
        <div className="hero-badges">
          <span className="badge">Qualiopi</span>
          <span className="badge">RNCP 36654 — Niv. 5</span>
          <span className="badge">Toulouse · Occitanie</span>
        </div>
        <h1>Formation DGESP &amp; conseil en sécurité privée</h1>
        <p className="lead">
          F2M Consulting accompagne dirigeants et professionnels vers le titre{" "}
          <strong>Dirigeant d&apos;Entreprise de Sécurité Privée</strong> — formation
          initiale, VAE et financements (CPF, OPCO, France Travail).
        </p>
        <div className="hero-cta">
          <Link className="btn btn-gold btn-primary-glow" href="/formation-dgesp">
            Découvrir la formation DGESP
          </Link>
          <Link className="btn btn-outline btn-outline-light" href="/contact">
            Prendre rendez-vous
          </Link>
          <Link className="btn btn-outline btn-outline-light" href="/deposer-dossier">
            Déposer un dossier
          </Link>
          <Link className="btn btn-outline btn-outline-light" href="/connexion">
            Connexion
          </Link>
        </div>
      </div>
    </section>
  );
}
