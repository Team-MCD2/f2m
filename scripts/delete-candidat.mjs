/**
 * Supprime un candidat dans Supabase (+ fichiers storage + profil).
 * Le compte Clerk doit être supprimé à la main dans le dashboard Clerk.
 *
 * Usage :
 *   npm run delete:candidat -- --email=linuxcam05@gmail.com
 *   npm run delete:candidat -- --token=cam-linux
 *   npm run delete:candidat -- --id=uuid-...
 *   npm run delete:candidat -- --email=... --yes   (sans confirmation)
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
      val = val.slice(1, -1);
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

const args = process.argv.slice(2);
const getArg = (name) => {
  const a = args.find((x) => x.startsWith(`--${name}=`));
  return a ? a.split("=").slice(1).join("=") : null;
};
const email = getArg("email");
const token = getArg("token")?.toLowerCase().replace(/\s+/g, "-");
const id = getArg("id");
const skipConfirm = args.includes("--yes");

if (!email && !token && !id) {
  console.error("Indiquez --email=... ou --token=... ou --id=...");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis (.env.local)");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });
const bucket = process.env.SUPABASE_STORAGE_BUCKET || "candidat-documents";

let q = supabase
  .from("candidats")
  .select("id, token, nom, prenom, email, statut, clerk_user_id");

if (id) q = q.eq("id", id);
else if (token) q = q.eq("token", token);
else q = q.ilike("email", email.trim());

const { data: rows, error: findErr } = await q;

if (findErr) {
  console.error("Erreur:", findErr.message);
  process.exit(1);
}

if (!rows?.length) {
  console.log("Aucun candidat trouvé.");
  process.exit(0);
}

const c = rows[0];
if (rows.length > 1) {
  console.warn(`Attention : ${rows.length} candidats trouvés, seul le premier sera supprimé.`);
}

console.log("\nCandidat à supprimer :");
console.log(`  ${c.prenom} ${c.nom} <${c.email}>`);
console.log(`  token: ${c.token}`);
console.log(`  id:    ${c.id}`);
console.log(`  clerk: ${c.clerk_user_id ?? "(non lié)"}\n`);

if (!skipConfirm) {
  console.log("Relancez avec --yes pour confirmer.");
  console.log(`  npm run delete:candidat -- --email=${c.email} --yes\n`);
  process.exit(0);
}

const { data: fichiers } = await supabase
  .from("documents_fichiers")
  .select("storage, storage_path")
  .eq("candidat_id", c.id);

const storagePaths = (fichiers ?? [])
  .filter((f) => f.storage === "supabase" && f.storage_path)
  .map((f) => f.storage_path);

if (storagePaths.length) {
  const { error: storageErr } = await supabase.storage.from(bucket).remove(storagePaths);
  if (storageErr) console.warn("Storage (certains fichiers) :", storageErr.message);
  else console.log(`Storage : ${storagePaths.length} fichier(s) supprimé(s).`);
}

if (c.clerk_user_id) {
  await supabase.from("profiles").delete().eq("clerk_user_id", c.clerk_user_id);
}
await supabase.from("profiles").delete().eq("candidat_token", c.token);
await supabase.from("admin_notifications").delete().eq("candidat_id", c.id);

const { error: delErr } = await supabase.from("candidats").delete().eq("id", c.id);

if (delErr) {
  console.error("Erreur suppression :", delErr.message);
  process.exit(1);
}

console.log("\n✓ Candidat supprimé de Supabase.");
console.log("→ Supprimez l'utilisateur dans Clerk :", c.email);
