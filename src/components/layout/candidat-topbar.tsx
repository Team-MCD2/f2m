"use client";

import { Badge } from "@/components/ui/badge";
import { useCandidatPortal } from "@/components/candidat/candidat-portal-context";
import { useCandidatSync } from "@/hooks/use-candidat-sync";
import { fullName } from "@/lib/utils";
import { STATUT_COLORS, STATUT_LABELS } from "@/types";
import type { StatutCandidat } from "@/types";
import { Bell } from "lucide-react";

export function CandidatTopbar({ title }: { title: string }) {
  const { candidat, candidatId } = useCandidatPortal();
  const { notifications } = useCandidatSync(candidatId, Boolean(candidatId));
  const unread = notifications.filter((n) => !n.lu).length;
  const statut = (candidat?.statut ?? "demande") as StatutCandidat;

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        {candidat && (
          <p className="text-xs text-slate-500">
            {fullName(candidat.nom, candidat.prenom)} · {candidat.token}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {unread > 0 && (
          <span className="relative flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800">
            <Bell className="h-3.5 w-3.5" />
            {unread} notification{unread > 1 ? "s" : ""}
          </span>
        )}
        <Badge className={STATUT_COLORS[statut]}>{STATUT_LABELS[statut]}</Badge>
      </div>
    </header>
  );
}
