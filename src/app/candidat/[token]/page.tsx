"use client";

import { CandidatDashboard } from "@/components/candidat/candidat-dashboard";
import { CandidatShell } from "@/components/layout/candidat-shell";

export default function CandidatDashboardPage() {
  return (
    <CandidatShell title="Tableau de bord">
      <CandidatDashboard />
    </CandidatShell>
  );
}
