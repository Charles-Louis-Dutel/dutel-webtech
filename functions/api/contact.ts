/**
 * Cloudflare Pages Function — POST /api/contact
 *
 * Formulaire React → cette fonction → Resend → CONTACT_TO_EMAIL
 *
 * Étapes : méthode et origine, limitation de fréquence (mémoire de l'isolat),
 * taille et format de la requête, validation des champs, pièges anti-robots,
 * vérification Turnstile côté serveur (Siteverify), puis envoi via l'API HTTP
 * de Resend. Aucun email n'est envoyé si une étape échoue.
 *
 * Le message est envoyé en texte brut uniquement (pas de HTML) : aucune donnée
 * du visiteur n'est interprétée comme du balisage. Les journaux ne contiennent
 * ni le message ni les données personnelles, seulement des codes d'erreur.
 *
 * Ce fichier n'utilise que des API web standard (fetch, Request, Response,
 * crypto) : il s'exécute sur Cloudflare et dans Node.js pour les tests.
 */

export interface Env {
  RESEND_API_KEY?: string;
  CONTACT_FROM_EMAIL?: string;
  CONTACT_TO_EMAIL?: string;
  TURNSTILE_SECRET_KEY?: string;
}

type PagesContext = { request: Request; env: Env };

export const LIMITS = {
  /** Taille maximale du corps de requête, en octets. */
  bodyBytes: 16 * 1024,
  nameMax: 100,
  emailMax: 254,
  messageMin: 10,
  messageMax: 5000,
  /** Longueur maximale d'un jeton Turnstile (documentation Cloudflare). */
  tokenMax: 2048,
  /** Délai minimal entre l'affichage du formulaire et l'envoi, en ms. */
  minFillMs: 3000,
} as const;

/** Limitation de fréquence : au plus `max` tentatives par IP et par fenêtre. */
export const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 } as const;

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const RESEND_SEND_URL = "https://api.resend.com/emails";
const TURNSTILE_ACTION = "contact";

export type ErrorCode =
  | "method_not_allowed"
  | "forbidden_origin"
  | "unsupported_media_type"
  | "payload_too_large"
  | "invalid_json"
  | "invalid_fields"
  | "rejected"
  | "rate_limited"
  | "turnstile_missing"
  | "turnstile_expired"
  | "turnstile_failed"
  | "turnstile_unavailable"
  | "not_configured"
  | "send_failed";

export type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

// ───────────────────────────── Réponses ─────────────────────────────

function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...headers,
    },
  });
}

function fail(
  error: ErrorCode,
  status: number,
  extra: Record<string, unknown> = {},
  headers: Record<string, string> = {},
): Response {
  return json({ ok: false, error, ...extra }, status, headers);
}

// ───────────────────── Limitation de fréquence ─────────────────────
// Mémoire propre à chaque isolat Cloudflare : protection « au mieux », remise
// à zéro au redémarrage et non partagée entre centres de données. À compléter
// par une règle de limitation de débit Cloudflare (WAF) sur /api/contact.

const attempts = new Map<string, number[]>();

export function resetRateLimit(): void {
  attempts.clear();
}

function isRateLimited(key: string, now: number): number | null {
  const recent = (attempts.get(key) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  if (recent.length >= RATE_LIMIT.max) {
    attempts.set(key, recent);
    return Math.ceil((RATE_LIMIT.windowMs - (now - recent[0])) / 1000);
  }
  recent.push(now);
  attempts.set(key, recent);
  // Évite une croissance illimitée de la table.
  if (attempts.size > 5000) {
    for (const [k, times] of attempts) {
      if (times.every((t) => now - t >= RATE_LIMIT.windowMs)) attempts.delete(k);
    }
  }
  return null;
}

// ───────────────────────────── Validation ─────────────────────────────

// Caractères de contrôle (hors tabulation et sauts de ligne pour le message).
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;
const MESSAGE_CONTROL_CHARS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;
// Vérification volontairement pragmatique : une adresse, sans espaces ni
// caractères spéciaux d'en-tête, avec un domaine contenant un point.
const EMAIL_PATTERN = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:".]+(\.[^\s@<>()[\]\\,;:".]+)+$/;

