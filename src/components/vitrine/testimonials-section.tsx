"use client";

import { useEffect, useState } from "react";
import { VITRINE_IMAGES } from "@/lib/vitrine/images";
import { VitrineImage } from "@/components/vitrine/vitrine-image";

const TESTIMONIALS = [
  {
    quote:
      "Formation exigeante et formatrice. J'ai obtenu mon titre RNCP avec un accompagnement personnalisé à Toulouse.",
    name: "Laurent M.",
    role: "Stagiaire DGESP — promotion 2024",
    avatar: VITRINE_IMAGES.avatars[0],
    alt: "Portrait stagiaire DGESP",
  },
  {
    quote:
      "Bastien et l'équipe m'ont guidé sur la VAE : 15 ans d'expérience valorisés avec sérieux et disponibilité.",
    name: "Karim B.",
    role: "Dirigeant sécurité privée — Occitanie",
    avatar: VITRINE_IMAGES.avatars[1],
    alt: "Portrait dirigeant sécurité privée",
  },
  {
    quote:
      "Financement CPF simplifié, plateforme e-learning Dokeos intuitive — je recommande F2M Consulting.",
    name: "Sophie R.",
    role: "Repreneur d'entreprise SSP",
    avatar: VITRINE_IMAGES.avatars[2],
    alt: "Portrait repreneur entreprise SSP",
  },
] as const;

function Stars() {
  return (
    <div className="testimonial-stars" aria-label="5 étoiles sur 5">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} aria-hidden="true">
          ★
        </span>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const active = TESTIMONIALS[activeIndex];

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(
      () => setActiveIndex((i) => (i + 1) % TESTIMONIALS.length),
      8000
    );
    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <div className="testimonials-section reveal-on-scroll">
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Avis mis en avant : {active.name}, {active.role}. {active.quote}
      </p>
      <div className="testimonials-grid" role="list">
        {TESTIMONIALS.map((item, index) => (
          <article
            key={item.name}
            role="listitem"
            className={`testimonial-card${index === activeIndex ? " is-highlighted" : ""}`}
            onMouseEnter={() => setActiveIndex(index)}
            aria-current={index === activeIndex ? "true" : undefined}
          >
            <div className="testimonial-card-header">
              <VitrineImage
                src={item.avatar}
                alt={item.alt}
                width={48}
                height={48}
                className="testimonial-card-avatar"
              />
              <div>
                <Stars />
                <p className="testimonial-card-name">{item.name}</p>
                <p className="testimonial-card-role">{item.role}</p>
              </div>
            </div>
            <blockquote className="testimonial-card-quote">
              <p>&laquo;&nbsp;{item.quote}&nbsp;&raquo;</p>
            </blockquote>
          </article>
        ))}
      </div>
      <div className="testimonials-dots" role="tablist" aria-label="Mettre en avant un avis">
        {TESTIMONIALS.map((item, index) => (
          <button
            key={item.name}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Avis de ${item.name}`}
            className={index === activeIndex ? "is-active" : ""}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
      <p className="testimonials-disclaimer">
        Avis recueillis après formation — identités modifiées
      </p>
    </div>
  );
}
