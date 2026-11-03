# Dutel Web & Tech — site professionnel

Site vitrine de **Dutel Web & Tech**, développeur web indépendant dans la région de Reims.
Intégration de la maquette « Hero C2 » (Claude Design) en Next.js, exportée en site statique
pour Cloudflare Pages (`https://dutel-webtech.fr`).

## Stack

- Next.js 16 (App Router, `output: "export"`), React 19, TypeScript
- Tailwind CSS 4 (thème et utilitaires) + CSS dédié pour la composition éditoriale (`app/globals.css`)
- ESLint (`eslint-config-next`)
- Polices servies localement via `next/font/local` : Geist, Geist Mono, Instrument Serif (licence OFL)
- Formulaire de contact : Cloudflare Pages Function + Cloudflare Turnstile + Resend (API HTTP)
- Wrangler (dépendance de développement) pour tester les Pages Functions en local

## Commandes

```bash
npm install
npm run dev            # http://localhost:3000 — interface uniquement, sans /api/contact
npm run lint
npx tsc --noEmit       # vérification TypeScript
npm run build          # génère le site statique dans out/
npm run test:contact   # tests de la fonction de contact (Node.js ≥ 22.6, sans réseau)
npm run pages:dev      # build + wrangler pages dev out → http://localhost:8788
```

## Structure

```text
app/
├── layout.tsx              # polices, métadonnées, lang="fr"
├── page.tsx                # page d'accueil (ordre des sections)
├── globals.css             # styles (repris de la maquette)
├── icon.svg                # favicon (monogramme D)
├── robots.ts, sitemap.ts   # générés en fichiers statiques
├── fonts/                  # woff2 extraits de la maquette
└── mentions-legales/page.tsx
components/
├── layout/                 # Header (+ menu mobile), Folio (rail latéral), Footer
├── sections/               # Hero, HeroVisual, Realisation, Services, About, Method, Contact, ContactForm
└── ui/                     # SectionHead, BrowserShot, RevealObserver
functions/api/contact.ts    # Cloudflare Pages Function : POST /api/contact
tests/contact.test.ts       # tests de la fonction (fetch simulé)
lib/site.ts                 # constantes : URL, email, navigation
public/
├── og.png                  # image Open Graph 1200×630
└── images/                 # captures de sophiedutel-art.fr, portrait (WebP)
.dev.vars.example           # variables des Functions (valeurs fictives)
.env.example                # variable publique du build (clé de test Turnstile)
```

## Formulaire de contact

### Architecture

```text
Formulaire React (components/sections/ContactForm.tsx)
  │  widget Cloudflare Turnstile → jeton à usage unique (5 min)
  ▼
POST /api/contact  (Cloudflare Pages Function, functions/api/contact.ts)
  │  1. méthode POST uniquement (405 sinon), origine identique au site
  │  2. limitation de fréquence par IP (5 tentatives / 10 min, mémoire de l'isolat)
  │  3. JSON uniquement, 16 Ko maximum
  │  4. champ piège invisible + délai minimal de remplissage (3 s)
  │  5. validation : nom ≤ 100, email ≤ 254 (format vérifié), message 10–5 000 caractères
  │  6. vérification du jeton via l'API Siteverify de Turnstile
  ▼
API Resend (POST https://api.resend.com/emails)
  │  from = CONTACT_FROM_EMAIL · to = CONTACT_TO_EMAIL · reply_to = email du visiteur
  │  texte brut uniquement · clé d'idempotence dérivée du jeton Turnstile
  ▼
contact@dutel-webtech.fr
```

- Le site reste un **export statique** : la fonction est servie par Cloudflare Pages à partir du
  dossier `functions/` (aucune route API Next.js, aucun serveur Node.js permanent, aucun SDK).
- Aucun email n'est envoyé si une étape échoue. Le visiteur ne voit un message de succès que si la
  fonction a reçu de Resend l'identifiant de l'email accepté.
- L'adresse du visiteur n'est jamais utilisée comme expéditeur : elle est placée en `reply_to`.
- Les journaux de la fonction ne contiennent que des codes d'erreur, jamais le message ni les
  coordonnées du visiteur.
