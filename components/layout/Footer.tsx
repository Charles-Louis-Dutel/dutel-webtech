import Link from "next/link";
import { mailto, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="fw" aria-hidden="true">
          Dutel
          <small>
            Web
            <br />
            &amp; Tech
          </small>
        </div>
        <div className="fi">
          <div>
            <span className="mono">Nom commercial</span>
            {site.name}
          </div>
          <div>
            <span className="mono">Localisation</span>
            Région de Reims, France
          </div>
          <div>
            <span className="mono">Email</span>
            <a href={mailto}>{site.email}</a>
          </div>
          <div>
            <span className="mono">Informations</span>
            <Link href="/mentions-legales">Mentions légales</Link>
            <Link href="/politique-de-confidentialite">Politique de confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
