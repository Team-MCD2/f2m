"use client";

import { useUser } from "@clerk/nextjs";
import { Bell, Search } from "lucide-react";
import { useAdminSearch } from "@/components/layout/admin-search-context";

export function AdminTopbar() {
  const { user } = useUser();
  const { query, setQuery } = useAdminSearch();

  const displayName =
    user?.fullName ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "Administrateur";
  const role =
    (user?.publicMetadata?.role as string)?.toUpperCase() || "ADMIN";
  const initials = displayName
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("") || "AD";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-6">
      <div className="relative max-w-xl flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Rechercher un candidat, un dossier…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/80 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-f2m-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-f2m-blue/20"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-900">{displayName}</p>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {role}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-f2m-navy text-sm font-bold text-white">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
