"use client";

import { useState } from "react";
import { CandidatList } from "@/components/admin/candidat-list";
import { StatCards } from "@/components/admin/stat-cards";
import { AdminPageHeader } from "@/components/layout/admin-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCandidats } from "@/lib/store";
import type { StatutCandidat } from "@/types";
import { Search } from "lucide-react";

type Tab = "demandes" | "acceptes" | "refuses";

const filterMap: Record<Tab, StatutCandidat | StatutCandidat[]> = {
  demandes: "demande",
  acceptes: ["accepte", "en_formation", "diplome"],
  refuses: "refuse",
};

export default function AdminDashboardPage() {
  const { candidats, updateStatut } = useCandidats();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("demandes");

  const tabs: { id: Tab; label: string }[] = [
    { id: "demandes", label: "Demandes en cours" },
    { id: "acceptes", label: "Dossiers acceptés" },
    { id: "refuses", label: "Dossiers refusés" },
  ];

  return (
    <>
      <AdminPageHeader
        title="Tableau de bord"
        description="Vue d'ensemble des candidatures et dossiers"
      />

      <StatCards candidats={candidats} />

      <div className="mt-8">
        <div className="relative mb-4 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Rechercher par nom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="mb-4 flex flex-wrap gap-2 border-b border-slate-200">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "border-f2m-navy text-f2m-navy"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {tabs.find((t) => t.id === tab)?.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CandidatList
              filterStatut={filterMap[tab]}
              search={search}
              showActions={tab === "demandes"}
              onAccept={(id) => updateStatut(id, "accepte")}
              onRefuse={(id) => updateStatut(id, "refuse")}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
