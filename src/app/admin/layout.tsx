import { AdminShell } from "@/components/layout/admin-shell";

/** Pas de prérendu au build (Supabase requis à la demande). */
export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
