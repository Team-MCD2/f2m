import Link from "next/link";
import { Suspense } from "react";
import { ConnexionForm } from "@/components/auth/connexion-form";

export const metadata = {
  title: "Connexion — F2M Consulting",
  description: "Accédez à votre espace F2M Consulting",
};

export default function ConnexionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-f2m-cream to-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-bold text-f2m-navy">
            F2M <span className="text-f2m-gold">Consulting</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-f2m-navy">Connexion</h1>
          <p className="mt-2 text-slate-600">
            Un seul formulaire — redirection automatique selon votre rôle.
          </p>
        </div>

        <Suspense fallback={<p className="text-center text-slate-500">Chargement…</p>}>
          <ConnexionForm />
        </Suspense>
      </main>
    </div>
  );
}
