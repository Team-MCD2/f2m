import type { ReactNode } from "react";

type VitrineImageZoomProps = {
  children: ReactNode;
  className?: string;
  /** Zoom lent continu (hero) — pas de déclenchement au scroll */
  kenBurns?: boolean;
  /** Désactive le zoom supplémentaire au survol (desktop) */
  noHover?: boolean;
};

/**
 * Wrapper overflow:hidden autour de VitrineImage / next/image.
 * La classe `is-in-view` est ajoutée par VitrineAnimations (IntersectionObserver).
 */
export function VitrineImageZoom({
  children,
  className = "",
  kenBurns = false,
  noHover = false,
}: VitrineImageZoomProps) {
  const classes = [
    "image-zoom-wrap",
    kenBurns && "image-zoom-wrap--ken-burns",
    noHover && "image-zoom-wrap--no-hover",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      {...(!kenBurns ? { "data-image-zoom": "" } : {})}
    >
      {children}
    </div>
  );
}
