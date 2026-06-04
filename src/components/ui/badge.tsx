import { cn } from "@/lib/utils";
import type { CandidateStatus } from "@/types/database";

const STATUS_STYLES: Record<CandidateStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
};

export function Badge({
  children,
  className,
  status,
}: {
  children: React.ReactNode;
  className?: string;
  status?: CandidateStatus;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        status && STATUS_STYLES[status],
        className
      )}
    >
      {children}
    </span>
  );
}
