type Props = { label: string; aside?: string };

/** En-tête de section : intitulé et mention à droite, sur un filet. */
export default function SectionHead({ label, aside }: Props) {
  return (
    <div className="sh">
      <span className="mono">{label}</span>
      {aside ? <span className="r mono">{aside}</span> : null}
    </div>
  );
}
