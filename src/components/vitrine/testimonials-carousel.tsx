"use client";

import { useEffect, useState } from "react";
import { VITRINE_IMAGES } from "@/lib/vitrine/images";
import { VitrineImage } from "./vitrine-image";

const TESTIMONIALS = [
  {
    text: "« Formation exigeante et formatrice. J'ai obtenu mon titre RNCP avec un accompagnement personnalisé à Toulouse. »",
    author: "— Stagiaire DGESP, promotion 2024",
    extra: "Vidéo témoignage disponible sur demande.",
    avatar: VITRINE_IMAGES.avatars[0],
    alt: "Portrait stagiaire DGESP",
  },
  {
    text: "« Bastien et l'équipe m'ont guidé sur la VAE : 15 ans d'expérience valorisés avec sérieux et disponibilité. »",
    author: "— Dirigeant sécurité privée, Occitanie",
    avatar: VITRINE_IMAGES.avatars[1],
    alt: "Portrait dirigeant sécurité privée",
  },
  {
    text: "« Financement CPF simplifié, plateforme e-learning Dokeos intuitive — je recommande F2M Consulting. »",
    author: "— Repreneur d'entreprise SSP",
    avatar: VITRINE_IMAGES.avatars[2],
    alt: "Portrait repreneur entreprise SSP",
  },
] as const;

export function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % TESTIMONIALS.length), 7000);
    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <div data-carousel>
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {TESTIMONIALS.map((t) => (
          <div key={t.author} className="carousel-slide is-active">
            <VitrineImage
              src={t.avatar}
              alt={t.alt}
              width={56}
              height={56}
              className="testimonial-avatar"
            />
            <div className="stars" aria-hidden="true">
              ★★★★★
            </div>
            <p>{t.text}</p>
            <p>
              <strong>{t.author}</strong>
            </p>
            {"extra" in t && t.extra && <p><em>{t.extra}</em></p>}
          </div>
        ))}
      </div>
      <div className="carousel-controls">
        <button
          type="button"
          aria-label="Témoignage précédent"
          onClick={() => setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
        >
          ‹
        </button>
        <div className="carousel-dots" role="tablist">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              data-carousel-dot
              className={i === index ? "is-active" : ""}
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Témoignage suivant"
          onClick={() => setIndex((i) => (i + 1) % TESTIMONIALS.length)}
        >
          ›
        </button>
      </div>
    </div>
  );
}
