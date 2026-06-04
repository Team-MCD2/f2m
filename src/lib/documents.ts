import type { Candidat, DocumentType } from "@/types";
import { DOCUMENT_LABELS, PARCOURS_LABELS } from "@/types";
import { formatDate, fullName } from "@/lib/utils";

function docStyles(): string {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Georgia, 'Times New Roman', serif; color: #1e293b; padding: 40px; max-width: 800px; margin: 0 auto; background: #fff; }
    .header { border-bottom: 3px solid #1e3a5f; padding-bottom: 16px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-start; }
    .logo { font-size: 22px; font-weight: bold; color: #1e3a5f; }
    .logo span { color: #ea580c; }
    .subtitle { font-size: 11px; color: #64748b; margin-top: 4px; }
    h1 { font-size: 20px; color: #1e3a5f; margin-bottom: 24px; text-align: center; text-transform: uppercase; letter-spacing: 1px; }
    .field { margin-bottom: 12px; display: flex; gap: 8px; }
    .label { font-weight: bold; min-width: 180px; color: #475569; }
    .value { flex: 1; border-bottom: 1px dotted #cbd5e1; padding-bottom: 2px; }
    .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; text-align: center; }
    .signature { margin-top: 60px; display: flex; justify-content: space-between; }
    .sig-box { width: 200px; border-top: 1px solid #1e293b; padding-top: 8px; font-size: 12px; text-align: center; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; font-size: 13px; }
    th { background: #f1f5f9; color: #1e3a5f; }
    @media print { body { padding: 20px; } .no-print { display: none; } }
  `;
}

function headerBlock(): string {
  return `
    <div class="header">
      <div>
        <div class="logo">F2M <span>Consulting</span></div>
        <div class="subtitle">Certification Dirigeant de Sécurité</div>
      </div>
      <div style="text-align:right;font-size:11px;color:#64748b">
        Document généré le ${new Date().toLocaleDateString("fr-FR")}
      </div>
    </div>
  `;
}

function footerBlock(): string {
  return `<div class="footer">F2M Consulting — f2mconsulting.fr — Document confidentiel</div>`;
}

export function generateDocumentHtml(candidat: Candidat, type: DocumentType): string {
  const nomComplet = fullName(candidat.nom, candidat.prenom);
  const titre = DOCUMENT_LABELS[type];

  let body = "";

  switch (type) {
    case "fiche_renseignement":
      body = `
        <h1>Fiche de renseignement</h1>
        <div class="field"><span class="label">Nom :</span><span class="value">${candidat.nom}</span></div>
        <div class="field"><span class="label">Prénom :</span><span class="value">${candidat.prenom}</span></div>
        <div class="field"><span class="label">Date de naissance :</span><span class="value">${formatDate(candidat.dateNaissance)} — ${candidat.lieuNaissance}</span></div>
        <div class="field"><span class="label">Adresse :</span><span class="value">${candidat.adresse}, ${candidat.codePostal} ${candidat.ville}</span></div>
        <div class="field"><span class="label">Téléphone :</span><span class="value">${candidat.telephone}</span></div>
        <div class="field"><span class="label">Email :</span><span class="value">${candidat.email}</span></div>
        <div class="field"><span class="label">N° Sécurité sociale :</span><span class="value">${candidat.numeroSecu || "—"}</span></div>
        <div class="field"><span class="label">Parcours :</span><span class="value">${PARCOURS_LABELS[candidat.parcours]}</span></div>
        <div class="field"><span class="label">Expérience sécurité :</span><span class="value">${candidat.experienceSecu ? "Oui" : "Non"}</span></div>
        <div class="signature">
          <div class="sig-box">Signature du candidat</div>
          <div class="sig-box">Cachet F2M Consulting</div>
        </div>
      `;
      break;
    case "attestation_entree":
      body = `
        <h1>Attestation d'entrée en formation</h1>
        <p style="margin-bottom:24px;line-height:1.8">
          Je soussigné(e), représentant de <strong>F2M Consulting</strong>, certifie que
          <strong>${nomComplet}</strong>, né(e) le ${formatDate(candidat.dateNaissance)} à ${candidat.lieuNaissance},
          est entré(e) en formation de Dirigeant de Sécurité le ${formatDate(candidat.dateAcceptation || candidat.dateDemande)},
          dans le cadre du parcours <strong>${PARCOURS_LABELS[candidat.parcours]}</strong>.
        </p>
        <div class="field"><span class="label">Durée totale :</span><span class="value">282 heures (formation continue)</span></div>
        <div class="signature">
          <div class="sig-box">Le responsable F2M</div>
          <div class="sig-box">Signature du candidat</div>
        </div>
      `;
      break;
    case "attestation_fin":
      body = `
        <h1>Attestation de fin de formation</h1>
        <p style="margin-bottom:24px;line-height:1.8">
          Je soussigné(e), représentant de <strong>F2M Consulting</strong>, certifie que
          <strong>${nomComplet}</strong> a suivi avec assiduité la formation de Dirigeant de Sécurité
          et a satisfait aux exigences du référentiel national.
        </p>
        <div class="field"><span class="label">N° diplôme :</span><span class="value">${candidat.numeroDiplome || "À attribuer"}</span></div>
        <div class="field"><span class="label">Date :</span><span class="value">${formatDate(candidat.dateDiplome || new Date().toISOString().split("T")[0])}</span></div>
        <div class="signature">
          <div class="sig-box">Le certificateur F2M</div>
          <div class="sig-box">Signature du candidat</div>
        </div>
      `;
      break;
    case "feuille_emargement":
      body = `
        <h1>Feuille d'émargement</h1>
        <p style="margin-bottom:16px"><strong>Candidat :</strong> ${nomComplet} — <strong>Parcours :</strong> ${PARCOURS_LABELS[candidat.parcours]}</p>
        <table>
          <thead><tr><th>Date</th><th>Module / Séance</th><th>Durée</th><th>Signature candidat</th><th>Signature formateur</th></tr></thead>
          <tbody>
            ${[1, 2, 3, 4, 5].map((i) => `<tr><td>___/___/______</td><td>Module ${i}</td><td>___ h</td><td></td><td></td></tr>`).join("")}
          </tbody>
        </table>
        <div class="signature">
          <div class="sig-box">Responsable de formation</div>
          <div class="sig-box">Cachet organisme</div>
        </div>
      `;
      break;
  }

  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>${titre} — ${nomComplet}</title><style>${docStyles()}</style></head><body>
    ${headerBlock()}
    ${body}
    ${footerBlock()}
    <script class="no-print">window.onload=function(){window.print()}</script>
  </body></html>`;
}

export function openDocumentPrint(candidat: Candidat, type: DocumentType): void {
  const html = generateDocumentHtml(candidat, type);
  const w = window.open("", "_blank");
  if (w) {
    w.document.write(html);
    w.document.close();
  }
}
