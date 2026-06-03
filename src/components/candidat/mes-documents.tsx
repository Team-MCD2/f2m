"use client";

import { DocumentsPanel } from "@/components/documents/documents-panel";
import { useCandidatSync } from "@/components/candidat/candidat-sync-context";

interface MesDocumentsProps {
  candidatId: string;
}

export function MesDocuments({ candidatId }: MesDocumentsProps) {
  const { refreshKey } = useCandidatSync();

  return (
    <DocumentsPanel
      key={refreshKey}
      candidatId={candidatId}
      canUpload
      canDelete={false}
      showSource={false}
      variant="candidat"
    />
  );
}
