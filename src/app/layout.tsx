import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { frFR } from "@clerk/localizations";
import { Inter } from "next/font/google";
import { CandidatProvider } from "@/lib/store";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "F2M Consulting — CRM",
  description: "Plateforme F2M Consulting — gestion candidats et documents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={frFR}>
      <html lang="fr">
        <body className={inter.className}>
          <CandidatProvider>{children}</CandidatProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
