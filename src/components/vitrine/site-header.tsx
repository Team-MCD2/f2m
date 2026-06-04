"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { F2M_SITE, VITRINE_NAV } from "@/lib/vitrine/site-config";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="site-header" role="banner">
        <div className="header-inner container">
          <Link className="logo" href="/" aria-label={`${F2M_SITE.name} — Accueil`}>
            <span className="logo-mark">F2M</span>
            <span className="logo-text">Consulting</span>
          </Link>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="main-nav"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
          <nav
            id="main-nav"
            className={`main-nav${open ? " is-open" : ""}`}
            aria-label="Navigation principale"
          >
            <ul className="nav-list">
              {VITRINE_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`${isActive(item.href) ? "is-active" : ""}${"highlight" in item && item.highlight ? " nav-highlight" : ""}`}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link className="btn btn-gold btn-sm nav-cta" href="/contact" onClick={() => setOpen(false)}>
              Contact
            </Link>
            <a className="btn btn-outline btn-sm" href={`tel:${F2M_SITE.phoneTel}`}>
              {F2M_SITE.phone}
            </a>
          </nav>
        </div>
      </header>
      <a href={`tel:${F2M_SITE.phoneTel}`} className="sticky-cta" aria-label="Appeler F2M Consulting">
        <span className="sticky-cta-icon" aria-hidden="true">
          📞
        </span>
        <span>Appeler</span>
      </a>
    </>
  );
}
