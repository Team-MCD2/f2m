"use client";

import { useTransition } from "react";
import { updateCandidateAdminFields } from "@/app/actions/candidates";

export function AdminFieldsForm({
  candidateId,
  defaultValues,
}: {
  candidateId: string;
  defaultValues: {
    notes: string | null;
    numero_diplome: string | null;
    numero_carte_vitale: string | null;
    code_insee_commune: string | null;
  };
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
          await updateCandidateAdminFields(candidateId, {
            notes: String(fd.get("notes") ?? ""),
            numero_diplome: String(fd.get("numero_diplome") ?? ""),
            numero_carte_vitale: String(fd.get("numero_carte_vitale") ?? ""),
            code_insee_commune: String(fd.get("code_insee_commune") ?? ""),
          });
        });
      }}
    >
      <h2 className="text-lg font-semibold text-slate-900">
        Données admin / export CDC
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">N° diplôme</label>
          <input
            name="numero_diplome"
            defaultValue={defaultValues.numero_diplome ?? ""}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Code INSEE commune
          </label>
          <input
            name="code_insee_commune"
            defaultValue={defaultValues.code_insee_commune ?? ""}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            N° carte Vitale
          </label>
          <input
            name="numero_carte_vitale"
            defaultValue={defaultValues.numero_carte_vitale ?? ""}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Notes internes</label>
          <textarea
            name="notes"
            rows={3}
            defaultValue={defaultValues.notes ?? ""}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
