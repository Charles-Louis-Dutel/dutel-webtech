import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { legal, type Maybe } from "@/lib/legal";

/** Repère visible pour une information pas encore disponible (jamais une fausse valeur). */
export function Todo({ children }: { children: React.ReactNode }) {
  return <span className="todo">[À compléter — {children}]</span>;
}

/** Affiche la valeur si elle est connue, sinon un repère « À compléter ». */
export function Value({ value, todo }: { value: Maybe; todo: string }) {
  return value ? <>{value}</> : <Todo>{todo}</Todo>;
}

type Props = {
  eyebrow: string;
  title: string;
  /** Lien vers l'autre page légale, en fin de page. */
  related: { href: string; label: string };
  notice?: React.ReactNode;
  children: React.ReactNode;
};

/** Gabarit commun des pages légales : en-tête, titre, avertissement, sections, pied de page. */
export default function LegalPage({ eyebrow, title, related, notice, children }: Props) {
  return (
    <>
      <Header />
      <main id="contenu" className="legal">
        <div className="wrap">
          <div className="sh">
            <span className="mono">{eyebrow}</span>
            <span className="r mono">Mise à jour : {legal.lastUpdated}</span>
          </div>
          <h1>{title}</h1>

          {notice ? (
            <p className="legal-note mono" role="note">
              {notice}
            </p>
          ) : null}

          <div className="legal-body">{children}</div>

          <nav className="legal-links" aria-label="Pages légales">
            <Link className="btn btn-line" href="/">
              <span className="a" aria-hidden="true">
                ←
              </span>
              Retour à l&apos;accueil
            </Link>
            <Link className="legal-related" href={related.href}>
              {related.label}
            </Link>
          </nav>
        </div>
      </main>
      <Footer />
    </>
  );
}
