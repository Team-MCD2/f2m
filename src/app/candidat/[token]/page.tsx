"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MesDocuments } from "@/components/candidat/mes-documents";
import { LogoutButton } from "@/components/auth/logout-button";
import { Card, CardContent } from "@/components/ui/card";
import { useCandidats } from "@/lib/store";
import { fullName } from "@/lib/utils";

export default function CandidatPortailPage() {
  const params = useParams();
  const token = params.token as string;
  const { getCandidatByToken, loading } = useCandidats();
  const existing = getCandidatByToken(token);
  const [candidatId, setCandidatId] = useState<string | null>(existing?.id ?? null);

  useEffect(() => {
    if (existing?.id) {
      setCandidatId(existing.id);
      return;
    }
    fetch(`/api/candidats/by-token/${token}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((c) => c?.id && setCandidatId(c.id))
      .catch(() => setCandidatId(null));
  }, [existing?.id, token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-f2m-cream to-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-bold text-f2m-navy">
              F2M <span className="text-f2m-gold">Consulting</span>
            </h1>
            <p className="text-sm text-slate-600">Mes documents</p>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        {loading && !candidatId ? (
          <p className="text-center text-slate-500">Chargement…</p>
        ) : !candidatId ? (
          <Card>
            <CardContent className="space-y-4 p-6 text-center">
              <p className="text-slate-600">
                Aucun dossier associé à ce compte. Déposez d&apos;abord une demande.
              </p>
              <Link href="/deposer-dossier" className="text-f2m-blue hover:underline">
                Déposer un dossier
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {existing && (
              <p className="mb-6 text-center text-sm text-slate-600">
                Bonjour <strong>{fullName(existing.nom, existing.prenom)}</strong>
              </p>
            )}
            <MesDocuments candidatId={candidatId} />
          </>
        )}
      </main>
    </div>
  );
}
