import type { ReactNode } from "react";
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

export function VitrineShell({ children }: { children: ReactNode }) {
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
