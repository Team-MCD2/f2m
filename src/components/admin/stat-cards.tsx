"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { Candidat } from "@/types";
import { BarChart3, CheckCircle, Clock, Users } from "lucide-react";

interface StatCardsProps {
  candidats: Candidat[];
}

export function StatCards({ candidats }: StatCardsProps) {
  const total = candidats.length;
  const demande = candidats.filter((c) => c.statut === "demande").length;
  const actifs = candidats.filter(
    (c) => c.statut === "accepte" || c.statut === "en_formation" || c.statut === "diplome"
  ).length;
  const tauxConversion =
    total > 0 ? ((actifs / total) * 100).toFixed(1).replace(".", ",") : "0,0";

  const stats = [
    {
      label: "Total candidats",
      value: String(total),
      icon: Users,
      iconBg: "bg-violet-50 text-violet-600",
    },
    {
      label: "Candidats actifs",
      value: String(actifs),
      icon: CheckCircle,
      iconBg: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Demandes en cours",
      value: String(demande),
      icon: Clock,
      iconBg: "bg-amber-50 text-amber-600",
    },
    {
      label: "Taux de conversion",
      value: `${tauxConversion} %`,
      icon: BarChart3,
      iconBg: "bg-sky-50 text-sky-600",
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, iconBg }) => (
        <Card key={label} className="border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {value}
                </p>
              </div>
              <div className={`rounded-xl p-3 ${iconBg}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-red-500">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
              En direct par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
