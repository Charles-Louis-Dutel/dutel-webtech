"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { mailto, site } from "@/lib/site";

/**
 * Formulaire de contact.
 *
 * Envoi : POST /api/contact (Cloudflare Pages Function, voir functions/api/contact.ts),
 * qui vérifie le jeton Turnstile puis transmet le message via Resend.
 * Le succès n'est affiché que si la fonction confirme l'acceptation par Resend.
 *
 * La clé publique Turnstile est lue au build (NEXT_PUBLIC_TURNSTILE_SITE_KEY).
 * Sans elle, le formulaire reste visible mais désactivé, avec l'adresse email
 * en alternative.
 */

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const LIMITS = { nameMax: 100, emailMax: 254, messageMin: 10, messageMax: 5000 };
const REQUEST_TIMEOUT_MS = 20_000;

type Status = "idle" | "sending" | "success" | "error";
type Field = "name" | "email" | "message";

type TurnstileOptions = {
  sitekey: string;
  action?: string;
  theme?: "light" | "dark" | "auto";
  appearance?: "always" | "execute" | "interaction-only";
  language?: string;
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
  "refresh-expired"?: "auto" | "manual" | "never";
};

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: TurnstileOptions) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

const FIELD_MESSAGES: Record<Field, Record<string, string>> = {
  name: {
    required: "Indiquez votre nom.",
    too_long: `Votre nom ne doit pas dépasser ${LIMITS.nameMax} caractères.`,
    invalid: "Votre nom contient des caractères non autorisés.",
  },
  email: {
    required: "Indiquez votre adresse email.",
    too_long: "Votre adresse email est trop longue.",
    invalid: "Votre adresse email semble invalide.",
  },
  message: {
    required: "Écrivez votre message.",
    too_short: `Votre message doit contenir au moins ${LIMITS.messageMin} caractères.`,
    too_long: `Votre message ne doit pas dépasser ${LIMITS.messageMax.toLocaleString("fr-FR")} caractères.`,
    invalid: "Votre message contient des caractères non autorisés.",
  },
};

function MailLink() {
  return <a href={mailto}>{site.email}</a>;
}

