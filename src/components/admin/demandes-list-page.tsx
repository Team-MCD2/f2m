"use client";

import { CandidatList } from "@/components/admin/candidat-list";
import { useAdminSearch } from "@/components/layout/admin-search-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCandidats } from "@/lib/store";
import type { StatutCandidat } from "@/types";

interface DemandesListPageProps {
  title: string;
  description?: string;
  filterStatut: StatutCandidat | StatutCandidat[];
  showActions?: boolean;
}

export function DemandesListPage({
  title,
  description,
  filterStatut,
  showActions = false,
}: DemandesListPageProps) {
  const { candidats, loading, updateStatut } = useCandidats();
  const { query } = useAdminSearch();

  const count = candidats.filter((c) => {
    const statuses = Array.isArray(filterStatut) ? filterStatut : [filterStatut];
    return statuses.includes(c.statut);
  }).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
          {title}
        </h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            {title} ({count})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-slate-500">Chargement des candidats…</p>
          ) : (
            <CandidatList
              filterStatut={filterStatut}
              search={query}
              showActions={showActions}
              onAccept={(id) => void updateStatut(id, "accepte")}
              onRefuse={(id) => void updateStatut(id, "refuse")}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
