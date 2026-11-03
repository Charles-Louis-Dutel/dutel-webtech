import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { Todo, Value } from "@/components/legal/LegalPage";
import { legal } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site dutel-webtech.fr : éditeur, hébergement, nom de domaine.",
  alternates: { canonical: "/mentions-legales" },
  // TODO(indexation) : retirer `index: false` une fois les informations obligatoires complétées.
  robots: { index: false, follow: true },
};

const p = legal.publisher;

export default function MentionsLegales() {
  return (
    <LegalPage
      eyebrow="Informations légales"
      title="Mentions légales"
      related={{ href: "/politique-de-confidentialite", label: "Politique de confidentialité" }}
      notice="Certaines informations d'identification seront ajoutées avant le lancement de l'activité commerciale."
    >
      <section aria-labelledby="ml-editeur">
        <h2 id="ml-editeur">Éditeur du site</h2>
        <p>
          Le site dutel-webtech.fr est édité par {p.name}, qui le présente sous le nom commercial{" "}
          {p.tradeName}.
        </p>
        <dl>
          <div>
            <dt>Éditeur</dt>
            <dd>{p.name}</dd>
          </div>
          <div>
            <dt>Nom commercial</dt>
            <dd>{p.tradeName}</dd>
          </div>
          <div>
            <dt>Statut</dt>
            <dd>
              <Value value={p.status} todo="statut professionnel" />
            </dd>
          </div>
          <div>
            <dt>SIRET</dt>
            <dd>
              <Value value={p.siret} todo="numéro SIRET" />
            </dd>
          </div>
          <div>
            <dt>Immatriculation</dt>
            <dd>
              <Value value={p.registration} todo="registre d'immatriculation, si applicable" />
            </dd>
          </div>
          <div>
            <dt>TVA</dt>
            <dd>
              <Value value={p.vat} todo="numéro de TVA intracommunautaire ou mention applicable" />
            </dd>
          </div>
          <div>
            <dt>Adresse</dt>
            <dd>
              <Value value={p.address} todo="adresse de domiciliation" />
            </dd>
          </div>
          <div>
            <dt>Téléphone</dt>
            <dd>
              <Value value={p.phone} todo="numéro de téléphone" />
            </dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${p.email}`}>{p.email}</a>
            </dd>
          </div>
          <div>
            <dt>Directeur de la publication</dt>
            <dd>{legal.publicationDirector}</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="ml-hebergeur">
        <h2 id="ml-hebergeur">Hébergement</h2>
        <p>
          Le site est hébergé par {legal.host.name}, via le service {legal.host.service}.
        </p>
        <dl>
          <div>
            <dt>Hébergeur</dt>
            <dd>{legal.host.name}</dd>
          </div>
          <div>
            <dt>Adresse</dt>
            <dd>{legal.host.address}</dd>
          </div>
          <div>
            <dt>Téléphone</dt>
            <dd>{legal.host.phone}</dd>
          </div>
          <div>
            <dt>Site</dt>
            <dd>
              <a href={legal.host.website} target="_blank" rel="noopener">
                cloudflare.com<span className="sr-only-text"> (nouvel onglet)</span>
              </a>
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="ml-domaine">
        <h2 id="ml-domaine">Nom de domaine et messagerie</h2>
        <p>
          Le nom de domaine dutel-webtech.fr est enregistré auprès de {legal.ovh.name} ({legal.ovh.address},{" "}
          {legal.ovh.registration}), qui fournit également la messagerie de l&apos;adresse {p.email}.
        </p>
      </section>

      <section aria-labelledby="ml-pi">
        <h2 id="ml-pi">Propriété intellectuelle</h2>
        <p>
          Les textes, la mise en page, le monogramme et les éléments graphiques du site sont la propriété de{" "}
          {p.name}, sauf mention contraire. Toute reproduction ou adaptation sans autorisation préalable est
          interdite.
        </p>
        <p>
          Les captures d&apos;écran du site sophiedutel-art.fr illustrent une réalisation ; les œuvres qui y
          figurent restent la propriété de leur autrice.{" "}
          {/* TODO(autorisation-captures) : confirmer l'accord de Sophie Dutel pour la reproduction des captures et des œuvres. */}
          <Todo>confirmation de l&apos;accord de l&apos;autrice pour la reproduction</Todo>
        </p>
        <p>
          Les polices Geist, Geist Mono et Instrument Serif sont utilisées sous licence SIL Open Font License.
        </p>
      </section>

      <section aria-labelledby="ml-donnees">
        <h2 id="ml-donnees">Données personnelles</h2>
        <p>
          Les informations sur les données collectées par le formulaire de contact, les prestataires
          concernés et vos droits figurent dans la{" "}
          <Link href="/politique-de-confidentialite">politique de confidentialité</Link>.
        </p>
      </section>
    </LegalPage>
  );
}
