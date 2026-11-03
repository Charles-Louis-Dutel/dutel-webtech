import SectionHead from "@/components/ui/SectionHead";

const steps = [
  { title: "Échange", text: "Nous discutons de votre activité, de vos besoins et de vos objectifs." },
  { title: "Conception", text: "Je prépare une proposition visuelle adaptée à votre identité." },
  { title: "Développement", text: "Je réalise votre site et nous ajustons les derniers détails." },
  { title: "Mise en ligne", text: "Votre site est publié et accessible à vos visiteurs." },
];

export default function Method() {
  return (
    <section
      id="methode"
      className="sec methode"
      data-folio="Méthode"
      data-dark=""
      aria-labelledby="m-title"
    >
      <div className="wrap">
        <SectionHead label="Méthode" aside="Quatre étapes" />
        <h2 id="m-title" className="m-title rv">
          De la première idée <em>à la mise en ligne.</em>
        </h2>
        <div className="steps-w" data-reveal="">
          <span className="bar" aria-hidden="true" />
          <ol className="steps">
            {steps.map((s, i) => (
              <li key={s.title} className="step rv">
                <div className="n" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
