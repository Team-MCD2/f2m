"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 100, suffix: "%", label: "Taux de réussite examen" },
  { value: 95, suffix: "%", label: "Stagiaires très satisfaits" },
  { value: 57, suffix: "%", label: "Retour à l'emploi à 6 mois" },
  { value: 12, suffix: "", label: "Années d'expérience depuis 2012" },
] as const;

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(target);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(target * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return display;
}

function StatItem({
  value,
  suffix,
  label,
  active,
}: {
  value: number;
  suffix: string;
  label: string;
  active: boolean;
}) {
  const count = useCountUp(value, active);

  return (
    <div className="stat-card">
      <strong>
        {count}
        {suffix}
      </strong>
      <span>{label}</span>
    </div>
  );
}

export function StatsCounters() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) {
      setActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="stats-grid reveal-on-scroll">
      {STATS.map((stat) => (
        <StatItem key={stat.label} {...stat} active={active} />
      ))}
    </div>
  );
}
