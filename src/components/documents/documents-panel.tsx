"use client";

import { useCallback, useEffect, useState } from "react";
import { DocumentDropzone } from "@/components/documents/document-dropzone";
import { Button } from "@/components/ui/button";
import { DOCUMENT_SOURCE_LABELS, type DocumentFichier } from "@/types";
import { formatDate } from "@/lib/utils";
import { ExternalLink, FileText, Image, Trash2 } from "lucide-react";

interface DocumentsPanelProps {
  candidatId: string;
  canUpload?: boolean;
  canDelete?: boolean | ((doc: DocumentFichier) => boolean);
  showSource?: boolean;
  title?: string;
}

export function DocumentsPanel({
  candidatId,
  canUpload = true,
  canDelete = true,
  showSource = true,
  title = "Mes documents",
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
            <li
              key={doc.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
            >
              <div className="flex min-w-0 items-start gap-3">
                {doc.mimeType.startsWith("image/") ? (
                  <Image className="h-5 w-5 shrink-0 text-sky-600" />
                ) : (
                  <FileText className="h-5 w-5 shrink-0 text-f2m-navy" />
                )}
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
                  className="inline-flex items-center gap-1 text-sm text-f2m-blue hover:underline"
                >
                  Ouvrir
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                {mayDelete(doc) && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => void remove(doc).catch((e) => setError(String(e.message)))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
