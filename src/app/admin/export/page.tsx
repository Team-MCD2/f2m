export default function ExportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Export CDC / CPF</h1>
        <p className="mt-1 text-slate-500">
          Téléchargez les tableaux remplis automatiquement depuis les fiches
          candidats (CSV pour Excel, XML pour la Caisse des dépôts).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ExportCard
          title="Candidats acceptés"
          description="Export des dossiers validés"
          status="accepted"
        />
        <ExportCard
          title="Toutes les demandes"
          description="Dossiers en attente de traitement"
          status="pending"
        />
      </div>

      <p className="text-sm text-slate-500">
        Renseignez le n° diplôme et le code INSEE sur chaque fiche candidat avant
        l&apos;export final.
      </p>
    </div>
  );
}

function ExportCard({
  title,
  description,
  status,
}: {
  title: string;
  description: string;
  status: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={`/api/export/cdc?status=${status}&format=csv`}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Télécharger CSV
        </a>
        <a
          href={`/api/export/cdc?status=${status}&format=xml`}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Télécharger XML
        </a>
      </div>
    </div>
  );
}
