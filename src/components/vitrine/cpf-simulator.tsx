"use client";

import { FormEvent, useState } from "react";

export function CpfSimulator() {
  const [result, setResult] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const hours = Number(new FormData(form).get("hours")) || 282;
    const estimate = Math.min(hours * 13, 5000);
    setResult(
      `Estimation indicative : ${estimate.toLocaleString("fr-FR")} € (CPF + reste à charge possible).`
    );
  }

  return (
    <div className="cpf-simulator-layout">
      <div className="cpf-simulator-intro">
        <p>
          Estimez une fourchette de prise en charge CPF pour la formation DGESP (282 h).
          Cet outil est <strong>indicatif</strong> — un conseiller F2M valide votre éligibilité
          et le montage du dossier.
        </p>
        <ul>
          <li>Vérification des droits sur Mon Compte Formation</li>
          <li>Devis et convention Qualiopi</li>
          <li>Accompagnement jusqu&apos;au démarrage</li>
        </ul>
      </div>
      <form id="cpf-simulator" className="card cpf-simulator-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="hours">Durée formation (heures)</label>
          <input type="number" id="hours" name="hours" defaultValue={282} min={1} max={500} />
        </div>
        <button type="submit" className="btn btn-gold" style={{ width: "100%" }}>
          Estimer ma prise en charge
        </button>
        {result && (
          <p className="cpf-simulator-result" role="status">
            {result}
          </p>
        )}
      </form>
    </div>
  );
}
