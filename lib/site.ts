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

/** Liens de navigation principale, dans l'ordre et avec la numérotation de la maquette. */
export const navLinks = [
  { href: "/#realisation", label: "Réalisation", n: "01" },
  { href: "/#services", label: "Services", n: "02" },
  { href: "/#apropos", label: "À propos", n: "03" },
  { href: "/#contact", label: "Contact", n: "05" },
] as const;
