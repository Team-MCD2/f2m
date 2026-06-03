"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Candidat } from "@/types";

interface CandidatPortalContextValue {
  token: string;
  basePath: string;
  candidat: Candidat | null;
  candidatId: string | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const CandidatPortalContext = createContext<CandidatPortalContextValue | null>(null);

export function CandidatPortalProvider({
  token,
  children,
}: {
  token: string;
  children: ReactNode;
}) {
  const basePath = `/candidat/${token}`;
  const [candidat, setCandidat] = useState<Candidat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/candidats/by-token/${encodeURIComponent(token)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Dossier introuvable");
      setCandidat(data as Candidat);
    } catch (e) {
      setCandidat(null);
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      token,
      basePath,
      candidat,
      candidatId: candidat?.id ?? null,
      loading,
      error,
      refresh,
    }),
    [token, basePath, candidat, loading, error, refresh]
  );

  return (
    <CandidatPortalContext.Provider value={value}>{children}</CandidatPortalContext.Provider>
  );
}

export function useCandidatPortal() {
  const ctx = useContext(CandidatPortalContext);
  if (!ctx) throw new Error("useCandidatPortal must be used within CandidatPortalProvider");
  return ctx;
}