export type ContactInput = { name: string; email: string; message: string };

export function validateFields(data: Record<string, unknown>): {
  value?: ContactInput;
  errors?: FieldErrors;
} {
  const errors: FieldErrors = {};
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";

  if (!name) errors.name = "required";
  else if (name.length > LIMITS.nameMax) errors.name = "too_long";
  else if (CONTROL_CHARS.test(name)) errors.name = "invalid";

  if (!email) errors.email = "required";
  else if (email.length > LIMITS.emailMax) errors.email = "too_long";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "invalid";

  if (!message) errors.message = "required";
  else if (message.length < LIMITS.messageMin) errors.message = "too_short";
  else if (message.length > LIMITS.messageMax) errors.message = "too_long";
  else if (MESSAGE_CONTROL_CHARS.test(message)) errors.message = "invalid";

  return Object.keys(errors).length ? { errors } : { value: { name, email, message } };
}

/** Lit le corps en refusant au-delà de `max` octets, même sans Content-Length. */
async function readBodyLimited(request: Request, max: number): Promise<string | null> {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
      await reader.cancel().catch(() => {});
      return null;
    }
    chunks.push(value);
  }
  const all = new Uint8Array(size);
  let offset = 0;
  for (const c of chunks) {
    all.set(c, offset);
    offset += c.byteLength;
  }
  return new TextDecoder().decode(all);
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("Origin");
  if (!origin) return true; // Certains navigateurs ou outils ne l'envoient pas.
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

// ───────────────────────────── Turnstile ─────────────────────────────

type TurnstileResult = "ok" | "expired" | "failed" | "unavailable";

async function verifyTurnstile(token: string, secret: string, ip: string | null): Promise<TurnstileResult> {
  const form = new URLSearchParams({ secret, response: token, idempotency_key: crypto.randomUUID() });
  if (ip) form.set("remoteip", ip);
  let res: Response;
  try {
    res = await fetch(TURNSTILE_VERIFY_URL, { method: "POST", body: form });
  } catch {
    return "unavailable";
  }
  if (!res.ok) return "unavailable";
  let data: { success?: boolean; action?: string; "error-codes"?: string[] };
  try {
    data = await res.json();
  } catch {
    return "unavailable";
  }
  const codes = data["error-codes"] ?? [];
  if (data.success === true) {
    // L'action est fixée côté client ; on refuse un jeton émis pour un autre usage.
    if (data.action && data.action !== TURNSTILE_ACTION) return "failed";
    return "ok";
  }
  if (codes.includes("timeout-or-duplicate")) return "expired";
  if (codes.includes("internal-error")) return "unavailable";
  if (codes.includes("missing-input-secret") || codes.includes("invalid-input-secret")) {
    console.error("[contact] Turnstile : clé secrète invalide ou absente");
    return "unavailable";
  }
  return "failed";
}

// ───────────────────────────── Resend ─────────────────────────────

function buildEmail(input: ContactInput, env: Required<Env>) {
  // Retire tout saut de ligne du nom avant de l'utiliser dans l'objet.
  const safeName = input.name.replace(/\s+/g, " ");
  return {
    from: env.CONTACT_FROM_EMAIL,
    to: [env.CONTACT_TO_EMAIL],
    reply_to: input.email,
    subject: `Nouveau message de ${safeName} — dutel-webtech.fr`,
    text: [
      "Nouveau message envoyé depuis le formulaire de contact de dutel-webtech.fr.",
      "",
      `Nom : ${safeName}`,
      `Email : ${input.email}`,
      "",
      "Message :",
      input.message,
      "",
      "—",
      "Répondre à cet email écrit directement à l'expéditeur.",
    ].join("\n"),
  };
}

