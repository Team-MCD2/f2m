"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/auth/logout-button";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Cloud,
  FileStack,
  LayoutDashboard,
  Settings,
  Sparkles,
} from "lucide-react";

const mainNav = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/documents/generer", label: "Documents", icon: Sparkles },
  { href: "/admin/documents/templates", label: "Modèles", icon: FileStack },
  { href: "/admin/stats", label: "Statistiques", icon: BarChart3 },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-100 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-f2m-navy text-white">
          <Cloud className="h-5 w-5" />
        </div>
        <span className="text-lg font-bold tracking-tight text-slate-900">
          F2M<span className="text-f2m-gold">.</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {mainNav.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(pathname, href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className="h-5 w-5 shrink-0 opacity-90" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-slate-100 px-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <Settings className="h-5 w-5" />
          Site public
        </Link>
        <LogoutButton className="w-full justify-start rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700">
          Déconnexion
        </LogoutButton>
      </div>
    </aside>
  );
}
