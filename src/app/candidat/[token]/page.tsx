"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PortailForm } from "@/components/candidat/portail-form";
import { Card, CardContent } from "@/components/ui/card";
import { useCandidats } from "@/lib/store";
import { PARCOURS_LABELS, STATUT_LABELS } from "@/types";
import { formatDate, fullName } from "@/lib/utils";

export default function CandidatPortailPage() {
  const params = useParams();
  const token = params.token as string;
  const { getCandidatByToken } = useCandidats();
  const existing = getCandidatByToken(token);

  return (
    <div className="min-h-screen bg-gradient-to-b from-f2m-cream to-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-bold text-f2m-navy">
              F2M <span className="text-f2m-gold">Consulting</span>
            </h1>
            <p className="text-sm text-slate-600">Portail candidat</p>
          </div>
          <Link href="/" className="text-sm text-slate-500 hover:text-f2m-navy">
            Accueil
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {existing ? (
          <Card className="mb-6 border-f2m-navy/20">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-f2m-navy">
                Bonjour {fullName(existing.nom, existing.prenom)}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Parcours : <strong>{PARCOURS_LABELS[existing.parcours]}</strong>
              </p>
              <p className="text-sm text-slate-600">
                Statut : <strong>{STATUT_LABELS[existing.statut]}</strong> — Demande du{" "}
                {formatDate(existing.dateDemande)}
              </p>
              <p className="mt-4 text-xs text-slate-500">
                Votre dossier est déjà enregistré. Pour soumettre un nouveau dossier, utilisez un autre lien ou contactez F2M Consulting.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <p className="mb-6 text-center text-slate-600">
              Déposez votre dossier de candidature — certification Dirigeant de Sécurité.
            </p>
            <PortailForm />
          </>
        )}
      </main>
    </div>
  );
}
