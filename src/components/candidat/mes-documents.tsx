"use client";

import { DocumentsPanel } from "@/components/documents/documents-panel";
import { CandidatNotifications } from "@/components/candidat/candidat-notifications";
import { LiensReunion } from "@/components/candidat/liens-reunion";
import { useCandidatSync } from "@/hooks/use-candidat-sync";

interface MesDocumentsProps {
  candidatId: string;
}

export function MesDocuments({ candidatId }: MesDocumentsProps) {
  const { notifications, enCours, refreshKey, dismissNotifications } = useCandidatSync(
    candidatId,
    true
  );

  return (
    <>
      <CandidatNotifications
        items={notifications}
        enCours={enCours}
        onDismiss={() => void dismissNotifications()}
      />
      <LiensReunion candidatId={candidatId} />
      <DocumentsPanel
        key={refreshKey}
        candidatId={candidatId}
        canUpload
        canDelete={(doc) => doc.source === "eleve"}
        showSource
        title="Mes documents"
      />
    </>
  );
}
