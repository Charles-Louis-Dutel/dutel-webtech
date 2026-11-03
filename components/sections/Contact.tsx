import SectionHead from "@/components/ui/SectionHead";
import ContactForm from "./ContactForm";
import { mailto, site } from "@/lib/site";

export default function Contact() {
  return (
    <section id="contact" className="sec" data-folio="05" data-name="Contact" aria-labelledby="ct-title">
      <div className="wrap">
        <SectionHead n="05" label="Contact" aside="Réponse par email" />
        <h2 id="ct-title" className="ct-h rv">
          Parlons de votre <em>projet.</em>
        </h2>
        <div className="g ct-g">
          <div className="ct-l rv">
            <p>
              Vous souhaitez créer un site internet, moderniser votre présence en ligne ou développer un
              projet numérique ? Échangeons sur vos besoins.
            </p>
            <a className="mail" href={mailto}>
              {site.email}
            </a>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
