import { mailLayout } from "@/lib/email/send-mail";
import { PARCOURS_LABELS } from "@/types";
import type { ParcoursType, StatutCandidat } from "@/types";

export function relanceEmailHtml(prenom: string, nom: string, message: string): string {
  const escaped = message
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");

  return mailLayout(
    "Message de l'équipe F2M",
    `
      <p>Bonjour ${prenom} ${nom},</p>
      <div style="background:#f8fafc;border-left:4px solid #1e3a5f;padding:16px;margin:16px 0">
        ${escaped}
      </div>
      <p>Connectez-vous à votre espace « Mes documents » pour mettre à jour votre dossier.</p>
    `
  );
}

export function acceptationEmailHtml(
  prenom: string,
  nom: string,
  token: string,
  appUrl: string
): string {
  return mailLayout(
    "Votre candidature est acceptée",
    `
      <p>Bonjour ${prenom} ${nom},</p>
      <p>Félicitations, votre dossier a été <strong>accepté</strong>.</p>
      <p><strong>Prochaine étape :</strong> activez votre compte et choisissez votre mot de passe.</p>
      <ol>
        <li>Allez sur <a href="${appUrl}/connexion/activation">${appUrl}/connexion/activation</a></li>
        <li>Entrez votre email ou l'identifiant <strong>${token}</strong></li>
        <li>Définissez votre mot de passe, puis connectez-vous</li>
      </ol>
    `
  );
}

export function refusEmailHtml(prenom: string, nom: string): string {
  return mailLayout(
    "Réponse à votre candidature",
    `
      <p>Bonjour ${prenom} ${nom},</p>
      <p>Après étude de votre dossier, nous ne pouvons pas donner suite à votre candidature pour le moment.</p>
      <p>Pour toute question, contactez F2M Consulting.</p>
    `
  );
}

export function nouveauDossierAdminHtml(
  prenom: string,
  nom: string,
  email: string,
  parcours: ParcoursType
): string {
  return mailLayout(
    "Nouveau dossier candidat",
    `
      <p>Un nouveau dossier vient d'être déposé :</p>
      <ul>
        <li><strong>${prenom} ${nom}</strong></li>
        <li>${email}</li>
        <li>Parcours : ${PARCOURS_LABELS[parcours]}</li>
      </ul>
    `
  );
}

export function motDePasseEmailHtml(
  prenom: string,
  nom: string,
  email: string,
  password: string,
  appUrl: string
): string {
  return mailLayout(
    "Vos identifiants F2M",
    `
      <p>Bonjour ${prenom} ${nom},</p>
      <p>Un nouveau mot de passe a été généré pour votre compte :</p>
      <p style="background:#f1f5f9;padding:12px;font-family:monospace">
        Email : ${email}<br/>
        Mot de passe : <strong>${password}</strong>
      </p>
      <p>Connectez-vous sur <a href="${appUrl}/connexion">${appUrl}/connexion</a> puis changez votre mot de passe si vous le souhaitez.</p>
    `
  );
}

export function statutLabel(statut: StatutCandidat): string {
  const labels: Record<StatutCandidat, string> = {
    demande: "en cours d'examen",
    accepte: "accepté",
    refuse: "refusé",
    en_formation: "en formation",
    diplome: "diplômé",
  };
  return labels[statut];
}
