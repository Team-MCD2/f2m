"use client";

import { useMemo, useState } from "react";
import { useAdminSearch } from "@/components/layout/admin-search-context";
import { Button } from "@/components/ui/button";
import {
  candidatsToStatsRows,
  exportToCsv,
  exportToYaml,
  filterByPeriod,
  formatStatsDate,
  getPeriodLabel,
  type StatsRow,
} from "@/lib/export-stats";
import { useCandidats } from "@/lib/store";
import { Download, FileSpreadsheet } from "lucide-react";

const COLUMNS: { key: keyof StatsRow; label: string; mono?: boolean }[] = [
  { key: "nom", label: "Nom" },
  { key: "prenom", label: "Prénom" },
  { key: "dateNaissance", label: "Date de naissance" },
  { key: "lieuNaissance", label: "Lieu de naissance" },
  { key: "numeroCarteVitale", label: "N° Carte Vitale", mono: true },
  { key: "codeInsee", label: "Code INSEE" },
  { key: "parcours", label: "Parcours" },
  { key: "dateAcceptation", label: "Date acceptation" },
  { key: "numeroDiplome", label: "N° diplôme" },
  { key: "statut", label: "Statut" },
];

function matchesSearch(row: StatsRow, q: string): boolean {
  if (!q.trim()) return true;
  const needle = q.trim().toLowerCase();
  return Object.values(row).some((v) => String(v).toLowerCase().includes(needle));
}

function cellValue(row: StatsRow, key: keyof StatsRow): string {
  if (key === "dateNaissance" || key === "dateAcceptation") {
    return formatStatsDate(row[key]);
  }
  const v = row[key];
  return v ? String(v) : "—";
}

export function AdminDataTable() {
  const { candidats, loading } = useCandidats();
  const { query } = useAdminSearch();
  const allRows = useMemo(() => candidatsToStatsRows(candidats), [candidats]);

  const years = useMemo(() => {
    const set = new Set<number>();
    allRows.forEach((r) => set.add(new Date(r.dateAcceptation).getFullYear()));
    if (set.size === 0) set.add(new Date().getFullYear());
    return Array.from(set).sort((a, b) => b - a);
  }, [allRows]);

  const [year, setYear] = useState(years[0] ?? new Date().getFullYear());
  const [month, setMonth] = useState<number | "all">("all");

  const filtered = useMemo(() => {
    const byPeriod =
      month === "all" ? filterByPeriod(allRows, year) : filterByPeriod(allRows, year, month);
    return byPeriod.filter((row) => matchesSearch(row, query));
  }, [allRows, year, month, query]);

  const periodLabel = getPeriodLabel(year, month === "all" ? undefined : month);
  const suffix = `${year}${month !== "all" ? `-${String(month).padStart(2, "0")}` : ""}`;

  const handleExportCsv = () => exportToCsv(filtered, `f2m-${suffix}.csv`);
  const handleExportYml = () => exportToYaml(filtered, `f2m-${suffix}.yml`);

  return (
    <section className="flex min-h-[420px] flex-col gap-3">
      <h2 className="text-base font-semibold text-slate-900">
        Candidats acceptés — export Excel
      </h2>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Année</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="h-8 rounded border border-slate-400 bg-white px-2 text-sm shadow-sm"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Mois</label>
            <select
              value={month}
              onChange={(e) =>
                setMonth(e.target.value === "all" ? "all" : Number(e.target.value))
              }
              className="h-8 rounded border border-slate-400 bg-white px-2 text-sm shadow-sm"
            >
              <option value="all">Toute l&apos;année</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {getPeriodLabel(year, m)}
                </option>
              ))}
            </select>
          </div>
          <p className="pb-1 text-sm text-slate-600">
            {periodLabel} — <strong>{filtered.length}</strong> ligne
            {filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleExportCsv}
            disabled={loading}
            size="sm"
            className="bg-[#217346] hover:bg-[#1a5c38]"
          >
            <Download className="mr-2 h-4 w-4" />
            Exporter CSV
          </Button>
          <Button
            variant="secondary"
            onClick={handleExportYml}
            disabled={loading}
            size="sm"
            className="border border-slate-300 bg-white hover:bg-slate-50"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Exporter YML
          </Button>
        </div>
      </div>

      <div className="min-h-[360px] flex-1 overflow-auto border border-slate-400 bg-white shadow-sm">
        {loading ? (
          <p className="p-8 text-center text-slate-500">Chargement…</p>
        ) : (
          <table className="w-full min-w-[960px] border-collapse text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#217346] text-left text-white">
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className="border border-[#1a5c38] px-2 py-1.5 text-xs font-semibold whitespace-nowrap"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="border border-slate-300 px-4 py-10 text-center text-slate-500"
                  >
                    Aucune donnée pour cette période.
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr
                    key={`${row.nom}-${row.prenom}-${row.dateAcceptation}-${i}`}
                    className={i % 2 === 0 ? "bg-white" : "bg-[#f3f3f3]"}
                  >
                    {COLUMNS.map((col) => (
                      <td
                        key={col.key}
                        className={`border border-slate-300 px-2 py-1 text-slate-900 ${
                          col.mono ? "font-mono text-xs" : ""
                        }`}
                      >
                        {cellValue(row, col.key)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
