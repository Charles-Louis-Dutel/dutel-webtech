import HeroVisual from "./HeroVisual";

const prestations = [
  "Création de sites internet",
  "Maintenance & évolution",
  "Développement sur mesure",
];

export default function Hero() {
  return (
    <section className="hc" data-folio="00" data-name="Accueil" aria-labelledby="hero-title">
      <div className="wrap">
        <div className="g hc-g">
          <div className="hc-l">
            <p className="hc-loc mono rv">
              <span className="dot" aria-hidden="true" />
              Développeur indépendant — Reims &amp; alentours
            </p>
            <h1 id="hero-title" className="rv">
              Des sites internet <em>à l&apos;image</em> de votre{" "}
              <span className="nowrap">savoir-faire.</span>
            </h1>
            <p className="hc-p rv">
              Je conçois et développe des sites internet modernes, élégants et performants pour les
              professionnels et les entreprises.
            </p>
            <div className="hc-act rv">
              <a className="btn btn-ink" href="#contact">
                Parlons de votre projet{" "}
                <span className="a" aria-hidden="true">
                  →
                </span>
              </a>
              <a className="btn btn-line" href="#realisation">
                Voir ma réalisation
              </a>
            </div>
          </div>
          <HeroVisual />
        </div>
        <ul className="hc-svc rv" aria-label="Prestations">
          {prestations.map((p, i) => (
            <li key={p} className={i === 0 ? "on" : undefined}>
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              <a href="#services">{p}</a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
