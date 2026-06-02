"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getChecklistItems, isChecklistComplete, piecesFromChecklist } from "@/lib/checklist";
import {
  createCandidatId,
  createTokenFromName,
  useCandidats,
  type FicheRenseignement,
} from "@/lib/store";
import type { Candidat, ParcoursType } from "@/types";
import { PARCOURS_LABELS } from "@/types";
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
}

export function PortailForm({ partenaireId, redirectAfterSubmit }: PortailFormProps) {
  const router = useRouter();
  const { addCandidat } = useCandidats();
  const [step, setStep] = useState(1);
  const [parcours, setParcours] = useState<ParcoursType>("formation_continue");
  const [experienceSecu, setExperienceSecu] = useState(false);
  const [diplomeScolaire, setDiplomeScolaire] = useState(false);
  const [uploaded, setUploaded] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState("");

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

  const toggleUpload = (id: string) => {
    setUploaded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = () => {
    const pieces = piecesFromChecklist(checklist, uploaded);
    if (!isChecklistComplete(pieces)) {
      alert("Veuillez fournir tous les documents obligatoires.");
      return;
    }
    if (!fiche.nom || !fiche.prenom || !fiche.email) {
      alert("Veuillez remplir la fiche de renseignement.");
      return;
    }

    const newToken = createTokenFromName(fiche.prenom, fiche.nom);
    const candidat: Candidat = {
      id: createCandidatId(),
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
      numeroSecu: fiche.numeroSecu,
      parcours,
      statut: "demande",
      partenaireId,
      dateDemande: new Date().toISOString().split("T")[0],
      experienceSecu,
      diplomeScolaire,
      piecesJointes: pieces,
      fiche: { ...fiche, experienceSecu, diplomeScolaire, rempli: true },
      documentsGeneres: [],
      liens: { eLearningUrl: "" },
    };

    addCandidat(candidat);
    setToken(newToken);
    setSubmitted(true);
    if (redirectAfterSubmit) {
      setTimeout(() => router.push(redirectAfterSubmit), 2000);
    }
  };

  if (submitted) {
    return (
      <Card className="border-emerald-200 bg-emerald-50">
        <CardContent className="p-8 text-center">
          <Check className="mx-auto mb-4 h-12 w-12 text-emerald-600" />
          <h2 className="text-xl font-bold text-emerald-800">Dossier soumis avec succès</h2>
          <p className="mt-2 text-slate-600">
            Votre demande a été enregistrée. Statut : <strong>DEMANDE</strong>
          </p>
          {token && (
            <p className="mt-4 text-sm text-slate-500">
              Référence : <code className="rounded bg-white px-2 py-1">{token}</code>
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Étape 1 — Parcours */}
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

      {/* Étape 2 — Pièces */}
      {step >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle>2. Pièces jointes (simulation)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-slate-600">
              Cochez chaque document que vous auriez téléversé. Les champs obligatoires dépendent de votre profil.
            </p>
            <ul className="space-y-3">
              {checklist.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-3 rounded-lg border border-slate-100 p-3"
                >
                  <button
                    type="button"
                    onClick={() => toggleUpload(item.id)}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                      uploaded[item.id]
                        ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                        : "border-slate-300 text-slate-400 hover:border-f2m-blue"
                    }`}
                  >
                    {uploaded[item.id] ? <Check className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
                  </button>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {item.label}
                      {item.obligatoire && (
                        <span className="ml-1 text-red-500">*</span>
                      )}
                    </p>
                    {item.condition && (
                      <p className="text-xs text-slate-500">{item.condition}</p>
                    )}
                    {uploaded[item.id] && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                        <FileUp className="h-3 w-3" />
                        {item.id}.pdf (fichier fictif)
                      </p>
                    )}
                  </div>
                </li>
              ))}
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

      {/* Étape 3 — Fiche */}
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
                <label className="mb-1 block text-sm font-medium">N° Sécurité sociale</label>
                <Input
                  value={fiche.numeroSecu || ""}
                  onChange={(e) => setFiche({ ...fiche, numeroSecu: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>
                Retour
              </Button>
              <Button onClick={handleSubmit}>Soumettre le dossier</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
