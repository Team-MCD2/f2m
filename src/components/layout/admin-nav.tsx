"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BarChart3, FileText, LayoutDashboard, Sparkles } from "lucide-react";

const links = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/documents/generer", label: "Documents", icon: Sparkles },
  { href: "/admin/documents/templates", label: "Modèles", icon: FileText },
  { href: "/admin/stats", label: "Statistiques", icon: BarChart3 },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-xl font-bold text-f2m-navy">
            F2M <span className="text-f2m-gold">Consulting</span>
          </span>
          <span className="hidden rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 sm:inline">
            Admin
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === href || (href !== "/admin" && pathname.startsWith(href))
                  ? "bg-f2m-navy text-white"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
          <Link
            href="/"
            className="ml-2 text-sm text-slate-500 hover:text-f2m-navy"
          >
            Accueil
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function AdminPageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-f2m-navy">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
      </div>
      {children}
    </div>
  );
}
