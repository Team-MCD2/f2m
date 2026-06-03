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
import type { Candidat, DocumentGenere, DocumentType, FicheRenseignement, StatutCandidat } from "@/types";
import { DOCUMENT_LABELS } from "@/types";

interface CandidatStore {
  candidats: Candidat[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getCandidat: (id: string) => Candidat | undefined;
  getCandidatByToken: (token: string) => Candidat | undefined;
  updateStatut: (id: string, statut: StatutCandidat) => Promise<void>;
  updateNumeroDiplome: (id: string, numero: string) => Promise<void>;
  updateLiens: (id: string, liens: Partial<Candidat["liens"]>) => Promise<void>;
  addDocument: (id: string, type: DocumentType) => Promise<DocumentGenere>;
  addCandidat: (candidat: Candidat) => Promise<Candidat>;
  updateCandidat: (id: string, patch: Partial<Candidat>) => Promise<void>;
}

const CandidatContext = createContext<CandidatStore | null>(null);

async function parseJson<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Erreur serveur");
  return data as T;
}

export function CandidatProvider({ children }: { children: ReactNode }) {
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/candidats");
      if (res.status === 401) {
        setCandidats([]);
        return;
      }
      const data = await parseJson<Candidat[]>(res);
      setCandidats(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
      setCandidats([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getCandidat = useCallback(
    (id: string) => candidats.find((c) => c.id === id),
    [candidats]
  );

  const getCandidatByToken = useCallback(
    (token: string) => candidats.find((c) => c.token === token),
    [candidats]
  );

  const updateStatut = useCallback(
    async (id: string, statut: StatutCandidat) => {
      const updated = await parseJson<Candidat>(
        await fetch(`/api/candidats/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ statut }),
        })
      );
      setCandidats((prev) => prev.map((c) => (c.id === id ? updated : c)));
    },
    []
  );

  const updateNumeroDiplome = useCallback(async (id: string, numero: string) => {
    const updated = await parseJson<Candidat>(
      await fetch(`/api/candidats/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numeroDiplome: numero }),
      })
    );
    setCandidats((prev) => prev.map((c) => (c.id === id ? updated : c)));
  }, []);

  const updateLiens = useCallback(
    async (id: string, liens: Partial<Candidat["liens"]>) => {
      const current = candidats.find((c) => c.id === id);
      if (!current) return;
      const updated = await parseJson<Candidat>(
        await fetch(`/api/candidats/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ liens: { ...current.liens, ...liens } }),
        })
      );
      setCandidats((prev) => prev.map((c) => (c.id === id ? updated : c)));
    },
    [candidats]
  );

  const addDocument = useCallback(async (id: string, type: DocumentType) => {
    const updated = await parseJson<Candidat>(
      await fetch(`/api/candidats/${id}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      })
    );
    setCandidats((prev) => prev.map((c) => (c.id === id ? updated : c)));
    const doc = updated.documentsGeneres[updated.documentsGeneres.length - 1];
    return (
      doc ?? {
        id: `doc-${Date.now()}`,
        type,
        nom: DOCUMENT_LABELS[type],
        genereLe: new Date().toISOString().split("T")[0],
      }
    );
  }, []);

  const addCandidat = useCallback(async (candidat: Candidat) => {
    const created = await parseJson<Candidat>(
      await fetch("/api/candidats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(candidat),
      })
    );
    setCandidats((prev) => [...prev, created]);
    return created;
  }, []);

  const updateCandidat = useCallback(async (id: string, patch: Partial<Candidat>) => {
    const updated = await parseJson<Candidat>(
      await fetch(`/api/candidats/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      })
    );
    setCandidats((prev) => prev.map((c) => (c.id === id ? updated : c)));
  }, []);

  const value = useMemo(
    () => ({
      candidats,
      loading,
      error,
      refresh,
      getCandidat,
      getCandidatByToken,
      updateStatut,
      updateNumeroDiplome,
      updateLiens,
      addDocument,
      addCandidat,
      updateCandidat,
    }),
    [
      candidats,
      loading,
      error,
      refresh,
      getCandidat,
      getCandidatByToken,
      updateStatut,
      updateNumeroDiplome,
      updateLiens,
      addDocument,
      addCandidat,
      updateCandidat,
    ]
  );

  return (
    <CandidatContext.Provider value={value}>{children}</CandidatContext.Provider>
  );
}

export function useCandidats() {
  const ctx = useContext(CandidatContext);
  if (!ctx) throw new Error("useCandidats must be used within CandidatProvider");
  return ctx;
}

export { createTokenFromName } from "@/lib/utils";

export type { FicheRenseignement };
