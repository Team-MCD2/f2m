"use client";

import { AdminAutoRefresh } from "@/components/layout/admin-auto-refresh";
import { AdminSearchProvider } from "@/components/layout/admin-search-context";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminTopbar } from "@/components/layout/admin-topbar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminSearchProvider>
      <AdminAutoRefresh />
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <AdminTopbar />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </AdminSearchProvider>
  );
}
