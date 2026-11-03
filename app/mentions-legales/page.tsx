import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { mailto, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site dutel-webtech.fr.",
  alternates: { canonical: "/mentions-legales" },
  // Page incomplète : à indexer seulement une fois les informations renseignées.
  robots: { index: false, follow: true },
};

/** Marqueur visible des informations à compléter avant publication. */
function Todo({ children }: { children: React.ReactNode }) {
  return <span className="todo">[À compléter — {children}]</span>;
}

export default function MentionsLegales() {
  return (
    <>
      <Header />
      <main id="contenu" className="legal">
        <div className="wrap">
          <div className="sh">
            <span className="mono">Informations légales</span>
            <span className="r mono">dutel-webtech.fr</span>
          </div>
          <h1>Mentions légales</h1>

          <p className="legal-note mono" role="note">
            Page à compléter avant la publication définitive du site.
          </p>

          <div className="legal-body">
            <section aria-labelledby="ml-editeur">
              <h2 id="ml-editeur">Éditeur du site</h2>
              <dl>
                <div>
                  <dt>Nom commercial</dt>
                  <dd>{site.name}</dd>
                </div>
                <div>
                  <dt>Responsable</dt>
                  <dd>Charles-Louis Dutel</dd>
                </div>
                <div>
                  <dt>Statut juridique</dt>
                  <dd>
                    <Todo>statut</Todo>
                  </dd>
                </div>
                <div>
                  <dt>SIRET</dt>
                  <dd>
                    <Todo>numéro SIRET</Todo>
                  </dd>
                </div>
                <div>
                  <dt>TVA intracommunautaire</dt>
                  <dd>
                    <Todo>numéro de TVA ou mention d&apos;exonération</Todo>
                  </dd>
                </div>
                <div>
                  <dt>Adresse</dt>
                  <dd>
                    <Todo>adresse professionnelle</Todo>
                  </dd>
                </div>
                <div>
                  <dt>Contact</dt>
                  <dd>
                    <a href={mailto}>{site.email}</a>
                  </dd>
                </div>
                <div>
                  <dt>Directeur de la publication</dt>
                  <dd>
                    <Todo>à confirmer</Todo>
                  </dd>
                </div>
              </dl>
            </section>

            <section aria-labelledby="ml-hebergeur">
              <h2 id="ml-hebergeur">Hébergement</h2>
              <p>
                Site hébergé par Cloudflare Pages (Cloudflare, Inc.). <Todo>raison sociale, adresse et
                téléphone de l&apos;hébergeur à vérifier</Todo>
              </p>
            </section>

            <section aria-labelledby="ml-pi">
              <h2 id="ml-pi">Propriété intellectuelle</h2>
              <p>
                <Todo>
                  conditions de reproduction des contenus ; crédits des captures du site
                  sophiedutel-art.fr reproduites avec l&apos;accord de son autrice
                </Todo>
              </p>
            </section>

            <section aria-labelledby="ml-donnees">
              <h2 id="ml-donnees">Données personnelles</h2>
              <p>
                Les informations saisies dans le formulaire de contact (nom, adresse email et message)
                sont transmises par email à {site.name} afin de répondre à votre demande. L&apos;envoi est
                assuré par le service Resend, et le formulaire est protégé contre le spam par Cloudflare
                Turnstile.{" "}
                <Todo>
                  base légale, durée de conservation des messages, sous-traitants (Resend, Cloudflare) et
                  éventuels transferts hors de l&apos;Union européenne, droits des personnes et contact
                  associé, cookies ou stockage éventuellement utilisés par Turnstile
                </Todo>
              </p>
            </section>
          </div>

          <Link className="btn btn-line legal-back" href="/">
            <span className="a" aria-hidden="true">
              ←
            </span>
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
