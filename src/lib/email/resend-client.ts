import { Resend } from "resend";

let resend: Resend | null = null;

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!resend) resend = new Resend(apiKey);
  return resend;
}

/** Expéditeur Resend (domaine vérifié ou onboarding@resend.dev en test). */
export function getResendFromAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL ??
    process.env.RELANCE_FROM_EMAIL ??
    "onboarding@resend.dev"
  );
}
