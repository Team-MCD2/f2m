import Link from "next/link";
import { F2M_SITE } from "@/lib/vitrine/site-config";

export function PortalCtaBand() {
  return (
    <section className="portal-cta-band" aria-labelledby="portal-cta-title">
      <div className="container portal-cta-inner">
        <div className="portal-cta-text">
          <h2 id="portal-cta-title">Candidat — dépôt &amp; suivi de dossier</h2>
          <p>
            Déposez votre première demande ou connectez-vous pour compléter votre dossier
            DGESP / VAE.
          </p>
        </div>
        <div className="portal-cta-actions">
          <Link className="btn btn-gold btn-primary-glow" href={F2M_SITE.depositUrl}>
            Déposer un dossier
          </Link>
          <Link className="btn btn-outline-light" href="/connexion">
            Connexion espace candidat
          </Link>
        </div>
      </div>
    </section>
  );
}
