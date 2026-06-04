"use client";

import Image from "next/image";
import { useState } from "react";

type VitrineImageBase = {
  src: string;
  fallback?: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
};

type VitrineImageProps = VitrineImageBase &
  (
    | { fill: true; width?: number; height?: number }
    | { fill?: false; width: number; height: number }
  );

export function VitrineImage({
  src,
  fallback,
  alt,
  width,
  height,
  className,
  priority,
  fill,
  sizes,
  style,
}: VitrineImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const isExternal = currentSrc.startsWith("http");
  const unoptimized =
    isExternal &&
    (currentSrc.includes("?") ||
      /\.bing\.net/i.test(currentSrc) ||
      /dtp-ag\.com/i.test(currentSrc));

  const handleError = () => {
    if (fallback && currentSrc !== fallback) {
      setCurrentSrc(fallback);
    }
  };

  if (fill) {
    return (
      <Image
        src={currentSrc}
        alt={alt}
        fill
      className={className}
      style={style}
      sizes={sizes ?? "100vw"}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        onError={handleError}
        unoptimized={unoptimized || (!isExternal && currentSrc.endsWith(".svg"))}
      />
    );
  }

  return (
    <Image
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      onError={handleError}
      unoptimized={unoptimized || (!isExternal && currentSrc.endsWith(".svg"))}
    />
  );
}
