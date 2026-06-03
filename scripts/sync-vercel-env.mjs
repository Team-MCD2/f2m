/**
 * Recopie .env.local → .env.vercel (pour import bulk dans le dashboard Vercel).
 * Usage : npm run vercel:env
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";

const root = process.cwd();
const localPath = resolve(root, ".env.local");
const vercelPath = resolve(root, ".env.vercel");

const KEYS = [
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "NEXT_PUBLIC_CLERK_SIGN_IN_URL",
  "NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL",
  "NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_STORAGE_BUCKET",
  "EMAIL_USER",
  "EMAIL_PASS",
  "EMAIL_FROM",
  "NEXT_PUBLIC_APP_URL",
];

function parseEnv(content) {
  const map = new Map();
  for (const line of content.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    map.set(t.slice(0, eq).trim(), t.slice(eq + 1).trim());
  }
  return map;
}

if (!existsSync(localPath)) {
  console.error("Fichier .env.local introuvable.");
  process.exit(1);
}

const map = parseEnv(readFileSync(localPath, "utf8"));

if (!map.get("NEXT_PUBLIC_APP_URL")) {
  map.set("NEXT_PUBLIC_APP_URL", "https://f2m-f1yb.vercel.app");
}

const lines = [
  "# Généré par npm run vercel:env — import dans Vercel → Settings → Environment Variables",
  "# Production + Preview + Development",
  "",
];

for (const key of KEYS) {
  const val = map.get(key);
  if (val !== undefined && val !== "") lines.push(`${key}=${val}`);
}

writeFileSync(vercelPath, lines.join("\n") + "\n", "utf8");
console.log("✓ Écrit :", vercelPath);
console.log("  → Vercel Dashboard → Settings → Environment Variables → Import .env");
