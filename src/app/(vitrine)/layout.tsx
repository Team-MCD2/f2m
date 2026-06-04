import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { SiteFooter } from "@/components/vitrine/site-footer";
import { SiteHeader } from "@/components/vitrine/site-header";
import "@/styles/vitrine.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm",
  display: "swap",
});

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
  return (
    <div className={`vitrine-root ${syne.variable} ${dmSans.variable} ${dmSans.className}`}>
      <a href="#main" className="sr-only">
        Aller au contenu principal
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </div>
  );
}
