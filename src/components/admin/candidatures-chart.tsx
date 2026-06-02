"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/supabase/types";

export function CandidaturesChart({ data }: { data: DashboardStats | null }) {
  const points = data?.parMois?.length
    ? [...data.parMois].reverse()
    : [{ mois: "—", count: 0 }];

  const max = Math.max(...points.map((p) => p.count), 1);

  return (
    <Card className="border-slate-100 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-slate-900">
          Aperçu des candidatures
        </CardTitle>
        <p className="text-sm text-slate-500">
          Visualisation des dossiers déposés et acceptés par mois.
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex h-56 items-end justify-between gap-2 border-b border-slate-100 pb-2 pt-4">
          {points.map((point) => {
            const height = Math.max((point.count / max) * 100, point.count > 0 ? 8 : 4);
            return (
              <div
                key={point.mois}
                className="flex flex-1 flex-col items-center gap-2"
                title={`${point.mois}: ${point.count}`}
              >
                <span className="text-xs font-medium text-slate-600">{point.count}</span>
                <div
                  className="w-full max-w-[48px] rounded-t-md bg-violet-300 transition-all hover:bg-violet-400"
                  style={{ height: `${height}%` }}
                />
                <span className="max-w-full truncate text-[10px] text-slate-400">
                  {point.mois}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
