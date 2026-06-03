"use client";

import { LiensReunion } from "@/components/candidat/liens-reunion";
import { CandidatShell } from "@/components/layout/candidat-shell";
import { useCandidatPortal } from "@/components/candidat/candidat-portal-context";
import { Card, CardContent } from "@/components/ui/card";
import { PARCOURS_LABELS } from "@/types";

export default function CandidatFormationPage() {
  const { candidat, candidatId } = useCandidatPortal();

  return (
    <CandidatShell title="Formation & réunion">
      <div className="mx-auto max-w-2xl space-y-6">
        {candidat && (
          <Card className="border-slate-200">
            <CardContent className="p-4 text-sm text-slate-600">
              Votre formation :{" "}
              <strong className="text-f2m-navy">{PARCOURS_LABELS[candidat.parcours]}</strong>
              . Les liens ci-dessous sont définis par F2M pour tous les candidats de ce parcours.
            </CardContent>
          </Card>
        )}
        {candidatId && <LiensReunion candidatId={candidatId} />}
      </div>
    </CandidatShell>
  );
}
