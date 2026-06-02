"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface AdminSearchContextValue {
  query: string;
  setQuery: (q: string) => void;
}

const AdminSearchContext = createContext<AdminSearchContextValue | null>(null);

export function AdminSearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  return (
    <AdminSearchContext.Provider value={{ query, setQuery }}>
      {children}
    </AdminSearchContext.Provider>
  );
}

export function useAdminSearch() {
  const ctx = useContext(AdminSearchContext);
  if (!ctx) {
    return { query: "", setQuery: () => {} };
  }
  return ctx;
}
