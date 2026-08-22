import type { ReactNode } from "react";

/**
 * Building blocks shared by the artwork scenes.
 * Everything is plain SVG geometry — no filters — so large hero-sized scenes
 * stay cheap to paint. Grain and vignette are added by the wrapper element.
 */

/** Deterministic pseudo-random so scenes render identically on server & client. */
export const rand = (seed: number): number => {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  // Two decimals is plenty of variation and keeps the emitted SVG compact
  return Math.round((x - Math.floor(x)) * 100) / 100;
};

type LayerProps = {
  d: string;
  fill: string;
  opacity?: number;
};

export const Layer = ({ d, fill, opacity = 1 }: LayerProps) => (
  <path d={d} fill={fill} opacity={opacity} />
);

/** A soft light source — used as sun, haze or a lamp behind the subject. */
export const Glow = ({
  cx,
  cy,
  r,
  id,
  color,
  opacity = 0.55,
}: {
  cx: number;
  cy: number;
  r: number;
  id: string;
  color: string;
  opacity?: number;
}) => (
  <>
    <defs>
      <radialGradient id={id}>
        <stop offset="0%" stopColor={color} stopOpacity={opacity} />
        <stop offset="60%" stopColor={color} stopOpacity={opacity * 0.28} />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} />
  </>
);

/** Ridge line generator — produces layered hills with a natural silhouette. */
export const ridge = (
  seed: number,
  baseY: number,
  amplitude: number,
  width = 1600,
  height = 1000,
): string => {
  const points: string[] = [];
  const steps = 10;
  for (let i = 0; i <= steps; i += 1) {
    const x = (width / steps) * i;
    const wobble =
      Math.sin(i * 0.9 + seed) * amplitude +
      Math.sin(i * 2.3 + seed * 1.7) * amplitude * 0.35;
    points.push(`${x},${Math.round(baseY + wobble)}`);
  }
  return `M0,${height} L0,${points[0].split(",")[1]} ${points
    .map((p, i) => (i === 0 ? "" : `L${p}`))
    .join(" ")} L${width},${height} Z`;
};

/** Rows of estate planting that recede toward the ridge line. */
export const PlantingRows = ({
  color,
  baseY,
  rows = 7,
}: {
  color: string;
  baseY: number;
  rows?: number;
}) => (
  <g opacity="0.5">
    {Array.from({ length: rows }).map((_, row) => {
      const y = baseY + row * 34 + row * row * 2.2;
      const dash = 26 + row * 12;
      return (
        <path
          key={row}
          d={`M-40,${y} Q800,${y - 26 - row * 6} 1640,${y + 8}`}
          stroke={color}
          strokeWidth={1 + row * 0.5}
          strokeDasharray={`${dash} ${dash * 0.7}`}
          strokeLinecap="round"
          fill="none"
          opacity={0.25 + row * 0.07}
        />
      );
    })}
  </g>
);

/** Botanical leaf used across the coffee, pepper and cardamom scenes. */
export const Leaf = ({
  x: rawX,
  y: rawY,
  rotate,
  length: rawLength,
  color,
  opacity = 1,
}: {
  x: number;
  y: number;
  rotate: number;
  length: number;
  color: string;
  opacity?: number;
}) => {
  const x = Math.round(rawX);
  const y = Math.round(rawY);
  const length = Math.round(rawLength);

  return (
  <g transform={`translate(${x} ${y}) rotate(${Math.round(rotate)})`} opacity={opacity}>
    <path
      d={`M0,0 C${length * 0.35},${-length * 0.32} ${length * 0.75},${-length * 0.28} ${length},0 C${length * 0.75},${length * 0.28} ${length * 0.35},${length * 0.32} 0,0 Z`}
      fill={color}
    />
    {/* Lit upper half and shaded lower half give the blade some form */}
    <path
      d={`M0,0 C${length * 0.35},${-length * 0.32} ${length * 0.75},${-length * 0.28} ${length},0 L0,0 Z`}
      fill="#ffffff"
      opacity="0.09"
    />
    <path
      d={`M0,0 C${length * 0.35},${length * 0.32} ${length * 0.75},${length * 0.28} ${length},0 L0,0 Z`}
      fill="#000000"
      opacity="0.22"
    />
    <path
      d={`M4,0 L${length - 6},0`}
      stroke="rgba(0,0,0,0.3)"
      strokeWidth={length * 0.022}
      strokeLinecap="round"
    />
    {/* Side veins */}
    <g stroke="rgba(0,0,0,0.16)" strokeWidth={length * 0.012} fill="none">
      {[0.28, 0.46, 0.64, 0.8].map((t) => (
        <g key={t}>
          <path d={`M${length * t},0 q${length * 0.06},${-length * 0.1} ${length * 0.14},${-length * 0.13}`} />
          <path d={`M${length * t},0 q${length * 0.06},${length * 0.1} ${length * 0.14},${length * 0.13}`} />
        </g>
      ))}
    </g>
  </g>
  );
};

/**
 * Distant tree line: a serrated silhouette along a ridge. Far more convincing
 * than drawn canopies once the scene is scaled down.
 */
export const TreeLine = ({
  y,
  color,
  seed = 1,
  amplitude = 26,
  density = 90,
  width = 1600,
  height = 1000,
}: {
  y: number;
  color: string;
  seed?: number;
  amplitude?: number;
  density?: number;
  width?: number;
  height?: number;
}) => {
  const step = width / density;
  let d = `M0,${height} L0,${y}`;
  for (let i = 0; i <= density; i += 1) {
    const x = i * step;
    // Rounded crowns rather than spikes — broadleaf shade trees, not conifers
    const peak = y - rand(i + seed) * amplitude - amplitude * 0.3;
    const dip = y - rand(i * 3 + seed) * amplitude * 0.28;
    d += ` Q${(x - step * 0.5).toFixed(1)},${peak.toFixed(1)} ${x.toFixed(1)},${dip.toFixed(1)}`;
  }
  d += ` L${width},${height} Z`;
  return <path d={d} fill={color} />;
};

export const SceneFrame = ({
  children,
  background,
}: {
  children: ReactNode;
  background: ReactNode;
}) => (
  <svg
    viewBox="0 0 1600 1000"
    preserveAspectRatio="xMidYMid slice"
    className="h-full w-full"
    aria-hidden="true"
    focusable="false"
  >
    {background}
    {children}
  </svg>
);
