"use client";

import { FormEvent, useState } from "react";

const STEPS = 3;

export function ContactForm() {
  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccess(true);
  }

  const progress = ((step + 1) / STEPS) * 100;

  return (
    <form
      id="contact-multistep"
      className="form-steps-wrap"
      onSubmit={handleSubmit}
      noValidate
    >
      <div
        className="form-progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div className="form-progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <div className="form-steps-wrap-inner">
        <div className={`form-step${step === 0 ? " is-active" : ""}`}>
          <h2>Étape 1 — Votre projet</h2>
          <div className="form-group">
            <label htmlFor="objet">Objet de la demande</label>
            <select id="objet" name="objet" required defaultValue="">
              <option value="">Choisir…</option>
              <option>Formation DGESP</option>
              <option>VAE DGESP</option>
              <option>Financement</option>
              <option>Autre</option>
            </select>
          </div>
        </div>
        <div className={`form-step${step === 1 ? " is-active" : ""}`}>
          <h2>Étape 2 — Coordonnées</h2>
          <div className="form-group">
            <label htmlFor="nom">Nom</label>
            <input id="nom" name="nom" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="tel">Téléphone</label>
            <input id="tel" name="tel" type="tel" />
          </div>
        </div>
        <div className={`form-step${step === 2 ? " is-active" : ""}`}>
          <h2>Étape 3 — Message</h2>
          <div className="form-group">
            <label htmlFor="msg">Votre message</label>
            <textarea id="msg" name="msg" rows={4} />
          </div>
        </div>
      </div>
      <div className="form-actions">
        {step > 0 && (
          <button type="button" className="btn btn-outline" onClick={() => setStep((s) => s - 1)}>
            Précédent
          </button>
        )}
        {step < STEPS - 1 ? (
          <button type="button" className="btn btn-gold" onClick={() => setStep((s) => s + 1)}>
            Suivant
          </button>
        ) : (
          <button type="submit" className="btn btn-gold">
            Envoyer (démo)
          </button>
        )}
      </div>
      {success && (
        <p className="form-success" role="status">
          Merci — ce formulaire est une démonstration locale. En production, branchez-le à
          votre CRM ou service email.
        </p>
      )}
    </form>
  );
}
