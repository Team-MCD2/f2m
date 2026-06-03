"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCandidatPortal } from "@/components/candidat/candidat-portal-context";
import { cn } from "@/lib/utils";
import { FileText, LayoutDashboard, Video } from "lucide-react";

export function CandidatMobileNav() {
  const { basePath } = useCandidatPortal();
  const pathname = usePathname();

  const items = [
    { href: basePath, label: "Accueil", icon: LayoutDashboard, exact: true },
    { href: `${basePath}/documents`, label: "Documents", icon: FileText },
    { href: `${basePath}/formation`, label: "Formation", icon: Video },
  ];

  return (
    <nav className="flex border-b border-slate-200 bg-white lg:hidden">
      {items.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-medium",
              active ? "text-f2m-navy" : "text-slate-500"
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
