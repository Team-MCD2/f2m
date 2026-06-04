import Link from "next/link";
import { DeposerDossierForm } from "@/components/candidat/deposer-dossier-form";
import { VitrineShell } from "@/components/vitrine/vitrine-shell";

export const metadata = {
  title: "Déposer un dossier — F2M Consulting",
  description: "Déposez votre candidature formation DGESP — F2M Consulting Toulouse",
};

export default function DeposerDossierPage() {
  return (
    <VitrineShell>
      <section className="section section-alt reveal-on-scroll">
        <div className="container portal-page reveal-on-scroll" data-reveal>
          <header className="portal-page-header">
            <h1>Déposer une demande</h1>
            <p>
              Première étape : complétez votre dossier de candidature. Vous recevrez un
              identifiant personnel pour vous reconnecter.
            </p>
            <p>
              <Link href="/connexion">Déjà un compte ? Connexion</Link>
            </p>
          </header>
          <DeposerDossierForm />
        </div>
      </section>
    </VitrineShell>
  );
}
