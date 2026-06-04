"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/vitrine/brand-logo";
import {
  F2M_SITE,
  VITRINE_NAV,
  isNavGroup,
  type VitrineNavItem,
  type VitrineNavLink,
} from "@/lib/vitrine/site-config";

function navItemActive(pathname: string, item: VitrineNavItem): boolean {
  if (isNavGroup(item)) {
    return item.children.some((child) => linkActive(pathname, child.href));
  }
  return linkActive(pathname, item.href);
}

function linkActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  const renderLink = (link: VitrineNavLink, inDropdown = false) => (
    <Link
      href={link.href}
      className={[
        linkActive(pathname, link.href) ? "is-active" : "",
        link.highlight ? "nav-highlight" : "",
        inDropdown ? "nav-dropdown-link" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => setOpen(false)}
    >
      {link.label}
    </Link>
  );

  return (
    <>
      <header className="site-header" role="banner">
        <div className="header-inner container">
          <Link className="logo" href="/" aria-label={`${F2M_SITE.name} — Accueil`}>
            <BrandLogo height={44} priority />
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
              {VITRINE_NAV.map((item) => {
                if (isNavGroup(item)) {
                  const active = navItemActive(pathname, item);
                  return (
                    <li key={item.label} className="nav-item nav-item--dropdown">
                      <details className="nav-dropdown">
                        <summary
                          className={`nav-dropdown-trigger${active ? " is-active" : ""}`}
                        >
                          {item.label}
                        </summary>
                        <ul className="nav-dropdown-menu">
                          {item.children.map((child) => (
                            <li key={child.href}>{renderLink(child, true)}</li>
                          ))}
                        </ul>
                      </details>
                    </li>
                  );
                }
                return (
                  <li key={item.href} className="nav-item">
                    {renderLink(item)}
                  </li>
                );
              })}
            </ul>
            <Link className="btn btn-gold btn-sm nav-cta" href="/contact" onClick={() => setOpen(false)}>
              Contact
            </Link>
            <a className="btn btn-outline-light btn-sm nav-tel" href={`tel:${F2M_SITE.phoneTel}`}>
              {F2M_SITE.phone}
            </a>
          </nav>
        </div>
      </header>
      <a href={`tel:${F2M_SITE.phoneTel}`} className="sticky-cta" aria-label="Appeler F2M Consulting">
        <span className="sticky-cta-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z"
              fill="currentColor"
            />
          </svg>
        </span>
        <span>Appeler</span>
      </a>
    </>
  );
}


