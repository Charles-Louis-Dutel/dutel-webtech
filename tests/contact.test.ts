/**
 * Tests de la Pages Function /api/contact, sans réseau.
 *
 * `fetch` est simulé : Siteverify reproduit le comportement des clés de test
 * officielles de Turnstile (1x… réussit, 2x… échoue, 3x… jeton déjà utilisé),
 * et l'API Resend est simulée (succès, erreur HTTP, réponse sans identifiant).
 *
 * Lancement : npm run test:contact
 */
import { afterEach, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { handleContact, LIMITS, onRequest, RATE_LIMIT, resetRateLimit, type Env } from "../functions/api/contact.ts";

const PASS_SECRET = "1x0000000000000000000000000000000AA";
const FAIL_SECRET = "2x0000000000000000000000000000000AA";
const SPENT_SECRET = "3x0000000000000000000000000000000AA";
const DUMMY_TOKEN = "XXXX.DUMMY.TOKEN.XXXX";

const baseEnv: Env = {
  RESEND_API_KEY: "re_test_factice",
  CONTACT_FROM_EMAIL: "Dutel Web & Tech <formulaire@mail.dutel-webtech.fr>",
  CONTACT_TO_EMAIL: "contact@dutel-webtech.fr",
  TURNSTILE_SECRET_KEY: PASS_SECRET,
};

const validBody = {
  name: "Jeanne Martin",
  email: "jeanne.martin@exemple.fr",
  message: "Bonjour, je souhaite créer un site pour mon atelier de céramique.",
  website: "",
  elapsed: 12_000,
  token: DUMMY_TOKEN,
};

type Call = { url: string; init?: RequestInit };
let calls: Call[] = [];
let resendMode: "ok" | "http_error" | "no_id" | "network" = "ok";
let turnstileMode: "normal" | "network" = "normal";
const spentTokens = new Set<string>();
const realFetch = globalThis.fetch;

function mockFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = String(input instanceof Request ? input.url : input);
  calls.push({ url, init });
  if (url.startsWith("https://challenges.cloudflare.com/turnstile/v0/siteverify")) {
    if (turnstileMode === "network") return Promise.reject(new TypeError("network"));
    const form = new URLSearchParams(String(init?.body));
    const secret = form.get("secret");
    const token = form.get("response") ?? "";
    let body: Record<string, unknown>;
    if (secret === FAIL_SECRET) body = { success: false, "error-codes": ["invalid-input-response"] };
    else if (secret === SPENT_SECRET || spentTokens.has(token))
      body = { success: false, "error-codes": ["timeout-or-duplicate"] };
    else if (secret === PASS_SECRET && token === DUMMY_TOKEN) {
      spentTokens.add(token); // usage unique, comme en production
      body = { success: true, hostname: "localhost", action: "contact" };
    } else body = { success: false, "error-codes": ["invalid-input-response"] };
    return Promise.resolve(Response.json(body));
  }
  if (url === "https://api.resend.com/emails") {
    if (resendMode === "network") return Promise.reject(new TypeError("network"));
    if (resendMode === "http_error")
      return Promise.resolve(Response.json({ statusCode: 403, name: "validation_error", message: "domain not verified" }, { status: 403 }));
    if (resendMode === "no_id") return Promise.resolve(Response.json({}));
    return Promise.resolve(Response.json({ id: "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794" }));
  }
  return Promise.reject(new Error(`URL inattendue : ${url}`));
}

function post(body: unknown, opts: { headers?: Record<string, string>; raw?: string; method?: string } = {}) {
  return new Request("https://dutel-webtech.fr/api/contact", {
    method: opts.method ?? "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://dutel-webtech.fr",
      "CF-Connecting-IP": "203.0.113.7",
      ...opts.headers,
    },
    body: opts.method === "GET" ? undefined : (opts.raw ?? JSON.stringify(body)),
  });
}

async function run(req: Request, env: Env = baseEnv) {
  const res = await handleContact(req, env);
  return { res, data: (await res.json()) as Record<string, unknown> };
}

