"use client";

import { useEffect } from "react";

const IN_VIEW_SELECTOR =
  ".reveal-on-scroll, [data-reveal], [data-image-zoom]";

function visibleClassFor(el: Element): string {
  if (el.hasAttribute("data-image-zoom")) return "is-in-view";
  if (el.hasAttribute("data-reveal")) return "is-visible";
  return "is-revealed";
}

function markAllVisible() {
  document.querySelectorAll(IN_VIEW_SELECTOR).forEach((el) => {
    el.classList.add(visibleClassFor(el));
  });
}

function isAlreadyVisible(el: Element, visibleClass: string): boolean {
  return el.classList.contains(visibleClass);
}

export function VitrineAnimations() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {
      markAllVisible();
      return;
    }

    if (!("IntersectionObserver" in window)) {
      markAllVisible();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const visibleClass = visibleClassFor(el);
          el.classList.add(visibleClass);
          observer.unobserve(el);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
    );

    const observeTargets = () => {
      document.querySelectorAll(IN_VIEW_SELECTOR).forEach((el) => {
        const visibleClass = visibleClassFor(el);
        if (isAlreadyVisible(el, visibleClass)) return;
        observer.observe(el);
      });
    };

    observeTargets();

    const mutationObserver = new MutationObserver(observeTargets);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    const onMotionChange = () => {
      if (reducedMotion.matches) {
        observer.disconnect();
        markAllVisible();
      }
    };
    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      reducedMotion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return null;
}
