import { getCandidatesByStatus } from "@/lib/queries/candidates";
import { CandidateList } from "@/components/admin/candidate-list";

export default async function DemandesPage() {
  const candidates = await getCandidatesByStatus("pending", {
    onlySubmitted: true,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Demandes en attente</h1>
        <p className="mt-1 text-slate-500">
          Dossiers soumis — à valider ou refuser
        </p>
      </div>
      <CandidateList candidates={candidates} />
    </div>
  );
}
