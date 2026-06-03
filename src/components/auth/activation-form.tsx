"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function ActivationForm() {
  const router = useRouter();
  const [step, setStep] = useState<"lookup" | "password">("lookup");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [candidatLabel, setCandidatLabel] = useState("");

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/candidat-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim() || undefined,
          token: token.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");

      if (!data.found) {
        setError("Aucun dossier trouvé avec ces informations.");
        return;
      }
      if (data.error) {
        setError(data.error);
        return;
      }
      if (!data.canActivate) {
        setInfo(data.message ?? "Dossier pas encore accepté.");
        return;
      }

      setCandidatLabel(`${data.prenom} ${data.nom}`);
      if (data.motDePasseDefini) {
        setInfo("Compte déjà activé. Connectez-vous avec votre email et mot de passe.");
        return;
      }

      setStep("password");
      setInfo(`Bienvenue ${data.prenom}. Choisissez votre mot de passe.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/candidat-set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim() || undefined,
          token: token.trim() || undefined,
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");

      router.push(`/connexion?activated=1&email=${encodeURIComponent(email.trim())}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-f2m-navy">Activation compte candidat</CardTitle>
        <p className="text-sm text-slate-600">
          Réservé aux candidats <strong>acceptés</strong>. Utilisez votre email ou votre
          identifiant de dossier (ex. prenom-nom).
        </p>
      </CardHeader>
      <CardContent>
        {step === "lookup" ? (
          <form onSubmit={lookup} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
              />
            </div>
            <p className="text-center text-xs text-slate-500">ou</p>
            <div>
              <label className="mb-1 block text-sm font-medium">Identifiant dossier</label>
              <Input
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="prenom-nom"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {info && <p className="text-sm text-sky-700">{info}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Vérification…" : "Continuer"}
            </Button>
          </form>
        ) : (
          <form onSubmit={submitPassword} className="space-y-4">
            <p className="text-sm text-slate-600">{candidatLabel}</p>
            <div>
              <label className="mb-1 block text-sm font-medium">Mot de passe</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Confirmer</label>
              <Input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={8}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enregistrement…" : "Activer mon compte"}
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={() => setStep("lookup")}>
              Retour
            </Button>
          </form>
        )}
        <p className="mt-6 text-center text-sm">
          <Link href="/connexion" className="text-f2m-blue hover:underline">
            Déjà un mot de passe ? Se connecter
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
