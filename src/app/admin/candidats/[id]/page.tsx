"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { AdminPageHeader } from "@/components/layout/admin-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { openDocumentPrint } from "@/lib/documents";
import { useCandidats } from "@/lib/store";
import { PARTENAIRES } from "@/data/mock";
import type { DocumentType } from "@/types";
import {
  DOCUMENT_LABELS,
  PARCOURS_LABELS,
  STATUT_COLORS,
  STATUT_LABELS,
} from "@/types";
import { formatDate, fullName } from "@/lib/utils";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  GraduationCap,
  Link2,
  Paperclip,
  User,
} from "lucide-react";

const DOC_TYPES: DocumentType[] = [
  "fiche_renseignement",
  "attestation_entree",
  "attestation_fin",
  "feuille_emargement",
];

export default function CandidatFichePage() {
  const params = useParams();
  const id = params.id as string;
  const { getCandidat, updateNumeroDiplome, updateLiens, addDocument, updateStatut } =
    useCandidats();
  const candidat = getCandidat(id);
  const [numeroDiplome, setNumeroDiplome] = useState(candidat?.numeroDiplome || "");
  const [teamsUrl, setTeamsUrl] = useState(candidat?.liens.teamsUrl || "");

  if (!candidat) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-600">Candidat introuvable.</p>
        <Link href="/admin" className="mt-4 inline-block text-f2m-blue hover:underline">
          Retour au tableau de bord
        </Link>
      </div>
    );
  }

  const partenaire = candidat.partenaireId
    ? PARTENAIRES.find((p) => p.id === candidat.partenaireId)
    : null;

  const handleGenerate = (type: DocumentType) => {
    addDocument(candidat.id, type);
    openDocumentPrint(candidat, type);
  };

  const saveDiplome = () => {
    updateNumeroDiplome(candidat.id, numeroDiplome);
  };

  const saveTeams = () => {
    updateLiens(candidat.id, { teamsUrl });
  };

  return (
    <>
      <Link
        href="/admin"
        className="mb-4 inline-flex items-center gap-1 text-sm text-slate-600 hover:text-f2m-navy"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Link>

      <AdminPageHeader
        title={fullName(candidat.nom, candidat.prenom)}
        description={`${PARCOURS_LABELS[candidat.parcours]} — Demande du ${formatDate(candidat.dateDemande)}`}
      >
        <div className="flex flex-wrap gap-2">
          <Badge className={STATUT_COLORS[candidat.statut]}>
            {STATUT_LABELS[candidat.statut]}
          </Badge>
          {candidat.statut === "demande" && (
            <>
              <Button size="sm" onClick={() => updateStatut(candidat.id, "accepte")}>
                Accepter
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => updateStatut(candidat.id, "refuse")}
              >
                Refuser
              </Button>
            </>
          )}
        </div>
      </AdminPageHeader>

      <Tabs defaultValue="infos">
        <TabsList className="mb-4 flex-wrap h-auto">
          <TabsTrigger value="infos">
            <User className="mr-1 h-4 w-4" />
            Informations
          </TabsTrigger>
          <TabsTrigger value="pieces">
            <Paperclip className="mr-1 h-4 w-4" />
            Pièces jointes
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="mr-1 h-4 w-4" />
            Documents générés
          </TabsTrigger>
          <TabsTrigger value="liens">
            <Link2 className="mr-1 h-4 w-4" />
            Liens
          </TabsTrigger>
        </TabsList>

        <TabsContent value="infos">
          <Card>
            <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
              <InfoField label="Email" value={candidat.email} />
              <InfoField label="Téléphone" value={candidat.telephone} />
              <InfoField
                label="Naissance"
                value={`${formatDate(candidat.dateNaissance)} — ${candidat.lieuNaissance}`}
              />
              <InfoField
                label="Adresse"
                value={`${candidat.adresse}, ${candidat.codePostal} ${candidat.ville}`}
              />
              <InfoField label="N° Sécu" value={candidat.numeroSecu || "—"} />
              <InfoField label="Carte Vitale" value={candidat.numeroCarteVitale || "—"} />
              <InfoField
                label="Expérience sécu"
                value={candidat.experienceSecu ? "Oui" : "Non"}
              />
              <InfoField
                label="Diplôme scolaire"
                value={candidat.diplomeScolaire ? "Oui" : "Non"}
              />
              {partenaire && (
                <InfoField label="Partenaire" value={partenaire.nom} />
              )}
              {candidat.notes && (
                <div className="sm:col-span-2">
                  <InfoField label="Notes" value={candidat.notes} />
                </div>
              )}
              <div className="sm:col-span-2 border-t pt-4">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-f2m-navy">
                  <GraduationCap className="h-4 w-4" />
                  Numéro de diplôme
                </label>
                <div className="flex gap-2 max-w-sm">
                  <Input
                    value={numeroDiplome}
                    onChange={(e) => setNumeroDiplome(e.target.value)}
                    placeholder="Ex: DS-2025-0142"
                  />
                  <Button variant="secondary" onClick={saveDiplome}>
                    Enregistrer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pieces">
          <Card>
            <CardContent className="p-6">
              <ul className="divide-y divide-slate-100">
                {candidat.piecesJointes.map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium">
                        {p.label}
                        {p.obligatoire && <span className="text-red-500"> *</span>}
                      </p>
                      {p.fichierNom && (
                        <p className="text-xs text-slate-500">{p.fichierNom}</p>
                      )}
                    </div>
                    <Badge
                      className={
                        p.fournie
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-600"
                      }
                    >
                      {p.fournie ? "Fourni" : "Manquant"}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-base">Générer un document</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {DOC_TYPES.map((type) => (
                <Button key={type} variant="outline" onClick={() => handleGenerate(type)}>
                  <FileText className="mr-2 h-4 w-4" />
                  {DOCUMENT_LABELS[type]}
                </Button>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Historique</CardTitle>
            </CardHeader>
            <CardContent>
              {candidat.documentsGeneres.length === 0 ? (
                <p className="text-sm text-slate-500">Aucun document généré.</p>
              ) : (
                <ul className="space-y-2">
                  {candidat.documentsGeneres.map((d) => (
                    <li
                      key={d.id}
                      className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3"
                    >
                      <span className="text-sm font-medium">{d.nom}</span>
                      <span className="text-xs text-slate-500">
                        {formatDate(d.genereLe)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="liens">
          <Card>
            <CardContent className="space-y-6 p-6">
              <div>
                <p className="mb-2 text-sm font-medium text-f2m-navy">
                  Plateforme e-learning (mock)
                </p>
                {candidat.liens.eLearningUrl ? (
                  <a
                    href={candidat.liens.eLearningUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-f2m-blue hover:underline"
                  >
                    Accéder à la plateforme
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <p className="text-sm text-slate-500">Non configuré</p>
                )}
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-f2m-navy">
                  Lien Teams (mock)
                </p>
                <div className="flex flex-wrap gap-2 max-w-lg">
                  <Input
                    value={teamsUrl}
                    onChange={(e) => setTeamsUrl(e.target.value)}
                    placeholder="https://teams.microsoft.com/..."
                  />
                  <Button variant="secondary" onClick={saveTeams}>
                    Enregistrer
                  </Button>
                </div>
                {teamsUrl && (
                  <a
                    href={teamsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 text-sm text-f2m-blue hover:underline"
                  >
                    Ouvrir Teams
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-f2m-navy">
                  Portail candidat
                </p>
                <Link
                  href={`/candidat/${candidat.token}`}
                  className="text-sm text-f2m-blue hover:underline"
                >
                  /candidat/{candidat.token}
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <p className="text-sm text-slate-900">{value}</p>
    </div>
  );
}
