"use client";

import { MesDocuments } from "@/components/candidat/mes-documents";
import { CandidatShell } from "@/components/layout/candidat-shell";
import { useCandidatPortal } from "@/components/candidat/candidat-portal-context";

export default function CandidatDocumentsPage() {
  const { candidatId } = useCandidatPortal();

  return (
    <CandidatShell title="Mes documents">
      {candidatId && <MesDocuments candidatId={candidatId} />}
    </CandidatShell>
  );
}
