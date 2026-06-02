"use client";

import { Card, CardContent } from "@/components/ui/card";
import { computeCandidatStats } from "@/lib/stats/compute";
import type { Candidat } from "@/types";
import {
  BarChart3,
  Building2,
  CheckCircle,
  Clock,
  FileText,
  GraduationCap,
  Users,
  XCircle,
} from "lucide-react";

interface StatCardsProps {
  candidats: Candidat[];
}

export function StatCards({ candidats }: StatCardsProps) {
  const s = computeCandidatStats(candidats);

  const stats = [
    {
      label: "Total candidats",
      value: String(s.total),
      hint:
        s.ceMois > 0
          ? `${s.ceMois} nouveau${s.ceMois > 1 ? "x" : ""} ce mois-ci`
          : "Aucune demande ce mois-ci",
      icon: Users,
      iconBg: "bg-violet-50 text-violet-600",
    },
    {
      label: "En cours",
      value: String(s.demande),
      hint: "En attente de validation",
      icon: Clock,
      iconBg: "bg-amber-50 text-amber-600",
    },
    {
      label: "Acceptées",
      value: String(s.actifs),
      hint: `${s.accepte} accepté${s.accepte > 1 ? "s" : ""} · ${s.enFormation} en formation · ${s.diplome} diplômé${s.diplome > 1 ? "s" : ""}`,
      icon: CheckCircle,
      iconBg: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Refusées",
      value: String(s.refuse),
      hint: s.tauxRefus > 0 ? `${s.tauxRefus.toFixed(1).replace(".", ",")} % du total` : "Aucun refus",
      icon: XCircle,
      iconBg: "bg-red-50 text-red-600",
    },
    {
      label: "Taux d'acceptation",
      value: `${s.tauxAcceptation.toFixed(1).replace(".", ",")} %`,
      hint: `${s.actifs} dossier${s.actifs > 1 ? "s" : ""} validé${s.actifs > 1 ? "s" : ""}`,
      icon: BarChart3,
      iconBg: "bg-sky-50 text-sky-600",
    },
    {
      label: "Documents générés",
      value: String(s.documentsGeneres),
      hint: "Attestations, fiches, émargements…",
      icon: FileText,
      iconBg: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Centres partenaires",
      value: String(s.partenaires),
      hint: "Partenaires ayant créé des dossiers",
      icon: Building2,
      iconBg: "bg-slate-100 text-slate-600",
    },
    {
      label: "Parcours le plus demandé",
      value: s.parcoursPrincipal ? String(s.parcoursPrincipal.count) : "—",
      hint: s.parcoursPrincipal?.label ?? "Pas encore de données",
      icon: GraduationCap,
      iconBg: "bg-f2m-cream text-f2m-navy",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ label, value, hint, icon: Icon, iconBg }) => (
        <Card key={label} className="border-slate-100 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
                  {value}
                </p>
                <p className="mt-2 line-clamp-2 text-xs text-slate-500">{hint}</p>
              </div>
              <div className={`shrink-0 rounded-xl p-2.5 ${iconBg}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/** Bloc secondaire pour la page Statistiques */
export function StatCardsExtended({ candidats }: StatCardsProps) {
  const s = computeCandidatStats(candidats);

  const extra = [
    { label: "Acceptés (statut seul)", value: s.accepte },
    { label: "En formation", value: s.enFormation },
    { label: "Diplômés", value: s.diplome },
    { label: "Taux de refus", value: `${s.tauxRefus.toFixed(1).replace(".", ",")} %` },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {extra.map(({ label, value }) => (
        <Card key={label} className="border-slate-100 bg-slate-50/50">
          <CardContent className="flex items-center justify-between p-4">
            <span className="text-sm text-slate-600">{label}</span>
            <span className="text-lg font-bold text-f2m-navy">{value}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
