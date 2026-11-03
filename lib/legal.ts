/**
 * Informations légales du site — source unique pour les mentions légales et la
 * politique de confidentialité.
 *
 * Situation (novembre 2026) : Dutel Web & Tech est un projet professionnel porté
 * par Charles-Louis Dutel, personne physique. Aucune entreprise n'est encore
 * créée : pas de SIRET, pas de statut, pas de numéro de TVA. Ne rien inventer et
 * ne pas indiquer « en cours d'immatriculation ».
 *
 * Affichage : un champ `null` n'est pas affiché sur le site (pas de liste de
 * rubriques « À compléter » visibles). Les champs exigés par la loi et encore
 * absents sont listés par `missingRequiredInfo()`, signalés pendant le build et
 * documentés dans le README : leur absence empêche de considérer les mentions
 * légales comme conformes.
 */

export type Maybe = string | null;

export const legal = {
  /** Date de dernière mise à jour affichée sur les deux pages. */
  lastUpdated: "3 novembre 2026",

  /** Nom du site (et nom commercial envisagé). */
  siteName: "Dutel Web & Tech",
  siteDomain: "dutel-webtech.fr",

  publisher: {
    /** Personne physique éditrice du site et responsable du traitement. */
    name: "Charles-Louis Dutel",
    email: "contact@dutel-webtech.fr",

    // ── Obligatoires pour un éditeur personne physique agissant à titre professionnel
    //    (LCEN, art. 1-1 ; anciennement art. 6, III). À renseigner avant publication.
    // TODO(adresse) : adresse du domicile ou de domiciliation. Ne pas inventer.
    address: null as Maybe,
    // TODO(telephone) : numéro de téléphone. Ne pas inventer.
    phone: null as Maybe,

    // ── À renseigner après la création de l'entreprise (affichés seulement s'ils sont remplis).
    // TODO(statut) : par exemple entrepreneur individuel, avec la mention « EI » accolée au nom.
    status: null as Maybe,
    // TODO(siret) : numéro SIRET attribué par l'INSEE.
    siret: null as Maybe,
    // TODO(rne) : immatriculation au Registre national des entreprises, si applicable.
    registration: null as Maybe,
    // TODO(tva) : numéro de TVA intracommunautaire, ou mention de franchise applicable.
    vat: null as Maybe,
  },

  /** Directeur de la publication : l'éditeur personne physique. */
  publicationDirector: "Charles-Louis Dutel",

  /**
   * Hébergeur. Coordonnées vérifiées le 3 novembre 2026 (adresse et téléphone
   * déclarés par Cloudflare, Inc. auprès de la SEC). À revérifier avant publication.
   */
  host: {
    name: "Cloudflare, Inc.",
    service: "Cloudflare Pages",
    address: "101 Townsend St., San Francisco, CA 94107, États-Unis",
    phone: "+1 888 993 5273",
    website: "https://www.cloudflare.com",
  },

  /**
   * Bureau d'enregistrement du nom de domaine et messagerie (OVH Zimbra).
   * Identité vérifiée le 3 novembre 2026 sur les mentions légales d'OVHcloud.
   */
  ovh: {
    name: "OVH SAS",
    brand: "OVHcloud",
    address: "2 rue Kellermann, 59100 Roubaix, France",
    registration: "RCS Lille Métropole 424 761 419",
    website: "https://www.ovhcloud.com",
  },

  privacy: {
    /** Décision du responsable du traitement (novembre 2026). */
    retentionWithoutFollowUp: "12 mois après le dernier échange",
    // TODO(conservation-projets) : durée de conservation des échanges qui aboutissent à une
    // collaboration (durée de la relation, puis obligations comptables et fiscales applicables).
    retentionProjects: null as Maybe,
    // TODO(ovh-localisation) : vérifier la localisation des données de la messagerie OVH Zimbra.
    ovhDataLocation: null as Maybe,
  },
} as const;

/** Informations exigées par la loi qui manquent encore (pour le build et le README). */
export function missingRequiredInfo(): string[] {
  const missing: string[] = [];
  if (!legal.publisher.address) missing.push("adresse de l'éditeur");
  if (!legal.publisher.phone) missing.push("téléphone de l'éditeur");
  return missing;
}
