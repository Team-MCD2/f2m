"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/layout/admin-nav";
import { DocumentsPanel } from "@/components/documents/documents-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCandidats } from "@/lib/store";
import type { DocumentFichier } from "@/types";
import { PARCOURS_LABELS, STATUT_LABELS } from "@/types";
import { cn, fullName } from "@/lib/utils";
import { Search, Sparkles, User } from "lucide-react";

export function DocsGeneresClient() {
  const { candidats } = useCandidats();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panelKey, setPanelKey] = useState(0);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = [...candidats].sort((a, b) =>
      fullName(a.nom, a.prenom).localeCompare(fullName(b.nom, b.prenom), "fr")
    );
    if (!q) return list;
    return list.filter(
      (c) =>
        fullName(c.nom, c.prenom).toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [candidats, search]);

  const selected = candidats.find((c) => c.id === selectedId);

  const handleRegenerate = async (doc: DocumentFichier) => {
    if (
      !confirm(
        `Régénérer « ${doc.nomFichier} » ? L'ancienne version sera remplacée (nouveau brouillon).`
      )
    ) {
      return;
    }
    const res = await fetch(
      `/api/candidats/${doc.candidatId}/documents/regenerate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fichierId: doc.id }),
      }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Régénération impossible");
    setPanelKey((k) => k + 1);
  };

  return (
    <>
      <AdminPageHeader
        title="Docs générés"
        description="Consultez les documents générés par candidat, envoyez les brouillons ou régénérez un modèle."
      >
        <Link href="/admin/documents/generer">
          <Button variant="outline" size="sm">
            <Sparkles className="mr-2 h-4 w-4" />
            Générer des documents
          </Button>
        </Link>
      </AdminPageHeader>

      <div className="grid gap-6 lg:grid-cols-[minmax(240px,320px)_1fr]">
        <Card className="h-fit lg:sticky lg:top-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Candidats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Rechercher par nom…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <ul className="max-h-[min(60vh,520px)] space-y-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <li className="py-6 text-center text-sm text-slate-500">
                  Aucun candidat trouvé.
                </li>
              ) : (
                filtered.map((c) => {
                  const active = c.id === selectedId;
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(c.id)}
                        className={cn(
                          "flex w-full items-start gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                          active
                            ? "bg-slate-900 text-white"
                            : "text-slate-700 hover:bg-slate-100"
                        )}
                      >
                        <User
                          className={cn(
                            "mt-0.5 h-4 w-4 shrink-0",
                            active ? "text-white/80" : "text-slate-400"
                          )}
                        />
                        <span className="min-w-0">
                          <span className="block font-medium truncate">
                            {fullName(c.nom, c.prenom)}
                          </span>
                          <span
                            className={cn(
                              "block truncate text-xs",
                              active ? "text-white/70" : "text-slate-500"
                            )}
                          >
                            {PARCOURS_LABELS[c.parcours]} · {STATUT_LABELS[c.statut]}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </CardContent>
        </Card>

        <div>
          {!selected ? (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center text-sm text-slate-500">
                Sélectionnez un candidat pour voir ses documents générés et gérer les
                brouillons.
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {fullName(selected.nom, selected.prenom)}
                </CardTitle>
                <p className="text-sm font-normal text-slate-500">
                  {selected.email} · {PARCOURS_LABELS[selected.parcours]}
                </p>
              </CardHeader>
              <CardContent>
                <DocumentsPanel
                  key={`${selected.id}-${panelKey}`}
                  candidatId={selected.id}
                  canUpload={false}
                  adminMode
                  showSource
                  title="Documents du candidat"
                  onRegenerate={handleRegenerate}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
