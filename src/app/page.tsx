import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Award,
  FileCheck,
  GraduationCap,
  Shield,
  Users,
} from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "Parcours certifiant",
    description:
      "Formation continue, VAE, VIAE ou apprentissage vers la certification Dirigeant de sécurité.",
  },
  {
    icon: FileCheck,
    title: "Dossiers numériques",
    description:
      "Dépôt des pièces, fiche de renseignement et suivi du statut de candidature en ligne.",
  },
  {
    icon: Shield,
    title: "Espace administration",
    description:
      "Validation des demandes, génération de documents et exports statistiques pour F2M.",
  },
  {
    icon: Users,
    title: "Réseau partenaires",
    description:
      "Les centres de formation créent et suivent les dossiers de leurs candidats.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-xl font-bold text-f2m-navy">
            F2M <span className="text-f2m-gold">Consulting</span>
          </Link>
          <Link href="/connexion">
            <Button>Connexion</Button>
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-f2m-navy via-f2m-navy to-slate-800 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-f2m-gold/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm backdrop-blur">
              <Award className="h-4 w-4 text-f2m-gold" />
              Certification Dirigeant de sécurité
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Votre parcours vers la certification, simplifié.
            </h1>
            <p className="mt-6 text-lg text-slate-200">
              F2M Consulting accompagne candidats et centres partenaires : gestion des
              dossiers, documents administratifs et suivi de formation, sur une plateforme
              unique et sécurisée.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/connexion">
                <Button size="lg" className="bg-f2m-gold text-f2m-navy hover:bg-f2m-gold/90">
                  Accéder à mon espace
                </Button>
              </Link>
              <Link href="/deposer-dossier">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-transparent text-white hover:bg-white/10"
                >
                  Déposer un dossier
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-f2m-navy">Une plateforme pour chaque acteur</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Administration F2M, candidats et centres partenaires disposent chacun d&apos;un
            espace dédié, accessible après connexion.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 inline-flex rounded-lg bg-f2m-navy p-3 text-white">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-f2m-navy">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-f2m-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-f2m-navy">Prêt à vous connecter ?</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Identifiez-vous selon votre profil : équipe F2M, candidat ou centre partenaire.
          </p>
          <Link href="/connexion" className="mt-8 inline-block">
            <Button size="lg">Connexion</Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-slate-500 sm:flex-row sm:px-6">
          <span>
            © {new Date().getFullYear()} F2M Consulting — Prototype CRM
          </span>
          <Link href="/connexion" className="text-f2m-blue hover:underline">
            Connexion
          </Link>
        </div>
      </footer>
    </div>
  );
}
