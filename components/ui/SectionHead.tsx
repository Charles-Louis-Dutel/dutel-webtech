type Props = { n: string; label: string; aside?: string };

/** En-tête de section : numéro, intitulé et mention à droite, sur un filet. */
export default function SectionHead({ n, label, aside }: Props) {
  return (
    <div className="sh">
      <span className="mono">
        <b>{n}</b>
        {label}
      </span>
      {aside ? <span className="r mono">{aside}</span> : null}
    </div>
  );
}
