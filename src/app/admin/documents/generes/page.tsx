import { Suspense } from "react";
import { DocsGeneresClient } from "./generes-client";

export default function DocsGeneresPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Chargement…</p>}>
      <DocsGeneresClient />
    </Suspense>
  );
}
