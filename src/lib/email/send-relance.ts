import { getResendClient, getResendFromAddress } from "@/lib/email/resend-client";

export interface SendEmailResult {
  ok: boolean;
  mock?: boolean;
  error?: string;
  id?: string;
}

export async function sendRelanceEmail(
  to: string,
  subject: string,
  htmlBody: string
): Promise<SendEmailResult> {
  const client = getResendClient();

  if (!client) {
    console.warn("[relance] RESEND_API_KEY absente — email non envoyé vers", to);
    return { ok: true, mock: true };
  }

  const from = getResendFromAddress();

  const { data, error } = await client.emails.send({
    from,
    to: [to],
    subject,
    html: htmlBody,
  });

  if (error) {
    console.error("[relance] Resend:", error);
    return { ok: false, error: error.message };
  }

  return { ok: true, id: data?.id };
}

export function relanceEmailHtml(prenom: string, nom: string, message: string): string {
  const escaped = message
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1e293b">
      <p style="border-bottom:3px solid #1e3a5f;padding-bottom:12px">
        <strong style="color:#1e3a5f">F2M Consulting</strong>
      </p>
      <p>Bonjour ${prenom} ${nom},</p>
      <div style="background:#f8fafc;border-left:4px solid #1e3a5f;padding:16px;margin:16px 0">
        ${escaped}
      </div>
      <p style="font-size:13px;color:#64748b">
        Connectez-vous à votre espace « Mes documents » pour mettre à jour votre dossier si nécessaire.
      </p>
      <p style="font-size:12px;color:#94a3b8">F2M Consulting — Message automatique de relance</p>
    </div>
  `;
}
