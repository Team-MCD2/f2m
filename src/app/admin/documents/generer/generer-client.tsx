"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/layout/admin-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DOCUMENT_TEMPLATES } from "@/data/document-templates";
import { openDocumentPrint } from "@/lib/documents";
import { useCandidats } from "@/lib/store";
import type { DocumentType } from "@/types";
import { DOCUMENT_LABELS, PARCOURS_LABELS } from "@/types";
import { fullName } from "@/lib/utils";
import { FileCheck, Eye } from "lucide-react";

const DOC_TYPES = Object.keys(DOCUMENT_LABELS) as DocumentType[];

export function GenererDocumentClient() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") || "";
  const initialCandidat = searchParams.get("candidat") || "";

  const { candidats } = useCandidats();
  const [candidatId, setCandidatId] = useState(initialCandidat);
  const [docType, setDocType] = useState(
    DOC_TYPES.includes(initialType as DocumentType)
      ? (initialType as DocumentType)
      : ""
  );
  const [message, setMessage] = useState<string | null>(null);

  const candidat = candidats.find((c) => c.id === candidatId);
  const template = DOCUMENT_TEMPLATES.find((t) => t.id === docType);

  const handlePreview = () => {
    if (!candidat || !docType) return;
    openDocumentPrint(candidat, docType as DocumentType);
  };

  const handleGenerate = async () => {
    if (!candidat || !docType) return;
    const res = await fetch(`/api/candidats/${candidat.id}/documents/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: docType }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Génération impossible");
    if (data.fichier?.url) window.open(data.fichier.url, "_blank");
    setMessage(
      `« ${DOCUMENT_LABELS[docType as DocumentType]} » généré en brouillon pour ${fullName(candidat.nom, candidat.prenom)}. Envoyez-le depuis la fiche candidat.`
    );
  };

  return (
    <>
      <AdminPageHeader
        title="Génération de documents"
        description="Sélectionnez un candidat et un modèle — le document se pré-remplit automatiquement (priorité métier F2M)."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">1. Candidat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <select
              value={candidatId}
              onChange={(e) => {
                setCandidatId(e.target.value);
                setMessage(null);
              }}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
            >
              <option value="">— Choisir un candidat —</option>
              {candidats.map((c) => (
                <option key={c.id} value={c.id}>
                  {fullName(c.nom, c.prenom)} — {PARCOURS_LABELS[c.parcours]}
                </option>
              ))}
            </select>

            <CardTitle className="text-base">2. Modèle</CardTitle>
            <select
              value={docType}
              onChange={(e) => {
                setDocType(e.target.value);
                setMessage(null);
              }}
              disabled={!candidatId}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm disabled:bg-slate-50"
            >
              <option value="">— Choisir un modèle actif —</option>
              {DOC_TYPES.map((t) => (
                <option key={t} value={t}>
                  {DOCUMENT_LABELS[t]}
                </option>
              ))}
            </select>
            {template && (
              <p className="text-xs text-slate-500">{template.description}</p>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                variant="outline"
                onClick={handlePreview}
                disabled={!candidat || !docType}
              >
                <Eye className="mr-2 h-4 w-4" />
                Aperçu / Imprimer
              </Button>
              <Button
                onClick={() => void handleGenerate().catch((e) => setMessage(String(e.message)))}
                disabled={!candidat || !docType}
              >
                <FileCheck className="mr-2 h-4 w-4" />
                Générer
              </Button>
            </div>

            {message && (
              <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {message}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-50">
          <CardHeader>
            <CardTitle className="text-base">Aperçu</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            {candidat && docType ? (
              <p>
                Le document HTML pré-rempli s&apos;ouvrira dans une nouvelle fenêtre
                (impression ou enregistrement en PDF via le navigateur).
              </p>
            ) : (
              <p>
                Sélectionnez un candidat et un modèle, puis cliquez sur « Aperçu »
                ou « Générer ».
              </p>
            )}
            <Link
              href="/admin/documents/templates"
              className="mt-4 inline-block text-f2m-blue hover:underline"
            >
              Voir tous les modèles →
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
