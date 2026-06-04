"use client";

import { useState, useTransition } from "react";
import { createCandidatureLink } from "@/app/actions/candidates";
import { Link2, Copy, Check } from "lucide-react";

export function CreateLinkButton() {
  const [url, setUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleCreate() {
    startTransition(async () => {
      const result = await createCandidatureLink();
      setUrl(result.url);
      setCopied(false);
    });
  }

  async function copy() {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        Nouveau lien candidature
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Envoyez ce lien au candidat après le premier contact (téléphone / RDV).
        Il déposera son dossier et sa fiche de renseignement en une fois.
      </p>
      <button
        type="button"
        onClick={handleCreate}
        disabled={pending}
        className="mt-4 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        <Link2 className="h-4 w-4" />
        {pending ? "Génération…" : "Générer un lien"}
      </button>
      {url && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-50 p-3">
          <code className="flex-1 truncate text-xs text-slate-700">{url}</code>
          <button
            type="button"
            onClick={copy}
            className="rounded-md border border-slate-200 bg-white p-2 hover:bg-slate-100"
            title="Copier"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <Copy className="h-4 w-4 text-slate-600" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