function errorMessage(code: string | undefined): ReactNode {
  switch (code) {
    case "turnstile_missing":
      return "La vérification anti-spam n'est pas encore terminée. Patientez un instant, puis réessayez.";
    case "turnstile_expired":
      return "La vérification anti-spam a expiré. Elle vient d'être relancée : vous pouvez réessayer.";
    case "turnstile_failed":
      return (
        <>
          La vérification anti-spam a échoué. Réessayez, ou écrivez-moi directement à <MailLink />.
        </>
      );
    case "rate_limited":
      return (
        <>
          Trop de tentatives en peu de temps. Réessayez plus tard, ou écrivez-moi directement à{" "}
          <MailLink />.
        </>
      );
    case "payload_too_large":
      return "Votre message est trop long pour être envoyé.";
    default:
      return (
        <>
          Le message n&apos;a pas pu être envoyé. Réessayez dans un instant, ou écrivez-moi directement
          à <MailLink />.
        </>
      );
  }
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState<ReactNode>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Field, string>>>({});

  const sending = useRef(false);
  const startedAt = useRef(0);
  const token = useRef<string | null>(null);
  const widgetId = useRef<string | null>(null);
  const widgetEl = useRef<HTMLDivElement>(null);

  // Chargement et rendu du widget Turnstile (une seule fois).
  useEffect(() => {
    startedAt.current = Date.now();
    if (!SITE_KEY || !widgetEl.current) return;
    const el = widgetEl.current;

    const render = () => {
      if (!window.turnstile || widgetId.current) return;
      widgetId.current = window.turnstile.render(el, {
        sitekey: SITE_KEY,
        action: "contact",
        theme: "light",
        appearance: "interaction-only",
        language: "fr",
        "refresh-expired": "auto",
        callback: (t) => {
          token.current = t;
        },
        "expired-callback": () => {
          token.current = null;
        },
        "error-callback": () => {
          token.current = null;
        },
      });
    };

    if (window.turnstile) {
      render();
    } else {
      let script = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SRC}"]`);
      if (!script) {
        script = document.createElement("script");
        script.src = TURNSTILE_SRC;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      script.addEventListener("load", render);
    }

    return () => {
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
      token.current = null;
    };
  }, []);

  /** Un jeton Turnstile ne sert qu'une fois : on en redemande un après chaque envoi. */
  function resetTurnstile() {
    token.current = null;
    if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current || !SITE_KEY) return; // Évite les doubles soumissions.

    const form = event.currentTarget;
    const data = new FormData(form);

    if (!token.current) {
      setStatus("error");
      setFeedback(errorMessage("turnstile_missing"));
      return;
    }

    sending.current = true;
    setStatus("sending");
    setFeedback("Envoi en cours…");
    setFieldErrors({});

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("nom") ?? ""),
          email: String(data.get("email") ?? ""),
          message: String(data.get("message") ?? ""),
          website: String(data.get("website") ?? ""),
          elapsed: Date.now() - startedAt.current,
          token: token.current,
        }),
        signal: controller.signal,
      });
      const result: { ok?: boolean; error?: string; fields?: Partial<Record<Field, string>> } = await res
        .json()
        .catch(() => ({}));

      if (res.ok && result.ok === true) {
        setStatus("success");
        setFeedback("Merci, votre message a bien été envoyé. Je vous réponds par email.");
        form.reset();
        startedAt.current = Date.now();
        return;
      }

      if (result.error === "invalid_fields" && result.fields) {
        const errors: Partial<Record<Field, string>> = {};
        for (const f of ["name", "email", "message"] as const) {
          const code = result.fields[f];
          if (code) errors[f] = FIELD_MESSAGES[f][code] ?? FIELD_MESSAGES[f].invalid;
        }
        setFieldErrors(errors);
        setStatus("error");
        setFeedback("Merci de vérifier les champs signalés.");
        return;
      }

      setStatus("error");
      setFeedback(errorMessage(result.error));
    } catch {
      setStatus("error");
      setFeedback(errorMessage(undefined));
    } finally {
      window.clearTimeout(timer);
      sending.current = false;
      resetTurnstile();
    }
  }

  const isSending = status === "sending";
  const describe = (f: Field) => (fieldErrors[f] ? `ct-${f}-error` : undefined);

  return (
    <form className="ct-form rv" onSubmit={handleSubmit} aria-label="Écrire un message" aria-busy={isSending}>
      <div className="fh mono">
        <span>Nouveau message</span>
        <span>À : {site.email}</span>
      </div>
      <div className={`f${fieldErrors.name ? " invalid" : ""}`}>
        <label htmlFor="ct-nom">Nom</label>
        <input
          id="ct-nom"
          name="nom"
          type="text"
          placeholder="Votre nom"
          autoComplete="name"
          required
          maxLength={LIMITS.nameMax}
          aria-invalid={fieldErrors.name ? true : undefined}
          aria-describedby={describe("name")}
        />
        {fieldErrors.name ? (
          <p id="ct-name-error" className="fe">
            {fieldErrors.name}
          </p>
        ) : null}
      </div>
      <div className={`f${fieldErrors.email ? " invalid" : ""}`}>
        <label htmlFor="ct-email">Email</label>
        <input
          id="ct-email"
          name="email"
          type="email"
          placeholder="vous@exemple.fr"
          autoComplete="email"
          required
          maxLength={LIMITS.emailMax}
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={describe("email")}
        />
        {fieldErrors.email ? (
          <p id="ct-email-error" className="fe">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>
      <div className={`f${fieldErrors.message ? " invalid" : ""}`}>
        <label htmlFor="ct-message">Message</label>
        <textarea
          id="ct-message"
          name="message"
          required
          minLength={LIMITS.messageMin}
          maxLength={LIMITS.messageMax}
          placeholder="Quelques mots sur votre activité et votre projet"
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={describe("message")}
        />
        {fieldErrors.message ? (
          <p id="ct-message-error" className="fe">
            {fieldErrors.message}
          </p>
        ) : null}
      </div>

      {/* Champ piège invisible : laissé vide par les visiteurs, souvent rempli par les robots. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="ct-website">Site web</label>
        <input id="ct-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Widget Turnstile : n'apparaît que si une interaction est nécessaire. */}
      <div ref={widgetEl} className="ts" />

      <div className="fs">
        <button className="btn btn-ink" type="submit" disabled={isSending || !SITE_KEY}>
          {isSending ? "Envoi en cours…" : "Envoyer le message"}{" "}
          <span className="a" aria-hidden="true">
            →
          </span>
        </button>
        <small>Protection anti-spam : Cloudflare Turnstile</small>
      </div>

      <div className={`form-status${status === "success" ? " ok" : ""}${status === "error" ? " ko" : ""}`} role="status" aria-live="polite">
        {SITE_KEY ? (
          feedback
        ) : (
          <>
            Le formulaire n&apos;est pas encore activé. Écrivez-moi directement à <MailLink />.
          </>
        )}
      </div>
    </form>
  );
}
