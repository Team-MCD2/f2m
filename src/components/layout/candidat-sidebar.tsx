"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/auth/logout-button";
import { useCandidatPortal } from "@/components/candidat/candidat-portal-context";
import { cn } from "@/lib/utils";
import { Cloud, FileText, LayoutDashboard, Video } from "lucide-react";

function NavLink({
  href,
  label,
  icon: Icon,
  exact,
}: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
        active
          ? "bg-f2m-navy text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <Icon className="h-5 w-5 shrink-0 opacity-90" />
      {label}
    </Link>
  );
}

export function CandidatSidebar() {
  const { basePath } = useCandidatPortal();

  const nav = [
    { href: basePath, label: "Tableau de bord", icon: LayoutDashboard, exact: true },
    { href: `${basePath}/documents`, label: "Mes documents", icon: FileText },
    { href: `${basePath}/formation`, label: "Formation & réunion", icon: Video },
  ];

  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-100 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-f2m-navy text-white">
          <Cloud className="h-5 w-5" />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            F2M<span className="text-f2m-gold">.</span>
          </span>
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
            Espace candidat
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {nav.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
      </nav>

      <div className="border-t border-slate-100 px-3 py-4">
        <LogoutButton className="w-full justify-start rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700">
          Déconnexion
        </LogoutButton>
      </div>
    </aside>
  );
}
