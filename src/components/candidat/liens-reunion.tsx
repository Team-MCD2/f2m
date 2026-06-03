"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Loader2, Video } from "lucide-react";

interface LiensReunionProps {
  candidatId: string;
}

export function LiensReunion({ candidatId }: LiensReunionProps) {
  const [teamsUrl, setTeamsUrl] = useState("");
  const [elearningUrl, setElearningUrl] = useState("");
  const [label, setLabel] = useState("");
  const [statut, setStatut] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/candidats/${candidatId}/reunion`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        setTeamsUrl(data.teamsUrl ?? "");
        setElearningUrl(data.elearningUrl ?? "");
        setLabel(data.parcoursLabel ?? "");
        setStatut(data.statut ?? null);
        setLoaded(true);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [candidatId]);

  const hasLinks = Boolean(teamsUrl.trim() || elearningUrl.trim());
  const showPending =
    loaded &&
    !hasLinks &&
    (statut === "accepte" || statut === "en_formation" || statut === "diplome");

  if (loading) {
    return (
      <Card className="mb-6 border-dashed">
        <CardContent className="flex items-center gap-2 py-4 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Chargement des liens réunion…
        </CardContent>
      </Card>
    );
  }

  if (!loaded) return null;

  if (showPending) {
    return (
      <Card className="mb-6 border-dashed border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base text-f2m-navy">
            <Video className="h-4 w-4" />
            Réunion &amp; formation
            {label && (
              <span className="text-sm font-normal text-slate-500">— {label}</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">
            Les liens Teams et e-learning seront publiés ici dès que l&apos;équipe F2M les aura
            configurés pour votre formation.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!hasLinks) return null;

  return (
    <Card className="border-f2m-navy/20 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base text-f2m-navy">
          <Video className="h-4 w-4" />
          Réunion &amp; formation
          {label && (
            <span className="text-sm font-normal text-slate-500">— {label}</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
        {teamsUrl.trim() && (
          <a
            href={teamsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-f2m-blue hover:bg-slate-100"
          >
            Rejoindre Teams
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
        {elearningUrl.trim() && (
          <a
            href={elearningUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-f2m-blue hover:bg-slate-100"
          >
            Plateforme e-learning
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </CardContent>
    </Card>
  );
}
