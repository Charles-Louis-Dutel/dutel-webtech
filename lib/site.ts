export const site = {
  name: "Dutel Web & Tech",
  url: "https://dutel-webtech.fr",
  email: "contact@dutel-webtech.fr",
  title: "Dutel Web & Tech — Création de sites internet à Reims",
  description:
    "Développeur indépendant à Reims : création de sites internet, maintenance et développement web sur mesure.",
  locale: "fr_FR",
} as const;

export const mailto = `mailto:${site.email}`;

/** Liens de navigation principale. */
export const navLinks = [
  { href: "/#realisation", label: "Réalisation" },
  { href: "/#services", label: "Services" },
  { href: "/#apropos", label: "À propos" },
  { href: "/#contact", label: "Contact" },
] as const;
