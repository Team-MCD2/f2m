"use client";

import { usePathname } from "next/navigation";
import { PortalCtaBand } from "@/components/vitrine/portal-cta-band";

const PORTAL_CTA_PATHS = new Set(["/", "/formation-dgesp"]);

export function VitrinePortalCtaGate() {
  const pathname = usePathname();
  if (!pathname || !PORTAL_CTA_PATHS.has(pathname)) return null;
  return <PortalCtaBand />;
}
