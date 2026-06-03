"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/layout/admin-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PARCOURS_LABELS, type ParcoursType } from "@/types";
import { Check, Info, Save, Trash2 } from "lucide-react";

interface LienRow {
  parcours: ParcoursType;
  label: string;
  teamsUrl: string;
  elearningUrl: string;
}

const ALL_PARCOURS = Object.keys(PARCOURS_LABELS) as ParcoursType[];

type ClearTarget = "teams" | "elearning" | "all";

export function ReunionsPage() {
  const [rows, setRows] = useState<LienRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<ParcoursType | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reunions");
      const data = (await res.json()) as LienRow[];
      if (!res.ok) throw new Error("Chargement impossible");

      const byParcours = new Map(data.map((r) => [r.parcours, r]));
      setRows(
        ALL_PARCOURS.map((p) => {
          const existing = byParcours.get(p);
          return {
            parcours: p,
            label: PARCOURS_LABELS[p],
            teamsUrl: existing?.teamsUrl ?? "",
            elearningUrl: existing?.elearningUrl ?? "",
          };
        })
      );
    } catch {
      setFeedback("Erreur de chargement des liens.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const updateRow = (parcours: ParcoursType, field: "teamsUrl" | "elearningUrl", value: string) => {
    setRows((prev) =>
      prev.map((r) => (r.parcours === parcours ? { ...r, [field]: value } : r))
    );
  };

  const persist = async (
    parcours: ParcoursType,
    teamsUrl: string,
    elearningUrl: string,
    successMsg: string
  ) => {
    setSaving(parcours);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/reunions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcours,
          teamsUrl: teamsUrl.trim(),
          elearningUrl: elearningUrl.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");

      setRows((prev) =>
        prev.map((r) =>
          r.parcours === parcours
            ? {
                ...r,
                teamsUrl: teamsUrl.trim(),
                elearningUrl: elearningUrl.trim(),
              }
            : r
        )
      );
      setFeedback(successMsg);
    } catch (e) {
      setFeedback(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSaving(null);
    }
  };

  const save = (parcours: ParcoursType) => {
    const row = rows.find((r) => r.parcours === parcours);
    if (!row) return;
    void persist(
      parcours,
      row.teamsUrl,
      row.elearningUrl,
      `Liens enregistrés — ${PARCOURS_LABELS[parcours]}.`
    );
  };

  const clear = (parcours: ParcoursType, target: ClearTarget) => {
    const row = rows.find((r) => r.parcours === parcours);
    if (!row) return;

    const label = PARCOURS_LABELS[parcours];
    let teamsUrl = row.teamsUrl;
    let elearningUrl = row.elearningUrl;
    let msg = "";

    if (target === "teams" || target === "all") teamsUrl = "";
    if (target === "elearning" || target === "all") elearningUrl = "";

    if (target === "teams") msg = `Lien Teams supprimé — ${label}.`;
    else if (target === "elearning") msg = `Lien e-learning supprimé — ${label}.`;
    else msg = `Tous les liens supprimés — ${label}.`;

    void persist(parcours, teamsUrl, elearningUrl, msg);
  };

  const hasLink = (row: LienRow) => Boolean(row.teamsUrl.trim() || row.elearningUrl.trim());

  return (
    <>
      <AdminPageHeader
        title="Espace réunion"
        description="Liens Teams et e-learning par formation — visibles par les candidats acceptés dans « Mes documents »"
      />

      <div className="mb-4 flex items-start gap-2 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Côté candidat (connecté, dossier accepté) : bloc <strong>Réunion &amp; formation</strong>{" "}
          au-dessus de « Mes documents ». Les boutons Teams / e-learning apparaissent dès qu&apos;au
          moins un lien est enregistré pour la formation du candidat.
        </p>
      </div>

      {feedback && (
        <p className="mb-4 rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">{feedback}</p>
      )}

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <p className="p-6 text-slate-500">Chargement…</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-left">
                    <th className="w-[140px] px-4 py-3 font-medium text-slate-700">Formation</th>
                    <th className="px-4 py-3 font-medium text-slate-700">Lien Teams</th>
                    <th className="px-4 py-3 font-medium text-slate-700">E-learning</th>
                    <th className="w-[200px] px-4 py-3 font-medium text-slate-700 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const busy = saving === row.parcours;
                    const configured = hasLink(row);
                    return (
                      <tr key={row.parcours} className="border-b border-slate-100 align-top">
                        <td className="px-4 py-3">
                          <p className="font-medium text-f2m-navy">{row.label}</p>
                          {configured ? (
                            <span className="mt-1 inline-flex items-center gap-1 text-xs text-emerald-700">
                              <Check className="h-3 w-3" />
                              Actif candidat
                            </span>
                          ) : (
                            <span className="mt-1 text-xs text-slate-400">Aucun lien</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            value={row.teamsUrl}
                            onChange={(e) =>
                              updateRow(row.parcours, "teamsUrl", e.target.value)
                            }
                            placeholder="https://teams.microsoft.com/…"
                            className="h-8 text-xs"
                            disabled={busy}
                          />
                          {row.teamsUrl.trim() && (
                            <button
                              type="button"
                              className="mt-1 text-xs text-red-600 hover:underline"
                              disabled={busy}
                              onClick={() => clear(row.parcours, "teams")}
                            >
                              Supprimer Teams
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            value={row.elearningUrl}
                            onChange={(e) =>
                              updateRow(row.parcours, "elearningUrl", e.target.value)
                            }
                            placeholder="https://…"
                            className="h-8 text-xs"
                            disabled={busy}
                          />
                          {row.elearningUrl.trim() && (
                            <button
                              type="button"
                              className="mt-1 text-xs text-red-600 hover:underline"
                              disabled={busy}
                              onClick={() => clear(row.parcours, "elearning")}
                            >
                              Supprimer e-learning
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap justify-end gap-1">
                            <Button
                              size="sm"
                              variant="secondary"
                              disabled={busy}
                              onClick={() => save(row.parcours)}
                            >
                              <Save className="mr-1 h-3.5 w-3.5" />
                              {busy ? "…" : "Enregistrer"}
                            </Button>
                            {configured && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-200 text-red-700 hover:bg-red-50"
                                disabled={busy}
                                onClick={() => {
                                  if (
                                    confirm(
                                      `Supprimer tous les liens pour « ${row.label} » ?`
                                    )
                                  ) {
                                    clear(row.parcours, "all");
                                  }
                                }}
                              >
                                <Trash2 className="mr-1 h-3.5 w-3.5" />
                                Tout
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
