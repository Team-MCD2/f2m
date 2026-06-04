"use client";

import { useEffect, useRef, useState } from "react";

type TypewriterTextProps = {
  text: string;
  /** Délai entre chaque caractère (ms). */
  speedMs?: number;
  className?: string;
  onComplete?: () => void;
};

export function TypewriterText({
  text,
  speedMs = 50,
  className = "",
  onComplete,
}: TypewriterTextProps) {
  const [visibleLength, setVisibleLength] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const onCompleteRef = useRef(onComplete);
  const completedRef = useRef(false);

  onCompleteRef.current = onComplete;

  useEffect(() => {
    completedRef.current = false;
    setVisibleLength(0);
  }, [text]);

  const fireComplete = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current?.();
  };

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyReduced = () => {
      setReducedMotion(mq.matches);
      if (mq.matches) {
        setVisibleLength(text.length);
        fireComplete();
      }
    };
    applyReduced();
    mq.addEventListener("change", applyReduced);
    return () => mq.removeEventListener("change", applyReduced);
  }, [text]);

  useEffect(() => {
    if (reducedMotion) return;

    if (visibleLength >= text.length) {
      fireComplete();
      return;
    }

    const timer = window.setTimeout(() => {
      setVisibleLength((n) => n + 1);
    }, speedMs);

    return () => window.clearTimeout(timer);
  }, [visibleLength, text, speedMs, reducedMotion]);

  const displayed = text.slice(0, visibleLength);
  const typing = !reducedMotion && visibleLength < text.length;

  return (
    <span className={["typewriter", className].filter(Boolean).join(" ")}>
      <span className="typewriter-display" aria-hidden="true">
        {displayed}
        {typing ? <span className="typewriter-cursor">|</span> : null}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
