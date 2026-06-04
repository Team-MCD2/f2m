"use client";

import Link from "next/link";
import { useState } from "react";
import { TypewriterText } from "@/components/vitrine/TypewriterText";
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

const TYPEWRITER_TEXT = "F2M Consulting";

export function HomeHeroAnimated() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <section
      className={[
        "hero",
        "hero--home",
        "hero--animated",
        introDone ? "hero--intro-done" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Présentation F2M Consulting"
    >
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
        <p className="hero-brand-line">
          <TypewriterText
            text={TYPEWRITER_TEXT}
            speedMs={50}
            className="hero-brand-typewriter"
            onComplete={() => setIntroDone(true)}
          />
        </p>
        <div className={`hero-after-intro${introDone ? " is-visible" : ""}`}>
          <div className="hero-badges hero-enter hero-enter--1">
            <span className="badge">Qualiopi</span>
            <span className="badge">RNCP 36654 — Niv. 5</span>
            <span className="badge">Toulouse · Occitanie</span>
          </div>
          <h1 className="hero-enter hero-enter--2">
            Formation DGESP &amp; sécurité privée à Toulouse
          </h1>
          <p className="lead hero-enter hero-enter--3">
            Centre certifié Qualiopi — titre RNCP 36654, VAE et financements CPF / OPCO pour
            dirigeants et professionnels de la sécurité privée.
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
      </div>
    </section>
  );
}
