"use client";

import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { clerkAppearance } from "@/lib/clerk-appearance";

const CALLBACK_URL = "/connexion/callback";

export function ConnexionForm() {
  const searchParams = useSearchParams();
  const activated = searchParams.get("activated") === "1";
  const emailHint = searchParams.get("email");

  return (
    <div className="mx-auto w-full max-w-md">
      {activated && (
        <p className="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Compte activé. Connectez-vous avec votre email
          {emailHint ? ` (${emailHint})` : ""} et le mot de passe que vous venez de choisir.
        </p>
      )}

      <div className="flex justify-center">
        <SignIn
          appearance={clerkAppearance}
          routing="hash"
          signUpUrl="/connexion"
          forceRedirectUrl={CALLBACK_URL}
          fallbackRedirectUrl={CALLBACK_URL}
        />
      </div>

      <div className="mt-6 space-y-3 border-t border-slate-200 pt-4 text-center text-sm">
        <p className="text-slate-600">Candidat accepté ?</p>
        <Link
          href="/connexion/activation"
          className="inline-block font-medium text-f2m-blue hover:underline"
        >
          Activer mon compte (premier mot de passe)
        </Link>
        <p className="text-xs text-slate-500">
          <Link href="/deposer-dossier" className="text-f2m-blue hover:underline">
            Première demande de dossier
          </Link>
        </p>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href="/" className="text-f2m-blue hover:underline">
          Retour à l&apos;accueil
        </Link>
      </p>
    </div>
  );
}
