"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/layout/admin-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCandidats } from "@/lib/store";
import type { Candidat, StatutCandidat } from "@/types";
import { STATUT_COLORS, STATUT_LABELS } from "@/types";
import { formatDate, fullName } from "@/lib/utils";
import { Ban, ExternalLink, Search, Trash2, UserCheck } from "lucide-react";

export function UtilisateursPage() {
  const { candidats, loading, refresh } = useCandidats();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"tous" | "actifs" | "bannis">("tous");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = candidats;
    if (filter === "actifs") list = list.filter((c) => !c.banni);
    if (filter === "bannis") list = list.filter((c) => c.banni);
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (c) =>
        c.nom.toLowerCase().includes(q) ||
        c.prenom.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.token.toLowerCase().includes(q)
    );
  }, [candidats, filter, query]);

  const handleBan = async (c: Candidat, banni: boolean) => {
    const raison = banni
      ? prompt("Motif du bannissement (optionnel) :") ?? undefined
      : undefined;
    if (banni && raison === null) return;

    if (
      banni &&
      !confirm(
        `Bannir ${fullName(c.nom, c.prenom)} ? Il ne pourra plus se connecter.`
      )
    ) {
      return;
    }

    setBusyId(c.id);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/candidats/${c.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banni, raison }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await refresh();
      setFeedback(banni ? "Candidat banni." : "Bannissement levé.");
    } catch (e) {
      setFeedback(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (c: Candidat) => {
    if (
      !confirm(
        `Supprimer définitivement ${fullName(c.nom, c.prenom)} ?\nTous les documents et données seront effacés. Irréversible.`
      )
    ) {
      return;
    }
    const confirmText = prompt('Tapez "SUPPRIMER" pour confirmer :');
    if (confirmText !== "SUPPRIMER") return;

    setBusyId(c.id);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/candidats/${c.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await refresh();
      setFeedback("Candidat supprimé.");
    } catch (e) {
      setFeedback(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Gestion des utilisateurs"
        description="Candidats : bannir (bloquer la connexion) ou supprimer définitivement le dossier"
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-10"
            placeholder="Rechercher nom, email, identifiant…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: "tous", label: "Tous" },
              { key: "actifs", label: "Actifs" },
              { key: "bannis", label: "Bannis" },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
                filter === key
                  ? "border-f2m-navy bg-f2m-navy text-white"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <p className="mb-4 rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">{feedback}</p>
      )}

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <p className="p-8 text-center text-slate-500">Chargement…</p>
          ) : filtered.length === 0 ? (
            <p className="p-8 text-center text-slate-500">Aucun candidat trouvé.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-left">
                    <th className="px-4 py-3 font-medium">Candidat</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Statut</th>
                    <th className="px-4 py-3 font-medium">Inscription</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-b border-slate-100">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">
                          {fullName(c.nom, c.prenom)}
                        </p>
                        <p className="text-xs text-slate-500">{c.token}</p>
                        {c.banni && (
                          <Badge className="mt-1 bg-red-100 text-red-800">Banni</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{c.email}</td>
                      <td className="px-4 py-3">
                        <Badge className={STATUT_COLORS[c.statut as StatutCandidat]}>
                          {STATUT_LABELS[c.statut]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {formatDate(c.dateDemande)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap justify-end gap-2">
                          <Link href={`/admin/candidats/${c.id}`}>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="mr-1 h-3.5 w-3.5" />
                              Fiche
                            </Button>
                          </Link>
                          {c.banni ? (
                            <Button
                              variant="secondary"
                              size="sm"
                              disabled={busyId === c.id}
                              onClick={() => void handleBan(c, false)}
                            >
                              <UserCheck className="mr-1 h-3.5 w-3.5" />
                              Débannir
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-amber-300 text-amber-800 hover:bg-amber-50"
                              disabled={busyId === c.id}
                              onClick={() => void handleBan(c, true)}
                            >
                              <Ban className="mr-1 h-3.5 w-3.5" />
                              Bannir
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={busyId === c.id}
                            onClick={() => void handleDelete(c)}
                          >
                            <Trash2 className="mr-1 h-3.5 w-3.5" />
                            Supprimer
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
