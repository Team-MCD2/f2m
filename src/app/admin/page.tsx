"use client";

import { useEffect, useState } from "react";
import { CandidatList } from "@/components/admin/candidat-list";
import { CandidaturesChart } from "@/components/admin/candidatures-chart";
import { StatCards } from "@/components/admin/stat-cards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminSearch } from "@/components/layout/admin-search-context";
import {
  candidatsToStatsRows,
  exportDashboardToYaml,
  exportToYaml,
} from "@/lib/export-stats";
import { useCandidats } from "@/lib/store";
import type { DashboardStats } from "@/lib/supabase/types";
import type { StatutCandidat } from "@/types";
import { Download } from "lucide-react";

type Tab = "demandes" | "acceptes" | "refuses";

const filterMap: Record<Tab, StatutCandidat | StatutCandidat[]> = {
  demandes: "demande",
  acceptes: ["accepte", "en_formation", "diplome"],
  refuses: "refuse",
};

export default function AdminDashboardPage() {
  const { candidats, loading, updateStatut } = useCandidats();
  const { query } = useAdminSearch();
  const [tab, setTab] = useState<Tab>("demandes");
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then(setDashboard)
      .catch(() => setDashboard(null));
  }, [candidats]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "demandes", label: "Demandes en cours" },
    { id: "acceptes", label: "Dossiers acceptés" },
    { id: "refuses", label: "Dossiers refusés" },
  ];

  const handleDownloadReport = () => {
    const rows = candidatsToStatsRows(candidats);
    const year = new Date().getFullYear();
    exportToYaml(rows, `f2m-rapport-${year}.yml`);
    if (dashboard) {
      exportDashboardToYaml(dashboard, `f2m-tableau-de-bord-${year}.yml`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
          Tableau de bord
        </h1>
        <Button
          onClick={handleDownloadReport}
          className="bg-slate-900 hover:bg-slate-800"
        >
          <Download className="mr-2 h-4 w-4" />
          Télécharger le rapport
        </Button>
      </div>

      <StatCards candidats={candidats} />

      <CandidaturesChart data={dashboard} />

      <div>
        <div className="mb-4 flex flex-wrap gap-2 border-b border-slate-200">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">
              {tabs.find((t) => t.id === tab)?.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="py-8 text-center text-slate-500">Chargement des candidats…</p>
            ) : (
              <CandidatList
                filterStatut={filterMap[tab]}
                search={query}
                showActions={tab === "demandes"}
                onAccept={(id) => void updateStatut(id, "accepte")}
                onRefuse={(id) => void updateStatut(id, "refuse")}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
