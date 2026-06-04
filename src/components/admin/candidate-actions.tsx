"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateCandidateStatus } from "@/app/actions/candidates";
import type { CandidateStatus } from "@/types/database";

export function CandidateActions({
  candidateId,
  currentStatus,
}: {
  candidateId: string;
  currentStatus: CandidateStatus;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function act(status: CandidateStatus) {
    startTransition(async () => {
      await updateCandidateStatus(candidateId, status);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {currentStatus !== "accepted" && (
        <button
          type="button"
          disabled={pending}
          onClick={() => act("accepted")}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          Accepter
        </button>
      )}
      {currentStatus !== "rejected" && (
        <button
          type="button"
          disabled={pending}
          onClick={() => act("rejected")}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          Refuser
        </button>
      )}
      {currentStatus !== "pending" && (
        <button
          type="button"
          disabled={pending}
          onClick={() => act("pending")}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Remettre en attente
        </button>
      )}
    </div>
  );
}
