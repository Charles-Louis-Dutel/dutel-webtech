import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { Row } from "@/components/legal/LegalPage";
import { legal } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Données collectées par le site dutel-webtech.fr et son formulaire de contact, prestataires, durées de conservation et droits.",
  alternates: { canonical: "/politique-de-confidentialite" },
  // TODO(indexation) : retirer `index: false` une fois les points « À compléter » tranchés.
  robots: { index: false, follow: true },
};

const p = legal.publisher;
const mail = <a href={`mailto:${p.email}`}>{p.email}</a>;

/*
 * Points nécessitant une décision ou une vérification (voir aussi lib/legal.ts) :
 * - TODO(bases-juridiques) : valider les bases juridiques proposées (intérêt légitime, mesures précontractuelles).
 * - TODO(conservation-projets) : fixer la durée de conservation des échanges qui aboutissent à une collaboration.
 * - TODO(turnstile-consentement) : confirmer, au regard des lignes directrices de la CNIL sur les CAPTCHA,
 *   que Turnstile peut fonctionner sans consentement (Cloudflare réutilise aussi les signaux en tant que
 *   responsable de traitement pour améliorer sa détection).
 * - TODO(cookies-production) : contrôler les cookies réellement déposés en production (paramètres de la zone
 *   Cloudflare, Bot Fight Mode, Web Analytics) et préciser la section « Cookies et autres traceurs ».
 * - TODO(resend-offre) : confirmer la durée de conservation de Resend selon l'offre souscrite.
 * - TODO(ovh-localisation) : vérifier la localisation des données de la messagerie OVH Zimbra.
 * - TODO(turnstile-preclearance) : conserver l'option « pre-clearance » désactivée sur le widget Turnstile
 *   (tableau de bord Cloudflare), sinon mettre à jour la section « Cookies et autres traceurs ».
 */

