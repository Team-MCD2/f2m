"use client";

import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { useSignIn } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { clerkAppearance } from "@/lib/clerk-appearance";

const CALLBACK_URL = "/connexion/callback";

export function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn: signInResource } = useSignIn();

  const initialToken = searchParams.get("token") ?? "";
  const [showCandidat, setShowCandidat] = useState(Boolean(initialToken));
  const [token, setToken] = useState(initialToken);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCandidatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInResource) return;

    setError("");
    setLoading(true);

    try {
      const ticketRes = await fetch("/api/auth/candidat-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const ticketData = await ticketRes.json();
      if (!ticketRes.ok) throw new Error(ticketData.error ?? "Connexion impossible.");

      const ticketResult = await signInResource.ticket({ ticket: ticketData.ticket });
      if (ticketResult.error) throw new Error(ticketResult.error.message);

      const finalized = await signInResource.finalize();
      if (finalized.error) throw new Error(finalized.error.message);

      router.push(ticketData.redirect);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <p className="mb-4 text-center text-sm text-slate-600">
        Identifiez-vous avec votre compte. Votre espace s&apos;ouvre selon votre rôle
        (administration, partenaire ou candidat).
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

      <div className="mt-6 border-t border-slate-200 pt-4">
        {!showCandidat ? (
          <button
            type="button"
            onClick={() => setShowCandidat(true)}
            className="w-full text-center text-sm text-f2m-blue hover:underline"
          >
            Accès candidat par identifiant personnel
          </button>
        ) : (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-f2m-navy">Espace candidat</CardTitle>
              <p className="text-sm text-slate-600">
                Connexion par identifiant personnel (après dépôt de dossier).
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCandidatSubmit} className="space-y-4">
                <div>
                  <label htmlFor="token" className="mb-1 block text-sm font-medium text-slate-700">
                    Identifiant personnel
                  </label>
                  <Input
                    id="token"
                    type="text"
                    placeholder="prenom-nom"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    <Link href="/deposer-dossier" className="text-f2m-blue hover:underline">
                      Première demande ?
                    </Link>
                  </p>
                </div>

                {error && (
                  <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading || !signInResource}
                >
                  {loading ? "Connexion…" : "Se connecter"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href="/" className="text-f2m-blue hover:underline">
          Retour à l&apos;accueil
        </Link>
      </p>
    </div>
  );
}
