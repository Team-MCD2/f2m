"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DocumentDropzone } from "@/components/documents/document-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DOCUMENT_SOURCE_LABELS,
  DOCUMENT_STATUT_LABELS,
  type DocumentFichier,
} from "@/types";
import { formatDate } from "@/lib/utils";
import {
  Download,
  ExternalLink,
  FileText,
  Image,
  RefreshCw,
  Send,
  Trash2,
  Upload,
} from "lucide-react";

interface DocumentsPanelProps {
  candidatId: string;
  canUpload?: boolean;
  canDelete?: boolean | ((doc: DocumentFichier) => boolean);
  showSource?: boolean;
  title?: string;
  /** Mise en page candidat : sections séparées, sans suppression */
  variant?: "default" | "candidat";
  /** Actions brouillon → envoi (fiche admin candidat) */
  adminMode?: boolean;
  /** Régénérer un document auto-généré (page Docs générés) */
  onRegenerate?: (doc: DocumentFichier) => Promise<void>;
}

function downloadHref(candidatId: string, docId: string) {
  return `/api/candidats/${candidatId}/fichiers/${docId}/download`;
}

function DocIcon({ mimeType }: { mimeType: string }) {
  if (mimeType.startsWith("image/")) {
    return <Image className="h-5 w-5 shrink-0 text-sky-600" />;
  }
  return <FileText className="h-5 w-5 shrink-0 text-f2m-navy" />;
}

function StatutBadge({ doc }: { doc: DocumentFichier }) {
  if (doc.source === "eleve") return null;
  const isDraft = doc.statutEnvoi === "brouillon";
  return (
    <Badge
      className={
        isDraft
          ? "bg-amber-100 text-amber-900 hover:bg-amber-100"
          : "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
      }
    >
      {DOCUMENT_STATUT_LABELS[doc.statutEnvoi]}
    </Badge>
  );
}

