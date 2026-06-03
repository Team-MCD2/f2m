"use client";

import { useEffect } from "react";
import { useCandidats } from "@/lib/store";

/** Rafraîchit la liste candidats quand une nouvelle notification admin arrive. */
export function AdminAutoRefresh() {
  const { refresh } = useCandidats();

  useEffect(() => {
    const onNew = () => void refresh();
    window.addEventListener("admin:new-notification", onNew);
    const interval = setInterval(() => void refresh(), 45_000);
    return () => {
      window.removeEventListener("admin:new-notification", onNew);
      clearInterval(interval);
    };
  }, [refresh]);

  return null;
}
