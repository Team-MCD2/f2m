"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/layout/admin-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentsPanel } from "@/components/documents/documents-panel";
import { useCandidats } from "@/lib/store";
import type { DocumentType, Partenaire } from "@/types";
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
  const { getCandidat, updateStatut, updateNumeroDiplome, refresh } = useCandidats();
  const candidat = getCandidat(id);
  const [partenaire, setPartenaire] = useState<Partenaire | null>(null);
  const [documentsKey, setDocumentsKey] = useState(0);
  const [numeroDiplome, setNumeroDiplome] = useState(candidat?.numeroDiplome || "");
  const [reunionLiens, setReunionLiens] = useState<{ teamsUrl: string; elearningUrl: string }>({
    teamsUrl: "",
    elearningUrl: "",
  });

  useEffect(() => {
    if (!candidat?.partenaireId) {
      setPartenaire(null);
      return;
    }
    fetch(`/api/partenaires/${candidat.partenaireId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setPartenaire)
      .catch(() => setPartenaire(null));
  }, [candidat?.partenaireId]);

  useEffect(() => {
    if (!candidat?.parcours) return;
    fetch("/api/admin/reunions")
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: { parcours: string; teamsUrl: string; elearningUrl: string }[]) => {
        const row = rows.find((r) => r.parcours === candidat.parcours);
        setReunionLiens({
          teamsUrl: row?.teamsUrl ?? "",
          elearningUrl: row?.elearningUrl ?? "",
        });
      })
      .catch(() => {});
  }, [candidat?.parcours]);

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

  const handleGenerate = async (type: DocumentType) => {
    const res = await fetch(`/api/candidats/${candidat.id}/documents/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Génération impossible");
    if (data.fichier?.url) window.open(data.fichier.url, "_blank");
    await refresh();
    setDocumentsKey((k) => k + 1);
  };

  const saveDiplome = async () => {
    await updateNumeroDiplome(candidat.id, numeroDiplome);
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
            Documents
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

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Générer un document F2M</CardTitle>
              <p className="text-sm text-slate-500">
                Chaque document est enregistré en brouillon. Envoyez-le ensuite depuis la liste
                ci-dessous (sélection ou tout envoyer).
              </p>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {DOC_TYPES.map((type) => (
                <Button
                  key={type}
                  variant="outline"
                  onClick={() => void handleGenerate(type).catch((e) => alert(e.message))}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {DOCUMENT_LABELS[type]}
                </Button>
              ))}
            </CardContent>
          </Card>

          <DocumentsPanel
            key={documentsKey}
            candidatId={candidat.id}
            canUpload
            canDelete
            showSource
            adminMode
            title="Tous les documents de l'élève"
          />
        </TabsContent>

        <TabsContent value="liens">
          <Card>
            <CardContent className="space-y-6 p-6">
              <div>
                <p className="mb-2 text-sm font-medium text-f2m-navy">
                  Formation : {PARCOURS_LABELS[candidat.parcours]}
                </p>
                <p className="text-sm text-slate-600">
                  Les liens Teams et e-learning sont définis par formation dans{" "}
                  <Link href="/admin/reunions" className="text-f2m-blue hover:underline">
                    Espace réunion
                  </Link>
                  .
                </p>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-f2m-navy">Lien Teams</p>
                {reunionLiens.teamsUrl ? (
                  <a
                    href={reunionLiens.teamsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-f2m-blue hover:underline"
                  >
                    Ouvrir Teams
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <p className="text-sm text-slate-500">Non configuré pour ce parcours</p>
                )}
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-f2m-navy">E-learning</p>
                {reunionLiens.elearningUrl ? (
                  <a
                    href={reunionLiens.elearningUrl}
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
