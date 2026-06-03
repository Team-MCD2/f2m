"use client";

import { useEffect, useRef, useState } from "react";
import { useCandidatSync } from "@/components/candidat/candidat-sync-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, CheckCheck, FileText, Info, Mail, X } from "lucide-react";
import type { CandidatNotification } from "@/components/candidat/candidat-sync-context";

function formatNotifDate(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60_000);
    if (diffMin < 1) return "À l'instant";
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `Il y a ${diffH} h`;
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  } catch {
    return "";
  }
}

function NotifIcon({ type }: { type: string }) {
  const className = "h-4 w-4 shrink-0";
  switch (type) {
    case "relance":
      return <Mail className={cn(className, "text-violet-600")} />;
    case "document":
      return <FileText className={cn(className, "text-emerald-600")} />;
    case "statut":
      return <Info className={cn(className, "text-sky-600")} />;
    default:
      return <Bell className={cn(className, "text-slate-500")} />;
  }
}

function NotifItem({
  n,
  onDismiss,
}: {
  n: CandidatNotification;
  onDismiss: (id: string) => void;
}) {
  return (
    <li
      className={cn(
        "relative border-b border-slate-50 px-4 py-3 text-sm transition-colors",
        !n.lu ? "bg-sky-50/80" : "bg-white"
      )}
    >
      {!n.lu && (
        <span className="absolute left-1.5 top-4 h-2 w-2 rounded-full bg-sky-500" aria-hidden />
      )}
      <div className="flex gap-3 pl-3">
        <NotifIcon type={n.type} />
        <div className="min-w-0 flex-1 pr-6">
          <p className={cn("font-medium", !n.lu ? "text-f2m-navy" : "text-slate-600")}>
            {n.titre}
          </p>
          <p className="mt-0.5 line-clamp-3 text-xs text-slate-500">{n.message}</p>
          <p className="mt-1 text-[10px] text-slate-400">{formatNotifDate(n.created_at)}</p>
        </div>
      </div>
      {!n.lu && (
        <button
          type="button"
          onClick={() => onDismiss(n.id)}
          className="absolute right-2 top-2 rounded p-1 text-slate-400 hover:bg-slate-100"
          aria-label="Marquer comme lu"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </li>
  );
}

export function CandidatNotificationsBell() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, dismissOne, dismissAll } = useCandidatSync();

  const unread = notifications.filter((n) => !n.lu);
  const read = notifications.filter((n) => n.lu).slice(0, 5);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,380px)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">Notifications</p>
            {unreadCount > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-slate-600"
                onClick={() => void dismissAll()}
              >
                <CheckCheck className="mr-1 h-3.5 w-3.5" />
                Tout marquer lu
              </Button>
            )}
          </div>

          <ul className="max-h-[min(60vh,420px)] overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="px-4 py-10 text-center text-sm text-slate-500">
                Aucune notification
              </li>
            ) : (
              <>
                {unread.map((n) => (
                  <NotifItem key={n.id} n={n} onDismiss={(id) => void dismissOne(id)} />
                ))}
                {read.length > 0 && unread.length > 0 && (
                  <li className="bg-slate-50 px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Déjà lues
                  </li>
                )}
                {read.map((n) => (
                  <NotifItem key={n.id} n={n} onDismiss={() => {}} />
                ))}
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
