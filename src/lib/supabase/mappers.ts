import type { DbCandidat, DbDocument, DbPartenaire } from "./types";
import type {
  Candidat,
  DocumentGenere,
  FicheRenseignement,
  LiensCandidat,
  Partenaire,
  PieceJointe,
  ParcoursType,
  StatutCandidat,
} from "@/types";

function asPiecesJointes(raw: unknown): PieceJointe[] {
  if (!Array.isArray(raw)) return [];
  return raw as PieceJointe[];
}

function asFiche(raw: unknown, fallback: Partial<Candidat>): FicheRenseignement {
  const f = (raw && typeof raw === "object" ? raw : {}) as Partial<FicheRenseignement>;
  return {
    nom: f.nom ?? fallback.nom ?? "",
    prenom: f.prenom ?? fallback.prenom ?? "",
    email: f.email ?? fallback.email ?? "",
    telephone: f.telephone ?? fallback.telephone ?? "",
    dateNaissance: f.dateNaissance ?? fallback.dateNaissance ?? "",
    lieuNaissance: f.lieuNaissance ?? fallback.lieuNaissance ?? "",
    adresse: f.adresse ?? fallback.adresse ?? "",
    codePostal: f.codePostal ?? fallback.codePostal ?? "",
    ville: f.ville ?? fallback.ville ?? "",
    numeroSecu: f.numeroSecu ?? fallback.numeroSecu,
    experienceSecu: f.experienceSecu ?? fallback.experienceSecu ?? false,
    diplomeScolaire: f.diplomeScolaire ?? fallback.diplomeScolaire ?? false,
    rempli: f.rempli ?? true,
  };
}

function asLiens(raw: unknown): LiensCandidat {
  const l = (raw && typeof raw === "object" ? raw : {}) as Partial<LiensCandidat>;
  return {
    eLearningUrl: l.eLearningUrl ?? "",
    teamsUrl: l.teamsUrl ?? undefined,
  };
}

export function mapDocument(row: DbDocument): DocumentGenere {
  return {
    id: row.id,
    type: row.type as DocumentGenere["type"],
    nom: row.nom,
    genereLe: row.genere_le,
  };
}

export function mapCandidat(row: DbCandidat): Candidat {
  const base = {
    nom: row.nom,
    prenom: row.prenom,
    email: row.email,
    telephone: row.telephone ?? "",
    dateNaissance: row.date_naissance ?? "",
    lieuNaissance: row.lieu_naissance ?? "",
    adresse: row.adresse ?? "",
    codePostal: row.code_postal ?? "",
    ville: row.ville ?? "",
    numeroSecu: row.numero_secu ?? undefined,
    experienceSecu: row.experience_secu,
    diplomeScolaire: row.diplome_scolaire,
  };

  return {
    id: row.id,
    token: row.token,
    ...base,
    numeroCarteVitale: row.numero_carte_vitale ?? undefined,
    codeInsee: row.code_insee ?? undefined,
    parcours: row.parcours as ParcoursType,
    statut: row.statut as StatutCandidat,
    partenaireId: row.partenaire_id ?? undefined,
    dateDemande: row.date_demande,
    dateAcceptation: row.date_acceptation ?? undefined,
    dateDiplome: row.date_diplome ?? undefined,
    numeroDiplome: row.numero_diplome ?? undefined,
    piecesJointes: asPiecesJointes(row.pieces_jointes),
    fiche: asFiche(row.fiche, base),
    documentsGeneres: (row.documents_generes ?? []).map(mapDocument),
    liens: asLiens(row.liens),
    notes: row.notes ?? undefined,
  };
}

export function mapPartenaire(row: DbPartenaire): Partenaire {
  return {
    id: row.id,
    nom: row.nom,
    ville: row.ville ?? "",
    email: row.email,
  };
}

export function candidatToDbInsert(c: Candidat): Record<string, unknown> {
  return {
    token: c.token,
    nom: c.nom,
    prenom: c.prenom,
    email: c.email,
    telephone: c.telephone,
    date_naissance: c.dateNaissance || null,
    lieu_naissance: c.lieuNaissance,
    adresse: c.adresse,
    code_postal: c.codePostal,
    ville: c.ville,
    numero_secu: c.numeroSecu ?? null,
    numero_carte_vitale: c.numeroCarteVitale ?? null,
    code_insee: c.codeInsee ?? null,
    parcours: c.parcours,
    statut: c.statut,
    partenaire_id: c.partenaireId ?? null,
    date_demande: c.dateDemande,
    date_acceptation: c.dateAcceptation ?? null,
    date_diplome: c.dateDiplome ?? null,
    numero_diplome: c.numeroDiplome ?? null,
    experience_secu: c.experienceSecu,
    diplome_scolaire: c.diplomeScolaire,
    pieces_jointes: c.piecesJointes,
    fiche: c.fiche,
    liens: c.liens,
    notes: c.notes ?? null,
  };
}
