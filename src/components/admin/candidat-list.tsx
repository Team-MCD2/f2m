"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCandidats } from "@/lib/store";
import type { Candidat, StatutCandidat } from "@/types";
import { PARCOURS_LABELS, STATUT_COLORS, STATUT_LABELS } from "@/types";
import { formatDate, fullName } from "@/lib/utils";
import { Eye } from "lucide-react";

interface CandidatListProps {
  filterStatut: StatutCandidat | StatutCandidat[];
  search: string;
  partenaireId?: string;
  onAccept?: (id: string) => void;
  onRefuse?: (id: string) => void;
  showActions?: boolean;
  hideAdminLink?: boolean;
}

export function CandidatList({
  filterStatut,
  search,
  partenaireId,
  onAccept,
  onRefuse,
  showActions = false,
  hideAdminLink = false,
}: CandidatListProps) {
  const { candidats } = useCandidats();
  const statuses = Array.isArray(filterStatut) ? filterStatut : [filterStatut];

  const filtered = candidats.filter((c) => {
    const matchStatut = statuses.includes(c.statut);
    const matchPartenaire = !partenaireId || c.partenaireId === partenaireId;
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      fullName(c.nom, c.prenom).toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q);
    return matchStatut && matchSearch && matchPartenaire;
  });

  if (filtered.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-500">Aucun dossier trouvé.</p>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {filtered.map((c) => (
        <CandidatRow
          key={c.id}
          candidat={c}
          showActions={showActions}
          hideAdminLink={hideAdminLink}
          onAccept={onAccept}
          onRefuse={onRefuse}
        />
      ))}
    </div>
  );
}

function CandidatRow({
  candidat: c,
  showActions,
  hideAdminLink,
  onAccept,
  onRefuse,
}: {
  candidat: Candidat;
  showActions: boolean;
  hideAdminLink?: boolean;
  onAccept?: (id: string) => void;
  onRefuse?: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-f2m-navy">
            {fullName(c.nom, c.prenom)}
          </p>
          <Badge className={STATUT_COLORS[c.statut]}>{STATUT_LABELS[c.statut]}</Badge>
        </div>
        <p className="mt-1 text-sm text-slate-600">
          {PARCOURS_LABELS[c.parcours]} — {formatDate(c.dateDemande)}
        </p>
        <p className="text-xs text-slate-400">{c.email}</p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        {showActions && c.statut === "demande" && (
          <>
            <Button size="sm" onClick={() => onAccept?.(c.id)}>
              Accepter
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onRefuse?.(c.id)}>
              Refuser
            </Button>
          </>
        )}
        {!hideAdminLink && (
          <Link href={`/admin/candidats/${c.id}`}>
            <Button size="sm" variant="outline">
              <Eye className="mr-1 h-4 w-4" />
              Voir fiche
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