export default function PolitiqueConfidentialite() {
  return (
    <LegalPage
      eyebrow="Données personnelles"
      title="Politique de confidentialité"
      related={{ href: "/mentions-legales", label: "Mentions légales" }}
    >
      <section aria-labelledby="pc-intro">
        <h2 id="pc-intro">En bref</h2>
        <p>
          Le site dutel-webtech.fr est un site vitrine. Il ne comporte ni compte utilisateur, ni outil de
          mesure d&apos;audience, ni publicité. Des données personnelles sont traitées dans deux situations :
          lorsque vous utilisez le formulaire de contact, et pour assurer la sécurité et l&apos;hébergement du
          site.
        </p>
      </section>

      <section aria-labelledby="pc-responsable">
        <h2 id="pc-responsable">1. Responsable du traitement</h2>
        <p>
          Le responsable du traitement est {p.name}, personne physique, qui édite ce site sous le nom{" "}
          {legal.siteName}. Pour toute question relative à vos données, vous pouvez lui écrire à {mail}.
        </p>
        <dl>
          <Row label="Responsable" value={p.name} />
          <Row label="Adresse" value={p.address} />
          <Row label="Contact" value={mail} />
        </dl>
      </section>

      <section aria-labelledby="pc-donnees">
        <h2 id="pc-donnees">2. Données collectées</h2>
        <h3>Formulaire de contact</h3>
        <ul>
          <li>votre nom ;</li>
          <li>votre adresse email ;</li>
          <li>le contenu de votre message.</li>
        </ul>
        <p>Ces informations sont fournies par vous. Les trois champs sont nécessaires pour vous répondre.</p>
        <h3>Données techniques liées à la sécurité</h3>
        <ul>
          <li>
            l&apos;adresse IP de votre appareil, utilisée pour limiter le nombre d&apos;envois successifs et
            transmise à Cloudflare Turnstile ;
          </li>
          <li>
            les signaux techniques collectés par Cloudflare Turnstile pour distinguer un visiteur humain
            d&apos;un robot : selon Cloudflare, notamment l&apos;adresse IP, l&apos;empreinte TLS, l&apos;en-tête
            User-Agent du navigateur et le site d&apos;origine ;
          </li>
          <li>
            les données de connexion traitées par l&apos;hébergeur pour acheminer et protéger le site (par
            exemple adresse IP, date et heure, page demandée).
          </li>
        </ul>
      </section>

      <section aria-labelledby="pc-finalites">
        <h2 id="pc-finalites">3. Finalités et bases juridiques</h2>
        {/* TODO(bases-juridiques) : bases proposées, à valider par le responsable du traitement. */}
        <dl>
          <div>
            <dt>Répondre à votre demande</dt>
            <dd>
              Lire votre message, vous répondre et, le cas échéant, échanger sur votre projet. Base
              juridique : l&apos;intérêt légitime à répondre aux personnes qui prennent contact (article 6.1.f
              du RGPD) et, lorsque votre demande porte sur un devis ou une prestation, les mesures
              précontractuelles prises à votre demande (article 6.1.b).
            </dd>
          </div>
          <div>
            <dt>Protéger le formulaire</dt>
            <dd>
              Limiter le spam et les envois automatisés (Cloudflare Turnstile, limitation du nombre
              d&apos;envois). Base juridique : l&apos;intérêt légitime à sécuriser le site (article 6.1.f).
            </dd>
          </div>
          <div>
            <dt>Héberger et sécuriser le site</dt>
            <dd>
              Diffuser les pages et protéger le site contre les attaques. Base juridique : l&apos;intérêt
              légitime à assurer le fonctionnement et la sécurité du site (article 6.1.f).
            </dd>
          </div>
        </dl>
        <p>Vos données ne sont ni vendues, ni utilisées à des fins publicitaires, ni inscrites à une liste de diffusion.</p>
      </section>

      <section aria-labelledby="pc-prestataires">
        <h2 id="pc-prestataires">4. Destinataires et prestataires</h2>
        <p>
          Vos messages sont lus par {p.name} uniquement. Les prestataires suivants interviennent pour son
          compte :
        </p>
        <dl>
          <div>
            <dt>Cloudflare, Inc. (États-Unis)</dt>
            <dd>
              Hébergement du site (Cloudflare Pages), exécution du traitement du formulaire (Pages
              Functions) et protection anti-spam (Turnstile). Pour Turnstile, Cloudflare indique agir comme
              sous-traitant pour la protection du site, et comme responsable de traitement distinct
              lorsqu&apos;il réutilise ces signaux pour améliorer sa détection des robots.
            </dd>
          </div>
          <div>
            <dt>Resend (États-Unis)</dt>
            <dd>
              Transmission par email du message envoyé via le formulaire, en tant que sous-traitant.
            </dd>
          </div>
          <div>
            <dt>{legal.ovh.name} (France)</dt>
            <dd>
              Messagerie de l&apos;adresse {p.email} (OVH Zimbra) : réception et stockage des messages et
              des échanges qui suivent.
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="pc-conservation">
        <h2 id="pc-conservation">5. Durées de conservation</h2>
        <h3>Conservation par le responsable du traitement</h3>
        <dl>
          <Row
            label="Demandes sans suite"
            value={`Les messages reçus via le formulaire et les échanges qui n'aboutissent pas à une collaboration sont conservés ${legal.privacy.retentionWithoutFollowUp}, puis supprimés.`}
          />
          <Row label="Projets engagés" value={legal.privacy.retentionProjects} />
          <Row
            label="Limitation des envois"
            value="L'adresse IP utilisée pour limiter les envois successifs est gardée temporairement dans la mémoire du serveur et n'est prise en compte que sur une fenêtre de 10 minutes ; elle n'est enregistrée dans aucune base de données."
          />
        </dl>
        <h3>Conservations techniques propres aux prestataires</h3>
        <p>
          Ces durées sont fixées par les prestataires eux-mêmes et ne dépendent pas de la durée indiquée
          ci-dessus.
        </p>
        <dl>
          <Row
            label="Resend"
            value="Conserve les contenus et journaux des emails transmis pendant une durée qui dépend de l'offre souscrite ; sa documentation indique 30 jours pour les offres Free, Pro et Scale."
          />
          <Row
            label="Cloudflare"
            value="Conserve les données de connexion, de sécurité et les signaux Turnstile selon ses propres politiques."
          />
          <Row
            label={legal.ovh.brand}
            value="Héberge la messagerie : les messages y restent jusqu'à leur suppression par le responsable du traitement, dans les conditions du service de messagerie."
          />
        </dl>
      </section>

      <section aria-labelledby="pc-transferts">
        <h2 id="pc-transferts">6. Transferts hors de l&apos;Union européenne</h2>
        <p>
          Cloudflare et Resend sont des sociétés établies aux États-Unis. D&apos;après leur documentation :
        </p>
        <ul>
          <li>
            Resend stocke les données de ses clients aux États-Unis ; les transferts sont encadrés par les
            clauses contractuelles types de la Commission européenne, et Resend participe au cadre de
            protection des données UE–États-Unis (Data Privacy Framework) ;
          </li>
          <li>
            Cloudflare traite certaines données (notamment des métadonnées de connexion) dans des centres de
            données aux États-Unis et en Europe ; les transferts sont encadrés par sa certification au Data
            Privacy Framework UE–États-Unis et par les clauses contractuelles types.
          </li>
        </ul>
        <p>
          La messagerie est fournie par {legal.ovh.name}, société établie en France.
          {legal.privacy.ovhDataLocation ? ` ${legal.privacy.ovhDataLocation}` : null}
        </p>
      </section>

      <section aria-labelledby="pc-droits">
        <h2 id="pc-droits">7. Vos droits</h2>
        <p>Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits suivants :</p>
        <ul>
          <li>accès à vos données et obtention d&apos;une copie ;</li>
          <li>rectification des données inexactes ;</li>
          <li>effacement de vos données ;</li>
          <li>limitation du traitement ;</li>
          <li>opposition au traitement fondé sur l&apos;intérêt légitime, pour des raisons tenant à votre situation particulière ;</li>
          <li>portabilité, pour les données traitées dans le cadre de mesures précontractuelles ;</li>
          <li>définition de directives relatives au sort de vos données après votre décès.</li>
        </ul>
      </section>

      <section aria-labelledby="pc-exercice">
        <h2 id="pc-exercice">8. Exercer vos droits</h2>
        <p>
          Écrivez à {mail} en précisant le droit que vous souhaitez exercer. Une réponse vous est apportée
          dans un délai d&apos;un mois, qui peut être prolongé de deux mois en cas de demande complexe ; vous
          en êtes alors informé. Un justificatif d&apos;identité ne peut vous être demandé qu&apos;en cas de doute
          raisonnable sur votre identité.
        </p>
        <p>
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès
          de la CNIL (
          <a href="https://www.cnil.fr" target="_blank" rel="noopener">
            cnil.fr<span className="sr-only-text"> (nouvel onglet)</span>
          </a>
          ).
        </p>
        <p>
          Pour les signaux que Cloudflare traite en tant que responsable de traitement distinct, vous pouvez
          également contacter Cloudflare à l&apos;adresse dpo@cloudflare.com.
        </p>
      </section>

      <section aria-labelledby="pc-cookies">
        <h2 id="pc-cookies">9. Cookies et autres traceurs</h2>
        <p>
          Le site ne dépose aucun cookie de mesure d&apos;audience, de publicité ou de réseau social, et
          n&apos;utilise pas le stockage local de votre navigateur.
        </p>
        <p>
          Le formulaire de contact utilise Cloudflare Turnstile. Son script est chargé depuis
          challenges.cloudflare.com lorsque la page d&apos;accueil s&apos;affiche ; il lit des informations
          techniques de votre navigateur afin de vérifier que l&apos;envoi provient d&apos;un être humain, et
          délivre un jeton à usage unique, valable quelques minutes, transmis avec votre message. Le widget
          est configuré sans pré-autorisation : Turnstile ne dépose donc pas le cookie cf_clearance.
        </p>
        <p>
          {/* TODO(cookies-production) : préciser ce paragraphe après contrôle des cookies en production. */}
          Selon ses réglages de sécurité, l&apos;infrastructure de Cloudflare peut déposer des cookies
          techniques destinés à la protection du site contre les robots ; ils sont décrits dans la politique
          relative aux cookies de Cloudflare.
        </p>
        <p>
          Pour plus d&apos;informations, consultez la politique de confidentialité de Turnstile publiée par
          Cloudflare (
          <a href="https://www.cloudflare.com/turnstile-privacy-policy/" target="_blank" rel="noopener">
            Turnstile Privacy Addendum<span className="sr-only-text"> (nouvel onglet)</span>
          </a>
          ).
        </p>
      </section>

      <section aria-labelledby="pc-modif">
        <h2 id="pc-modif">10. Évolution de cette politique</h2>
        <p>
          Cette politique peut être mise à jour, notamment en cas de changement de prestataire ou de
          fonctionnement du site. La date de dernière mise à jour figure en haut de page. Voir aussi les{" "}
          <Link href="/mentions-legales">mentions légales</Link>.
        </p>
      </section>
    </LegalPage>
  );
}
