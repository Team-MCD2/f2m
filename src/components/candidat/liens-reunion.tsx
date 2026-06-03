"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Video } from "lucide-react";

interface LiensReunionProps {
  candidatId: string;
}

export function LiensReunion({ candidatId }: LiensReunionProps) {
  const [teamsUrl, setTeamsUrl] = useState("");
  const [elearningUrl, setElearningUrl] = useState("");
  const [label, setLabel] = useState("");

  useEffect(() => {
    fetch(`/api/candidats/${candidatId}/reunion`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        setTeamsUrl(data.teamsUrl ?? "");
        setElearningUrl(data.elearningUrl ?? "");
        setLabel(data.parcoursLabel ?? "");
      })
      .catch(() => {});
  }, [candidatId]);

  if (!teamsUrl && !elearningUrl) return null;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base text-f2m-navy">
          <Video className="h-4 w-4" />
          Réunion & formation
          {label && <span className="text-sm font-normal text-slate-500">— {label}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {teamsUrl && (
          <a
            href={teamsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-f2m-blue hover:underline"
          >
            Rejoindre la réunion Teams
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
        {elearningUrl && (
          <a
            href={elearningUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-f2m-blue hover:underline"
          >
            Plateforme e-learning
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </CardContent>
    </Card>
  );
}
