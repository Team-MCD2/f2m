/** URL du portail candidature (projet séparé, port 3001) */
export function getCandidaturePortalUrl(): string {
  return (
    process.env.NEXT_PUBLIC_CANDIDATURE_URL?.replace(/\/$/, "") ??
    "http://localhost:3001"
  );
}
