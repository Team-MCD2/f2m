"use client";

import { useState } from "react";
import { HERO_VIDEO } from "@/lib/vitrine/videos";

type HeroVideoBackgroundProps = {
  poster: string;
};

export function HeroVideoBackground({ poster }: HeroVideoBackgroundProps) {
  const [usePosterFallback, setUsePosterFallback] = useState(false);

  return (
    <div className="hero-video-wrap hero-parallax" aria-hidden="true">
      {usePosterFallback ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="" className="hero-poster-fallback" />
      ) : (
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
          preload="metadata"
          onError={() => setUsePosterFallback(true)}
        >
          <source src={HERO_VIDEO.local} type="video/mp4" />
          <source src={HERO_VIDEO.fallback} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
