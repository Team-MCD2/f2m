import { getCandidatesByStatus } from "@/lib/queries/candidates";
import { CandidateList } from "@/components/admin/candidate-list";

export default async function RefusesPage() {
  const candidates = await getCandidatesByStatus("rejected");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dossiers refusés</h1>
        <p className="mt-1 text-slate-500">Historique des candidatures refusées</p>
      </div>
      <CandidateList candidates={candidates} />
    </div>
  );
}
