"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
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

interface CandidatSyncContextValue {
  notifications: CandidatNotification[];
  unreadCount: number;
  statut: StatutCandidat | null;
  statutLabel: string | null;
  enCours: boolean;
  documentsCount: number;
  refreshKey: number;
  dismissOne: (id: string) => Promise<void>;
  dismissAll: () => Promise<void>;
  poll: () => Promise<void>;
}

const CandidatSyncContext = createContext<CandidatSyncContextValue | null>(null);

export function CandidatSyncProvider({
  candidatId,
  children,
}: {
  candidatId: string | null;
  children: ReactNode;
}) {
  const [allNotifications, setAllNotifications] = useState<CandidatNotification[]>([]);
  const [statut, setStatut] = useState<StatutCandidat | null>(null);
  const [documentsCount, setDocumentsCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const sinceRef = useRef<string | null>(null);

  const poll = useCallback(async () => {
    if (!candidatId) return;

    const url = sinceRef.current
      ? `/api/candidats/${candidatId}/notifications?since=${encodeURIComponent(sinceRef.current)}`
      : `/api/candidats/${candidatId}/notifications`;

    const res = await fetch(url);
    if (!res.ok) return;

    const data = (await res.json()) as SyncPayload;
    if (data.statut) setStatut(data.statut);
    if (typeof data.documentsCount === "number") setDocumentsCount(data.documentsCount);

    const incoming = data.notifications ?? [];
    if (sinceRef.current) {
      if (incoming.length > 0) {
        setAllNotifications((prev) => {
          const ids = new Set(prev.map((n) => n.id));
          const merged = [...incoming.filter((n) => !ids.has(n.id)), ...prev];
          return merged.slice(0, 50);
        });
        sinceRef.current = incoming[0]?.created_at ?? sinceRef.current;
        setRefreshKey((k) => k + 1);
      }
    } else {
      setAllNotifications(incoming.slice(0, 50));
      if (incoming[0]?.created_at) sinceRef.current = incoming[0].created_at;
    }
  }, [candidatId]);

  useEffect(() => {
    if (!candidatId) return;
    sinceRef.current = null;
    setAllNotifications([]);
    void poll();
    const id = window.setInterval(() => void poll(), POLL_MS);
    return () => window.clearInterval(id);
  }, [candidatId, poll]);

  const dismissOne = useCallback(
    async (notificationId: string) => {
      if (!candidatId) return;
      await fetch(`/api/candidats/${candidatId}/notifications`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });
      setAllNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, lu: true } : n))
      );
    },
    [candidatId]
  );

  const dismissAll = useCallback(async () => {
    if (!candidatId) return;
    await fetch(`/api/candidats/${candidatId}/notifications`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    setAllNotifications((prev) => prev.map((n) => ({ ...n, lu: true })));
  }, [candidatId]);

  const unreadCount = allNotifications.filter((n) => !n.lu).length;
  const enCours = statut === "demande";

  const value = useMemo(
    () => ({
      notifications: allNotifications,
      unreadCount,
      statut,
      statutLabel: statut ? STATUT_LABELS[statut] : null,
      enCours,
      documentsCount,
      refreshKey,
      dismissOne,
      dismissAll,
      poll,
    }),
    [
      allNotifications,
      unreadCount,
      statut,
      enCours,
      documentsCount,
      refreshKey,
      dismissOne,
      dismissAll,
      poll,
    ]
  );

  return <CandidatSyncContext.Provider value={value}>{children}</CandidatSyncContext.Provider>;
}

export function useCandidatSync() {
  const ctx = useContext(CandidatSyncContext);
  if (!ctx) throw new Error("useCandidatSync must be used within CandidatSyncProvider");
  return ctx;
}
