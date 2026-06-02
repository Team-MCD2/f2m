"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import type { UserRole } from "@/lib/auth/roles";

function CallbackHandler() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const expected = searchParams.get("expected") as UserRole | null;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      const q = expected ? `?role=${expected}` : "";
      router.replace(`/connexion${q}`);
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/me");
        const me = await res.json();
        if (!res.ok) {
          setError(me.error ?? "Profil introuvable.");
          return;
        }

        if (expected && me.role !== expected) {
          setError(
            `Ce compte est un compte « ${me.role} », pas « ${expected} ». Choisissez le bon onglet à la connexion.`
          );
          return;
        }

        router.replace(me.redirect);
        router.refresh();
      } catch {
        setError("Erreur lors de la vérification du profil.");
      }
    })();
  }, [isLoaded, isSignedIn, expected, router]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
      {error ? (
        <>
          <p className="mb-4 text-red-600">{error}</p>
          <Link href="/connexion" className="text-f2m-blue hover:underline">
            Retour à la connexion
          </Link>
        </>
      ) : (
        <p className="text-slate-600">Connexion en cours…</p>
      )}
    </div>
  );
}

export default function ConnexionCallbackPage() {
  return (
    <Suspense fallback={<p className="text-center text-slate-600">Connexion en cours…</p>}>
      <CallbackHandler />
    </Suspense>
  );
}
