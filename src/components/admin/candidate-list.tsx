import Link from "next/link";
import { formatDateFr } from "@/lib/format-date";
import { Badge } from "@/components/ui/badge";
import { PARCOURS_LABELS, STATUS_LABELS } from "@/lib/constants";
import type { Candidate } from "@/types/database";

export function CandidateList({ candidates }: { candidates: Candidate[] }) {
  if (candidates.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-500">
        Aucun dossier dans cette liste.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3 font-medium">Candidat</th>
            <th className="px-4 py-3 font-medium">Parcours</th>
            <th className="px-4 py-3 font-medium">Contact</th>
            <th className="px-4 py-3 font-medium">Soumis</th>
            <th className="px-4 py-3 font-medium">Statut</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {candidates.map((c) => (
            <tr key={c.id} className="hover:bg-slate-50">
              <td className="px-4 py-3">
                <Link
                  href={`/admin/candidats/${c.id}`}
                  className="font-medium text-slate-900 hover:underline"
                >
                  {c.prenom} {c.nom}
                </Link>
              </td>
              <td className="px-4 py-3 text-slate-600">
                {PARCOURS_LABELS[c.parcours]}
              </td>
              <td className="px-4 py-3 text-slate-600">
                <div>{c.telephone}</div>
                {c.email && (
                  <div className="text-xs text-slate-400">{c.email}</div>
                )}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {formatDateFr(c.submitted_at)}
              </td>
              <td className="px-4 py-3">
                <Badge status={c.status}>{STATUS_LABELS[c.status]}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
