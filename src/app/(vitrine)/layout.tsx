import type { Metadata } from "next";
import { VitrineShell } from "@/components/vitrine/vitrine-shell";

export const metadata: Metadata = {
  title: {
    default: "F2M Consulting | Formation DGESP Toulouse - Sécurité Privée",
    template: "%s | F2M Consulting",
  },
  description:
    "Centre de formation DGESP à Toulouse — Titre RNCP 36654, VAE, financement CPF. F2M Consulting, organisme Qualiopi spécialiste sécurité privée et CNAPS.",
};

export default function VitrineLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <VitrineShell>{children}</VitrineShell>;
}
