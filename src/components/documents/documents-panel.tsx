"use client";

import { useCallback, useEffect, useState } from "react";
import { DocumentDropzone } from "@/components/documents/document-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DOCUMENT_SOURCE_LABELS, type DocumentFichier } from "@/types";
import { formatDate } from "@/lib/utils";
import { ExternalLink, FileText, Image, Trash2, Upload } from "lucide-react";

interface DocumentsPanelProps {
  candidatId: string;
  canUpload?: boolean;
  canDelete?: boolean | ((doc: DocumentFichier) => boolean);
  showSource?: boolean;
  title?: string;
  /** Mise en page candidat : sections séparées, sans suppression */
  variant?: "default" | "candidat";
}

function DocIcon({ mimeType }: { mimeType: string }) {
  if (mimeType.startsWith("image/")) {
    return <Image className="h-5 w-5 shrink-0 text-sky-600" />;
  }
  return <FileText className="h-5 w-5 shrink-0 text-f2m-navy" />;
}

function DocumentRow({
  doc,
  showSource,
  mayDelete,
  onRemove,
  onError,
}: {
  doc: DocumentFichier;
  showSource: boolean;
  mayDelete: boolean;
  onRemove: (doc: DocumentFichier) => Promise<void>;
  onError: (msg: string) => void;
}) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
      <div className="flex min-w-0 items-start gap-3">
        <DocIcon mimeType={doc.mimeType} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">{doc.nomFichier}</p>
          <p className="text-xs text-slate-500">
            {formatDate(doc.createdAt.slice(0, 10))}
            {showSource && ` · ${DOCUMENT_SOURCE_LABELS[doc.source]}`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <a
          href={doc.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-f2m-blue hover:bg-slate-50"
        >
          Ouvrir
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
        {mayDelete && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => void onRemove(doc).catch((e) => onError(String(e.message)))}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </li>
  );
}

function DocumentCard({
  doc,
  showSource,
}: {
  doc: DocumentFichier;
  showSource: boolean;
}) {
  return (
    <div className="flex flex-col rounded-lg border border-slate-200 bg-slate-50/80 p-4 transition-shadow hover:shadow-sm">
      <div className="mb-3 flex items-start gap-2">
        <DocIcon mimeType={doc.mimeType} />
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-medium text-slate-900" title={doc.nomFichier}>
            {doc.nomFichier}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {formatDate(doc.createdAt.slice(0, 10))}
            {showSource && ` · ${DOCUMENT_SOURCE_LABELS[doc.source]}`}
          </p>
        </div>
      </div>
      <a
        href={doc.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-white py-2 text-sm font-medium text-f2m-blue ring-1 ring-slate-200 hover:bg-f2m-cream"
      >
        Ouvrir
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

export function DocumentsPanel({
  candidatId,
  canUpload = true,
  canDelete = true,
  showSource = true,
  title = "Mes documents",
  variant = "default",
}: DocumentsPanelProps) {
  const [docs, setDocs] = useState<DocumentFichier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/candidats/${candidatId}/fichiers`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Chargement impossible");
      setDocs(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
      setDocs([]);
    } finally {
      setLoading(false);
    }
  }, [candidatId]);

  useEffect(() => {
    void load();
  }, [load]);

  const uploadFiles = async (files: FileList | File[]) => {
    setError(null);
    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`/api/candidats/${candidatId}/fichiers`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `Échec : ${file.name}`);
    }
    await load();
  };

  const remove = async (doc: DocumentFichier) => {
    if (!confirm(`Supprimer « ${doc.nomFichier} » ?`)) return;
    const res = await fetch(`/api/candidats/${candidatId}/fichiers/${doc.id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Suppression impossible");
    await load();
  };

  const mayDelete = (doc: DocumentFichier) => {
    if (typeof canDelete === "function") return canDelete(doc);
    return canDelete;
  };

  const mesEnvois = docs.filter((d) => d.source === "eleve");
  const docsF2m = docs.filter((d) => d.source === "admin" || d.source === "auto_genere");

  const renderGrid = (items: DocumentFichier[], emptyMsg: string) => {
    if (items.length === 0) {
      return (
        <p className="rounded-lg border border-dashed border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
          {emptyMsg}
        </p>
      );
    }
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((doc) => (
          <DocumentCard key={doc.id} doc={doc} showSource={showSource} />
        ))}
      </div>
    );
  };

  if (variant === "candidat") {
    return (
      <div className="space-y-6">
        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-center text-sm text-slate-500">Chargement des documents…</p>
        ) : (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base text-f2m-navy">
                  <Upload className="h-4 w-4" />
                  Mes pièces jointes
                </CardTitle>
                <p className="text-sm font-normal text-slate-500">
                  Déposez ici vos justificatifs. Vous ne pouvez pas les supprimer : contactez F2M
                  en cas d&apos;erreur.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {canUpload && (
                  <DocumentDropzone onUpload={uploadFiles} disabled={loading} compact />
                )}
                {renderGrid(mesEnvois, "Aucune pièce déposée pour le moment.")}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-f2m-navy">Documents F2M</CardTitle>
                <p className="text-sm font-normal text-slate-500">
                  Attestations et documents officiels envoyés par l&apos;équipe (lecture seule).
                </p>
              </CardHeader>
              <CardContent>{renderGrid(docsF2m, "Aucun document F2M pour le moment.")}</CardContent>
            </Card>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-f2m-navy">{title}</h2>

      {canUpload && <DocumentDropzone onUpload={uploadFiles} disabled={loading} />}

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-center text-sm text-slate-500">Chargement des documents…</p>
      ) : docs.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-200 py-10 text-center text-sm text-slate-500">
          Aucun document pour le moment.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
          {docs.map((doc) => (
            <DocumentRow
              key={doc.id}
              doc={doc}
              showSource={showSource}
              mayDelete={mayDelete(doc)}
              onRemove={remove}
              onError={setError}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
