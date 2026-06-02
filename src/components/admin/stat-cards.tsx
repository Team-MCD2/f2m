"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { Candidat } from "@/types";
import { CheckCircle, Clock, GraduationCap, XCircle } from "lucide-react";

export function StatCards({ candidats }: { candidats: Candidat[] }) {
  const demande = candidats.filter((c) => c.statut === "demande").length;
  const accepte = candidats.filter((c) => c.statut === "accepte").length;
  const refuse = candidats.filter((c) => c.statut === "refuse").length;
  const formation = candidats.filter(
    (c) => c.statut === "en_formation" || (c.statut === "accepte" && c.documentsGeneres.length > 0)
  ).length;

  const stats = [
    { label: "Demandes en attente", value: demande, icon: Clock, color: "text-amber-600 bg-amber-50" },
    { label: "Acceptés", value: accepte, icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" },
    { label: "Refusés", value: refuse, icon: XCircle, color: "text-red-600 bg-red-50" },
    { label: "En formation", value: formation, icon: GraduationCap, color: "text-indigo-600 bg-indigo-50" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <Card key={label}>
          <CardContent className="flex items-center gap-4 p-6">
            <div className={`rounded-lg p-3 ${color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-f2m-navy">{value}</p>
              <p className="text-sm text-slate-600">{label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
