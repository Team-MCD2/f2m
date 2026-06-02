"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CandidaturesChart } from "@/components/admin/candidatures-chart";
import { StatCards } from "@/components/admin/stat-cards";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  candidatsToStatsRows,
  exportDashboardToYaml,
  exportToYaml,
} from "@/lib/export-stats";
import { useCandidats } from "@/lib/store";
import type { DashboardStats } from "@/lib/supabase/types";
import { CheckCircle, Clock, Download, XCircle } from "lucide-react";

const quickLinks = [
  {
    href: "/admin/demandes/en-cours",
    label: "En cours",
    description: "Demandes à traiter",
    icon: Clock,
    color: "bg-amber-50 text-amber-600",
  },
  {
    href: "/admin/demandes/acceptees",
    label: "Acceptées",
    description: "Dossiers validés",
    icon: CheckCircle,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    href: "/admin/demandes/refusees",
    label: "Refusées",
    description: "Candidatures refusées",
    icon: XCircle,
    color: "bg-red-50 text-red-600",
  },
];

export default function AdminDashboardPage() {
  const { candidats } = useCandidats();
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then(setDashboard)
      .catch(() => setDashboard(null));
  }, [candidats]);

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
        <Button onClick={handleDownloadReport} className="bg-slate-900 hover:bg-slate-800">
          <Download className="mr-2 h-4 w-4" />
          Télécharger le rapport
        </Button>
      </div>

      <StatCards candidats={candidats} />

      <div className="grid gap-4 sm:grid-cols-3">
        {quickLinks.map(({ href, label, description, icon: Icon, color }) => (
          <Link key={href} href={href}>
            <Card className="border-slate-100 shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`rounded-xl p-3 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{label}</p>
                  <p className="text-xs text-slate-500">{description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <CandidaturesChart data={dashboard} />
    </div>
  );
}
