"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CANDIDATS_INIT } from "@/data/mock";
import type { Candidat, DocumentGenere, DocumentType, FicheRenseignement, StatutCandidat } from "@/types";
import { DOCUMENT_LABELS } from "@/types";

interface CandidatStore {
  candidats: Candidat[];
  getCandidat: (id: string) => Candidat | undefined;
  getCandidatByToken: (token: string) => Candidat | undefined;
  updateStatut: (id: string, statut: StatutCandidat) => void;
  updateNumeroDiplome: (id: string, numero: string) => void;
  updateLiens: (id: string, liens: Partial<Candidat["liens"]>) => void;
  addDocument: (id: string, type: DocumentType) => DocumentGenere;
  addCandidat: (candidat: Candidat) => void;
  updateCandidat: (id: string, patch: Partial<Candidat>) => void;
}

const CandidatContext = createContext<CandidatStore | null>(null);

export function CandidatProvider({ children }: { children: ReactNode }) {
  const [candidats, setCandidats] = useState<Candidat[]>(CANDIDATS_INIT);

  const getCandidat = useCallback(
    (id: string) => candidats.find((c) => c.id === id),
    [candidats]
  );

  const getCandidatByToken = useCallback(
    (token: string) => candidats.find((c) => c.token === token),
    [candidats]
  );

  const updateStatut = useCallback((id: string, statut: StatutCandidat) => {
    setCandidats((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const patch: Partial<Candidat> = { statut };
        if (statut === "accepte" && !c.dateAcceptation) {
          patch.dateAcceptation = new Date().toISOString().split("T")[0];
        }
        return { ...c, ...patch };
      })
    );
  }, []);

  const updateNumeroDiplome = useCallback((id: string, numero: string) => {
    setCandidats((prev) =>
      prev.map((c) => (c.id === id ? { ...c, numeroDiplome: numero } : c))
    );
  }, []);

  const updateLiens = useCallback((id: string, liens: Partial<Candidat["liens"]>) => {
    setCandidats((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, liens: { ...c.liens, ...liens } } : c
      )
    );
  }, []);

  const addDocument = useCallback((id: string, type: DocumentType): DocumentGenere => {
    const doc: DocumentGenere = {
      id: `doc-${Date.now()}`,
      type,
      nom: DOCUMENT_LABELS[type],
      genereLe: new Date().toISOString().split("T")[0],
    };
    setCandidats((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, documentsGeneres: [...c.documentsGeneres, doc] }
          : c
      )
    );
    return doc;
  }, []);

  const addCandidat = useCallback((candidat: Candidat) => {
    setCandidats((prev) => [...prev, candidat]);
  }, []);

  const updateCandidat = useCallback((id: string, patch: Partial<Candidat>) => {
    setCandidats((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  }, []);

  const value = useMemo(
    () => ({
      candidats,
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

export function createCandidatId(): string {
  return `cand-${Date.now()}`;
}

export function createTokenFromName(prenom: string, nom: string): string {
  return `${prenom}-${nom}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export type { FicheRenseignement };
