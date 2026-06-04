import Link from "next/link";
import { VitrineImage } from "@/components/vitrine/vitrine-image";
import { VitrineImageZoom } from "@/components/vitrine/vitrine-image-zoom";
import { VITRINE_IMAGES } from "@/lib/vitrine/images";

const HERO_FAMILIES = [
  { label: "DGESP", href: "/formation-dgesp" },
  { label: "VAE", href: "/vae-dgesp" },
  { label: "Financements", href: "/financements" },
  { label: "Notre centre", href: "/notre-centre" },
  { label: "E-learning", href: "/e-learning" },
] as const;

export function HomeHeroSigroupe() {
  return (
    <section className="hero hero--sigroupe hero--animated" aria-label="Présentation F2M Consulting">
      <div className="hero-static-bg" aria-hidden="true">
        <VitrineImageZoom kenBurns className="hero-static-bg-zoom">
          <VitrineImage
            src={VITRINE_IMAGES.hero}
            fallback={VITRINE_IMAGES.toulouseFallback}
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero-static-bg-img"
          />
        </VitrineImageZoom>
      </div>
      <div className="hero-overlay" aria-hidden="true" />
      <div className="container hero-content">
        <div className="hero-badges hero-enter hero-enter--1">
          <span className="badge">Qualiopi</span>
          <span className="badge">RNCP 36654 — Niv. 5</span>
          <span className="badge">Toulouse · Occitanie</span>
        </div>
        <h1 className="hero-enter hero-enter--2">
          F2M Consulting — Centre de formation DGESP &amp; sécurité privée à Toulouse
        </h1>
        <p className="lead hero-enter hero-enter--3">
          Accompagnement des dirigeants et professionnels vers le titre{" "}
          <strong>Dirigeant d&apos;Entreprise de Sécurité Privée</strong>.
          <br />
          Formation initiale, VAE et financements (CPF, OPCO, France Travail).
        </p>
        <div className="hero-cta hero-enter hero-enter--4">
          <Link className="btn btn-gold btn-primary-glow" href="/formation-dgesp">
            Nos formations
          </Link>
          <Link className="btn btn-outline btn-outline-light" href="/contact">
            Prendre rendez-vous
          </Link>
        </div>
        <ul className="hero-families hero-enter hero-enter--5" aria-label="Parcours et services">
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
