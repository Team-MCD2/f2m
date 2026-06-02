import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, GraduationCap, Shield } from "lucide-react";

const portals = [
  {
    href: "/admin",
    title: "Espace Admin",
    description: "Tableau de bord, gestion des dossiers, génération de documents et statistiques.",
    icon: Shield,
    color: "bg-f2m-navy text-white",
  },
  {
    href: "/candidat/jean-dupont",
    title: "Portail Candidat",
    description: "Exemple : Jean Dupont — dépôt de dossier et fiche de renseignement.",
    icon: GraduationCap,
    color: "bg-f2m-blue text-white",
  },
  {
    href: "/partenaire",
    title: "Portail Partenaire",
    description: "Centre Formation Marseille Sud — création de dossiers candidats.",
    icon: Building2,
    color: "bg-slate-700 text-white",
  },
];

const demoLinks = [
  { label: "Fatima Benali (VAE — Demande)", href: "/candidat/fatima-benali" },
  { label: "Admin — Fiche Jean Dupont", href: "/admin/candidats/cand-001" },
  { label: "Statistiques CDC", href: "/admin/stats" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-f2m-cream to-slate-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6">
          <div>
            <h1 className="text-2xl font-bold text-f2m-navy">
              F2M <span className="text-f2m-gold">Consulting</span>
            </h1>
            <p className="text-sm text-slate-600">CRM — Prototype Phase 1</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12">
        <p className="mb-8 text-center text-slate-600">
          Plateforme de gestion des candidats — certification Dirigeant de Sécurité.
          Sélectionnez un espace pour commencer la démonstration.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {portals.map(({ href, title, description, icon: Icon, color }) => (
            <Link key={href} href={href}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className={`mb-3 inline-flex rounded-lg p-3 ${color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">{description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="mt-10">
          <CardHeader>
            <CardTitle className="text-base">Liens de démonstration rapide</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {demoLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-f2m-blue hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
