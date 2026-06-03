/**
 * Crée le bucket Supabase Storage pour les documents candidats.
 *
 * Usage : npm run setup:storage
 * Prérequis : .env.local avec NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const DEFAULT_BUCKET = "candidat-documents";
const MAX_BYTES = 20 * 1024 * 1024;

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  const content = readFileSync(path, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucketName = process.env.SUPABASE_STORAGE_BUCKET || DEFAULT_BUCKET;

if (!url || !serviceKey) {
  console.error("❌ Manquant dans .env.local :");
  if (!url) console.error("   - NEXT_PUBLIC_SUPABASE_URL");
  if (!serviceKey) console.error("   - SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function bucketExists(name) {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) throw error;
  return data?.some((b) => b.id === name || b.name === name) ?? false;
}

async function main() {
  console.log(`\n📦 Configuration Storage Supabase`);
  console.log(`   Projet : ${url}`);
  console.log(`   Bucket : ${bucketName}\n`);

  const exists = await bucketExists(bucketName);

  if (exists) {
    console.log(`✅ Le bucket « ${bucketName} » existe déjà. Rien à créer.`);
  } else {
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: MAX_BYTES,
      allowedMimeTypes: [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/html",
        "text/plain",
      ],
    });

    if (error) {
      console.error("❌ Échec création bucket :", error.message);
      console.error("\n💡 Alternative : exécutez le SQL");
      console.error("   supabase/migrations/20260603_storage_bucket.sql");
      console.error("   dans Supabase → SQL Editor\n");
      process.exit(1);
    }

    console.log(`✅ Bucket créé :`, data?.name ?? bucketName);
    console.log(`   Public : oui (lecture directe via URL)`);
    console.log(`   Taille max : 20 Mo par fichier`);
  }

  const { data: buckets } = await supabase.storage.listBuckets();
  console.log("\n📋 Buckets du projet :");
  for (const b of buckets ?? []) {
    console.log(`   - ${b.name} (public: ${b.public ? "oui" : "non"})`);
  }

  console.log("\n📝 Ajoutez dans .env.local si ce n’est pas fait :");
  console.log(`   SUPABASE_STORAGE_BUCKET=${bucketName}\n`);
  console.log("⚠️  Si les uploads échouent encore, exécutez aussi :");
  console.log("   supabase/migrations/20260603_storage_bucket.sql");
  console.log("   (politiques RLS de lecture publique)\n");
}

main().catch((e) => {
  console.error("❌", e.message ?? e);
  process.exit(1);
});
