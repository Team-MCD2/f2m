"use client";

import Link from "next/link";
import { useCandidatPortal } from "@/components/candidat/candidat-portal-context";
import { CandidatNotifications } from "@/components/candidat/candidat-notifications";
import { useCandidatSync } from "@/hooks/use-candidat-sync";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PARCOURS_LABELS } from "@/types";
import { formatDate, fullName } from "@/lib/utils";
import { ArrowRight, FileText, Video } from "lucide-react";

export function CandidatDashboard() {
  const { candidat, candidatId, basePath } = useCandidatPortal();
  const { notifications, enCours, dismissNotifications, documentsCount, statut } =
    useCandidatSync(candidatId, Boolean(candidatId));

  if (!candidat) return null;

  const showFormation =
    statut === "accepte" || statut === "en_formation" || statut === "diplome";

  return (
    <div className="space-y-6">
      <Card className="border-f2m-navy/10 bg-gradient-to-br from-white to-f2m-cream/40">
        <CardContent className="p-6">
          <p className="text-sm text-slate-500">Bienvenue</p>
          <h2 className="mt-1 text-2xl font-bold text-f2m-navy">
            {fullName(candidat.nom, candidat.prenom)}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Parcours : <strong>{PARCOURS_LABELS[candidat.parcours]}</strong> · Dossier déposé le{" "}
            {formatDate(candidat.dateDemande)}
          </p>
        </CardContent>
      </Card>

      <CandidatNotifications
        items={notifications}
        enCours={enCours}
        onDismiss={() => void dismissNotifications()}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-f2m-navy">{documentsCount}</p>
            <p className="mt-1 text-xs text-slate-500">fichier(s) dans votre dossier</p>
            <Link
              href={`${basePath}/documents`}
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-f2m-blue hover:underline"
            >
              Gérer mes documents
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-f2m-navy">
              {notifications.filter((n) => !n.lu).length}
            </p>
            <p className="mt-1 text-xs text-slate-500">message(s) non lu(s)</p>
          </CardContent>
        </Card>

        {showFormation && (
          <Card className="border-sky-100 bg-sky-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-sky-900">
                <Video className="h-4 w-4" />
                Formation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-sky-800">
                Accédez aux liens Teams et e-learning de votre formation.
              </p>
              <Link
                href={`${basePath}/formation`}
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-f2m-blue hover:underline"
              >
                Voir les liens
                <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Link href={`${basePath}/documents`}>
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-f2m-navy/10">
                <FileText className="h-6 w-6 text-f2m-navy" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Mes documents</p>
                <p className="text-sm text-slate-500">
                  Déposer des pièces, consulter les documents F2M
                </p>
              </div>
              <ArrowRight className="ml-auto h-5 w-5 text-slate-400" />
            </CardContent>
          </Card>
        </Link>

        {showFormation && (
          <Link href={`${basePath}/formation`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100">
                  <Video className="h-6 w-6 text-sky-700" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Formation & réunion</p>
                  <p className="text-sm text-slate-500">Teams, plateforme e-learning</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-slate-400" />
              </CardContent>
            </Card>
          </Link>
        )}
      </div>
    </div>
  );
}
