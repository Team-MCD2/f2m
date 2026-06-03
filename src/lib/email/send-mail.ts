import nodemailer from "nodemailer";

export interface SendMailResult {
  ok: boolean;
  mock?: boolean;
  error?: string;
}

function getTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS?.replace(/\s/g, "");
  if (!user || !pass) return null;

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export async function sendMail(
  to: string,
  subject: string,
  html: string
): Promise<SendMailResult> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[email] EMAIL_USER / EMAIL_PASS manquants — non envoyé vers", to);
    return { ok: true, mock: true };
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM ?? `F2M Consulting <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur envoi email";
    console.error("[email]", message);
    return { ok: false, error: message };
  }
}

export function mailLayout(title: string, bodyHtml: string): string {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1e293b">
      <p style="border-bottom:3px solid #1e3a5f;padding-bottom:12px">
        <strong style="color:#1e3a5f;font-size:18px">F2M Consulting</strong>
      </p>
      <h2 style="color:#1e3a5f;font-size:16px">${title}</h2>
      ${bodyHtml}
      <p style="font-size:12px;color:#94a3b8;margin-top:24px">F2M Consulting — Ne pas répondre à cet email automatique.</p>
    </div>
  `;
}
