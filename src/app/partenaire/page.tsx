"use client";

import Link from "next/link";
import { useState } from "react";
import { LogoutButton } from "@/components/auth/logout-button";
import { CandidatList } from "@/components/admin/candidat-list";
import { PortailForm } from "@/components/candidat/portail-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCandidats } from "@/lib/store";
import { PARTENAIRES } from "@/data/mock";
import { Building2, Plus, Users } from "lucide-react";

const PARTENAIRE_ID = "part-marseille-sud";

export default function PartenairePage() {
  const { candidats } = useCandidats();
  const partenaire = PARTENAIRES.find((p) => p.id === PARTENAIRE_ID)!;
  const mesCandidats = candidats.filter((c) => c.partenaireId === PARTENAIRE_ID);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-700 p-2 text-white">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-f2m-navy">{partenaire.nom}</h1>
              <p className="text-sm text-slate-600">Portail partenaire — {partenaire.ville}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-slate-500 hover:text-f2m-navy">
              Accueil
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-slate-600">
            <Users className="h-5 w-5" />
            <span className="text-sm">
              <strong>{mesCandidats.length}</strong> candidat(s) associé(s)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 rounded-md bg-f2m-navy px-4 py-2 text-sm font-medium text-white hover:bg-f2m-navy/90"
          >
            <Plus className="h-4 w-4" />
            {showForm ? "Fermer le formulaire" : "Créer un dossier candidat"}
          </button>
        </div>

        {showForm && (
          <div className="mb-8">
            <PortailForm
              partenaireId={PARTENAIRE_ID}
              redirectAfterSubmit="/partenaire"
            />
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mes candidats</CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="search"
              placeholder="Rechercher par nom..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4 h-10 w-full max-w-sm rounded-md border border-slate-300 px-3 text-sm"
            />
            {mesCandidats.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">
                Aucun candidat pour ce partenaire. Ibrahim N. est le candidat mock associé.
              </p>
            ) : (
              <CandidatList
                filterStatut={["demande", "accepte", "refuse", "en_formation", "diplome"]}
                search={search}
                partenaireId={PARTENAIRE_ID}
                hideAdminLink
              />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
