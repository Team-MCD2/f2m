"use client";

import Link from "next/link";
import { useClerk, useSignIn } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  const { signOut } = useClerk();

  const initialRole = (searchParams.get("role") as UserRole) || "admin";
  const initialToken = searchParams.get("token") ?? "";

  const [role, setRole] = useState<UserRole>(
    roles.some((r) => r.id === initialRole) ? initialRole : "admin"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(initialToken);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInResource) return;

    setError("");
    setLoading(true);

    try {
      if (role === "candidat") {
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
        return;
      }

      const createResult = await signInResource.create({
        identifier: email.trim(),
        password,
      });
      if (createResult.error) throw new Error(createResult.error.message);

      if (signInResource.status !== "complete") {
        const pwdResult = await signInResource.password({ password });
        if (pwdResult.error) throw new Error(pwdResult.error.message);
      }

      if (signInResource.status !== "complete") {
        throw new Error("Identifiants incorrects ou étape supplémentaire requise.");
      }

      const finalized = await signInResource.finalize();
      if (finalized.error) throw new Error(finalized.error.message);

      const meRes = await fetch("/api/me");
      const me = await meRes.json();
      if (!meRes.ok) throw new Error(me.error ?? "Profil introuvable.");

      if (me.role !== role) {
        await signOut();
        throw new Error(
          `Ce compte n'est pas un compte « ${role} ». Vérifiez les métadonnées Clerk (publicMetadata.role).`
        );
      }

      router.push(me.redirect);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Connexion impossible.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg">
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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-f2m-navy">
            {roles.find((r) => r.id === role)?.label}
          </CardTitle>
          <p className="text-sm text-slate-600">
            {roles.find((r) => r.id === role)?.description}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {(role === "admin" || role === "partenaire") && (
              <>
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                    E-mail
                  </label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                    Mot de passe
                  </label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {role === "candidat" && (
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
                  Identifiant reçu après dépôt du dossier.{" "}
                  <Link href="/deposer-dossier" className="text-f2m-blue hover:underline">
                    Première demande ?
                  </Link>
                </p>
              </div>
            )}

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

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href="/" className="text-f2m-blue hover:underline">
          Retour à l&apos;accueil
        </Link>
      </p>
    </div>
  );
}
