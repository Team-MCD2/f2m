"use client";

import Link from "next/link";
import { useCandidatPortal } from "@/components/candidat/candidat-portal-context";
import { useCandidatSync } from "@/components/candidat/candidat-sync-context";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PARCOURS_LABELS, STATUT_COLORS, STATUT_LABELS } from "@/types";
import type { StatutCandidat } from "@/types";
import { formatDate, fullName } from "@/lib/utils";
import { ArrowRight, Bell, FileText, Video } from "lucide-react";

export function CandidatDashboard() {
  const { candidat, basePath } = useCandidatPortal();
  const { unreadCount, documentsCount, statut, enCours } = useCandidatSync();

  if (!candidat) return null;

  const statutKey = (statut ?? candidat.statut) as StatutCandidat;
  const showFormation =
    statutKey === "accepte" || statutKey === "en_formation" || statutKey === "diplome";

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-f2m-navy/10 bg-gradient-to-br from-white to-f2m-cream/40">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Bienvenue</p>
              <h2 className="mt-1 text-2xl font-bold text-f2m-navy">
                {fullName(candidat.nom, candidat.prenom)}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Parcours : <strong>{PARCOURS_LABELS[candidat.parcours]}</strong> · Dossier déposé
                le {formatDate(candidat.dateDemande)}
              </p>
            </div>
            <Badge className={`${STATUT_COLORS[statutKey]} shrink-0 text-sm`}>
              {STATUT_LABELS[statutKey]}
            </Badge>
          </div>

          {enCours && (
            <p className="mt-4 flex items-center gap-2 rounded-lg border border-amber-200/80 bg-amber-50/90 px-3 py-2 text-sm text-amber-900">
              <Bell className="h-4 w-4 shrink-0" />
              Dossier en cours d&apos;examen. Vous serez notifié via la cloche en haut à droite.
            </p>
          )}

          {unreadCount > 0 && (
            <p className="mt-3 text-sm text-sky-800">
              <strong>{unreadCount}</strong> notification{unreadCount > 1 ? "s" : ""} non lue
              {unreadCount > 1 ? "s" : ""} — cliquez sur la cloche pour les lire.
            </p>
          )}
        </CardContent>
      </Card>

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
            <p className="text-3xl font-bold text-f2m-navy">{unreadCount}</p>
            <p className="mt-1 text-xs text-slate-500">non lue(s) — icône cloche en haut</p>
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
