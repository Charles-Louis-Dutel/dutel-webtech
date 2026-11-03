type Props = {
  /** Nom de base du fichier dans /public/images/realisation (sans largeur ni extension). */
  name: string;
  url: string;
  alt: string;
  fig: string;
  title: string;
  note: string;
  className?: string;
  /** Valeur `sizes` adaptée à la largeur de la figure dans la grille. */
  sizes: string;
};

/** Capture d'écran présentée dans un cadre de navigateur, avec légende. */
export default function BrowserShot({ name, url, alt, fig, title, note, className, sizes }: Props) {
  const base = `/images/realisation/${name}`;
  return (
    <figure className={`shot rv${className ? ` ${className}` : ""}`}>
      <div className="browser">
        <div className="bar">
          <span className="dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="url">{url}</span>
        </div>
        <div className="img">
          {/* Export statique : images pré-optimisées en WebP (1200 et 2400 px). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${base}-1200.webp`}
            srcSet={`${base}-1200.webp 1200w, ${base}-2400.webp 2400w`}
            sizes={sizes}
            alt={alt}
            width={2400}
            height={1238}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
      <figcaption className="cap mono">
        <span>
          <b>{fig}</b> — {title}
        </span>
        <span>{note}</span>
      </figcaption>
    </figure>
  );
}
