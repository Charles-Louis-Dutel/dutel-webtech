import SectionHead from "@/components/ui/SectionHead";

export default function About() {
  return (
    <section
      id="apropos"
      className="sec apropos"
      data-folio="À propos"
      aria-labelledby="about-title"
    >
      <div className="wrap">
        <SectionHead label="À propos" aside="Charles-Louis Dutel" />
        <h2 id="about-title" className="about-q rv">
          Un interlocuteur unique, <em>du premier échange à la mise en ligne.</em>
        </h2>
        <div className="g about-g">
          <div className="portrait rv">
            {/* Photo d'origine recadrée en 4:5 (bandes noires retirées, visage centré), sans retouche. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/about/charles-louis-dutel.webp"
              alt="Portrait de Charles-Louis Dutel"
              width={550}
              height={688}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="about-t rv">
            <p>
              Je suis Charles-Louis, développeur indépendant basé dans la région de Reims et formé à
              l&apos;École 42 Paris.
            </p>
            <p>
              J&apos;accompagne les professionnels dans la création de leur présence en ligne, en associant
              conception soignée, développement moderne et attention portée à leurs besoins.
            </p>
          </div>
          <dl className="facts rv">
            <div>
              <dt className="mono">Basé</dt>
              <dd>Région de Reims</dd>
            </div>
            <div>
              <dt className="mono">Formation</dt>
              <dd>École 42 Paris</dd>
            </div>
            <div>
              <dt className="mono">Statut</dt>
              <dd>Indépendant</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
