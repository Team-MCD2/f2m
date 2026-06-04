"use client";

import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { clerkAppearance } from "@/lib/clerk-appearance";

const CALLBACK_URL = "/connexion/callback";

type ConnexionMode = "existing" | "new";

export function ConnexionForm() {
  const searchParams = useSearchParams();
  const activated = searchParams.get("activated") === "1";
  const emailHint = searchParams.get("email");
  const [mode, setMode] = useState<ConnexionMode>("existing");

  return (
    <div className="mx-auto w-full max-w-md">
      {activated && (
        <p
          className="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
          role="status"
          aria-live="polite"
        >
          Compte activé. Connectez-vous avec votre email
          {emailHint ? ` (${emailHint})` : ""} et le mot de passe que vous venez de choisir.
        </p>
      )}

      <p className="mb-4 text-center text-sm text-slate-600">
        Première visite ? Déposez votre dossier. Déjà inscrit ? Connectez-vous à votre espace.
      </p>

      <div
        className="connexion-mode-tabs"
        role="tablist"
        aria-label="Type d'accès espace candidat"
      >
        <button
          type="button"
          role="tab"
          id="connexion-tab-existing"
          aria-selected={mode === "existing"}
          aria-controls="connexion-panel-existing"
          className={mode === "existing" ? "is-active" : ""}
          onClick={() => setMode("existing")}
        >
          J&apos;ai déjà un compte
        </button>
        <button
          type="button"
          role="tab"
          id="connexion-tab-new"
          aria-selected={mode === "new"}
          aria-controls="connexion-panel-new"
          className={mode === "new" ? "is-active" : ""}
          onClick={() => setMode("new")}
        >
          Nouveau dossier
        </button>
      </div>

      {mode === "existing" ? (
        <div
          id="connexion-panel-existing"
          role="tabpanel"
          aria-labelledby="connexion-tab-existing"
          className="connexion-mode-panel"
        >
          <p className="mb-4 text-center text-sm text-slate-600">
            Identifiant et mot de passe reçus après acceptation de votre dossier, ou après
            activation de compte.
          </p>
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
            <p className="text-slate-600">Candidat accepté, pas encore de mot de passe ?</p>
            <Link
              href="/connexion/activation"
              className="inline-block font-medium text-f2m-blue hover:underline"
            >
              Activer mon compte (premier mot de passe)
            </Link>
          </div>
        </div>
      ) : (
        <div
          id="connexion-panel-new"
          role="tabpanel"
          aria-labelledby="connexion-tab-new"
          className="connexion-mode-panel connexion-mode-panel--new"
        >
          <p className="text-center text-sm text-slate-600">
            Vous n&apos;avez pas encore de compte : commencez par déposer votre première demande
            (DGESP, VAE ou financement). Notre équipe vous recontactera.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/deposer-dossier"
              className="btn btn-gold w-full text-center"
              style={{ display: "block" }}
            >
              Déposer un dossier en ligne
            </Link>
            <p className="text-center text-xs text-slate-500">
              Déjà un compte ?{" "}
              <button
                type="button"
                className="font-medium text-f2m-blue hover:underline"
                onClick={() => setMode("existing")}
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href="/" className="text-f2m-blue hover:underline">
          Retour à l&apos;accueil
        </Link>
      </p>
    </div>
  );
}
