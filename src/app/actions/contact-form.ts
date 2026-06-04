"use server";

import { F2M_SITE } from "@/lib/vitrine/site-config";
import { mailLayout, sendMail } from "@/lib/email/send-mail";
import { getResendClient, getResendFromAddress } from "@/lib/email/resend-client";

export type ContactFormPayload = {
  objet: string;
  nom: string;
  email: string;
  tel: string;
  msg: string;
};

export type ContactFormResult =
  | { ok: true; sent: true }
  | { ok: true; sent: false; mailto: string }
  | { ok: false; error: string };

function buildMailto(payload: ContactFormPayload): string {
  const subject = encodeURIComponent(`[F2M Contact] ${payload.objet}`);
  const body = encodeURIComponent(
    [
      `Objet : ${payload.objet}`,
      `Nom : ${payload.nom}`,
      `Email : ${payload.email}`,
      `Téléphone : ${payload.tel || "—"}`,
      "",
      payload.msg || "(aucun message)",
    ].join("\n")
  );
  return `mailto:${F2M_SITE.email}?subject=${subject}&body=${body}`;
}

function formatHtml(payload: ContactFormPayload): string {
  return mailLayout(
    "Nouveau message — formulaire contact",
    `<p><strong>Objet :</strong> ${payload.objet}</p>
     <p><strong>Nom :</strong> ${payload.nom}</p>
     <p><strong>Email :</strong> ${payload.email}</p>
     <p><strong>Téléphone :</strong> ${payload.tel || "—"}</p>
     <p><strong>Message :</strong></p>
     <p>${(payload.msg || "").replace(/\n/g, "<br>")}</p>`
  );
}

export async function submitContactForm(payload: ContactFormPayload): Promise<ContactFormResult> {
  if (!payload.objet || !payload.nom || !payload.email) {
    return { ok: false, error: "Veuillez remplir les champs obligatoires." };
  }

  const html = formatHtml(payload);
  const subject = `[F2M Contact] ${payload.objet} — ${payload.nom}`;

  const resend = getResendClient();
  if (resend) {
    try {
      const { error } = await resend.emails.send({
        from: getResendFromAddress(),
        to: F2M_SITE.email,
        replyTo: payload.email,
        subject,
        html,
      });
      if (error) {
        console.error("[contact] Resend:", error);
        return { ok: false, error: "Envoi impossible pour le moment. Réessayez plus tard." };
      }
      return { ok: true, sent: true };
    } catch (e) {
      console.error("[contact] Resend exception:", e);
    }
  }

  const mail = await sendMail(F2M_SITE.email, subject, html);
  if (mail.ok && !mail.mock) {
    return { ok: true, sent: true };
  }

  return { ok: true, sent: false, mailto: buildMailto(payload) };
}
