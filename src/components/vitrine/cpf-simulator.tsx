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
    <form id="cpf-simulator" className="card" style={{ maxWidth: 480, marginTop: "1rem" }} onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="hours">Durée formation (heures)</label>
        <input type="number" id="hours" name="hours" defaultValue={282} min={1} max={500} />
      </div>
      <button type="submit" className="btn btn-gold">
        Estimer ma prise en charge
      </button>
      {result && (
        <p style={{ marginTop: "1rem", fontWeight: 600 }} role="status">
          {result}
        </p>
      )}
    </form>
  );
}
