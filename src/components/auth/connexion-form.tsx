"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { UserRole } from "@/lib/auth";
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
    setError("");
    setLoading(true);

    try {
      const payload: Record<string, string> = { role };
      if (role === "admin" || role === "partenaire") {
        payload.email = email;
        payload.password = password;
      } else {
        payload.token = token;
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Connexion impossible.");
        return;
      }

      router.push(data.redirect);
      router.refresh();
    } catch {
      setError("Erreur réseau. Réessayez.");
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
            {role === "admin" && (
              <>
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                    E-mail
                  </label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="dev@microdidact.com"
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
                  placeholder="jean-dupont"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                />
                <p className="mt-2 text-xs text-slate-500">
                  L&apos;identifiant figure dans le lien reçu par e-mail (ex.{" "}
                  <code className="rounded bg-slate-100 px-1">/candidat/jean-dupont</code>
                  ).
                </p>
              </div>
            )}

            {role === "partenaire" && (
              <>
                <div>
                  <label htmlFor="part-email" className="mb-1 block text-sm font-medium text-slate-700">
                    E-mail du centre
                  </label>
                  <Input
                    id="part-email"
                    type="email"
                    autoComplete="email"
                    placeholder="contact@cf-marseille-sud.fr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="part-password" className="mb-1 block text-sm font-medium text-slate-700">
                    Mot de passe
                  </label>
                  <Input
                    id="part-password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
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
