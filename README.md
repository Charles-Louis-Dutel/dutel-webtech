# Dutel Web & Tech — site professionnel

Site vitrine de **Dutel Web & Tech**, développeur web indépendant dans la région de Reims.
Intégration de la maquette « Hero C2 » (Claude Design) en Next.js, exportée en site statique
pour Cloudflare Pages (`https://dutel-webtech.fr`).

## Stack

- Next.js 16 (App Router, `output: "export"`), React 19, TypeScript
- Tailwind CSS 4 (thème et utilitaires) + CSS dédié pour la composition éditoriale (`app/globals.css`)
- ESLint (`eslint-config-next`)
- Polices servies localement via `next/font/local` : Geist, Geist Mono, Instrument Serif (licence OFL)

## Commandes

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build   # génère le site statique dans out/
```

Pour prévisualiser l'export : `npx serve out`.

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
lib/site.ts                 # constantes : URL, email, navigation
public/
├── og.png                  # image Open Graph 1200×630
└── images/realisation/     # captures de sophiedutel-art.fr (WebP 1200 et 2400 px)
```

## Déploiement Cloudflare Pages

- Commande de build : `npm run build`
- Répertoire de sortie : `out`
- Variable d'environnement conseillée : `NODE_VERSION=22`

## À compléter avant publication

- Mentions légales (`app/mentions-legales/page.tsx`) : statut, SIRET, TVA, adresse, hébergeur.
  La page est en `noindex` tant qu'elle n'est pas complétée.
- Capture mobile réelle de sophiedutel-art.fr (Fig. 04, actuellement un emplacement réservé).
- Photo professionnelle (section À propos, format 4:5).
- Solution d'envoi du formulaire (actuellement : ouverture de la messagerie via `mailto:`).