async function sendWithResend(input: ContactInput, env: Required<Env>, idempotencyKey: string): Promise<boolean> {
  let res: Response;
  try {
    res = await fetch(RESEND_SEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(buildEmail(input, env)),
    });
  } catch {
    console.error("[contact] Resend : échec réseau");
    return false;
  }
  if (!res.ok) {
    console.error(`[contact] Resend : réponse HTTP ${res.status}`);
    return false;
  }
  // Succès confirmé uniquement si Resend renvoie l'identifiant de l'email.
  try {
    const data: { id?: unknown } = await res.json();
    return typeof data.id === "string" && data.id.length > 0;
  } catch {
    return false;
  }
}

// ───────────────────────────── Traitement ─────────────────────────────

export async function handleContact(request: Request, env: Env, now = Date.now()): Promise<Response> {
  if (request.method !== "POST") return fail("method_not_allowed", 405, {}, { Allow: "POST" });
  if (!isSameOrigin(request)) return fail("forbidden_origin", 403);

  const ip = request.headers.get("CF-Connecting-IP");
  const retryAfter = isRateLimited(ip ?? "unknown", now);
  if (retryAfter !== null) return fail("rate_limited", 429, {}, { "Retry-After": String(retryAfter) });

  const contentType = request.headers.get("Content-Type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) return fail("unsupported_media_type", 415);

  const declared = Number(request.headers.get("Content-Length"));
  if (Number.isFinite(declared) && declared > LIMITS.bodyBytes) return fail("payload_too_large", 413);
  const raw = await readBodyLimited(request, LIMITS.bodyBytes);
  if (raw === null) return fail("payload_too_large", 413);

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return fail("invalid_json", 400);
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) return fail("invalid_json", 400);
  const body = data as Record<string, unknown>;

  // Pièges élémentaires : champ caché rempli, ou envoi quasi instantané.
  if (typeof body.website === "string" && body.website.trim() !== "") return fail("rejected", 400);
  if (typeof body.elapsed !== "number" || body.elapsed < LIMITS.minFillMs) return fail("rejected", 400);

  const { value, errors } = validateFields(body);
  if (!value) return fail("invalid_fields", 422, { fields: errors });

  const token = typeof body.token === "string" ? body.token : "";
  if (!token) return fail("turnstile_missing", 400);
  if (token.length > LIMITS.tokenMax) return fail("turnstile_failed", 403);

  const missing = (["RESEND_API_KEY", "CONTACT_FROM_EMAIL", "CONTACT_TO_EMAIL", "TURNSTILE_SECRET_KEY"] as const).filter(
    (k) => !env[k],
  );
  if (missing.length) {
    console.error(`[contact] Configuration incomplète : ${missing.join(", ")}`);
    return fail("not_configured", 500);
  }
  const config = env as Required<Env>;

  const verdict = await verifyTurnstile(token, config.TURNSTILE_SECRET_KEY, ip);
  if (verdict === "expired") return fail("turnstile_expired", 400);
  if (verdict === "failed") return fail("turnstile_failed", 403);
  if (verdict === "unavailable") return fail("turnstile_unavailable", 502);

  // Clé d'idempotence dérivée du jeton (à usage unique) : un même jeton ne
  // peut pas produire deux emails, même en cas de nouvelle tentative.
  const sent = await sendWithResend(value, config, `contact-${await sha256Hex(token)}`);
  if (!sent) return fail("send_failed", 502);

  return json({ ok: true });
}

export async function onRequestPost(context: PagesContext): Promise<Response> {
  return handleContact(context.request, context.env);
}

/** Toute autre méthode HTTP est refusée. */
export async function onRequest(): Promise<Response> {
  return fail("method_not_allowed", 405, {}, { Allow: "POST" });
}
