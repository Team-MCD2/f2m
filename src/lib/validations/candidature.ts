import { z } from "zod";

export const candidatureSchema = z.object({
  parcours: z.enum([
    "formation_continue",
    "vae",
    "apprentissage",
    "contre_livre",
  ]),
  civilite: z.string().optional(),
  nom: z.string().min(1, "Nom requis"),
  prenom: z.string().min(1, "Prénom requis"),
  date_naissance: z.string().optional(),
  lieu_naissance: z.string().optional(),
  nationalite: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  telephone: z.string().min(1, "Téléphone requis"),
  adresse: z.string().optional(),
  code_postal: z.string().optional(),
  ville: z.string().optional(),
  a_experience_secu: z.coerce.boolean(),
  a_diplome_scolaire: z.coerce.boolean(),
  numero_carte_vitale: z.string().optional(),
});

export type CandidatureInput = z.infer<typeof candidatureSchema>;
