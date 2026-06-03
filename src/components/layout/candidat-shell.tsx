"use client";

import Link from "next/link";
import { CandidatMobileNav } from "@/components/layout/candidat-mobile-nav";
import { CandidatSidebar } from "@/components/layout/candidat-sidebar";
import { CandidatTopbar } from "@/components/layout/candidat-topbar";
import { useCandidatPortal } from "@/components/candidat/candidat-portal-context";
import { Card, CardContent } from "@/components/ui/card";

export function CandidatShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { loading, error } = useCandidatPortal();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <CandidatSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <CandidatTopbar title={title} />
        <CandidatMobileNav />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {loading ? (
            <p className="text-center text-slate-500">Chargement de votre dossier…</p>
          ) : error ? (
            <Card>
              <CardContent className="space-y-4 p-8 text-center">
                <p className="text-slate-600">{error}</p>
                <Link href="/deposer-dossier" className="text-f2m-blue hover:underline">
                  Déposer un dossier
                </Link>
              </CardContent>
            </Card>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
