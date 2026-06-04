"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Inbox,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/demandes", label: "Demandes", icon: Inbox },
  { href: "/admin/acceptes", label: "Acceptés", icon: CheckCircle2 },
  { href: "/admin/refuses", label: "Refusés", icon: XCircle },
  { href: "/admin/export", label: "Export CDC", icon: FileSpreadsheet },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
            F2M
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">CRM F2M</p>
            <p className="text-xs text-slate-500">Dirigeant de sécurité</p>
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <UserButton />
      </div>
    </header>
  );
}
