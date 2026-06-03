/** N° sécurité sociale : chiffres uniquement (13 à 15 chiffres, espaces retirés). */
export function sanitizeNumeroSecu(value: string): string {
  return value.replace(/\D/g, "").slice(0, 15);
}

export function isValidNumeroSecu(value: string | undefined): boolean {
  if (!value?.trim()) return true;
  const digits = sanitizeNumeroSecu(value);
  return digits.length >= 13 && digits.length <= 15;
}

export function numeroSecuError(value: string | undefined): string | null {
  if (!value?.trim()) return null;
  const digits = sanitizeNumeroSecu(value);
  if (digits.length === 0) return null;
  if (!/^\d+$/.test(digits)) return "Le numéro de sécurité sociale ne doit contenir que des chiffres.";
  if (digits.length < 13 || digits.length > 15) {
    return "Le numéro de sécurité sociale doit contenir entre 13 et 15 chiffres.";
  }
  return null;
}
