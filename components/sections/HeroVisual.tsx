/**
 * Visuel droit du hero — « Le D en construction ».
 *
 * Le monogramme est le vrai dessin du « D » d'Instrument Serif (la police du
 * logotype), tracé depuis le fichier de police. Sa panse correspond presque
 * exactement à un demi-cercle de rayon 360 unités (la moitié de la hauteur de
 * capitale) centré sur l'axe du fût : le cercle de construction, le demi-disque
 * et les lignes de capitale et de base rendent cette géométrie visible.
 *
 * Purement décoratif : ignoré par les technologies d'assistance.
 * Animations : tracé à l'apparition et bascule du demi-disque au survol,
 * désactivées avec `prefers-reduced-motion`.
 */

// Grille de 6 colonnes (marges de 6 %), prolongée au-delà du cadre pour
// rester continue quel que soit le format du conteneur.
const GRID_X = [-1113.33, -966.67, -820.0, -673.33, -526.67, -380.0, -233.33, -86.67, 60.0, 206.67, 353.33, 500.0, 646.67, 793.33, 940.0, 1086.67, 1233.33, 1380.0, 1526.67, 1673.33, 1820.0, 1966.67, 2113.33];

// Tangentes du cercle de construction : haut et bas du fût, extrémités gauche et droite.
const ANCHORS: [number, number][] = [
  [500, 210],
  [500, 810],
  [200, 510],
  [800, 510],
];

// Contour du glyphe « D » (unités de police, 1000 / em, axe Y vers le haut).
const D_PATH =
  "M34 0Q19 0 19 11Q19 20 32 23L55 27Q89 33 89 66V654Q89 675 82.5 682.0Q76 689 55 693L32 697Q19 700 19 709Q19 720 34 720H236Q314 720 371.0 674.5Q428 629 459.0 547.0Q490 465 490 357Q490 248 457.5 168.0Q425 88 366.0 44.0Q307 0 226 0ZM230 26Q319 26 365.5 111.0Q412 196 412 357Q412 517 367.5 605.5Q323 694 236 694Q160 694 160 621V99Q160 59 176.5 42.5Q193 26 230 26Z";

export default function HeroVisual() {
  return (
    <div className="hv rv" aria-hidden="true">
      <svg viewBox="0 0 1000 1020" preserveAspectRatio="xMidYMid meet" focusable="false">
        <g className="ln grid">
          {GRID_X.map((x) => (
            <line key={x} x1={x} x2={x} y1={-1000} y2={2020} />
          ))}
        </g>

        {/* Lignes de capitale et de base */}
        <g className="ln guide">
          <line x1={-3000} x2={4000} y1={210} y2={210} />
          <line x1={-3000} x2={4000} y1={810} y2={810} />
        </g>

        {/* Demi-disque complémentaire, côté gauche du fût */}
        <g className="flip">
          <path className="half" d="M500 210 A300 300 0 0 0 500 810 Z" />
        </g>

        {/* Monogramme : 720 unités de capitale → 600 unités ici */}
        <path className="glyph" d={D_PATH} transform="translate(396.25 810) scale(0.833333 -0.833333)" />

        {/* Construction */}
        <circle className="ln acc draw" cx={500} cy={510} r={300} pathLength={1} />
        <line className="ln axis fade" x1={500} x2={500} y1={150} y2={870} />
        {/* Points d'ancrage aux tangentes du cercle */}
        <g className="fade">
          {ANCHORS.map(([x, y]) => (
            <rect key={`${x}-${y}`} className="ln anchor" x={x - 6} y={y - 6} width={12} height={12} />
          ))}
        </g>
        <rect className="pt" x={495} y={505} width={10} height={10} />
      </svg>

      <span className="hv-t hv-tl mono">Dutel — Web &amp; Tech</span>
      <span className="hv-t hv-tr mono">Fig. 00 — Monogramme</span>
      <span className="hv-t hv-g hv-cap mono">Capitale · 720</span>
      <span className="hv-t hv-g hv-base mono">Ligne de base · 0</span>
      <span className="hv-t hv-bl">
        <i style={{ background: "var(--paper)" }} />
        <i style={{ background: "var(--ink)" }} />
        <i style={{ background: "var(--acc)" }} />
      </span>
      <span className="hv-t hv-br mono">49°15′ N · 4°02′ E</span>
    </div>
  );
}
