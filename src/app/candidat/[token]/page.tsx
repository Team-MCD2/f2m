"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MesDocuments } from "@/components/candidat/mes-documents";
import { LogoutButton } from "@/components/auth/logout-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCandidats } from "@/lib/store";
import { fullName } from "@/lib/utils";
import { STATUT_COLORS, STATUT_LABELS } from "@/types";
import type { StatutCandidat } from "@/types";

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

  const statut = existing?.statut as StatutCandidat | undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-f2m-cream via-white to-slate-50">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <h1 className="text-xl font-bold text-f2m-navy">
              F2M <span className="text-f2m-gold">Consulting</span>
            </h1>
            <p className="text-sm text-slate-600">Espace candidat</p>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
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
              <Card className="mb-6 border-f2m-navy/10">
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <p className="text-sm text-slate-500">Bonjour</p>
                    <p className="text-lg font-semibold text-f2m-navy">
                      {fullName(existing.nom, existing.prenom)}
                    </p>
                    <p className="text-xs text-slate-500">Identifiant : {existing.token}</p>
                  </div>
                  {statut && (
                    <Badge className={STATUT_COLORS[statut]}>{STATUT_LABELS[statut]}</Badge>
                  )}
                </CardContent>
              </Card>
            )}
            <MesDocuments candidatId={candidatId} />
          </>
        )}
      </main>
    </div>
  );
}