- Réponses JSON : `{ "ok": true }` ou `{ "ok": false, "error": "<code>" }` (`invalid_fields` avec
  le détail par champ, `turnstile_missing`, `turnstile_expired`, `turnstile_failed`,
  `rate_limited`, `send_failed`, `not_configured`…).
- Côté interface : quatre états (prêt, envoi en cours, succès, erreur), messages annoncés aux
  lecteurs d'écran, champs conservés en cas d'erreur, bouton désactivé pendant l'envoi (pas de
  double soumission), nouveau jeton Turnstile demandé après chaque tentative. L'adresse email
  cliquable reste proposée comme alternative.
- Sans `NEXT_PUBLIC_TURNSTILE_SITE_KEY` au moment du build, le formulaire est affiché mais
  désactivé, avec l'adresse email en alternative.

Ces protections réduisent le spam ; elles ne le suppriment pas totalement. La limitation de
fréquence en mémoire est « au mieux » (propre à chaque instance Cloudflare, remise à zéro au
redémarrage) : pour une limite fiable, ajouter une règle de limitation de débit Cloudflare sur
`/api/contact` (voir plus bas).

### Variables d'environnement

| Variable | Où | Rôle |
|---|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Build (Next.js) | Clé **publique** du widget, intégrée au JavaScript client |
| `TURNSTILE_SECRET_KEY` | Pages Function (secret) | Clé secrète pour l'API Siteverify |
| `RESEND_API_KEY` | Pages Function (secret) | Clé API Resend |
| `CONTACT_FROM_EMAIL` | Pages Function | Expéditeur sur un domaine vérifié dans Resend, ex. `Dutel Web & Tech <formulaire@mail.dutel-webtech.fr>` |
| `CONTACT_TO_EMAIL` | Pages Function | Destinataire : `contact@dutel-webtech.fr` |

Les secrets ne sont jamais dans le code ni dans le bundle client. Fichiers locaux ignorés par Git :
`.dev.vars` (variables des Functions) et `.env.local` (variable de build).

### Configuration Resend

1. Créer un compte Resend et ajouter un domaine d'envoi. Un **sous-domaine dédié** (par exemple
   `mail.dutel-webtech.fr`) est conseillé : il n'interfère pas avec la boîte de réception de
   `contact@dutel-webtech.fr`.
2. Resend indique les enregistrements DNS à créer pour ce domaine. Ils comprennent en général un
   enregistrement **TXT DKIM** (`resend._domainkey…`) ainsi qu'un **MX** et un **TXT SPF** sur un
   sous-domaine d'envoi (`send…`). Recopier exactement les valeurs affichées par Resend dans la
   zone DNS Cloudflare. Un enregistrement **DMARC** (`_dmarc`) est recommandé s'il n'existe pas.
3. Ne pas modifier les enregistrements MX existants du domaine principal, qui servent à recevoir
   les emails de `contact@dutel-webtech.fr`.
4. Une fois le domaine vérifié, créer une clé API avec un accès limité à l'envoi (« Sending
   access ») et la renseigner dans `RESEND_API_KEY`.
5. Renseigner `CONTACT_FROM_EMAIL` avec une adresse de ce domaine vérifié.

Aucun DNS n'a été modifié lors du développement.

### Configuration Turnstile

1. Tableau de bord Cloudflare → Turnstile → ajouter un widget (mode « Managed »).
2. Hostnames : `dutel-webtech.fr` (et le domaine `*.pages.dev` du projet si les prévisualisations
   doivent fonctionner).
3. Récupérer la **clé du site** → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, et la **clé secrète** →
   `TURNSTILE_SECRET_KEY`.
4. Le widget est rendu avec `appearance: "interaction-only"` : il n'apparaît que si Cloudflare
   demande une interaction, et l'action `contact` est vérifiée côté serveur.

Clés de test officielles (pour le développement) :

