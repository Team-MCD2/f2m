"use client";

import { Badge } from "@/components/ui/badge";
import { CandidatNotificationsBell } from "@/components/candidat/candidat-notifications-bell";
import { useCandidatPortal } from "@/components/candidat/candidat-portal-context";
import { useCandidatSync } from "@/components/candidat/candidat-sync-context";
import { fullName } from "@/lib/utils";
import { STATUT_COLORS, STATUT_LABELS } from "@/types";
import type { StatutCandidat } from "@/types";

export function CandidatTopbar({ title }: { title: string }) {
  const { candidat } = useCandidatPortal();
  const { statut } = useCandidatSync();
  const statutKey = (statut ?? candidat?.statut ?? "demande") as StatutCandidat;

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-6">
      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold text-slate-900">{title}</h1>
        {candidat && (
          <p className="truncate text-xs text-slate-500">
            {fullName(candidat.nom, candidat.prenom)} · {candidat.token}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <CandidatNotificationsBell />
        <Badge className={STATUT_COLORS[statutKey]}>{STATUT_LABELS[statutKey]}</Badge>
      </div>
    </header>
  );
}
