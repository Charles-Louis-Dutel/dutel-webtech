import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { Row } from "@/components/legal/LegalPage";
import { legal, missingRequiredInfo } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site dutel-webtech.fr : éditeur, hébergement, nom de domaine.",
  alternates: { canonical: "/mentions-legales" },
  // TODO(indexation) : retirer `index: false` une fois les informations obligatoires renseignées
  // (voir missingRequiredInfo() dans lib/legal.ts).
  robots: { index: false, follow: true },
};

// Rappel au moment du build : informations exigées par la loi encore absentes.
const missing = missingRequiredInfo();
if (missing.length) {
  console.warn(`[mentions-legales] Informations obligatoires manquantes : ${missing.join(", ")} (lib/legal.ts)`);
}

const p = legal.publisher;

export default function MentionsLegales() {
  return (
    <LegalPage
      eyebrow="Informations légales"
      title="Mentions légales"
      related={{ href: "/politique-de-confidentialite", label: "Politique de confidentialité" }}
    >
      <section aria-labelledby="ml-editeur">
        <h2 id="ml-editeur">Éditeur du site</h2>
        <p>
          Le site {legal.siteDomain} ({legal.siteName}) est édité par {p.name}, personne physique.
        </p>
        <dl>
          <Row label="Nom du site" value={legal.siteName} />
          <Row label="Éditeur" value={p.name} />
          {/* Champs affichés automatiquement une fois renseignés dans lib/legal.ts. */}
          <Row label="Statut" value={p.status} />
          <Row label="SIRET" value={p.siret} />
          <Row label="Immatriculation" value={p.registration} />
          <Row label="TVA" value={p.vat} />
          <Row label="Adresse" value={p.address} />
          <Row label="Téléphone" value={p.phone} />
          <Row label="Email" value={<a href={`mailto:${p.email}`}>{p.email}</a>} />
          <Row label="Directeur de la publication" value={legal.publicationDirector} />
        </dl>
      </section>

      <section aria-labelledby="ml-hebergeur">
        <h2 id="ml-hebergeur">Hébergement</h2>
        <p>
          Le site est hébergé par {legal.host.name}, via le service {legal.host.service}.
        </p>
        <dl>
          <Row label="Hébergeur" value={legal.host.name} />
          <Row label="Adresse" value={legal.host.address} />
          <Row label="Téléphone" value={legal.host.phone} />
          <Row
            label="Site"
            value={
              <a href={legal.host.website} target="_blank" rel="noopener">
                cloudflare.com<span className="sr-only-text"> (nouvel onglet)</span>
              </a>
            }
          />
        </dl>
      </section>

      <section aria-labelledby="ml-domaine">
        <h2 id="ml-domaine">Nom de domaine et messagerie</h2>
        <p>
          Le nom de domaine {legal.siteDomain} est géré auprès de {legal.ovh.brand} ({legal.ovh.name},{" "}
          {legal.ovh.address}, {legal.ovh.registration}), qui fournit également la messagerie de
          l&apos;adresse {p.email}.
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
          figurent restent la propriété de leur autrice.
          {/* TODO(autorisation-captures) : conserver une trace écrite de l'accord de Sophie Dutel. */}
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
