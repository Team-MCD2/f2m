"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/layout/admin-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  candidatsToStatsRows,
  exportDashboardToYaml,
  exportToCsv,
  exportToYaml,
  filterByPeriod,
  formatStatsDate,
  getPeriodLabel,
} from "@/lib/export-stats";
import { StatCards, StatCardsExtended } from "@/components/admin/stat-cards";
import { useCandidats } from "@/lib/store";
import type { DashboardStats } from "@/lib/supabase/types";
import { Download, FileJson } from "lucide-react";

export default function StatsPage() {
  const { candidats, loading } = useCandidats();
  const allRows = useMemo(() => candidatsToStatsRows(candidats), [candidats]);
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then(setDashboard)
      .catch(() => setDashboard(null));
  }, [candidats]);

  const years = useMemo(() => {
    const set = new Set<number>();
    allRows.forEach((r) => set.add(new Date(r.dateAcceptation).getFullYear()));
    if (set.size === 0) set.add(new Date().getFullYear());
    return Array.from(set).sort((a, b) => b - a);
  }, [allRows]);

  const [year, setYear] = useState(years[0] ?? new Date().getFullYear());
  const [month, setMonth] = useState<number | "all">("all");

  const filtered = useMemo(() => {
    if (month === "all") return filterByPeriod(allRows, year);
    return filterByPeriod(allRows, year, month);
  }, [allRows, year, month]);

  const periodLabel = getPeriodLabel(year, month === "all" ? undefined : month);
  const suffix = `${year}${month !== "all" ? `-${String(month).padStart(2, "0")}` : ""}`;

  const handleExportCsv = () => exportToCsv(filtered, `f2m-stats-${suffix}.csv`);
  const handleExportYaml = () => exportToYaml(filtered, `f2m-stats-${suffix}.yml`);
  const handleExportDashboardYaml = () => {
    if (dashboard) exportDashboardToYaml(dashboard, `f2m-dashboard-${suffix}.yml`);
  };

  return (
    <>
      <AdminPageHeader
        title="Statistiques"
        description="Indicateurs en temps réel depuis Supabase — exports CSV et YAML"
      />

      <div className="mb-8 space-y-6">
        <StatCards candidats={candidats} />
        <StatCardsExtended candidats={candidats} />
      </div>

      {dashboard && dashboard.parParcours.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base">Répartition par parcours</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 sm:grid-cols-2">
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

      <Card className="mb-6">
        <CardContent className="flex flex-wrap items-end gap-4 p-6">
          <div>
            <label className="mb-1 block text-sm font-medium">Année</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="h-10 rounded-md border border-slate-300 px-3 text-sm"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Mois</label>
            <select
              value={month}
              onChange={(e) =>
                setMonth(e.target.value === "all" ? "all" : Number(e.target.value))
              }
              className="h-10 rounded-md border border-slate-300 px-3 text-sm"
            >
              <option value="all">Toute l&apos;année</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {getPeriodLabel(year, m)}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={handleExportCsv} disabled={loading}>
            <Download className="mr-2 h-4 w-4" />
            Exporter CSV
          </Button>
          <Button variant="secondary" onClick={handleExportYaml} disabled={loading}>
            <FileJson className="mr-2 h-4 w-4" />
            Exporter YAML
          </Button>
          {dashboard && (
            <Button variant="outline" onClick={handleExportDashboardYaml}>
              <FileJson className="mr-2 h-4 w-4" />
              Tableau de bord YAML
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Candidats acceptés — {periodLabel} ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          {loading ? (
            <p className="p-8 text-center text-slate-500">Chargement…</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left">
                  <th className="px-4 py-3 font-medium text-f2m-navy">Nom</th>
                  <th className="px-4 py-3 font-medium text-f2m-navy">Prénom</th>
                  <th className="px-4 py-3 font-medium text-f2m-navy">Naissance</th>
                  <th className="px-4 py-3 font-medium text-f2m-navy">Lieu</th>
                  <th className="px-4 py-3 font-medium text-f2m-navy">Carte Vitale</th>
                  <th className="px-4 py-3 font-medium text-f2m-navy">INSEE</th>
                  <th className="px-4 py-3 font-medium text-f2m-navy">Parcours</th>
                  <th className="px-4 py-3 font-medium text-f2m-navy">N° diplôme</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                      Aucune donnée pour cette période.
                    </td>
                  </tr>
                ) : (
                  filtered.map((row, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3">{row.nom}</td>
                      <td className="px-4 py-3">{row.prenom}</td>
                      <td className="px-4 py-3">{formatStatsDate(row.dateNaissance)}</td>
                      <td className="px-4 py-3">{row.lieuNaissance}</td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {row.numeroCarteVitale || "—"}
                      </td>
                      <td className="px-4 py-3">{row.codeInsee || "—"}</td>
                      <td className="px-4 py-3">{row.parcours}</td>
                      <td className="px-4 py-3">{row.numeroDiplome || "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
