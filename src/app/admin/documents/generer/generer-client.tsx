"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/layout/admin-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DOCUMENT_TEMPLATES } from "@/data/document-templates";
import { openDocumentPrint } from "@/lib/documents";
import { useCandidats } from "@/lib/store";
import type { DocumentType } from "@/types";
import { DOCUMENT_LABELS, PARCOURS_LABELS } from "@/types";
import { fullName } from "@/lib/utils";
import { FileCheck, Eye, Loader2, Search } from "lucide-react";

const DOC_TYPES = Object.keys(DOCUMENT_LABELS) as DocumentType[];

type GenerateResult = {
  candidatId: string;
  candidatName: string;
  type: DocumentType;
  ok: boolean;
  error?: string;
};

export function GenererDocumentClient() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") || "";
  const initialCandidat = searchParams.get("candidat") || "";

  const { candidats } = useCandidats();
  const [selectedCandidatIds, setSelectedCandidatIds] = useState<Set<string>>(() => {
    const s = new Set<string>();
    if (initialCandidat) s.add(initialCandidat);
    return s;
  });
  const [selectedTypes, setSelectedTypes] = useState<Set<DocumentType>>(() => {
    const s = new Set<DocumentType>();
    if (DOC_TYPES.includes(initialType as DocumentType)) {
      s.add(initialType as DocumentType);
    }
    return s;
  });
  const [candidatSearch, setCandidatSearch] = useState("");
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<GenerateResult[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const filteredCandidats = useMemo(() => {
    const q = candidatSearch.trim().toLowerCase();
    if (!q) return candidats;
    return candidats.filter((c) =>
      fullName(c.nom, c.prenom).toLowerCase().includes(q)
    );
  }, [candidats, candidatSearch]);

  const previewCandidat = candidats.find((c) => selectedCandidatIds.has(c.id));
  const previewType = selectedTypes.size > 0 ? Array.from(selectedTypes)[0] : null;
  const previewTemplate = previewType
    ? DOCUMENT_TEMPLATES.find((t) => t.id === previewType)
    : undefined;

  const toggleCandidat = (id: string) => {
    setSelectedCandidatIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setMessage(null);
    setResults(null);
  };

  const toggleType = (type: DocumentType) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
    setMessage(null);
    setResults(null);
  };

  const selectAllCandidats = () => {
    setSelectedCandidatIds(new Set(filteredCandidats.map((c) => c.id)));
    setResults(null);
  };

  const clearCandidats = () => {
    setSelectedCandidatIds(new Set());
    setResults(null);
  };

  const selectAllTypes = () => {
    setSelectedTypes(new Set(DOC_TYPES));
    setResults(null);
  };

  const clearTypes = () => {
    setSelectedTypes(new Set());
    setResults(null);
  };

  const handlePreview = () => {
    if (!previewCandidat || !previewType) return;
    openDocumentPrint(previewCandidat, previewType);
  };

  const handleGenerate = async () => {
    if (selectedCandidatIds.size === 0 || selectedTypes.size === 0) return;

    setGenerating(true);
    setMessage(null);
    setResults(null);

    const batch: GenerateResult[] = [];
    const candidatList = candidats.filter((c) => selectedCandidatIds.has(c.id));
    const types = Array.from(selectedTypes);

    for (const candidat of candidatList) {
      for (const type of types) {
        try {
          const res = await fetch(`/api/candidats/${candidat.id}/documents/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error ?? "Génération impossible");
          batch.push({
            candidatId: candidat.id,
            candidatName: fullName(candidat.nom, candidat.prenom),
            type,
            ok: true,
          });
        } catch (e) {
          batch.push({
            candidatId: candidat.id,
            candidatName: fullName(candidat.nom, candidat.prenom),
            type,
            ok: false,
            error: e instanceof Error ? e.message : "Erreur",
          });
        }
      }
    }

    const okCount = batch.filter((r) => r.ok).length;
    const errCount = batch.length - okCount;
    setResults(batch);
    setMessage(
      errCount === 0
        ? `${okCount} document${okCount > 1 ? "s" : ""} généré${okCount > 1 ? "s" : ""} en brouillon. Envoyez-les depuis « Docs générés ».`
        : `${okCount} réussi${okCount > 1 ? "s" : ""}, ${errCount} échec${errCount > 1 ? "s" : ""}. Consultez le détail ci-dessous.`
    );
    setGenerating(false);
  };

  const comboCount = selectedCandidatIds.size * selectedTypes.size;

  return (
    <>
      <AdminPageHeader
        title="Génération de documents"
        description="Sélectionnez un ou plusieurs candidats et un ou plusieurs modèles. Les documents restent en brouillon jusqu'à envoi depuis « Docs générés »."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">
                  1. Candidats ({selectedCandidatIds.size} sélectionné
                  {selectedCandidatIds.size > 1 ? "s" : ""})
                </CardTitle>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={selectAllCandidats}>
                    Tout
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={clearCandidats}>
                    Aucun
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Rechercher un candidat…"
                  value={candidatSearch}
                  onChange={(e) => setCandidatSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <ul className="max-h-56 space-y-1 overflow-y-auto rounded-lg border border-slate-200 p-2">
                {filteredCandidats.length === 0 ? (
                  <li className="px-2 py-4 text-center text-sm text-slate-500">
                    Aucun candidat trouvé.
                  </li>
                ) : (
                  filteredCandidats.map((c) => (
                    <li key={c.id}>
                      <label className="flex cursor-pointer items-start gap-3 rounded-md px-2 py-2 hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={selectedCandidatIds.has(c.id)}
                          onChange={() => toggleCandidat(c.id)}
                          className="mt-0.5 h-4 w-4 rounded border-slate-300"
                        />
                        <span className="min-w-0 text-sm">
                          <span className="font-medium text-slate-900">
                            {fullName(c.nom, c.prenom)}
                          </span>
                          <span className="text-slate-500">
                            {" "}
                            — {PARCOURS_LABELS[c.parcours]}
                          </span>
                        </span>
                      </label>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">
                  2. Modèles ({selectedTypes.size} sélectionné
                  {selectedTypes.size > 1 ? "s" : ""})
                </CardTitle>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={selectAllTypes}>
                    Tout
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={clearTypes}>
                    Aucun
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2">
                {DOC_TYPES.map((type) => {
                  const tpl = DOCUMENT_TEMPLATES.find((t) => t.id === type);
                  return (
                    <label
                      key={type}
                      className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTypes.has(type)}
                        onChange={() => toggleType(type)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300"
                      />
                      <span className="min-w-0 text-sm">
                        <span className="font-medium text-slate-900">
                          {DOCUMENT_LABELS[type]}
                        </span>
                        {tpl?.description && (
                          <span className="mt-0.5 block text-xs text-slate-500">
                            {tpl.description}
                          </span>
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={handlePreview}
              disabled={!previewCandidat || !previewType || generating}
            >
              <Eye className="mr-2 h-4 w-4" />
              Aperçu (1er couple)
            </Button>
            <Button
              onClick={() => void handleGenerate()}
              disabled={
                generating || selectedCandidatIds.size === 0 || selectedTypes.size === 0
              }
            >
              {generating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileCheck className="mr-2 h-4 w-4" />
              )}
              Générer la sélection ({comboCount})
            </Button>
          </div>

          {message && (
            <p
              className={`rounded-lg border px-4 py-3 text-sm ${
                results?.some((r) => !r.ok)
                  ? "border-amber-200 bg-amber-50 text-amber-900"
                  : "border-emerald-200 bg-emerald-50 text-emerald-800"
              }`}
            >
              {message}
            </p>
          )}

          {results && results.some((r) => !r.ok) && (
            <ul className="space-y-1 rounded-lg border border-red-100 bg-red-50/50 p-3 text-sm">
              {results
                .filter((r) => !r.ok)
                .map((r, i) => (
                  <li key={i} className="text-red-800">
                    {r.candidatName} — {DOCUMENT_LABELS[r.type]} : {r.error}
                  </li>
                ))}
            </ul>
          )}
        </div>

        <Card className="bg-slate-50">
          <CardHeader>
            <CardTitle className="text-base">Récapitulatif</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <p>
              {comboCount > 0 ? (
                <>
                  <strong>{comboCount}</strong> document{comboCount > 1 ? "s" : ""} seront
                  généré{comboCount > 1 ? "s" : ""} en brouillon (
                  {selectedCandidatIds.size} candidat
                  {selectedCandidatIds.size > 1 ? "s" : ""} × {selectedTypes.size} modèle
                  {selectedTypes.size > 1 ? "s" : ""}).
                </>
              ) : (
                "Sélectionnez au moins un candidat et un modèle."
              )}
            </p>
            {previewCandidat && previewType && previewTemplate && (
              <p>
                Aperçu : « {DOCUMENT_LABELS[previewType]} » pour{" "}
                {fullName(previewCandidat.nom, previewCandidat.prenom)}.
              </p>
            )}
            <p className="rounded-md border border-amber-200 bg-amber-50/80 px-3 py-2 text-amber-900">
              Les documents générés restent en <strong>brouillon</strong>. Allez dans{" "}
              <Link href="/admin/documents/generes" className="font-medium text-f2m-blue hover:underline">
                Docs générés
              </Link>{" "}
              pour les envoyer aux candidats.
            </p>
            <Link
              href="/admin/documents/templates"
              className="inline-block text-f2m-blue hover:underline"
            >
              Voir tous les modèles →
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
