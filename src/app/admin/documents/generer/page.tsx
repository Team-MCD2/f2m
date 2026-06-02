import { Suspense } from "react";
import { GenererDocumentClient } from "./generer-client";

export default function GenererDocumentPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Chargement…</p>}>
      <GenererDocumentClient />
    </Suspense>
  );
}
