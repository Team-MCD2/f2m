"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { submitContactForm } from "@/app/actions/contact-form";

const STEPS = 3;

export function ContactForm() {
  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [rgpd, setRgpd] = useState(false);
  const [form, setForm] = useState({
    objet: "",
    nom: "",
    email: "",
    tel: "",
    msg: "",
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!rgpd) {
      setError("Veuillez accepter la politique de confidentialité pour envoyer votre message.");
      return;
    }

    setPending(true);
    try {
      const result = await submitContactForm(form);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (result.sent) {
        setSuccess(true);
        return;
      }

      window.location.href = result.mailto;
      setSuccess(true);
    } catch {
      setError("Une erreur est survenue. Réessayez ou contactez-nous par téléphone.");
    } finally {
      setPending(false);
    }
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
            <select
              id="objet"
              name="objet"
              required
              value={form.objet}
              onChange={(e) => setForm((f) => ({ ...f, objet: e.target.value }))}
            >
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
            <input
              id="nom"
              name="nom"
              required
              value={form.nom}
              onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="tel">Téléphone</label>
            <input
              id="tel"
              name="tel"
              type="tel"
              value={form.tel}
              onChange={(e) => setForm((f) => ({ ...f, tel: e.target.value }))}
            />
          </div>
        </div>
        <div className={`form-step${step === 2 ? " is-active" : ""}`}>
          <h2>Étape 3 — Message</h2>
          <div className="form-group">
            <label htmlFor="msg">Votre message</label>
            <textarea
              id="msg"
              name="msg"
              rows={4}
              value={form.msg}
              onChange={(e) => setForm((f) => ({ ...f, msg: e.target.value }))}
            />
          </div>
          <div className="form-group form-group--checkbox">
            <label className="checkbox-label" htmlFor="rgpd">
              <input
                id="rgpd"
                name="rgpd"
                type="checkbox"
                required
                checked={rgpd}
                onChange={(e) => setRgpd(e.target.checked)}
              />
              <span>
                J&apos;accepte que mes données soient traitées pour répondre à ma demande, conformément
                à la{" "}
                <Link href="/politique-confidentialite" target="_blank" rel="noopener noreferrer">
                  politique de confidentialité
                </Link>
                . *
              </span>
            </label>
          </div>
        </div>
      </div>
      <div className="form-actions">
        {step > 0 && (
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setStep((s) => s - 1)}
            disabled={pending}
          >
            Précédent
          </button>
        )}
        {step < STEPS - 1 ? (
          <button
            type="button"
            className="btn btn-gold"
            onClick={() => setStep((s) => s + 1)}
          >
            Suivant
          </button>
        ) : (
          <button type="submit" className="btn btn-gold" disabled={pending || !rgpd}>
            {pending ? "Envoi…" : "Envoyer"}
          </button>
        )}
      </div>
      {error && (
        <p className="form-error" role="alert" aria-live="polite">
          {error}
        </p>
      )}
      {success && (
        <p className="form-success" role="status" aria-live="polite">
          Merci pour votre message. Nous vous recontacterons sous 48 h ouvrées.
        </p>
      )}
    </form>
  );
}
