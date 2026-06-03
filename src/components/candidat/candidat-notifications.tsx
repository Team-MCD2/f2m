"use client";

import { Bell, X } from "lucide-react";
import type { CandidatNotification } from "@/hooks/use-candidat-sync";

interface CandidatNotificationsProps {
  items: CandidatNotification[];
  enCours?: boolean;
  onDismiss: () => void;
}

export function CandidatNotifications({ items, enCours, onDismiss }: CandidatNotificationsProps) {
  if (items.length === 0 && !enCours) return null;

  return (
    <div className="mb-6 space-y-2">
      {enCours && items.length === 0 && (
        <p className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <Bell className="h-4 w-4 shrink-0" />
          Votre dossier est en cours de traitement. Mise à jour automatique toutes les 2 minutes.
        </p>
      )}
      {items.map((n) => (
        <div
          key={n.id}
          className="relative rounded-lg border border-f2m-navy/20 bg-white px-4 py-3 shadow-sm"
        >
          <button
            type="button"
            onClick={onDismiss}
            className="absolute right-2 top-2 rounded p-1 text-slate-400 hover:bg-slate-100"
            aria-label="Marquer comme lu"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="pr-8 text-sm font-semibold text-f2m-navy">{n.titre}</p>
          <p className="mt-1 text-sm text-slate-600">{n.message}</p>
        </div>
      ))}
    </div>
  );
}
