import type { DbCandidat, DbDocument, DbPartenaire, DbProfile } from "./types";

export type Database = {
  public: {
    Tables: {
      partenaires: { Row: DbPartenaire; Insert: Partial<DbPartenaire>; Update: Partial<DbPartenaire> };
      profiles: { Row: DbProfile; Insert: Partial<DbProfile>; Update: Partial<DbProfile> };
      candidats: { Row: DbCandidat; Insert: Partial<DbCandidat>; Update: Partial<DbCandidat> };
      documents_generes: { Row: DbDocument; Insert: Partial<DbDocument>; Update: Partial<DbDocument> };
    };
  };
};
