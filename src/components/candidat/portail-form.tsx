"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getChecklistItems, isChecklistComplete, piecesFromFiles } from "@/lib/checklist";
import { useCandidats, type FicheRenseignement } from "@/lib/store";
import { createTokenFromName } from "@/lib/utils";
import Link from "next/link";
import type { Candidat, ParcoursType } from "@/types";
import { PARCOURS_LABELS } from "@/types";
import {
  isValidNumeroSecu,
  numeroSecuError,
  sanitizeNumeroSecu,
} from "@/lib/validators/secu";
import { Check, FileUp, Upload } from "lucide-react";

const PARCOURS_OPTIONS: ParcoursType[] = [
  "formation_continue",
  "vae",
  "viae",
  "apprentissage",
  "contre_livret",
];

interface PortailFormProps {
  partenaireId?: string;
  redirectAfterSubmit?: string;
  publicSubmit?: boolean;
}

async function uploadPiece(
  candidatId: string,
  token: string,
  pieceId: string,
  file: File
) {
  const form = new FormData();
  form.append("token", token);
  form.append("pieceId", pieceId);
  form.append("file", file);
  const res = await fetch(`/api/public/candidats/${candidatId}/fichiers`, {
    method: "POST",
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `Échec envoi : ${file.name}`);
}

export function PortailForm({
  partenaireId,
  redirectAfterSubmit,
  publicSubmit = false,
}: PortailFormProps) {
  const router = useRouter();
  const { addCandidat } = useCandidats();
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [parcours, setParcours] = useState<ParcoursType>("formation_continue");
  const [experienceSecu, setExperienceSecu] = useState(false);
  const [diplomeScolaire, setDiplomeScolaire] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<Record<string, File>>({});
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState("");
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [secuError, setSecuError] = useState<string | null>(null);

  const [fiche, setFiche] = useState<FicheRenseignement>({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    dateNaissance: "",
    lieuNaissance: "",
    adresse: "",
    codePostal: "",
    ville: "",
    experienceSecu: false,
    diplomeScolaire: false,
    rempli: false,
  });

  const checklist = getChecklistItems(parcours, experienceSecu, diplomeScolaire);

  const setFileForPiece = (pieceId: string, file: File | null) => {
    setPendingFiles((prev) => {
      const next = { ...prev };
      if (file) next[pieceId] = file;
      else delete next[pieceId];
      return next;
    });
  };

  const handleSubmit = async () => {
    const pieces = piecesFromFiles(checklist, pendingFiles);
    if (!isChecklistComplete(pieces)) {
      alert("Veuillez téléverser tous les documents obligatoires.");
      return;
    }
    if (!fiche.nom || !fiche.prenom || !fiche.email) {
      alert("Veuillez remplir la fiche de renseignement.");
      return;
    }

    const secuErr = numeroSecuError(fiche.numeroSecu);
    if (secuErr) {
      setSecuError(secuErr);
      return;
    }
    setSecuError(null);

    const numeroSecu = fiche.numeroSecu ? sanitizeNumeroSecu(fiche.numeroSecu) : undefined;

    setSubmitting(true);
    const newToken = createTokenFromName(fiche.prenom, fiche.nom);
    const candidat: Candidat = {
      id: "",
      token: newToken,
      nom: fiche.nom,
      prenom: fiche.prenom,
      email: fiche.email,
      telephone: fiche.telephone,
      dateNaissance: fiche.dateNaissance,
      lieuNaissance: fiche.lieuNaissance,
      adresse: fiche.adresse,
      codePostal: fiche.codePostal,
      ville: fiche.ville,
      numeroSecu,
      parcours,
      statut: "demande",
      partenaireId,
      dateDemande: new Date().toISOString().split("T")[0],
      experienceSecu,
      diplomeScolaire,
      piecesJointes: pieces,
      fiche: { ...fiche, numeroSecu, experienceSecu, diplomeScolaire, rempli: true },
      documentsGeneres: [],
      liens: { eLearningUrl: "" },
    };

    try {
      let created: Candidat;
      if (publicSubmit) {
        const res = await fetch("/api/public/dossiers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(candidat),
        });
        const data = await res.json();
        if (res.status === 409) {
          if (!data.candidat) {
            throw new Error(
              data.error ??
                "Un dossier existe déjà avec cet email. Connectez-vous ou contactez F2M."
            );
          }
          created = data.candidat as Candidat;
          setDuplicateWarning(
            data.error ??
              "Un dossier existe déjà. Vos pièces jointes seront ajoutées à ce dossier."
          );
        } else if (!res.ok) {
          throw new Error(data.error ?? "Erreur lors de l'enregistrement.");
        } else {
          created = data as Candidat;
        }
      } else {
        created = await addCandidat(candidat);
      }

      for (const [pieceId, file] of Object.entries(pendingFiles)) {
        if (publicSubmit) {
          await uploadPiece(created.id, created.token, pieceId, file);
        } else {
          const form = new FormData();
          form.append("file", file);
          const up = await fetch(`/api/candidats/${created.id}/fichiers`, {
            method: "POST",
            body: form,
          });
          if (!up.ok) {
            const err = await up.json();
            throw new Error(err.error ?? file.name);
          }
        }
      }

      setToken(created.token);
      setSubmitted(true);
      if (redirectAfterSubmit) {
        setTimeout(() => router.push(redirectAfterSubmit), 2000);
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur lors de l'envoi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="border-emerald-200 bg-emerald-50">
        <CardContent className="p-8 text-center">
          <Check className="mx-auto mb-4 h-12 w-12 text-emerald-600" />
          <h2 className="text-xl font-bold text-emerald-800">
            {duplicateWarning ? "Dossier déjà enregistré" : "Dossier soumis avec succès"}
          </h2>
          {duplicateWarning && (
            <p className="mt-2 text-sm text-amber-800">{duplicateWarning}</p>
          )}
          <p className="mt-2 text-slate-600">
            Statut : <strong>DEMANDE</strong> — conservez votre identifiant pour vous reconnecter.
          </p>
          {token && (
            <p className="mt-4 text-sm text-slate-500">
              Identifiant : <code className="rounded bg-white px-2 py-1">{token}</code>
            </p>
          )}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/connexion">
              <Button type="button">Se connecter</Button>
            </Link>
            <Link href="/">
              <Button type="button" variant="outline">
                Retour à l&apos;accueil
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {step >= 1 && (
        <Card>
          <CardHeader>
            <CardTitle>1. Choix du parcours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {PARCOURS_OPTIONS.map((p) => (
                <label
                  key={p}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                    parcours === p
                      ? "border-f2m-navy bg-f2m-cream"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="parcours"
                    checked={parcours === p}
                    onChange={() => setParcours(p)}
                    className="text-f2m-navy"
                  />
                  <span className="text-sm font-medium">{PARCOURS_LABELS[p]}</span>
                </label>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={experienceSecu}
                  onChange={(e) => setExperienceSecu(e.target.checked)}
                />
                J&apos;ai une expérience en sécurité
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={diplomeScolaire}
                  onChange={(e) => setDiplomeScolaire(e.target.checked)}
                />
                J&apos;ai un diplôme scolaire (bac+)
              </label>
            </div>
            <Button className="mt-4" onClick={() => setStep(2)}>
              Continuer
            </Button>
          </CardContent>
        </Card>
      )}

      {step >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle>2. Pièces jointes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-slate-600">
              Téléversez chaque document (PDF, image ou Word). Les fichiers sont enregistrés
              immédiatement après validation du dossier.
            </p>
            <ul className="space-y-3">
              {checklist.map((item) => {
                const file = pendingFiles[item.id];
                return (
                  <li
                    key={item.id}
                    className="flex flex-col gap-2 rounded-lg border border-slate-100 p-3 sm:flex-row sm:items-center"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {item.label}
                        {item.obligatoire && <span className="ml-1 text-red-500">*</span>}
                      </p>
                      {item.condition && (
                        <p className="text-xs text-slate-500">{item.condition}</p>
                      )}
                      {file && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                          <FileUp className="h-3 w-3" />
                          {file.name}
                        </p>
                      )}
                    </div>
                    <label
                      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-2 text-sm transition-colors ${
                        file
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-slate-300 text-slate-600 hover:border-f2m-blue"
                      }`}
                    >
                      <Upload className="h-4 w-4" />
                      {file ? "Changer" : "Choisir un fichier"}
                      <input
                        type="file"
                        className="sr-only"
                        accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          setFileForPiece(item.id, f ?? null);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Retour
              </Button>
              <Button onClick={() => setStep(3)}>Continuer</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step >= 3 && (
        <Card>
          <CardHeader>
            <CardTitle>3. Fiche de renseignement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Nom *</label>
                <Input
                  value={fiche.nom}
                  onChange={(e) => setFiche({ ...fiche, nom: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Prénom *</label>
                <Input
                  value={fiche.prenom}
                  onChange={(e) => setFiche({ ...fiche, prenom: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Email *</label>
                <Input
                  type="email"
                  value={fiche.email}
                  onChange={(e) => setFiche({ ...fiche, email: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Téléphone</label>
                <Input
                  value={fiche.telephone}
                  onChange={(e) => setFiche({ ...fiche, telephone: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Date de naissance</label>
                <Input
                  type="date"
                  value={fiche.dateNaissance}
                  onChange={(e) => setFiche({ ...fiche, dateNaissance: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Lieu de naissance</label>
                <Input
                  value={fiche.lieuNaissance}
                  onChange={(e) => setFiche({ ...fiche, lieuNaissance: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Adresse</label>
                <Input
                  value={fiche.adresse}
                  onChange={(e) => setFiche({ ...fiche, adresse: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Code postal</label>
                <Input
                  value={fiche.codePostal}
                  onChange={(e) => setFiche({ ...fiche, codePostal: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Ville</label>
                <Input
                  value={fiche.ville}
                  onChange={(e) => setFiche({ ...fiche, ville: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">
                  N° Sécurité sociale (chiffres uniquement)
                </label>
                <Input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={fiche.numeroSecu || ""}
                  onChange={(e) => {
                    const v = sanitizeNumeroSecu(e.target.value);
                    setFiche({ ...fiche, numeroSecu: v });
                    setSecuError(numeroSecuError(v));
                  }}
                  placeholder="15 chiffres maximum"
                />
                {secuError && <p className="mt-1 text-xs text-red-600">{secuError}</p>}
                {fiche.numeroSecu && isValidNumeroSecu(fiche.numeroSecu) && !secuError && (
                  <p className="mt-1 text-xs text-emerald-600">
                    {sanitizeNumeroSecu(fiche.numeroSecu).length} chiffres
                  </p>
                )}
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>
                Retour
              </Button>
              <Button onClick={handleSubmit} disabled={submitting || Boolean(secuError)}>
                {submitting ? "Envoi et upload des fichiers…" : "Soumettre le dossier"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
