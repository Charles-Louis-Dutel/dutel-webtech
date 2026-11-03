import BrowserShot from "@/components/ui/BrowserShot";
import SectionHead from "@/components/ui/SectionHead";

const SITE = "https://sophiedutel-art.fr";

const features = [
  "Galerie de peintures",
  "Pages individuelles des œuvres",
  "Interface d'administration",
  "Gestion des contenus",
  "Formulaire de contact",
  "Responsive design",
];

export default function Realisation() {
  return (
    <section
      id="realisation"
      className="realisation"
      data-folio="Réalisation"
      aria-labelledby="case-title"
    >
      <div className="wrap">
        <SectionHead label="Réalisation" aside="Étude de cas" />
        <div className="g case-head">
          <h2 id="case-title" className="rv">
            Sophie Dutel <em>Artiste peintre</em>
          </h2>
          <dl className="spec rv">
            <div>
              <dt>Projet</dt>
              <dd>Site professionnel d&apos;artiste</dd>
            </div>
            <div>
              <dt>Prestation</dt>
              <dd>Création de site internet</dd>
            </div>
            <div>
              <dt>Écrans</dt>
              <dd>Ordinateur, tablette, mobile</dd>
            </div>
            <div>
              <dt>En ligne</dt>
              <dd>
                <a href={SITE} target="_blank" rel="noopener">
                  sophiedutel-art.fr ↗<span className="sr-only-text"> (nouvel onglet)</span>
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <BrowserShot
          name="sophie-dutel-accueil"
          url="sophiedutel-art.fr"
          alt="Capture de la page d'accueil de sophiedutel-art.fr : signature, navigation et grand visuel d'une peinture de bord de lac"
          fig="Fig. 01"
          title="Page d'accueil"
          note="Version ordinateur"
          sizes="(max-width: 1520px) 92vw, 1350px"
        />

        <div className="g case-body">
          <div className="case-txt rv">
            <p className="lead">
              Création d&apos;un site professionnel permettant à une artiste peintre de présenter{" "}
              <em>son univers et ses œuvres.</em>
            </p>
            <ol className="fl" aria-label="Fonctionnalités">
              {features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ol>
            <a className="visit" href={SITE} target="_blank" rel="noopener">
              Visiter le site <span aria-hidden="true">↗</span>
              <span className="sr-only-text"> sophiedutel-art.fr (nouvel onglet)</span>
            </a>
          </div>
          <BrowserShot
            className="case-f2"
            name="sophie-dutel-creations-recentes"
            url="sophiedutel-art.fr"
            alt="Capture de la section « Créations récentes » : trois œuvres avec titre, technique et format"
            fig="Fig. 02"
            title="Créations récentes"
            note="Titre, technique, format"
            sizes="(max-width: 1080px) 92vw, 50vw"
          />
        </div>

        <div className="g case-row">
          <BrowserShot
            className="case-f3"
            name="sophie-dutel-galerie"
            url="sophiedutel-art.fr/gallery"
            alt="Capture de la page galerie : mosaïque de peintures de paysages"
            fig="Fig. 03"
            title="Galerie"
            note="Mise en page en mosaïque"
            sizes="(max-width: 680px) 92vw, 66vw"
          />
          <figure className="case-f4 rv">
            {/* Ressource manquante : capture mobile réelle de sophiedutel-art.fr à fournir. */}
            <div className="phone">
              <div>
                Capture mobile
                <br />à fournir
              </div>
            </div>
            <figcaption className="cap mono" style={{ width: "min(100%, 260px)" }}>
              <span>
                <b>Fig. 04</b> — Mobile
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
