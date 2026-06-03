/** URL publique du site (emails, liens d'activation). */
const DEFAULT_APP_URL = "https://f2m-f1yb.vercel.app";

export function getAppUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return DEFAULT_APP_URL;
}