const resendCalls = () => calls.filter((c) => c.url === "https://api.resend.com/emails");
const turnstileCalls = () => calls.filter((c) => c.url.includes("siteverify"));

beforeEach(() => {
  calls = [];
  resendMode = "ok";
  turnstileMode = "normal";
  spentTokens.clear();
  resetRateLimit();
  globalThis.fetch = mockFetch as typeof fetch;
});
afterEach(() => {
  globalThis.fetch = realFetch;
});

describe("POST /api/contact", () => {
  it("formulaire valide : envoi via Resend et réponse ok", async () => {
    const { res, data } = await run(post(validBody));
    assert.equal(res.status, 200);
    assert.deepEqual(data, { ok: true });
    assert.equal(turnstileCalls().length, 1);
    assert.equal(resendCalls().length, 1);
    const call = resendCalls()[0];
    const headers = new Headers(call.init?.headers);
    assert.equal(headers.get("Authorization"), "Bearer re_test_factice");
    assert.match(headers.get("Idempotency-Key") ?? "", /^contact-[0-9a-f]{64}$/);
    const email = JSON.parse(String(call.init?.body));
    assert.equal(email.from, baseEnv.CONTACT_FROM_EMAIL, "l'expéditeur n'est jamais le visiteur");
    assert.deepEqual(email.to, ["contact@dutel-webtech.fr"]);
    assert.equal(email.reply_to, "jeanne.martin@exemple.fr");
    assert.equal(email.html, undefined, "texte brut uniquement");
    assert.match(email.text, /atelier de céramique/);
    assert.match(email.subject, /Jeanne Martin/);
  });

  it("email invalide : 422, aucun appel externe", async () => {
    const { res, data } = await run(post({ ...validBody, email: "jeanne@@exemple" }));
    assert.equal(res.status, 422);
    assert.deepEqual(data.fields, { email: "invalid" });
    assert.equal(calls.length, 0);
  });

  it("champs vides : 422 avec les trois champs signalés", async () => {
    const { res, data } = await run(post({ ...validBody, name: "  ", email: "", message: "" }));
    assert.equal(res.status, 422);
    assert.deepEqual(data.fields, { name: "required", email: "required", message: "required" });
    assert.equal(calls.length, 0);
  });

  it("message trop court ou trop long : 422", async () => {
    let r = await run(post({ ...validBody, message: "Salut" }));
    assert.equal(r.res.status, 422);
    assert.deepEqual(r.data.fields, { message: "too_short" });
    r = await run(post({ ...validBody, message: "a".repeat(LIMITS.messageMax + 1) }));
    assert.equal(r.res.status, 422);
    assert.deepEqual(r.data.fields, { message: "too_long" });
    assert.equal(calls.length, 0);
  });

  it("nom avec saut de ligne (injection d'en-tête) : refusé", async () => {
    const { res, data } = await run(post({ ...validBody, name: "Jeanne\nBcc: x@y.z" }));
    assert.equal(res.status, 422);
    assert.deepEqual(data.fields, { name: "invalid" });
  });

  it("requête trop volumineuse : 413", async () => {
    const big = JSON.stringify({ ...validBody, message: "a".repeat(LIMITS.bodyBytes) });
    const { res } = await run(post(null, { raw: big }));
    assert.equal(res.status, 413);
    assert.equal(calls.length, 0);
  });

  it("JSON invalide ou mauvais type de contenu : 400 / 415", async () => {
    assert.equal((await run(post(null, { raw: "{pas du json" }))).res.status, 400);
    assert.equal((await run(post(null, { raw: "[1,2]" }))).res.status, 400);
    assert.equal((await run(post(validBody, { headers: { "Content-Type": "text/plain" } }))).res.status, 415);
  });

  it("absence de jeton Turnstile : 400, aucun email", async () => {
    const { res, data } = await run(post({ ...validBody, token: "" }));
    assert.equal(res.status, 400);
    assert.equal(data.error, "turnstile_missing");
    assert.equal(calls.length, 0);
  });

  it("jeton invalide (clé de test « échoue toujours ») : 403, aucun email", async () => {
    const { res, data } = await run(post(validBody), { ...baseEnv, TURNSTILE_SECRET_KEY: FAIL_SECRET });
    assert.equal(res.status, 403);
    assert.equal(data.error, "turnstile_failed");
    assert.equal(resendCalls().length, 0);
  });

  it("jeton expiré ou déjà utilisé (clé de test 3x…) : 400 turnstile_expired", async () => {
    const { res, data } = await run(post(validBody), { ...baseEnv, TURNSTILE_SECRET_KEY: SPENT_SECRET });
    assert.equal(res.status, 400);
    assert.equal(data.error, "turnstile_expired");
    assert.equal(resendCalls().length, 0);
  });

  it("Siteverify injoignable : 502, aucun email", async () => {
    turnstileMode = "network";
    const { res, data } = await run(post(validBody));
    assert.equal(res.status, 502);
    assert.equal(data.error, "turnstile_unavailable");
    assert.equal(resendCalls().length, 0);
  });

  it("erreur Resend (HTTP 403) : 502, pas de succès", async () => {
    resendMode = "http_error";
    const { res, data } = await run(post(validBody));
    assert.equal(res.status, 502);
    assert.deepEqual(data, { ok: false, error: "send_failed" });
  });

  it("Resend sans identifiant ou injoignable : 502", async () => {
    resendMode = "no_id";
    assert.equal((await run(post(validBody))).res.status, 502);
    spentTokens.clear();
    resendMode = "network";
    assert.equal((await run(post(validBody))).res.status, 502);
  });

  it("double soumission du même jeton : un seul email", async () => {
    const first = await run(post(validBody));
    const second = await run(post(validBody));
    assert.equal(first.res.status, 200);
    assert.equal(second.res.status, 400);
    assert.equal(second.data.error, "turnstile_expired");
    assert.equal(resendCalls().length, 1);
  });

  it("champ piège rempli ou envoi trop rapide : refusé sans appel externe", async () => {
    assert.equal((await run(post({ ...validBody, website: "https://spam.example" }))).data.error, "rejected");
    assert.equal((await run(post({ ...validBody, elapsed: 500 }))).data.error, "rejected");
    assert.equal((await run(post({ ...validBody, elapsed: undefined }))).data.error, "rejected");
    assert.equal(calls.length, 0);
  });

  it("origine étrangère : 403", async () => {
    const { res } = await run(post(validBody, { headers: { Origin: "https://evil.example" } }));
    assert.equal(res.status, 403);
    assert.equal(calls.length, 0);
  });

  it(`limitation : au-delà de ${RATE_LIMIT.max} tentatives par IP, 429`, async () => {
    for (let i = 0; i < RATE_LIMIT.max; i++) await run(post({ ...validBody, email: "invalide" }));
    const { res } = await run(post(validBody));
    assert.equal(res.status, 429);
    assert.ok(Number(res.headers.get("Retry-After")) > 0);
    const other = await run(post(validBody, { headers: { "CF-Connecting-IP": "198.51.100.9" } }));
    assert.equal(other.res.status, 200, "une autre IP n'est pas bloquée");
  });

  it("configuration incomplète : 500, aucun appel externe", async () => {
    const { res, data } = await run(post(validBody), { ...baseEnv, RESEND_API_KEY: undefined });
    assert.equal(res.status, 500);
    assert.equal(data.error, "not_configured");
    assert.equal(calls.length, 0);
  });

  it("autres méthodes : 405 avec en-tête Allow", async () => {
    const res = await onRequest();
    assert.equal(res.status, 405);
    assert.equal(res.headers.get("Allow"), "POST");
    const viaHandler = await handleContact(post(null, { method: "GET" }), baseEnv);
    assert.equal(viaHandler.status, 405);
  });

  it("les réponses ne sont pas mises en cache", async () => {
    const { res } = await run(post(validBody));
    assert.equal(res.headers.get("Cache-Control"), "no-store");
  });
});
