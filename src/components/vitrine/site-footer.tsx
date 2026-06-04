import Link from "next/link";
import { BrandLogo } from "@/components/vitrine/brand-logo";
import {
  F2M_SITE,
  LEGAL_LINKS,
  MICRODIDACT,
} from "@/lib/vitrine/site-config";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container footer-grid">
        <div className="footer-brand">
          <BrandLogo className="footer-logo-img" height={36} />
          <p className="sr-only">{F2M_SITE.name}</p>
          <p className="footer-tagline">{F2M_SITE.tagline}</p>
          <p className="footer-keywords">{F2M_SITE.keywords}</p>
        </div>
        <div>
          <p className="footer-heading">Coordonnées</p>
          <address className="footer-address">
            {F2M_SITE.address.full}
            <br />
            <a href={`tel:${F2M_SITE.phoneTel}`}>{F2M_SITE.phone}</a>
            <br />
            <a href={`mailto:${F2M_SITE.email}`}>{F2M_SITE.email}</a>
          </address>
        </div>
        <div>
          <p className="footer-heading">Formations</p>
          <ul className="footer-links">
            <li>
              <Link href="/formation-dgesp">Formation DGESP</Link>
            </li>
            <li>
              <Link href="/vae-dgesp">VAE DGESP</Link>
            </li>
            <li>
              <Link href="/financements">Financements</Link>
            </li>
            <li>
              <Link href="/e-learning">E-learning</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="footer-heading">Liens utiles</p>
          <ul className="footer-links">
            <li>
              <Link href="/notre-centre">Notre centre</Link>
            </li>
            <li>
              <Link href="/blog">Blog &amp; ressources</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/connexion">Espace candidat</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom container">
        <ul className="footer-legal">
          {LEGAL_LINKS.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
        <p>
          © {year} {F2M_SITE.name} — Certifié Qualiopi · Titre RNCP 36654
        </p>
        <p className="footer-credits">
          <span aria-hidden="true">·</span>
          <a href={MICRODIDACT.url} target="_blank" rel="noopener noreferrer">
            {MICRODIDACT.label}
          </a>
        </p>
      </div>
    </footer>
  );
}
