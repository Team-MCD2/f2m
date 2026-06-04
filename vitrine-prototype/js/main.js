(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const cfg = window.F2M_SITE || {};
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Menu mobile */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("nav-open", open);
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      })
    );
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length) {
    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-visible");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
      );
      revealEls.forEach((el) => io.observe(el));
    }
  }

  /* Compteurs */
  function animateCount(el) {
    if (el.dataset.animated === "true") return;
    el.dataset.animated = "true";
    const target = parseInt(el.getAttribute("data-count") || "0", 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const prefix = el.getAttribute("data-prefix") || "";
    if (reducedMotion) {
      el.textContent = prefix + target + suffix;
      return;
    }
    const duration = 1600;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    if ("IntersectionObserver" in window && !reducedMotion) {
      const cio = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              animateCount(e.target);
              cio.unobserve(e.target);
            }
          });
        },
        { threshold: 0.35 }
      );
      counters.forEach((el) => cio.observe(el));
    } else {
      counters.forEach(animateCount);
    }
  }

  /* Cartes Google Maps + fallback OSM */
  document.querySelectorAll("[data-map]").forEach((block) => {
    const googleFrame = block.querySelector("[data-map-google]");
    const osmFrame = block.querySelector("[data-map-osm]");
    const link = block.querySelector("[data-map-link]");
    const toggleBtn = block.querySelector("[data-map-toggle-osm]");

    if (link && cfg.mapsPlaceUrl) link.href = cfg.mapsPlaceUrl;
    if (googleFrame && cfg.mapsEmbed) googleFrame.src = cfg.mapsEmbed;
    if (osmFrame && cfg.mapsOsmEmbed) osmFrame.src = cfg.mapsOsmEmbed;

    if (toggleBtn && googleFrame && osmFrame) {
      toggleBtn.addEventListener("click", () => {
        const useOsm = googleFrame.hidden;
        googleFrame.hidden = !useOsm;
        osmFrame.hidden = useOsm;
        toggleBtn.textContent = useOsm
          ? "Afficher Google Maps"
          : "Afficher OpenStreetMap (alternative)";
        toggleBtn.setAttribute("aria-pressed", useOsm ? "false" : "true");
      });
    }
  });

  /* Accordéon */
  document.querySelectorAll("[data-accordion]").forEach((root) => {
    root.querySelectorAll(".accordion-trigger").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".accordion-item");
        const panel = item?.querySelector(".accordion-panel");
        const expanded = btn.getAttribute("aria-expanded") === "true";
        root.querySelectorAll(".accordion-item").forEach((i) => {
          i.querySelector(".accordion-trigger")?.setAttribute("aria-expanded", "false");
          i.querySelector(".accordion-panel")?.setAttribute("hidden", "");
        });
        if (!expanded && panel) {
          btn.setAttribute("aria-expanded", "true");
          panel.removeAttribute("hidden");
        }
      });
    });
  });

  /* Carrousel témoignages */
  document.querySelectorAll("[data-carousel]").forEach((root) => {
    const track = root.querySelector(".carousel-track");
    const slides = root.querySelectorAll(".carousel-slide");
    const dots = root.querySelectorAll("[data-carousel-dot]");
    let index = 0;
    let timer;

    function go(i) {
      index = (i + slides.length) % slides.length;
      if (track) {
        track.style.transform = `translateX(-${index * 100}%)`;
        track.dataset.active = String(index);
      }
      slides.forEach((s, j) => s.classList.toggle("is-active", j === index));
      dots.forEach((d, j) => {
        d.classList.toggle("is-active", j === index);
        d.setAttribute("aria-selected", j === index ? "true" : "false");
      });
    }

    root.querySelector("[data-carousel-prev]")?.addEventListener("click", () => go(index - 1));
    root.querySelector("[data-carousel-next]")?.addEventListener("click", () => go(index + 1));
    dots.forEach((d, j) => d.addEventListener("click", () => go(j)));
    go(0);

    if (slides.length > 1 && !reducedMotion) {
      timer = setInterval(() => go(index + 1), 8000);
      root.addEventListener("mouseenter", () => clearInterval(timer));
      root.addEventListener("mouseleave", () => {
        timer = setInterval(() => go(index + 1), 8000);
      });
    }
  });

  /* Stepper — animation au scroll */
  document.querySelectorAll(".stepper").forEach((stepper) => {
    const items = stepper.querySelectorAll(".stepper-item");
    items.forEach((item, i) => item.style.setProperty("--step-delay", `${i * 0.12}s`));

    if (reducedMotion || !("IntersectionObserver" in window)) {
      stepper.classList.add("is-visible");
      return;
    }

    const sio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            sio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    sio.observe(stepper);
  });

  /* Simulateur CPF simplifié */
  const cpfForm = document.getElementById("cpf-simulator");
  if (cpfForm) {
    cpfForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const hours = parseInt(
        /** @type {HTMLInputElement} */ (cpfForm.querySelector('[name="hours"]'))?.value || "282",
        10
      );
      const rate = 15;
      const out = cpfForm.querySelector("#cpf-result");
      if (out) {
        out.textContent = `Estimation indicative : jusqu'à ${(hours * rate).toLocaleString("fr-FR")} € de prise en charge CPF (selon droits acquis — à confirmer avec un conseiller).`;
        out.hidden = false;
      }
    });
  }

  /* Formulaire contact multi-étapes */
  const contactForm = document.getElementById("contact-multistep");
  if (contactForm) {
    const steps = contactForm.querySelectorAll(".form-step");
    const progress = contactForm.querySelector(".form-progress-bar");
    let step = 0;

    function showStep(n) {
      step = Math.max(0, Math.min(n, steps.length - 1));
      steps.forEach((s, i) => s.classList.toggle("is-active", i === step));
      if (progress) progress.style.width = `${((step + 1) / steps.length) * 100}%`;
      contactForm.querySelector("[data-prev]")?.toggleAttribute("hidden", step === 0);
      contactForm.querySelector("[data-next]")?.toggleAttribute("hidden", step === steps.length - 1);
      contactForm.querySelector("[data-submit]")?.toggleAttribute("hidden", step !== steps.length - 1);
    }

    contactForm.querySelector("[data-next]")?.addEventListener("click", () => showStep(step + 1));
    contactForm.querySelector("[data-prev]")?.addEventListener("click", () => showStep(step - 1));
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = contactForm.querySelector(".form-success");
      if (ok) {
        ok.hidden = false;
        contactForm.querySelector(".form-steps-wrap")?.setAttribute("hidden", "");
      }
    });
    showStep(0);
  }

  /* Parallax léger hero */
  const hero = document.querySelector(".hero-parallax");
  if (hero && !reducedMotion) {
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY * 0.18;
        hero.style.transform = `translateY(${y}px)`;
      },
      { passive: true }
    );
  }

  /* Hero vidéo — poster Unsplash si MP4 absent */
  const heroVideo = document.querySelector(".hero-video-wrap video");
  if (heroVideo && cfg.images?.hero) {
    heroVideo.addEventListener("error", () => {
      heroVideo.style.display = "none";
    });
    const poster = heroVideo.getAttribute("poster");
    if (poster && poster.includes("assets/hero-poster")) {
      heroVideo.setAttribute("poster", cfg.images.hero);
    }
  }
})();