function DocumentActions({
  candidatId,
  doc,
  compact,
}: {
  candidatId: string;
  doc: DocumentFichier;
  compact?: boolean;
}) {
  const btnClass = compact
    ? "inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-f2m-blue hover:bg-slate-50"
    : "inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-f2m-blue hover:bg-slate-50";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a href={doc.url} target="_blank" rel="noopener noreferrer" className={btnClass}>
        Visualiser
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
      <a href={downloadHref(candidatId, doc.id)} className={btnClass}>
        Télécharger
        <Download className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

function DocumentRow({
  doc,
  candidatId,
  showSource,
  showStatut,
  mayDelete,
  selectable,
  selected,
  onToggleSelect,
  onRemove,
  onRegenerate,
  regenerating,
  onError,
}: {
  doc: DocumentFichier;
  candidatId: string;
  showSource: boolean;
  showStatut: boolean;
  mayDelete: boolean;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
  onRemove: (doc: DocumentFichier) => Promise<void>;
  onRegenerate?: (doc: DocumentFichier) => Promise<void>;
  regenerating?: boolean;
  onError: (msg: string) => void;
}) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
      <div className="flex min-w-0 items-start gap-3">
        {selectable && (
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelect}
            className="mt-1 h-4 w-4 rounded border-slate-300"
            aria-label={`Sélectionner ${doc.nomFichier}`}
          />
        )}
        <DocIcon mimeType={doc.mimeType} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">{doc.nomFichier}</p>
          <p className="text-xs text-slate-500">
            {formatDate(doc.createdAt.slice(0, 10))}
            {showSource && ` · ${DOCUMENT_SOURCE_LABELS[doc.source]}`}
          </p>
          {showStatut && (
            <div className="mt-1">
              <StatutBadge doc={doc} />
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <DocumentActions candidatId={candidatId} doc={doc} />
        {onRegenerate && doc.source === "auto_genere" && doc.templateType && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-slate-600 hover:bg-slate-100"
            disabled={regenerating}
            title="Régénérer"
            aria-label={`Régénérer ${doc.nomFichier}`}
            onClick={() =>
              void onRegenerate(doc).catch((e) => onError(String(e.message)))
            }
          >
            <RefreshCw className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`} />
          </Button>
        )}
        {mayDelete && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
            disabled={regenerating}
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
  candidatId,
  showSource,
}: {
  doc: DocumentFichier;
  candidatId: string;
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
      <DocumentActions candidatId={candidatId} doc={doc} compact />
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
  adminMode = false,
  onRegenerate,
}: DocumentsPanelProps) {
  const [docs, setDocs] = useState<DocumentFichier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);
  const [sendMessage, setSendMessage] = useState<string | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/candidats/${candidatId}/fichiers`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Chargement impossible");
      setDocs(data);
      setSelectedIds(new Set());
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

  const brouillons = useMemo(
    () => docs.filter((d) => d.statutEnvoi === "brouillon"),
    [docs]
  );

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

  const regenerate = async (doc: DocumentFichier) => {
    if (!onRegenerate) return;
    setRegeneratingId(doc.id);
    setError(null);
    try {
      await onRegenerate(doc);
      await load();
    } finally {
      setRegeneratingId(null);
    }
  };

  const sendDocuments = async (payload: { ids?: string[]; all?: boolean }) => {
    setSending(true);
    setSendMessage(null);
    setError(null);
    try {
      const res = await fetch(`/api/candidats/${candidatId}/fichiers/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Envoi impossible");
      setSendMessage(
        data.count === 1
          ? "1 document envoyé au candidat."
          : `${data.count} documents envoyés au candidat.`
      );
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur envoi");
    } finally {
      setSending(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllDrafts = () => {
    setSelectedIds(new Set(brouillons.map((d) => d.id)));
  };

  const mayDelete = (doc: DocumentFichier) => {
    if (typeof canDelete === "function") return canDelete(doc);
    return canDelete;
  };

  const mesEnvois = docs.filter((d) => d.source === "eleve");
  const docsF2m = docs.filter(
    (d) => d.source === "admin" || d.source === "auto_genere"
  );

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
          <DocumentCard key={doc.id} doc={doc} candidatId={candidatId} showSource={showSource} />
        ))}
      </div>
    );
  };

  const draftActionsCard =
    adminMode && brouillons.length > 0 ? (
      <Card className="border-amber-200 bg-amber-50/40">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-amber-950">
            Brouillons ({brouillons.length})
          </CardTitle>
          <p className="text-sm font-normal text-amber-900/80">
            Les documents générés restent en brouillon jusqu&apos;à envoi. Le candidat sera
            notifié à l&apos;envoi.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={selectAllDrafts}
              disabled={sending}
            >
              Tout sélectionner
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() =>
                void sendDocuments({
                  ids: Array.from(selectedIds),
                })
              }
              disabled={sending || selectedIds.size === 0}
            >
              <Send className="mr-2 h-4 w-4" />
              Envoyer la sélection ({selectedIds.size})
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => void sendDocuments({ all: true })}
              disabled={sending}
            >
              Tout envoyer au candidat
            </Button>
          </div>
          {sendMessage && (
            <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {sendMessage}
            </p>
          )}
          <ul className="divide-y divide-amber-100 rounded-xl border border-amber-200 bg-white">
            {brouillons.map((doc) => (
              <DocumentRow
                key={doc.id}
                doc={doc}
                candidatId={candidatId}
                showSource={showSource}
                showStatut={false}
                mayDelete={mayDelete(doc)}
                selectable
                selected={selectedIds.has(doc.id)}
                onToggleSelect={() => toggleSelect(doc.id)}
                onRemove={remove}
                onRegenerate={onRegenerate ? regenerate : undefined}
                regenerating={regeneratingId === doc.id}
                onError={setError}
              />
            ))}
          </ul>
        </CardContent>
      </Card>
    ) : null;

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
                  Attestations et documents officiels envoyés par l&apos;équipe. Visualisez ou
                  téléchargez chaque fichier.
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

      {draftActionsCard}

      {loading ? (
        <p className="text-center text-sm text-slate-500">Chargement des documents…</p>
      ) : (adminMode ? docs.filter((d) => d.statutEnvoi !== "brouillon") : docs).length ===
        0 ? (
        <p className="rounded-lg border border-dashed border-slate-200 py-10 text-center text-sm text-slate-500">
          {adminMode && brouillons.length > 0
            ? "Aucun autre document (hors brouillons)."
            : "Aucun document pour le moment."}
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
          {(adminMode ? docs.filter((d) => d.statutEnvoi !== "brouillon") : docs).map((doc) => (
            <DocumentRow
              key={doc.id}
              doc={doc}
              candidatId={candidatId}
              showSource={showSource}
              showStatut={adminMode}
              mayDelete={mayDelete(doc)}
              onRemove={remove}
              onRegenerate={onRegenerate ? regenerate : undefined}
              regenerating={regeneratingId === doc.id}
              onError={setError}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
