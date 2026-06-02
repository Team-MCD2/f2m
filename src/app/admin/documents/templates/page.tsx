import Link from "next/link";
import { Sparkles } from "lucide-react";
import { AdminPageHeader } from "@/components/layout/admin-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DOCUMENT_TEMPLATES } from "@/data/document-templates";
import { PARCOURS_LABELS } from "@/types";

const CATEGORIE_LABELS = {
  admission: "Admission",
  formation: "Formation",
  certification: "Certification",
  administratif: "Administratif",
} as const;

export default function TemplatesPage() {
  const byCat = DOCUMENT_TEMPLATES.reduce(
    (acc, t) => {
      if (!acc[t.categorie]) acc[t.categorie] = [];
      acc[t.categorie].push(t);
      return acc;
    },
    {} as Record<string, typeof DOCUMENT_TEMPLATES>
  );

  return (
    <>
      <AdminPageHeader
        title="Modèles de documents"
        description="Environ une dizaine de documents types — fiches, attestations, SARFA VAE, grilles jury. Les modèles marqués « Actif » sont générables dans ce prototype."
      >
        <Link href="/admin/documents/generer">
          <Button>
            <Sparkles className="mr-2 h-4 w-4" />
            Générer un document
          </Button>
        </Link>
      </AdminPageHeader>

      <div className="space-y-8">
        {(
          Object.keys(CATEGORIE_LABELS) as Array<keyof typeof CATEGORIE_LABELS>
        ).map((cat) => (
          <section key={cat}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              {CATEGORIE_LABELS[cat]}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {byCat[cat]?.map((t) => (
                <Card key={t.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">{t.nom}</CardTitle>
                      <Badge
                        className={
                          t.disponible
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600"
                        }
                      >
                        {t.disponible ? "Actif" : "Phase 2"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3 text-sm text-slate-600">{t.description}</p>
                    <p className="text-xs text-slate-500">
                      Parcours :{" "}
                      {t.parcours === "tous"
                        ? "Tous"
                        : t.parcours.map((p) => PARCOURS_LABELS[p]).join(", ")}
                    </p>
                    {t.disponible && (
                      <Link
                        href={`/admin/documents/generer?type=${t.id}`}
                        className="mt-4 inline-block text-sm font-medium text-f2m-blue hover:underline"
                      >
                        Utiliser ce modèle →
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
