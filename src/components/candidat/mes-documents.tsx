"use client";

import { DocumentsPanel } from "@/components/documents/documents-panel";

interface MesDocumentsProps {
  candidatId: string;
}

export function MesDocuments({ candidatId }: MesDocumentsProps) {
  return (
    <DocumentsPanel
      candidatId={candidatId}
      canUpload
      canDelete={(doc) => doc.source === "eleve"}
      showSource
      title="Mes documents"
    />
  );
}
