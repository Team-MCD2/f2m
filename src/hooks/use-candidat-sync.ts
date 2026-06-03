"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { STATUT_LABELS, type StatutCandidat } from "@/types";

const POLL_MS = 120_000;

export interface CandidatNotification {
  id: string;
  type: string;
  titre: string;
  message: string;
  lu: boolean;
  created_at: string;
}

interface SyncPayload {
  notifications: CandidatNotification[];
  statut?: StatutCandidat;
  documentsCount?: number;
}

export function useCandidatSync(candidatId: string | null, enabled = true) {
  const [notifications, setNotifications] = useState<CandidatNotification[]>([]);
  const [statut, setStatut] = useState<StatutCandidat | null>(null);
  const [documentsCount, setDocumentsCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const sinceRef = useRef<string | null>(null);

  const poll = useCallback(async () => {
    if (!candidatId || !enabled) return;

    const url = sinceRef.current
      ? `/api/candidats/${candidatId}/notifications?since=${encodeURIComponent(sinceRef.current)}`
      : `/api/candidats/${candidatId}/notifications`;

    const res = await fetch(url);
    if (!res.ok) return;

    const data = (await res.json()) as SyncPayload;
    if (data.statut) setStatut(data.statut);
    if (typeof data.documentsCount === "number") setDocumentsCount(data.documentsCount);

    const incoming = data.notifications ?? [];
    if (incoming.length > 0) {
      setNotifications((prev) => {
        const ids = new Set(prev.map((n) => n.id));
        const merged = [...incoming.filter((n) => !ids.has(n.id)), ...prev];
        return merged.slice(0, 30);
      });
      const latest = incoming[0]?.created_at;
      if (latest) sinceRef.current = latest;
      setRefreshKey((k) => k + 1);
    }
  }, [candidatId, enabled]);

  useEffect(() => {
    if (!candidatId || !enabled) return;
    sinceRef.current = null;
    void poll();
    const id = window.setInterval(() => void poll(), POLL_MS);
    return () => window.clearInterval(id);
  }, [candidatId, enabled, poll]);

  const dismissNotifications = useCallback(async () => {
    if (!candidatId) return;
    await fetch(`/api/candidats/${candidatId}/notifications`, { method: "PATCH" });
    setNotifications((prev) => prev.map((n) => ({ ...n, lu: true })));
  }, [candidatId]);

  const unread = notifications.filter((n) => !n.lu);
  const enCours = statut === "demande" || statut === "en_formation";

  return {
    notifications: unread,
    statut,
    statutLabel: statut ? STATUT_LABELS[statut] : null,
    enCours,
    documentsCount,
    refreshKey,
    poll,
    dismissNotifications,
  };
}
