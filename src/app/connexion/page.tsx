import { Suspense } from "react";
import { ConnexionForm } from "@/components/auth/connexion-form";
import { VitrineShell } from "@/components/vitrine/vitrine-shell";

export const metadata = {
  title: "Connexion — F2M Consulting",
  description: "Accédez à votre espace F2M Consulting",
};

export default function ConnexionPage() {
  return (
    <VitrineShell>
      <section className="section section-alt reveal-on-scroll">
        <div className="container portal-page reveal-on-scroll" data-reveal>
          <header className="portal-page-header">
            <h1>Connexion</h1>
            <p>Accédez à votre espace candidat, partenaire ou administrateur.</p>
          </header>
          <div className="form-steps-wrap portal-page-form">
            <Suspense fallback={<p className="portal-page-loading">Chargement…</p>}>
              <ConnexionForm />
            </Suspense>
          </div>
        </div>
      </section>
    </VitrineShell>
  );
}
