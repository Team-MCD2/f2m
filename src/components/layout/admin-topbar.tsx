"use client";

import { Search } from "lucide-react";
import { AdminNotificationsBell } from "@/components/layout/admin-notifications-bell";
import { useAdminSearch } from "@/components/layout/admin-search-context";

export function AdminTopbar() {
  const { query, setQuery } = useAdminSearch();

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-6">
      <div className="relative max-w-xl flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Rechercher dans le tableau…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-9 w-full rounded border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#217346] focus:outline-none focus:ring-1 focus:ring-[#217346]"
        />
      </div>
      <AdminNotificationsBell />
    </header>
  );
}
