import SectionHead from "@/components/ui/SectionHead";

export default function Services() {
  return (
    <section id="services" className="sec" data-folio="02" data-name="Services" aria-labelledby="svc-title">
      <div className="wrap">
        <SectionHead n="02" label="Services" aside="Trois prestations" />
        <div className="g svc-wrap">
          <div className="svc-intro rv">
            <h2 id="svc-title">
              Ce que je fais <em>pour vous.</em>
            </h2>
            <p>Du site vitrine à l&apos;outil sur mesure, un accompagnement adapté à votre activité.</p>
          </div>
          <ol className="svc-list">
            <li className="svc main rv">
              <span className="n">01</span>
              <h3>
                Création de <em>sites internet</em>
              </h3>
              <span className="ar" aria-hidden="true">
                →
              </span>
              <p>
                Sites vitrines modernes, adaptés à tous les écrans et conçus pour valoriser votre activité.
              </p>
              <span className="svc-tag mono">Prestation principale</span>
            </li>
            <li className="svc rv">
              <span className="n">02</span>
              <h3>Maintenance &amp; évolution</h3>
              <span className="ar" aria-hidden="true">
                →
              </span>
              <p>
                Modifications, mises à jour et accompagnement technique pour faire évoluer votre site
                internet.
              </p>
            </li>
            <li className="svc rv">
              <span className="n">03</span>
              <h3>Développement sur mesure</h3>
              <span className="ar" aria-hidden="true">
                →
              </span>
              <p>Fonctionnalités spécifiques, interfaces web et outils numériques adaptés à vos besoins.</p>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
