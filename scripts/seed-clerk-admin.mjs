/**
 * Crée ou met à jour le compte super admin Clerk.
 * Usage : npm run seed:admin
 * Variables optionnelles : ADMIN_EMAIL, ADMIN_PASSWORD (sinon valeurs par défaut du stage)
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClerkClient } from "@clerk/backend";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i === -1) continue;
    const key = trimmed.slice(0, i).trim();
    const val = trimmed.slice(i + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

const email = process.env.ADMIN_EMAIL ?? "dev@microdidact.com";
const password = process.env.ADMIN_PASSWORD ?? "microdidact";
const secretKey = process.env.CLERK_SECRET_KEY;

if (!secretKey) {
  console.error("CLERK_SECRET_KEY manquant dans .env.local");
  process.exit(1);
}

const clerk = createClerkClient({ secretKey });

const { data: users } = await clerk.users.getUserList({
  emailAddress: [email],
});

const metadata = { role: "admin", superAdmin: true };

if (users.length > 0) {
  const user = users[0];
  await clerk.users.updateUser(user.id, {
    publicMetadata: metadata,
    password,
  });
  console.log(`Compte admin mis à jour : ${email} (id: ${user.id})`);
} else {
  const user = await clerk.users.createUser({
    emailAddress: [email],
    password,
    publicMetadata: metadata,
  });
  console.log(`Compte admin créé : ${email} (id: ${user.id})`);
}

console.log("Connexion : http://localhost:3000/sign-in");
