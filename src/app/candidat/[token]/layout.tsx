"use client";

import { useParams } from "next/navigation";
import { CandidatPortalProvider } from "@/components/candidat/candidat-portal-context";

export default function CandidatTokenLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const token = params.token as string;

  return <CandidatPortalProvider token={token}>{children}</CandidatPortalProvider>;
}
