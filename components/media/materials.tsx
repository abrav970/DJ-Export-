/**
 * Shared material definitions for the artwork scenes.
 *
 * Each commodity gets a lit-sphere gradient (offset highlight, dark terminator
 * and a warm bounce) plus soft-focus filters, which is what makes the vector
 * scenes read as photographic macro imagery rather than flat illustration.
 */

export type Material = "cherry" | "bean" | "corn" | "pod" | "husk";

export const Materials = ({ id }: { id: string }) => (
  <defs>
    <radialGradient id={`${id}-cherry`} cx="0.34" cy="0.28" r="0.92">
      <stop offset="0%" stopColor="#f0917a" />
      <stop offset="28%" stopColor="#c2442c" />
      <stop offset="70%" stopColor="#7d2114" />
      <stop offset="100%" stopColor="#3d0f09" />
    </radialGradient>

    <radialGradient id={`${id}-bean`} cx="0.34" cy="0.26" r="0.95">
      <stop offset="0%" stopColor="#c99a67" />
      <stop offset="32%" stopColor="#8f6239" />
      <stop offset="72%" stopColor="#4f331b" />
      <stop offset="100%" stopColor="#22150a" />
    </radialGradient>

    <radialGradient id={`${id}-corn`} cx="0.32" cy="0.26" r="0.95">
      <stop offset="0%" stopColor="#9b8871" />
      <stop offset="26%" stopColor="#4a3d31" />
      <stop offset="68%" stopColor="#221a14" />
      <stop offset="100%" stopColor="#0b0806" />
    </radialGradient>

    <radialGradient id={`${id}-pod`} cx="0.32" cy="0.24" r="0.95">
      <stop offset="0%" stopColor="#dfeabd" />
      <stop offset="30%" stopColor="#a3bd7c" />
      <stop offset="68%" stopColor="#5f7a48" />
      <stop offset="100%" stopColor="#2b3a24" />
    </radialGradient>

    <radialGradient id={`${id}-husk`} cx="0.34" cy="0.26" r="0.95">
      <stop offset="0%" stopColor="#e7c79a" />
      <stop offset="34%" stopColor="#b98f5c" />
      <stop offset="74%" stopColor="#6d4d2c" />
      <stop offset="100%" stopColor="#2e1f10" />
    </radialGradient>

    <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
    </linearGradient>

    {/* Depth of field: background layers are pushed out of focus */}
    <filter id={`${id}-soft`} x="-25%" y="-25%" width="150%" height="150%">
      <feGaussianBlur stdDeviation="9" />
    </filter>
    <filter id={`${id}-far`} x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="26" />
    </filter>
    <filter id={`${id}-shadow`} x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="12" />
    </filter>
  </defs>
);

/** A lit sphere — the basis of every berry, bean and peppercorn. */
export const Berry = ({
  id,
  material,
  cx: rawCx,
  cy: rawCy,
  r: rawR,
  rotate = 0,
  squash = 1,
  sheen = 0.5,
}: {
  id: string;
  material: Material;
  cx: number;
  cy: number;
  r: number;
  rotate?: number;
  squash?: number;
  sheen?: number;
}) => {
  const cx = Math.round(rawCx);
  const cy = Math.round(rawCy);
  const r = Math.round(rawR);

  return (
  <g transform={`translate(${cx} ${cy}) rotate(${Math.round(rotate)})`}>
    <ellipse rx={r} ry={r * squash} fill={`url(#${id}-${material})`} />
    <ellipse
      cx={-r * 0.3}
      cy={-r * squash * 0.34}
      rx={r * 0.3}
      ry={r * squash * 0.2}
      fill={`url(#${id}-sheen)`}
      opacity={sheen}
    />
    {/* Warm bounce light on the shadow side keeps the form from going flat */}
    <ellipse
      cx={r * 0.36}
      cy={r * squash * 0.4}
      rx={r * 0.42}
      ry={r * squash * 0.26}
      fill="#c08a4e"
      opacity="0.14"
    />
  </g>
  );
};

/** Out-of-focus highlight discs that give the macro scenes depth. */
export const Bokeh = ({
  id,
  color,
  seed = 1,
  count = 9,
}: {
  id: string;
  color: string;
  seed?: number;
  count?: number;
}) => (
  <g filter={`url(#${id}-far)`} opacity="0.6">
    {Array.from({ length: count }).map((_, i) => {
      const x = ((Math.sin(i * 12.9898 + seed) * 43758.5453) % 1) * 1600;
      const y = ((Math.sin(i * 78.233 + seed) * 43758.5453) % 1) * 1000;
      const r = 60 + (((Math.sin(i * 39.42 + seed) * 43758.5453) % 1) + 1) * 60;
      return (
        <circle
          key={i}
          cx={Math.abs(x)}
          cy={Math.abs(y)}
          r={r}
          fill={color}
          opacity={0.1 + ((i % 4) * 0.05)}
        />
      );
    })}
  </g>
);
