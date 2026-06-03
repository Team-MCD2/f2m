"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/layout/admin-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PARCOURS_LABELS, type ParcoursType } from "@/types";
import { Save, Video } from "lucide-react";

interface LienRow {
  parcours: ParcoursType;
  label: string;
  teamsUrl: string;
  elearningUrl: string;
}

const ALL_PARCOURS = Object.keys(PARCOURS_LABELS) as ParcoursType[];

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

  const save = async (parcours: ParcoursType) => {
    const row = rows.find((r) => r.parcours === parcours);
    if (!row) return;

    setSaving(parcours);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/reunions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcours,
          teamsUrl: row.teamsUrl.trim(),
          elearningUrl: row.elearningUrl.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      setFeedback(`Liens enregistrés pour ${PARCOURS_LABELS[parcours]}.`);
    } catch (e) {
      setFeedback(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSaving(null);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Espace réunion"
        description="Un lien Teams (et e-learning) par formation — partagé par tous les candidats du même parcours"
      />

      {feedback && (
        <p className="mb-4 rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">{feedback}</p>
      )}

      {loading ? (
        <p className="text-slate-500">Chargement…</p>
      ) : (
        <div className="space-y-4">
          {rows.map((row) => (
            <Card key={row.parcours}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-f2m-navy">
                  <Video className="h-4 w-4" />
                  {row.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Lien Teams</label>
                  <Input
                    value={row.teamsUrl}
                    onChange={(e) => updateRow(row.parcours, "teamsUrl", e.target.value)}
                    placeholder="https://teams.microsoft.com/..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Plateforme e-learning</label>
                  <Input
                    value={row.elearningUrl}
                    onChange={(e) => updateRow(row.parcours, "elearningUrl", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <Button
                  variant="secondary"
                  disabled={saving === row.parcours}
                  onClick={() => void save(row.parcours)}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving === row.parcours ? "Enregistrement…" : "Enregistrer"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
