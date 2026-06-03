"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/auth/logout-button";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  Clock,
  Cloud,
  FileStack,
  LayoutDashboard,
  Mail,
  Sparkles,
  XCircle,
} from "lucide-react";

const mainNav = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
];

const demandesNav = [
  { href: "/admin/demandes/en-cours", label: "En cours", icon: Clock },
  { href: "/admin/demandes/acceptees", label: "Acceptées", icon: CheckCircle },
  { href: "/admin/demandes/refusees", label: "Refusées", icon: XCircle },
];

const toolsNav = [
  { href: "/admin/relances", label: "Relances", icon: Mail },
  { href: "/admin/documents/generer", label: "Documents", icon: Sparkles },
  { href: "/admin/documents/templates", label: "Modèles", icon: FileStack },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  href,
  label,
  icon: Icon,
  exact,
  pathname,
}: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  pathname: string;
}) {
  const active = isActive(pathname, href, exact);
  return (
    <Link
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

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {mainNav.map((item) => (
            <NavLink key={item.href} pathname={pathname} {...item} />
          ))}
        </div>

        <div>
          <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Demandes
          </p>
          <div className="space-y-1">
            {demandesNav.map((item) => (
              <NavLink key={item.href} pathname={pathname} {...item} />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Outils
          </p>
          <div className="space-y-1">
            {toolsNav.map((item) => (
              <NavLink key={item.href} pathname={pathname} {...item} />
            ))}
          </div>
        </div>
      </nav>

      <div className="space-y-1 border-t border-slate-100 px-3 py-4">
        <LogoutButton className="w-full justify-start rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700">
          Déconnexion
        </LogoutButton>
      </div>
    </aside>
  );
}
