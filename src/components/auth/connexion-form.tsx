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
import type { UserRole } from "@/lib/auth/roles";
import { Building2, GraduationCap, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const roles: {
  id: UserRole;
  label: string;
  description: string;
  icon: typeof Shield;
}[] = [
  {
    id: "admin",
    label: "Administration F2M",
    description: "Gestion des dossiers, documents et statistiques.",
    icon: Shield,
  },
  {
    id: "candidat",
    label: "Candidat",
    description: "Accès à votre espace personnel via votre lien.",
    icon: GraduationCap,
  },
  {
    id: "partenaire",
    label: "Partenaire",
    description: "Centre de formation — création de dossiers.",
    icon: Building2,
  },
];

export function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn: signInResource } = useSignIn();

  const initialRole = (searchParams.get("role") as UserRole) || "admin";
  const initialToken = searchParams.get("token") ?? "";

  const [role, setRole] = useState<UserRole>(
    roles.some((r) => r.id === initialRole) ? initialRole : "admin"
  );
  const [token, setToken] = useState(initialToken);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const callbackUrl = `/connexion/callback?expected=${role}`;

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
      <div className="mb-6 grid gap-2 sm:grid-cols-3">
        {roles.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setRole(id);
              setError("");
            }}
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg border p-4 text-center text-sm transition-colors",
              role === id
                ? "border-f2m-navy bg-f2m-navy text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>

      <p className="mb-4 text-center text-sm text-slate-600">
        {roles.find((r) => r.id === role)?.description}
      </p>

      {(role === "admin" || role === "partenaire") && (
        <div className="flex justify-center">
          <SignIn
            key={role}
            appearance={clerkAppearance}
            routing="hash"
            signUpUrl="/connexion"
            forceRedirectUrl={callbackUrl}
            fallbackRedirectUrl={callbackUrl}
          />
        </div>
      )}

      {role === "candidat" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-f2m-navy">Espace candidat</CardTitle>
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

              <Button type="submit" className="w-full" size="lg" disabled={loading || !signInResource}>
                {loading ? "Connexion…" : "Se connecter"}
              </Button>
            </form>

            <p className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-400">
              Authentification sécurisée par{" "}
              <span className="font-semibold text-slate-600">Clerk</span>
            </p>
          </CardContent>
        </Card>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href="/" className="text-f2m-blue hover:underline">
          Retour à l&apos;accueil
        </Link>
      </p>
    </div>
  );
}
