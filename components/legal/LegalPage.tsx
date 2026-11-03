import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { legal, type Maybe } from "@/lib/legal";

/**
 * Ligne d'une liste de définitions, affichée uniquement si la valeur est connue.
 * Les informations manquantes ne sont pas affichées : elles sont suivies dans
 * lib/legal.ts (TODO et `missingRequiredInfo`).
 */
export function Row({ label, value }: { label: string; value: Maybe | React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
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
