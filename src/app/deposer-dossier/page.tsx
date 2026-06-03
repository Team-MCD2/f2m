import Link from "next/link";
import { DeposerDossierForm } from "@/components/candidat/deposer-dossier-form";

export const metadata = {
  title: "Déposer un dossier — F2M Consulting",
};

export default function DeposerDossierPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-f2m-cream to-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-bold text-f2m-navy">
            F2M <span className="text-f2m-gold">Consulting</span>
          </Link>
          <Link href="/connexion" className="text-sm text-f2m-blue hover:underline">
            Déjà un compte ?
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold text-f2m-navy">Déposer une demande</h1>
        <p className="mb-8 text-slate-600">
          Première étape : complétez votre dossier de candidature. Vous recevrez un identifiant
          personnel pour vous reconnecter.
        </p>
        <DeposerDossierForm />
      </main>
    </div>
  );
}
