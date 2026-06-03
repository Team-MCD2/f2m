/**
 * Insère des candidats de démonstration dans Supabase (+ compte Clerk).
 * Usage : npm run seed:candidats
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

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const clerkSecret = process.env.CLERK_SECRET_KEY;

if (!url || !serviceKey) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

const today = new Date().toISOString().split("T")[0];

const PIECES = [
  { id: "cni", label: "Pièce d'identité", obligatoire: true, fournie: true, fichierNom: "cni.pdf" },
  { id: "cv", label: "CV", obligatoire: true, fournie: true, fichierNom: "cv.pdf" },
  { id: "vitale", label: "Carte Vitale", obligatoire: true, fournie: true, fichierNom: "vitale.pdf" },
];

const SEED = [
  {
    token: "jean-dupont",
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont.demo@f2m-consulting.fr",
    telephone: "06 12 34 56 78",
    parcours: "formation_continue",
    statut: "demande",
    date_acceptation: null,
  },
  {
    token: "marie-martin",
    nom: "Martin",
    prenom: "Marie",
    email: "marie.martin.demo@f2m-consulting.fr",
    telephone: "06 98 76 54 32",
    parcours: "vae",
    statut: "accepte",
    date_acceptation: today,
  },
];

async function createClerkUser(email, token) {
  if (!clerkSecret) {
    console.warn("   ⚠ CLERK_SECRET_KEY absente — pas de compte Clerk pour", token);
    return null;
  }

  const password = `Demo-${token}-2026!`;
  const res = await fetch("https://api.clerk.com/v1/users", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${clerkSecret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email_address: [email],
      password,
      public_metadata: { role: "candidat", candidat_token: token },
      skip_password_checks: true,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    if (data.errors?.[0]?.code === "form_identifier_exists") {
      console.warn(`   ⚠ Email déjà utilisé dans Clerk : ${email}`);
      return null;
    }
    throw new Error(data.errors?.[0]?.message ?? JSON.stringify(data));
  }

  console.log(`   ✓ Clerk créé — mot de passe : ${password}`);
  return data.id;
}

async function upsertCandidat(c) {
  const { data: existing } = await supabase
    .from("candidats")
    .select("id, token")
    .eq("token", c.token)
    .maybeSingle();

  if (existing) {
    console.log(`⏭  ${c.prenom} ${c.nom} existe déjà (${existing.id})`);
    return existing;
  }

  const fiche = {
    nom: c.nom,
    prenom: c.prenom,
    email: c.email,
    telephone: c.telephone,
    dateNaissance: "1990-05-15",
    lieuNaissance: "Marseille",
    adresse: "12 rue de la Formation",
    codePostal: "13001",
    ville: "Marseille",
    experienceSecu: false,
    diplomeScolaire: true,
    rempli: true,
  };

  const { data, error } = await supabase
    .from("candidats")
    .insert({
      token: c.token,
      nom: c.nom,
      prenom: c.prenom,
      email: c.email,
      telephone: c.telephone,
      date_naissance: "1990-05-15",
      lieu_naissance: "Marseille",
      adresse: "12 rue de la Formation",
      code_postal: "13001",
      ville: "Marseille",
      numero_carte_vitale: "1234567890123",
      code_insee: "13055",
      parcours: c.parcours,
      statut: c.statut,
      date_demande: today,
      date_acceptation: c.date_acceptation,
      experience_secu: false,
      diplome_scolaire: true,
      pieces_jointes: PIECES,
      fiche,
      liens: { eLearningUrl: "https://elearning.example.com", teamsUrl: null },
    })
    .select("id, token")
    .single();

  if (error) throw error;

  const clerkId = await createClerkUser(c.email, c.token);
  if (clerkId) {
    await supabase.from("candidats").update({ clerk_user_id: clerkId }).eq("id", data.id);
    await supabase.from("profiles").upsert(
      {
        clerk_user_id: clerkId,
        role: "candidat",
        email: c.email,
        candidat_token: c.token,
      },
      { onConflict: "clerk_user_id" }
    );
  }

  console.log(`✅ ${c.prenom} ${c.nom}`);
  console.log(`   ID    : ${data.id}`);
  console.log(`   Token : ${data.token}`);
  console.log(`   Admin : /admin/candidats/${data.id}`);
  console.log(`   Élève : /candidat/${data.token}`);
  console.log("");

  return data;
}

console.log("\n🌱 Seed candidats F2M\n");

for (const c of SEED) {
  try {
    await upsertCandidat(c);
  } catch (e) {
    console.error(`❌ ${c.token}:`, e.message ?? e);
  }
}

console.log("Terminé. Relancez npm run list:candidats pour la liste complète.\n");
