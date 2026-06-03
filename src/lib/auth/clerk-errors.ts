/** Message lisible à partir d'une erreur Clerk (422, etc.). */
export function formatClerkError(e: unknown): string {
  if (e && typeof e === "object" && "errors" in e) {
    const errors = (e as { errors: { message?: string; longMessage?: string; code?: string }[] })
      .errors;
    const first = errors?.[0];
    if (first?.longMessage) return first.longMessage;
    if (first?.message) return first.message;
    if (first?.code === "form_password_pwned") {
      return "Ce mot de passe est trop courant. Choisissez-en un autre (lettres, chiffres, symboles).";
    }
  }
  if (e instanceof Error && e.message && e.message !== "Unprocessable Entity") {
    return e.message;
  }
  return "Impossible d'enregistrer le mot de passe. Utilisez au moins 8 caractères avec lettres et chiffres.";
}
