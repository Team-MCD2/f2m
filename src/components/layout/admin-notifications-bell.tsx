"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminNotification {
  id: string;
  type: string;
  titre: string;
  message: string;
  candidatId?: string;
  lu: boolean;
  createdAt: string;
}

export function AdminNotificationsBell() {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [items, setItems] = useState<AdminNotification[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const prevUnread = useRef(0);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      if (!res.ok) return;
      const data = await res.json();
      const count = data.unreadCount ?? 0;
      setItems(data.notifications ?? []);
      setUnreadCount(count);
      if (count > prevUnread.current) {
        window.dispatchEvent(new CustomEvent("admin:new-notification"));
      }
      prevUnread.current = count;
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void load();
    const id = setInterval(() => void load(), 20_000);
    return () => clearInterval(id);
  }, [load]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next) {
      await load();
      if (unreadCount > 0) {
        await fetch("/api/admin/notifications", { method: "PATCH" });
        setUnreadCount(0);
        setItems((prev) => prev.map((n) => ({ ...n, lu: true })));
      }
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => void toggle()}
        className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-slate-200 bg-white shadow-lg">
          <div className="border-b px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">Notifications</p>
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-slate-500">Aucune notification</li>
            ) : (
              items.map((n) => (
                <li
                  key={n.id}
                  className={cn(
                    "border-b border-slate-50 px-4 py-3 text-sm",
                    !n.lu && "bg-sky-50"
                  )}
                >
                  <p className="font-medium text-slate-900">{n.titre}</p>
                  <p className="mt-0.5 text-slate-600">{n.message}</p>
                  {n.candidatId && (
                    <Link
                      href={`/admin/candidats/${n.candidatId}`}
                      className="mt-1 inline-block text-xs text-f2m-blue hover:underline"
                      onClick={() => setOpen(false)}
                    >
                      Voir le dossier
                    </Link>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