| | Clé | Comportement |
|---|---|---|
| Site | `1x00000000000000000000AA` | Passe toujours (widget visible) |
| Site | `2x00000000000000000000AB` | Échoue toujours |
| Secret | `1x0000000000000000000000000000000AA` | Validation toujours réussie |
| Secret | `2x0000000000000000000000000000000AA` | Validation toujours refusée |
| Secret | `3x0000000000000000000000000000000AA` | Erreur `timeout-or-duplicate` (jeton déjà utilisé) |

Les clés secrètes de test n'acceptent que le jeton factice produit par les clés de site de test.

### Test local

`npm run dev` ne sert **pas** `/api/contact` : les Pages Functions ne tournent qu'avec Wrangler.

```bash
cp .dev.vars.example .dev.vars    # puis ajuster (clé Resend, expéditeur)
cp .env.example .env.local        # clé de site Turnstile de test
npm run pages:dev                 # next build + wrangler pages dev out
# → http://localhost:8788
```

- Avec les clés de test Turnstile et une clé Resend fictive, la vérification anti-spam réussit
  puis l'envoi échoue côté Resend : le formulaire affiche l'état d'erreur, ce qui est attendu.
- Pour un envoi réel, utiliser une vraie clé Resend et un expéditeur vérifié dans `.dev.vars`.
- Tests automatisés de la fonction (sans réseau, Turnstile et Resend simulés) :
  `npm run test:contact`.

Exemples de requêtes :

```bash
# 405
curl -i http://localhost:8788/api/contact
# 422 (email invalide)
curl -i -X POST http://localhost:8788/api/contact \
  -H "Content-Type: application/json" -H "Origin: http://localhost:8788" \
  -d '{"name":"Test","email":"invalide","message":"Bonjour, ceci est un test.","website":"","elapsed":9000,"token":"XXXX.DUMMY.TOKEN.XXXX"}'
```

## Déploiement Cloudflare Pages

- Commande de build : `npm run build`
- Répertoire de sortie : `out`
- Le dossier `functions/` à la racine est détecté automatiquement : `/api/contact` devient une
  Pages Function, le reste du site reste statique.
- Variables (Settings → Variables and Secrets), à définir pour **Production** et **Preview** :
  - `NODE_VERSION=22`
  - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (texte, utilisée au build)
  - `TURNSTILE_SECRET_KEY` et `RESEND_API_KEY` (type **Secret**)
  - `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` (texte)
- Après modification d'une variable, relancer un déploiement.
- Recommandé : règle de limitation de débit Cloudflare (Security → WAF → Rate limiting rules) sur
  le chemin `/api/contact`, selon ce que permet l'offre du compte.
- Avant d'annoncer le formulaire comme opérationnel : effectuer un envoi réel en production et
  vérifier la réception sur `contact@dutel-webtech.fr` (et la réponse via « Répondre »).

## Pages légales

- `/mentions-legales` et `/politique-de-confidentialite`, sur un gabarit commun
  (`components/legal/LegalPage.tsx`), liées depuis le pied de page et sous le formulaire.
- Toutes les informations légales sont centralisées dans **`lib/legal.ts`**. Les valeurs inconnues
  valent `null`, sont signalées par des commentaires `TODO(...)` et s'affichent comme
  « À compléter », jamais comme une information inventée.
- Les deux pages sont en `noindex` tant qu'elles ne sont pas complétées (`robots` dans chaque page).

## À compléter avant publication

- Informations d'identification dans `lib/legal.ts` (statut, SIRET, immatriculation, TVA, adresse,
  téléphone), après immatriculation de l'activité.
- Politique de confidentialité : durées de conservation, bases juridiques à valider, offre Resend,
  localisation des données OVH, cookies observés en production, position sur Turnstile au regard
  des recommandations de la CNIL (voir les `TODO` en tête de `app/politique-de-confidentialite/page.tsx`).
- Accord de l'autrice pour les captures de sophiedutel-art.fr.
- Configuration Resend (domaine, DNS, clé), Turnstile (widget, clés) et variables Cloudflare Pages.
- Test d'envoi réel en production.
- Retirer de `public/` les fichiers source inutilisés (`portrait.jpg`, `sophie-dutel-mobile.png`).
