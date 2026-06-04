import type { ReactNode } from "react";
import { DM_Sans, Pinyon_Script, Syne } from "next/font/google";
import { SiteFooter } from "@/components/vitrine/site-footer";
import { SiteHeader } from "@/components/vitrine/site-header";
import { VitrineAnimations } from "@/components/vitrine/vitrine-animations";
import { VitrinePortalCtaGate } from "@/components/vitrine/vitrine-portal-cta-gate";
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

/** Script signature — proche du logo manuscrit (textes brand courts). */
const pinyonScript = Pinyon_Script({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-brand",
  display: "swap",
});

export function VitrineShell({ children }: { children: ReactNode }) {
  return (
    <div
      className={`vitrine-root ${syne.variable} ${dmSans.variable} ${pinyonScript.variable} ${dmSans.className}`}
    >
      <a href="#main" className="sr-only">
        Aller au contenu principal
      </a>
      <VitrineAnimations />
      <SiteHeader />
      <main id="main" className="vitrine-main">
        {children}
      </main>
      <VitrinePortalCtaGate />
      <SiteFooter />
    </div>
  );
}
