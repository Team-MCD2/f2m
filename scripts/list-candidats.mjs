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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const { data, error } = await supabase
  .from("candidats")
  .select("id, token, nom, prenom, email, statut, clerk_user_id, created_at")
  .order("created_at", { ascending: false });

if (error) {
  console.error("Erreur:", error.message);
  process.exit(1);
}

if (!data?.length) {
  console.log("Aucun candidat en base.");
} else {
  console.log(`${data.length} candidat(s):\n`);
  for (const c of data) {
    console.log(`  Nom      : ${c.prenom} ${c.nom}`);
    console.log(`  ID (UUID): ${c.id}`);
    console.log(`  Token    : ${c.token}`);
    console.log(`  Email    : ${c.email}`);
    console.log(`  Statut   : ${c.statut}`);
    console.log(`  Clerk    : ${c.clerk_user_id ?? "(non lié)"}`);
    console.log(`  Créé le  : ${c.created_at}`);
    console.log(`  Profil admin: /admin/candidats/${c.id}`);
    console.log(`  Portail     : /candidat/${c.token}`);
    console.log("");
  }
}
