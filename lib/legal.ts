/**
 * Informations légales du site — source unique pour les mentions légales et la
 * politique de confidentialité.
 *
 * ⚠️  À COMPLÉTER AVANT TOUTE PUBLICATION COMMERCIALE
 *
 * Les valeurs `null` ne sont jamais présentées comme des informations réelles :
 * les pages affichent à leur place un repère « À compléter ». Ne rien inventer :
 * renseigner uniquement des informations officielles (avis de situation INSEE,
 * extrait RNE, etc.).
 *
 * Contexte (novembre 2026) : l'activité n'est pas encore immatriculée. Aucun
 * numéro SIRET n'est attribué. Ne pas indiquer « en cours d'immatriculation »
 * tant qu'aucune démarche n'a été engagée.
 */

export type Maybe = string | null;

export const legal = {
  /** Date de dernière mise à jour affichée sur les deux pages. */
  lastUpdated: "3 novembre 2026",

  publisher: {
    /** Personne physique éditrice du site (connu). */
    name: "Charles-Louis Dutel",
    /** Nom commercial envisagé (connu). */
    tradeName: "Dutel Web & Tech",
    /** Adresse de contact (connu). */
    email: "contact@dutel-webtech.fr",

    // TODO(statut) : statut professionnel définitif après immatriculation
    // (par exemple entrepreneur individuel, avec la mention « EI » ou
    // « entrepreneur individuel » accolée au nom).
    status: null as Maybe,
    // TODO(siret) : numéro SIRET attribué par l'INSEE après immatriculation.
    siret: null as Maybe,
    // TODO(rne) : immatriculation au Registre national des entreprises, si applicable.
    registration: null as Maybe,
    // TODO(adresse) : adresse de domiciliation ou de domicile (obligatoire pour
    // un éditeur personne physique exerçant à titre professionnel).
    address: null as Maybe,
    // TODO(telephone) : numéro de téléphone (exigé par la LCEN pour un éditeur
    // personne physique exerçant à titre professionnel).
    phone: null as Maybe,
    // TODO(tva) : numéro de TVA intracommunautaire, ou mention applicable en
    // franchise en base (à confirmer selon la situation fiscale).
    vat: null as Maybe,
  },

  /** Directeur de la publication : l'éditeur personne physique. */
  publicationDirector: "Charles-Louis Dutel",

  /**
   * Hébergeur. Coordonnées vérifiées le 3 novembre 2026 : adresse et téléphone
   * déclarés par Cloudflare, Inc. auprès de la SEC (formulaire EDGAR, 2024).
   * À revérifier avant publication.
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
    address: "2 rue Kellermann, 59100 Roubaix, France",
    registration: "RCS Lille Métropole 424 761 419",
    website: "https://www.ovhcloud.com",
  },

  privacy: {
    // TODO(conservation-messages) : durée de conservation des messages reçus
    // dans la messagerie (décision du responsable du traitement).
    retentionMessages: null as Maybe,
    // TODO(conservation-prospects) : durée de conservation des échanges qui
    // n'aboutissent pas à une collaboration (décision à prendre).
    retentionProspects: null as Maybe,
    // TODO(resend-offre) : la documentation Resend indique une conservation des
    // données d'emails et journaux de 30 jours pour les offres Free, Pro et
    // Scale. À confirmer selon l'offre souscrite.
    resendRetentionNote:
      "D'après la documentation de Resend, les contenus et journaux d'emails sont conservés 30 jours sur ses offres Free, Pro et Scale.",
    // TODO(ovh-localisation) : vérifier la localisation des données de la
    // messagerie OVH Zimbra dans le contrat ou l'espace client OVHcloud.
    ovhDataLocation: null as Maybe,
  },
} as const;
