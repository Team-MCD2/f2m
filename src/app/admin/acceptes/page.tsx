import { getCandidatesByStatus } from "@/lib/queries/candidates";
import { CandidateList } from "@/components/admin/candidate-list";

export default async function AcceptesPage() {
  const candidates = await getCandidatesByStatus("accepted");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dossiers acceptés</h1>
        <p className="mt-1 text-slate-500">Candidats recevables</p>
      </div>
      <CandidateList candidates={candidates} />
    </div>
  );
}
