"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/layout/admin-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { STATUT_LABELS, type StatutCandidat } from "@/types";
import { Mail, Send } from "lucide-react";

interface RelanceCandidat {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  statut: StatutCandidat;
  statutLabel: string;
}

const FILTERS: { key: StatutCandidat; label: string }[] = [
  { key: "demande", label: "En cours" },
  { key: "accepte", label: "Acceptées" },
  { key: "refuse", label: "Refusées" },
];

export function RelancesPage() {
  const [selectedStatuts, setSelectedStatuts] = useState<StatutCandidat[]>([
    "demande",
    "accepte",
    "refuse",
  ]);
  const [candidats, setCandidats] = useState<RelanceCandidat[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = selectedStatuts.join(",");
      const res = await fetch(`/api/admin/relances?statuts=${q}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCandidats(data);
      setSelectedIds(new Set());
    } catch (e) {
      setFeedback(e instanceof Error ? e.message : "Erreur chargement");
    } finally {
      setLoading(false);
    }
  }, [selectedStatuts]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleStatut = (s: StatutCandidat) => {
    setSelectedStatuts((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const toggleCandidat = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(candidats.map((c) => c.id)));
  };

  const send = async () => {
    if (selectedIds.size === 0) {
      setFeedback("Sélectionnez au moins un candidat.");
      return;
    }
    if (!message.trim()) {
      setFeedback("Saisissez un message de relance.");
      return;
    }

    setSending(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/relances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidatIds: Array.from(selectedIds),
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const results = data.results as {
        ok: boolean;
        email?: boolean;
        error?: string;
        emailTo?: string;
      }[];
      const emailsSent = data.emailsSent ?? 0;
      const emailsSkipped = data.emailsSkipped ?? 0;
      const emailsFailed = data.emailsFailed ?? 0;

      let msg = `Relance enregistrée pour ${selectedIds.size} candidat(s) (notification dans son espace).`;
      if (emailsSent > 0) {
        msg += ` ${emailsSent} email(s) envoyé(s).`;
      } else if (emailsSkipped > 0 || !data.emailConfigured) {
        msg +=
          " Aucun email : ajoutez EMAIL_USER et EMAIL_PASS dans .env.local puis redémarrez le serveur.";
      }
      if (emailsFailed > 0) {
        const detail = data.firstError ? ` Détail : ${data.firstError}` : "";
        msg += ` ${emailsFailed} email(s) en échec.${detail}`;
      }
      setFeedback(msg);
      setMessage("");
      setSelectedIds(new Set());
    } catch (e) {
      setFeedback(e instanceof Error ? e.message : "Erreur envoi");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Relances"
        description="Sélectionnez des candidats et envoyez un message (document manquant, problème d'affichage, etc.)"
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Filtrer par statut</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleStatut(key)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                selectedStatuts.includes(key)
                  ? "border-f2m-navy bg-f2m-navy text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {label}
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Candidats ({candidats.length})</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={selectAll}>
              Tout sélectionner
            </Button>
          </CardHeader>
          <CardContent className="max-h-[420px] overflow-y-auto">
            {loading ? (
              <p className="text-sm text-slate-500">Chargement…</p>
            ) : candidats.length === 0 ? (
              <p className="text-sm text-slate-500">Aucun candidat pour ces filtres.</p>
            ) : (
              <ul className="space-y-2">
                {candidats.map((c) => (
                  <li key={c.id}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-100 p-3 hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(c.id)}
                        onChange={() => toggleCandidat(c.id)}
                        className="mt-1"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {c.prenom} {c.nom}
                        </p>
                        <p className="text-xs text-slate-500">{c.email}</p>
                        <p className="text-xs text-f2m-navy">{STATUT_LABELS[c.statut]}</p>
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Message de relance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={10}
              placeholder="Ex. : Il manque votre carte Vitale. Merci de la déposer dans Mes documents ou de nous l'envoyer par email…"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-f2m-navy focus:outline-none focus:ring-1 focus:ring-f2m-navy"
            />
            <p className="text-xs text-slate-500">
              Le candidat reçoit un email et une notification dans son espace (sans recharger la
              page). Vous pouvez corriger le dossier manuellement côté admin si besoin.
            </p>
            <Button
              className="w-full"
              disabled={sending}
              onClick={() => void send()}
            >
              <Send className="mr-2 h-4 w-4" />
              {sending
                ? "Envoi…"
                : `Envoyer à ${selectedIds.size} candidat${selectedIds.size !== 1 ? "s" : ""}`}
            </Button>
            {feedback && (
              <p className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">{feedback}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
