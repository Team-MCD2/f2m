"use client";

import { useEffect, useState } from "react";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { StatCards, StatCardsExtended } from "@/components/admin/stat-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCandidats } from "@/lib/store";
import type { DashboardStats } from "@/lib/supabase/types";

export function AdminDashboard() {
  const { candidats } = useCandidats();
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then(setDashboard)
      .catch(() => setDashboard(null));
  }, [candidats]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 lg:text-2xl">
          Tableau de bord
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Indicateurs en temps réel et export des candidats acceptés
        </p>
      </div>

      <StatCards candidats={candidats} />
      <StatCardsExtended candidats={candidats} />

      {dashboard && dashboard.parParcours.length > 0 && (
        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Répartition par parcours</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {dashboard.parParcours.map(({ parcours, count }) => (
                <li
                  key={parcours}
                  className="flex justify-between rounded-lg border border-slate-100 px-4 py-2 text-sm"
                >
                  <span>{parcours}</span>
                  <strong>{count}</strong>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <AdminDataTable />
    </div>
  );
}
