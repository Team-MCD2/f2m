"use client";

import { CandidatSyncProvider } from "@/components/candidat/candidat-sync-context";
import { useCandidatPortal } from "@/components/candidat/candidat-portal-context";
import type { ReactNode } from "react";

export function CandidatSyncWrapper({ children }: { children: ReactNode }) {
  const { candidatId } = useCandidatPortal();
  return <CandidatSyncProvider candidatId={candidatId}>{children}</CandidatSyncProvider>;
}
