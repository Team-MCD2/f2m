"use client";

import { DocumentsPanel } from "@/components/documents/documents-panel";
import { CandidatNotifications } from "@/components/candidat/candidat-notifications";
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
    <div className="space-y-6">
      <CandidatNotifications
        items={notifications}
        enCours={enCours}
        onDismiss={() => void dismissNotifications()}
      />
      <DocumentsPanel
        key={refreshKey}
        candidatId={candidatId}
        canUpload
        canDelete={false}
        showSource={false}
        variant="candidat"
      />
    </div>
  );
}
