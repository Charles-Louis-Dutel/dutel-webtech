"use client";

import type { FormEvent } from "react";
import { site } from "@/lib/site";

/**
 * Formulaire de contact — sans backend pour cette première version.
 *
 * À l'envoi, il prépare un email (lien `mailto:`) dans la messagerie du
 * visiteur, avec le nom, l'adresse et le message pré-remplis. Aucune
 * confirmation d'envoi n'est affichée : rien n'est transmis par le site.
 * Une solution d'envoi adaptée à Cloudflare Pages pourra remplacer ce
 * comportement plus tard (seule la fonction `handleSubmit` est à changer).
 */
export default function ContactForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("nom") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const subject = name ? `Projet de site — ${name}` : "Projet de site internet";
    const signature = [name, email].filter(Boolean);
    const body = signature.length ? `${message}\n\n—\n${signature.join("\n")}` : message;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form
      className="ct-form rv"
      action={`mailto:${site.email}`}
      method="post"
      encType="text/plain"
      onSubmit={handleSubmit}
      aria-label="Écrire un message"
      aria-describedby="form-info"
    >
      <div className="fh mono">
        <span>Nouveau message</span>
        <span>À : {site.email}</span>
      </div>
      <div className="f">
        <label htmlFor="ct-nom">Nom</label>
        <input id="ct-nom" name="nom" type="text" placeholder="Votre nom" autoComplete="name" />
      </div>
      <div className="f">
        <label htmlFor="ct-email">Email</label>
        <input
          id="ct-email"
          name="email"
          type="email"
          placeholder="vous@exemple.fr"
          autoComplete="email"
        />
      </div>
      <div className="f">
        <label htmlFor="ct-message">Message</label>
        <textarea
          id="ct-message"
          name="message"
          required
          placeholder="Quelques mots sur votre activité et votre projet"
        />
      </div>
      <div className="fs">
        <button className="btn btn-ink" type="submit">
          Préparer l&apos;email{" "}
          <span className="a" aria-hidden="true">
            →
          </span>
        </button>
        <small id="form-info">S&apos;ouvre dans votre messagerie — aucun envoi depuis le site</small>
      </div>
    </form>
  );
}
