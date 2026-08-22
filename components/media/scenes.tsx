import type { MediaSlot } from "@/data/products";
import { Glow, Leaf, PlantingRows, rand, ridge, SceneFrame, TreeLine } from "./artworkParts";
import { Berry, Bokeh, Materials } from "./materials";

/**
 * Art-directed vector scenes used as the site's imagery.
 *
 * They are drawn in the logo's palette — bronze on charcoal, warm neutrals and
 * a muted plantation green — so the whole site reads as one piece of art
 * direction. Macro scenes are built in three depth layers (out-of-focus bokeh,
 * soft-focus middle, sharp foreground) with lit-sphere materials, which is what
 * gives them weight.
 *
 * Every scene is addressed through a MediaSlot, so a real photograph can
 * replace any of them from data/media.ts without touching a component.
 */

export type SceneProps = { id: string };

const INK = "#0c0b09";
const BRONZE = "#c08a4e";
const BRONZE_LIGHT = "#dbb27f";
const BRONZE_PALE = "#f4e3cd";
const BRONZE_DEEP = "#82582d";
const CREAM = "#f6f1e8";
const LEAF_DARK = "#1b2a20";
const LEAF = "#2c4034";
const LEAF_LIGHT = "#4a6b52";

const DarkSky = ({ id }: { id: string }) => (
  <>
    <defs>
      <linearGradient id={id} x1="0.1" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stopColor="#241c16" />
        <stop offset="45%" stopColor="#15110e" />
        <stop offset="100%" stopColor="#080706" />
      </linearGradient>
    </defs>
    <rect width="1600" height="1000" fill={`url(#${id})`} />
  </>
);

const Vignette = ({ id, strength = 0.72 }: { id: string; strength?: number }) => (
  <>
    <defs>
      <radialGradient id={id} cx="0.48" cy="0.44" r="0.78">
        <stop offset="45%" stopColor={INK} stopOpacity="0" />
        <stop offset="100%" stopColor={INK} stopOpacity={strength} />
      </radialGradient>
    </defs>
    <rect width="1600" height="1000" fill={`url(#${id})`} />
  </>
);

/** Haze bands that separate ridge lines and give the landscapes air. */
const Haze = ({ y, height, color = BRONZE_PALE, opacity = 0.12 }: { y: number; height: number; color?: string; opacity?: number }) => (
  <ellipse cx="800" cy={y} rx="1100" ry={height} fill={color} opacity={opacity} />
);

/** Latitude/longitude arcs echoing the globe inside the logo mark. */
const MeridianArcs = ({ color, opacity = 0.16 }: { color: string; opacity?: number }) => (
  <g fill="none" stroke={color} strokeWidth="1.1" opacity={opacity} transform="translate(1210 250)">
    <circle r="250" />
    <ellipse rx="250" ry="92" />
    <ellipse rx="250" ry="182" />
    <ellipse rx="92" ry="250" />
    <ellipse rx="182" ry="250" />
    <path d="M-250,0 L250,0" />
  </g>
);

const HeroExport = ({ id }: SceneProps) => (
  <SceneFrame background={<DarkSky id={`${id}-hero-sky`} />}>
    <Materials id={`${id}-hx`} />
    <Glow cx={1180} cy={215} r={640} id={`${id}-hero-glow`} color={BRONZE} opacity={0.44} />
    <Glow cx={1180} cy={215} r={170} id={`${id}-hero-core`} color="#ffe6bd" opacity={0.85} />
    <MeridianArcs color={BRONZE_LIGHT} opacity={0.14} />

    {/* Ridge lines receding into haze, each with its own tree line */}
    <path d={ridge(1.2, 496, 54)} fill="#4a382a" opacity="0.42" />
    <TreeLine y={512} color="#40301f" seed={2} amplitude={20} density={120} />
    <Haze y={548} height={62} opacity={0.2} />

    <path d={ridge(3.6, 604, 44)} fill="#2f241c" opacity="0.85" />
    <TreeLine y={620} color="#281e17" seed={5} amplitude={26} density={100} />
    <Haze y={660} height={46} opacity={0.15} />

    <path d={ridge(6.1, 726, 34)} fill="#171210" />
    <TreeLine y={742} color="#141010" seed={9} amplitude={32} density={80} />
    <Haze y={782} height={30} opacity={0.09} />

    <path d={ridge(9.4, 856, 22)} fill="#0a0807" />
    <TreeLine y={870} color="#080706" seed={14} amplitude={30} density={64} />
    <PlantingRows color={BRONZE} baseY={892} rows={4} />

    {/* Out-of-focus foliage framing the lower-left corner */}
    <g filter={`url(#${id}-hx-far)`} opacity="0.85">
      <Leaf x={-40} y={980} rotate={-46} length={420} color="#0f1a14" />
      <Leaf x={-20} y={1030} rotate={-16} length={380} color="#0b1410" />
      <Leaf x={170} y={1040} rotate={-70} length={300} color="#0d1712" />
    </g>
    <Vignette id={`${id}-hero-vig`} strength={0.52} />
  </SceneFrame>
);

const Landscape = ({ id }: SceneProps) => (
  <SceneFrame
    background={
      <>
        <defs>
          <linearGradient id={`${id}-land-sky`} x1="0.2" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="#fbf5ea" />
            <stop offset="42%" stopColor="#f0e2ca" />
            <stop offset="100%" stopColor="#d9c09a" />
          </linearGradient>
        </defs>
        <rect width="1600" height="1000" fill={`url(#${id}-land-sky)`} />
      </>
    }
  >
    <Materials id={`${id}-ls`} />
    <Glow cx={430} cy={200} r={470} id={`${id}-land-glow`} color="#ffeac6" opacity={1} />
    <circle cx="430" cy="212" r="46" fill="#fff8ea" opacity="0.95" />

    <path d={ridge(2.1, 452, 60)} fill="#bda88a" opacity="0.45" />
    <TreeLine y={470} color="#b09a7c" seed={3} amplitude={16} density={130} />
    <Haze y={506} height={56} color={CREAM} opacity={0.6} />

    <path d={ridge(4.4, 566, 48)} fill="#93805f" opacity="0.72" />
    <TreeLine y={584} color="#88764f" seed={6} amplitude={22} density={110} />
    <Haze y={624} height={44} color={CREAM} opacity={0.48} />

    <path d={ridge(7.7, 688, 36)} fill="#5f7a58" opacity="0.9" />
    <TreeLine y={706} color="#4f6a4a" seed={11} amplitude={28} density={90} />
    <Haze y={746} height={32} color={CREAM} opacity={0.3} />

    <path d={ridge(11.2, 806, 26)} fill={LEAF} />
    <TreeLine y={824} color="#22342a" seed={17} amplitude={34} density={70} />
    <path d={ridge(14.5, 918, 16)} fill="#16241c" />
    <PlantingRows color="#0f1a14" baseY={926} rows={4} />
  </SceneFrame>
);

const Plantation = ({ id }: SceneProps) => (
  <SceneFrame background={<DarkSky id={`${id}-plant-sky`} />}>
    <Materials id={`${id}-pl`} />
    <Glow cx={340} cy={120} r={560} id={`${id}-plant-glow`} color={BRONZE_LIGHT} opacity={0.42} />

    {/* Light shafts through the shade canopy */}
    <g opacity="0.1" filter={`url(#${id}-pl-soft)`}>
      {Array.from({ length: 6 }).map((_, i) => (
        <path
          key={i}
          d={`M${100 + i * 160},0 L${400 + i * 180},1000 L${250 + i * 180},1000 Z`}
          fill={BRONZE_PALE}
        />
      ))}
    </g>

    <path d={ridge(2.8, 456, 40)} fill="#221c17" opacity="0.9" />
    <TreeLine y={474} color="#1a1613" seed={4} amplitude={30} density={100} />
    <Haze y={510} height={44} opacity={0.12} />
    <path d={ridge(5.5, 600, 28)} fill={LEAF_DARK} />
    <TreeLine y={616} color="#16221b" seed={8} amplitude={34} density={80} />
    <PlantingRows color={LEAF_LIGHT} baseY={660} rows={6} />

    {/* Mid-ground bushes, softened */}
    <g filter={`url(#${id}-pl-soft)`} opacity="0.85">
      {Array.from({ length: 7 }).map((_, i) => {
        const x = 120 + i * 230;
        const y = 830 - rand(i * 3) * 30;
        return (
          <g key={i}>
            <rect x={x - 3} y={y - 130} width="6" height="140" fill="#0f1712" />
            {Array.from({ length: 5 }).map((_, j) => (
              <Leaf
                key={j}
                x={x}
                y={y - 34 - j * 24}
                rotate={j % 2 === 0 ? -30 - j * 5 : 210 + j * 5}
                length={48 + rand(i + j) * 20}
                color={LEAF}
                opacity={0.9}
              />
            ))}
          </g>
        );
      })}
    </g>

    {/* Sharp foreground foliage with a few ripe cherries catching the light */}
    {Array.from({ length: 5 }).map((_, i) => {
      const x = 30 + i * 380 + rand(i) * 60;
      const y = 1020 - rand(i * 3) * 40;
      return (
        <g key={i}>
          <rect x={x - 5} y={y - 250} width="10" height="260" fill="#0c1310" />
          {Array.from({ length: 7 }).map((_, j) => (
            <Leaf
              key={j}
              x={x}
              y={y - 50 - j * 32}
              rotate={j % 2 === 0 ? -34 - j * 3 : 214 + j * 3}
              length={78 + rand(i * 7 + j) * 26}
              color={j % 3 === 0 ? LEAF_LIGHT : LEAF}
            />
          ))}
          {Array.from({ length: 3 }).map((_, k) => (
            <Berry
              key={k}
              id={`${id}-pl`}
              material="cherry"
              cx={x + (k - 1) * 26}
              cy={y - 120 - k * 44}
              r={13}
            />
          ))}
        </g>
      );
    })}
    <Vignette id={`${id}-plant-vig`} strength={0.55} />
  </SceneFrame>
);

const CoffeeCherries = ({ id }: SceneProps) => (
  <SceneFrame background={<DarkSky id={`${id}-cherry-sky`} />}>
    <Materials id={`${id}-cc`} />
    <Glow cx={1120} cy={220} r={620} id={`${id}-cherry-glow`} color={BRONZE} opacity={0.38} />
    <Bokeh id={`${id}-cc`} color={BRONZE_LIGHT} seed={3} count={10} />

    {/* Out-of-focus cluster behind the subject */}
    <g filter={`url(#${id}-cc-soft)`} opacity="0.7">
      {Array.from({ length: 9 }).map((_, i) => (
        <Berry
          key={i}
          id={`${id}-cc`}
          material="cherry"
          cx={180 + i * 170 + rand(i) * 60}
          cy={230 + rand(i * 3) * 260}
          r={52 + rand(i * 5) * 22}
          sheen={0.3}
        />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <Leaf
          key={`l${i}`}
          x={120 + i * 260}
          y={420 + rand(i * 7) * 220}
          rotate={-40 + rand(i) * 90}
          length={190}
          color={LEAF_DARK}
          opacity={0.75}
        />
      ))}
    </g>

    {/* Sharp branch across the frame */}
    <path
      d="M-60,880 C280,830 520,760 820,640 C1080,536 1320,430 1680,300"
      stroke="#241a12"
      strokeWidth="26"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M-60,872 C280,822 520,752 820,632 C1080,528 1320,422 1680,292"
      stroke="#4a3524"
      strokeWidth="7"
      fill="none"
      strokeLinecap="round"
      opacity="0.9"
    />

    {Array.from({ length: 7 }).map((_, i) => {
      const t = i / 6;
      const x = -20 + t * 1660;
      const y = 872 - t * 590 - Math.sin(t * 3) * 22;
      const up = i % 2 === 0;
      return (
        <g key={i}>
          <Leaf
            x={x}
            y={y}
            rotate={up ? -52 : 128}
            length={175 + rand(i) * 45}
            color={i % 3 === 0 ? LEAF_LIGHT : LEAF}
          />
          <Leaf
            x={x + 30}
            y={y}
            rotate={up ? -18 : 168}
            length={140 + rand(i * 2) * 40}
            color={LEAF_DARK}
            opacity={0.9}
          />
          {Array.from({ length: 3 }).map((_, j) => {
            const cx = x + (j - 1) * 74 + rand(i * j + 2) * 16;
            const cy = y + (up ? 70 : -66) + (j === 1 ? 26 : 0) + rand(i + j) * 24;
            const r = 32 + rand(i * 5 + j) * 9;
            return (
              <g key={j}>
                <ellipse cx={cx + 6} cy={cy + r * 0.9} rx={r * 0.8} ry={r * 0.3} fill="#000" opacity="0.4" filter={`url(#${id}-cc-shadow)`} />
                <Berry id={`${id}-cc`} material={i % 5 === 0 ? "husk" : "cherry"} cx={cx} cy={cy} r={r} />
              </g>
            );
          })}
        </g>
      );
    })}
    <Vignette id={`${id}-cherry-vig`} strength={0.66} />
  </SceneFrame>
);

const CoffeeBean = ({ id, x, y, r: rawR, rotate, blur }: { id: string; x: number; y: number; r: number; rotate: number; blur?: string }) => {
  const r = Math.round(rawR);

  return (
  <g transform={`translate(${Math.round(x)} ${Math.round(y)}) rotate(${Math.round(rotate)})`} filter={blur}>
    <ellipse cx={r * 0.08} cy={r * 0.5} rx={r * 0.95} ry={r * 0.5} fill="#000" opacity="0.45" />
    <ellipse rx={r} ry={r * 0.66} fill={`url(#${id}-bean)`} />
    {/* Centre crease with a lifted lip either side */}
    <path
      d={`M${-r * 0.88},2 C${-r * 0.3},${-r * 0.26} ${r * 0.3},${r * 0.26} ${r * 0.88},-2`}
      stroke="#150c05"
      strokeWidth={r * 0.14}
      fill="none"
      strokeLinecap="round"
    />
    <path
      d={`M${-r * 0.86},-4 C${-r * 0.3},${-r * 0.32} ${r * 0.3},${r * 0.2} ${r * 0.86},-8`}
      stroke="#c99a67"
      strokeWidth={r * 0.05}
      fill="none"
      opacity="0.35"
    />
    <ellipse cx={-r * 0.3} cy={-r * 0.3} rx={r * 0.34} ry={r * 0.16} fill="#fff" opacity="0.1" />
  </g>
  );
};

const CoffeeBeans = ({ id }: SceneProps) => (
  <SceneFrame background={<DarkSky id={`${id}-bean-sky`} />}>
    <Materials id={`${id}-cb`} />
    <Glow cx={760} cy={240} r={700} id={`${id}-bean-glow`} color={BRONZE} opacity={0.34} />
    <Bokeh id={`${id}-cb`} color={BRONZE} seed={7} count={8} />

    {/* Depth layer — beans further back fall out of focus */}
    {Array.from({ length: 12 }).map((_, i) => (
      <CoffeeBean
        key={`f${i}`}
        id={`${id}-cb`}
        x={40 + (i % 6) * 290 + rand(i) * 120}
        y={60 + Math.floor(i / 6) * 200 + rand(i * 3) * 90}
        r={70 + rand(i * 5) * 24}
        rotate={rand(i * 7) * 180}
        blur={`url(#${id}-cb-far)`}
      />
    ))}
    {Array.from({ length: 11 }).map((_, i) => (
      <CoffeeBean
        key={`m${i}`}
        id={`${id}-cb`}
        x={-20 + (i % 5) * 350 + rand(i + 20) * 130}
        y={340 + Math.floor(i / 5) * 230 + rand(i * 3 + 5) * 90}
        r={86 + rand(i * 5 + 9) * 26}
        rotate={rand(i * 11) * 180}
        blur={`url(#${id}-cb-soft)`}
      />
    ))}
    {Array.from({ length: 11 }).map((_, i) => (
      <CoffeeBean
        key={`n${i}`}
        id={`${id}-cb`}
        x={20 + (i % 4) * 430 + rand(i + 40) * 150}
        y={120 + Math.floor(i / 4) * 330 + rand(i * 3 + 11) * 120}
        r={104 + rand(i * 5 + 17) * 30}
        rotate={rand(i * 13) * 180}
      />
    ))}
    <Vignette id={`${id}-bean-vig`} strength={0.74} />
  </SceneFrame>
);

const CoffeeDrying = ({ id }: SceneProps) => (
  <SceneFrame
    background={
      <>
        <defs>
          <linearGradient id={`${id}-dry-sky`} x1="0.3" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#f9f0e0" />
            <stop offset="38%" stopColor="#eeddc0" />
            <stop offset="100%" stopColor="#c9a97e" />
          </linearGradient>
        </defs>
        <rect width="1600" height="1000" fill={`url(#${id}-dry-sky)`} />
      </>
    }
  >
    <Materials id={`${id}-cd`} />
    <Glow cx={1240} cy={130} r={480} id={`${id}-dry-glow`} color="#fff0d2" opacity={1} />
    <path d={ridge(3.3, 238, 26)} fill="#b9a179" opacity="0.5" />
    <TreeLine y={256} color="#93805c" seed={7} amplitude={26} density={110} />
    <rect y="300" width="1600" height="700" fill="#d2b992" />
    <Haze y={310} height={26} color={CREAM} opacity={0.5} />

    {/* Raised drying beds receding toward the tree line */}
    {Array.from({ length: 5 }).map((_, i) => {
      const top = 360 + i * 84 + i * i * 18;
      const inset = 320 - i * 78;
      const h = 44 + i * 22;
      return (
        <g key={i}>
          <path
            d={`M${inset},${top} L${1600 - inset},${top} L${1600 - inset * 0.52},${top + h} L${inset * 0.52},${top + h} Z`}
            fill="#6d4a29"
          />
          <path
            d={`M${inset + 6},${top + 3} L${1600 - inset - 6},${top + 3} L${1600 - inset * 0.53},${top + h * 0.4} L${inset * 0.53 + 6},${top + h * 0.4} Z`}
            fill={i % 2 === 0 ? "#b98246" : "#a97339"}
          />
          <g opacity={0.85 - i * 0.1}>
            {Array.from({ length: 26 }).map((_, j) => (
              <ellipse
                key={j}
                cx={inset + 24 + j * ((1600 - inset * 2 - 48) / 25)}
                cy={top + 8 + rand(i * j + 1) * (h * 0.28)}
                rx={6 + i * 1.4}
                ry={4 + i}
                fill={j % 3 === 0 ? "#4a3116" : "#31200e"}
              />
            ))}
          </g>
        </g>
      );
    })}

    {/* Out-of-focus bed edge in the immediate foreground */}
    <g filter={`url(#${id}-cd-soft)`}>
      <path d="M-40,930 L1640,930 L1640,1010 L-40,1010 Z" fill="#5d3f21" />
      {Array.from({ length: 18 }).map((_, i) => (
        <ellipse key={i} cx={20 + i * 92} cy={922 + rand(i) * 16} rx="26" ry="16" fill="#3a2611" />
      ))}
    </g>
  </SceneFrame>
);

const PepperSpike = ({
  id,
  x,
  y,
  length,
  count,
  blur,
  scale = 1,
  ripe = 0,
}: {
  id: string;
  x: number;
  y: number;
  length: number;
  count: number;
  blur?: string;
  scale?: number;
  /** How many berries at the tip have turned red */
  ripe?: number;
}) => (
  <g filter={blur}>
    <path
      d={`M${x},${y} C${x + 26 * scale},${y + length * 0.35} ${x - 20 * scale},${y + length * 0.7} ${x + 6 * scale},${y + length}`}
      stroke="#5d7a4f"
      strokeWidth={7 * scale}
      fill="none"
      strokeLinecap="round"
    />
    {Array.from({ length: count }).map((_, i) => {
      const t = i / (count - 1);
      const bx = x + Math.sin(t * 3.1) * 22 * scale + (i % 2 ? 15 : -15) * scale;
      const by = y + t * length;
      const r = (26 - t * 6) * scale;
      return (
        <g key={i}>
          <ellipse cx={bx + r * 0.2} cy={by + r * 0.8} rx={r * 0.8} ry={r * 0.3} fill="#000" opacity="0.4" />
          <Berry
            id={id}
            material={i >= count - ripe ? "cherry" : "pod"}
            cx={bx}
            cy={by}
            r={r}
            squash={0.96}
            sheen={0.6}
          />
        </g>
      );
    })}
  </g>
);

const PepperVine = ({ id }: SceneProps) => (
  <SceneFrame background={<DarkSky id={`${id}-vine-sky`} />}>
    <Materials id={`${id}-pv`} />
    <Glow cx={1180} cy={180} r={620} id={`${id}-vine-glow`} color={BRONZE_LIGHT} opacity={0.34} />
    <Bokeh id={`${id}-pv`} color="#9db787" seed={9} count={8} />

    {/* Support trunk and canopy, thrown out of focus behind the subject */}
    <g filter={`url(#${id}-pv-far)`} opacity="0.9">
      <rect x="980" y="0" width="300" height="1000" fill="#241b15" />
      <rect x="160" y="0" width="180" height="1000" fill="#1a1411" />
      {Array.from({ length: 10 }).map((_, i) => (
        <Leaf
          key={i}
          x={rand(i) * 1600}
          y={rand(i * 3) * 1000}
          rotate={rand(i * 5) * 360}
          length={200 + rand(i * 7) * 90}
          color={LEAF_DARK}
        />
      ))}
      <PepperSpike id={`${id}-pv`} x={1240} y={180} length={420} count={13} scale={1.2} />
    </g>

    {/* Soft-focus middle distance */}
    <g filter={`url(#${id}-pv-soft)`} opacity="0.9">
      <Leaf x={220} y={300} rotate={-24} length={330} color={LEAF} />
      <Leaf x={1080} y={720} rotate={166} length={300} color={LEAF_DARK} />
      <PepperSpike id={`${id}-pv`} x={880} y={80} length={380} count={12} scale={0.9} />
    </g>

    {/* Sharp foreground: vine, leaves and three hanging spikes */}
    <path
      d="M-40,120 C260,180 420,340 460,560 C500,780 660,900 900,1010"
      stroke="#3d2c20"
      strokeWidth="22"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M-40,112 C260,172 420,332 460,552 C500,772 660,892 900,1002"
      stroke="#5c452f"
      strokeWidth="6"
      fill="none"
      opacity="0.8"
    />
    <Leaf x={430} y={470} rotate={-38} length={380} color={LEAF} />
    <Leaf x={470} y={620} rotate={28} length={330} color={LEAF_DARK} />
    <Leaf x={180} y={230} rotate={-8} length={300} color={LEAF_LIGHT} opacity={0.9} />

    <PepperSpike id={`${id}-pv`} x={330} y={330} length={470} count={15} ripe={3} />
    <PepperSpike id={`${id}-pv`} x={620} y={250} length={520} count={16} scale={1.1} />
    <PepperSpike id={`${id}-pv`} x={1180} y={430} length={430} count={13} scale={0.95} ripe={2} />

    <Vignette id={`${id}-vine-vig`} strength={0.66} />
  </SceneFrame>
);

const Peppercorn = ({ id, x: rawX, y: rawY, r: rawR, seed, blur }: { id: string; x: number; y: number; r: number; seed: number; blur?: string }) => {
  const x = Math.round(rawX);
  const y = Math.round(rawY);
  const r = Math.round(rawR);

  return (
  <g filter={blur}>
    <ellipse cx={x + r * 0.12} cy={y + r * 0.85} rx={r * 0.9} ry={r * 0.32} fill="#000" opacity="0.5" />
    <Berry id={id} material="corn" cx={x} cy={y} r={r} squash={0.94} rotate={rand(seed) * 90} sheen={0.42} />
    {/* Wrinkles — the giveaway texture of a dried peppercorn */}
    <g opacity="0.5" stroke="#0a0705" fill="none" strokeLinecap="round">
      <path d={`M${x - r * 0.72},${y - r * 0.12} q${r * 0.7},${r * 0.34} ${r * 1.44},${-r * 0.1}`} strokeWidth={r * 0.08} />
      <path d={`M${x - r * 0.6},${y + r * 0.34} q${r * 0.6},${r * 0.26} ${r * 1.2},${-r * 0.06}`} strokeWidth={r * 0.07} />
      <path d={`M${x - r * 0.2},${y - r * 0.8} q${r * 0.24},${r * 0.8} ${r * 0.02},${r * 1.5}`} strokeWidth={r * 0.06} />
    </g>
  </g>
  );
};

const Peppercorns = ({ id }: SceneProps) => (
  <SceneFrame background={<DarkSky id={`${id}-corn-sky`} />}>
    <Materials id={`${id}-pc`} />
    <Glow cx={560} cy={220} r={640} id={`${id}-corn-glow`} color={BRONZE} opacity={0.3} />
    <Bokeh id={`${id}-pc`} color={BRONZE_LIGHT} seed={11} count={8} />

    {Array.from({ length: 14 }).map((_, i) => (
      <Peppercorn
        key={`f${i}`}
        id={`${id}-pc`}
        x={30 + (i % 7) * 250 + rand(i) * 90}
        y={40 + Math.floor(i / 7) * 190 + rand(i * 3) * 80}
        r={58 + rand(i * 5) * 18}
        seed={i}
        blur={`url(#${id}-pc-far)`}
      />
    ))}
    {Array.from({ length: 12 }).map((_, i) => (
      <Peppercorn
        key={`m${i}`}
        id={`${id}-pc`}
        x={-10 + (i % 5) * 340 + rand(i + 30) * 130}
        y={330 + Math.floor(i / 5) * 240 + rand(i * 3 + 7) * 80}
        r={76 + rand(i * 5 + 3) * 22}
        seed={i + 40}
        blur={`url(#${id}-pc-soft)`}
      />
    ))}
    {Array.from({ length: 10 }).map((_, i) => (
      <Peppercorn
        key={`n${i}`}
        id={`${id}-pc`}
        x={40 + (i % 4) * 440 + rand(i + 60) * 150}
        y={150 + Math.floor(i / 4) * 320 + rand(i * 3 + 13) * 110}
        r={94 + rand(i * 5 + 21) * 26}
        seed={i + 80}
      />
    ))}
    <Vignette id={`${id}-corn-vig`} strength={0.78} />
  </SceneFrame>
);

const CardamomPlantation = ({ id }: SceneProps) => (
  <SceneFrame background={<DarkSky id={`${id}-card-sky`} />}>
    <Materials id={`${id}-cp`} />
    <Glow cx={900} cy={60} r={560} id={`${id}-card-glow`} color="#e6f0cd" opacity={0.22} />

    {/* Light falling through the shade canopy */}
    <g opacity="0.13" filter={`url(#${id}-cp-soft)`}>
      {Array.from({ length: 6 }).map((_, i) => (
        <path key={i} d={`M${200 + i * 200},0 L${470 + i * 220},1000 L${340 + i * 220},1000 Z`} fill={CREAM} />
      ))}
    </g>

    <path d={ridge(4.2, 300, 30)} fill="#101815" />
    <TreeLine y={318} color="#0b110e" seed={6} amplitude={44} density={60} />

    {/* Blurred understory behind the subject */}
    <g filter={`url(#${id}-cp-soft)`} opacity="0.8">
      {Array.from({ length: 6 }).map((_, i) => {
        const x = 60 + i * 300;
        return (
          <g key={i}>
            {Array.from({ length: 6 }).map((_, j) => (
              <Leaf key={j} x={x} y={640} rotate={-150 + j * 30} length={230 + rand(i + j) * 70} color="#16221b" />
            ))}
          </g>
        );
      })}
    </g>

    {/* Sharp clumps: long blades fanning from the base, capsules at ground level */}
    {Array.from({ length: 5 }).map((_, i) => {
      const x = 40 + i * 380 + rand(i) * 60;
      const base = 860 - rand(i * 2) * 40;
      return (
        <g key={i}>
          {/* Long, mostly upright blades — the growth habit of a cardamom clump */}
          {Array.from({ length: 8 }).map((_, j) => {
            const angle = -146 + j * 14 + rand(i + j) * 8;
            return (
              <Leaf
                key={j}
                x={x}
                y={base}
                rotate={angle}
                length={330 + rand(i * 7 + j) * 150}
                color={j % 2 === 0 ? LEAF : LEAF_DARK}
              />
            );
          })}
          <path d={`M${x},${base} q84,40 190,26`} stroke="#41583f" strokeWidth="8" fill="none" />
          {Array.from({ length: 8 }).map((_, k) => (
            <g key={k}>
              <ellipse cx={x + 40 + k * 26} cy={base + 34 + rand(i * k + 3) * 14} rx="18" ry="7" fill="#000" opacity="0.35" />
              <Berry
                id={`${id}-cp`}
                material="pod"
                cx={x + 40 + k * 26}
                cy={base + 20 + rand(i * k + 3) * 14}
                r={22}
                squash={0.62}
                rotate={-16 + rand(i + k) * 32}
              />
            </g>
          ))}
        </g>
      );
    })}

    {/* Out-of-focus blade sweeping across the foreground */}
    <g filter={`url(#${id}-cp-far)`} opacity="0.9">
      <Leaf x={-60} y={1010} rotate={-38} length={520} color="#0d1712" />
      <Leaf x={1660} y={980} rotate={214} length={480} color="#0b1410" />
    </g>
    <Vignette id={`${id}-card-vig`} strength={0.6} />
  </SceneFrame>
);

const CardamomPod = ({ id, x, y, r: rawR, rotate, blur }: { id: string; x: number; y: number; r: number; rotate: number; blur?: string }) => {
  const r = Math.round(rawR);

  return (
  <g transform={`translate(${Math.round(x)} ${Math.round(y)}) rotate(${Math.round(rotate)})`} filter={blur}>
    <ellipse cx={r * 0.1} cy={r * 0.62} rx={r * 0.92} ry={r * 0.34} fill="#000" opacity="0.45" />
    <Berry id={id} material="pod" cx={0} cy={0} r={r} squash={0.6} sheen={0.45} />
    {/* Longitudinal ribs and the dried stem tip */}
    <g stroke="#2b3a24" fill="none" opacity="0.55" strokeLinecap="round">
      {[-0.42, -0.14, 0.14, 0.42].map((offset) => (
        <path
          key={offset}
          d={`M${-r * 0.82},${offset * r * 0.5} C${-r * 0.25},${offset * r * 0.66} ${r * 0.25},${offset * r * 0.66} ${r * 0.82},${offset * r * 0.5}`}
          strokeWidth={r * 0.035}
        />
      ))}
    </g>
    <path d={`M${r * 0.9},0 l${r * 0.4},${-r * 0.1} l0,${r * 0.2} Z`} fill="#7d6a3a" />
    <path d={`M${-r * 0.92},${-r * 0.06} l${-r * 0.22},${-r * 0.04} l0,${r * 0.14} Z`} fill="#4b5c33" />
  </g>
  );
};

const CardamomPods = ({ id }: SceneProps) => (
  <SceneFrame background={<DarkSky id={`${id}-pods-sky`} />}>
    <Materials id={`${id}-cd2`} />
    <Glow cx={720} cy={280} r={660} id={`${id}-pods-glow`} color="#c7dcae" opacity={0.22} />
    <Bokeh id={`${id}-cd2`} color="#a8c48c" seed={5} count={9} />

    {Array.from({ length: 11 }).map((_, i) => (
      <CardamomPod
        key={`f${i}`}
        id={`${id}-cd2`}
        x={40 + (i % 5) * 320 + rand(i) * 110}
        y={60 + Math.floor(i / 5) * 230 + rand(i * 3) * 90}
        r={76 + rand(i * 5) * 24}
        rotate={-50 + rand(i * 7) * 100}
        blur={`url(#${id}-cd2-far)`}
      />
    ))}
    {Array.from({ length: 10 }).map((_, i) => (
      <CardamomPod
        key={`m${i}`}
        id={`${id}-cd2`}
        x={-20 + (i % 4) * 420 + rand(i + 30) * 140}
        y={330 + Math.floor(i / 4) * 250 + rand(i * 3 + 5) * 80}
        r={92 + rand(i * 5 + 7) * 26}
        rotate={-50 + rand(i * 11) * 100}
        blur={`url(#${id}-cd2-soft)`}
      />
    ))}
    {Array.from({ length: 8 }).map((_, i) => (
      <CardamomPod
        key={`n${i}`}
        id={`${id}-cd2`}
        x={70 + (i % 3) * 560 + rand(i + 60) * 170}
        y={170 + Math.floor(i / 3) * 340 + rand(i * 3 + 9) * 120}
        r={116 + rand(i * 5 + 15) * 30}
        rotate={-50 + rand(i * 13) * 100}
      />
    ))}
    <Vignette id={`${id}-pods-vig`} strength={0.76} />
  </SceneFrame>
);

const Packing = ({ id }: SceneProps) => (
  <SceneFrame background={<DarkSky id={`${id}-pack-sky`} />}>
    <Materials id={`${id}-pk`} />
    <Glow cx={1160} cy={140} r={620} id={`${id}-pack-glow`} color={BRONZE} opacity={0.34} />
    <defs>
      <linearGradient id={`${id}-sack-face`} x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stopColor="#c39a63" />
        <stop offset="45%" stopColor="#8f6b40" />
        <stop offset="100%" stopColor="#4c3620" />
      </linearGradient>
      <linearGradient id={`${id}-sack-face-2`} x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stopColor="#a98454" />
        <stop offset="45%" stopColor="#775833" />
        <stop offset="100%" stopColor="#3d2b18" />
      </linearGradient>
    </defs>

    <rect y="700" width="1600" height="300" fill="#120f0c" />

    {/* Stacked, marked export sacks — back row softened for depth */}
    {[2, 1, 0].map((row) =>
      Array.from({ length: 4 }).map((_, col) => {
        const w = 320;
        const h = 190;
        const x = 40 + col * 388 - row * 54;
        const y = 690 - row * 180;
        return (
          <g key={`${row}-${col}`} filter={row === 2 ? `url(#${id}-pk-soft)` : undefined} opacity={row === 2 ? 0.8 : 1}>
            <path
              d={`M${x},${y} q${w * 0.5},${-44} ${w},0 l0,${h} q${-w * 0.5},40 ${-w},0 Z`}
              fill={col % 2 === 0 ? `url(#${id}-sack-face)` : "url(#sack-face-2)"}
            />
            {/* Jute weave */}
            <g opacity="0.18">
              {Array.from({ length: 11 }).map((_, k) => (
                <path key={k} d={`M${x + 10 + k * 30},${y + 4} l0,${h}`} stroke="#2b1d0f" strokeWidth="4" />
              ))}
              {Array.from({ length: 7 }).map((_, k) => (
                <path key={`h${k}`} d={`M${x + 4},${y + 20 + k * 26} q${w * 0.5},14 ${w - 8},0`} stroke="#2b1d0f" strokeWidth="3" fill="none" />
              ))}
            </g>
            {/* Stencilled shipping mark */}
            <g opacity="0.72">
              <rect x={x + w * 0.22} y={y + h * 0.3} width={w * 0.56} height={h * 0.4} fill="#1a1209" opacity="0.55" />
              <path d={`M${x + w * 0.28},${y + h * 0.44} l${w * 0.44},0`} stroke={BRONZE_PALE} strokeWidth="6" />
              <path d={`M${x + w * 0.28},${y + h * 0.56} l${w * 0.3},0`} stroke={BRONZE_PALE} strokeWidth="6" opacity="0.6" />
              <path d={`M${x + w * 0.28},${y + h * 0.66} l${w * 0.2},0`} stroke={BRONZE_PALE} strokeWidth="5" opacity="0.4" />
            </g>
            <path d={`M${x},${y + h} q${w * 0.5},40 ${w},0`} stroke="#000" strokeWidth="10" opacity="0.35" fill="none" />
          </g>
        );
      }),
    )}

    {/* Spilled beans on the warehouse floor */}
    {Array.from({ length: 9 }).map((_, i) => (
      <Berry key={i} id={`${id}-pk`} material="bean" cx={120 + i * 170 + rand(i) * 60} cy={930 + rand(i * 3) * 40} r={18} squash={0.66} rotate={rand(i * 5) * 180} />
    ))}
    <Vignette id={`${id}-pack-vig`} strength={0.6} />
  </SceneFrame>
);

const Logistics = ({ id }: SceneProps) => (
  <SceneFrame background={<DarkSky id={`${id}-log-sky`} />}>
    <Materials id={`${id}-lg`} />
    <Glow cx={760} cy={380} r={760} id={`${id}-log-glow`} color={BRONZE} opacity={0.24} />

    {/* Dot-matrix world suggestion with trade arcs leaving India */}
    <g opacity="0.55">
      {Array.from({ length: 460 }).map((_, i) => {
        const col = i % 46;
        const row = Math.floor(i / 46);
        const x = 60 + col * 33;
        const y = 110 + row * 33;
        const nx = (x - 800) / 760;
        const ny = (y - 300) / 240;
        const inMass =
          Math.abs(Math.sin(nx * 2.4 + ny * 1.3)) > 0.42 &&
          Math.abs(Math.cos(nx * 1.6 - ny * 2.1)) > 0.24;
        if (!inMass) return null;
        return <circle key={i} cx={x} cy={y} r="3.4" fill={BRONZE_LIGHT} opacity={0.3 + rand(i) * 0.45} />;
      })}
    </g>

    <g fill="none" stroke={BRONZE} strokeWidth="2.2" opacity="0.8">
      <path d="M700,470 C900,290 1200,290 1390,386" strokeDasharray="12 14" />
      <path d="M700,470 C520,320 290,310 160,424" strokeDasharray="12 14" />
      <path d="M700,470 C830,610 1100,650 1330,606" strokeDasharray="12 14" />
    </g>
    {[[1390, 386], [160, 424], [1330, 606]].map(([cx, cy]) => (
      <circle key={`${cx}`} cx={cx} cy={cy} r="6" fill={BRONZE_LIGHT} opacity="0.9" />
    ))}
    <circle cx="700" cy="470" r="12" fill={BRONZE_PALE} />
    <circle cx="700" cy="470" r="28" fill="none" stroke={BRONZE} strokeWidth="2" opacity="0.7" />
    <circle cx="700" cy="470" r="52" fill="none" stroke={BRONZE} strokeWidth="1" opacity="0.32" />

    {/* Container stack, back row out of focus */}
    <defs>
      <linearGradient id={`${id}-cont-a`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#a0703c" />
        <stop offset="100%" stopColor="#4a3018" />
      </linearGradient>
      <linearGradient id={`${id}-cont-b`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#332a22" />
        <stop offset="100%" stopColor="#171310" />
      </linearGradient>
    </defs>
    <g filter={`url(#${id}-lg-soft)`} opacity="0.7">
      {Array.from({ length: 7 }).map((_, i) => {
        const x = 40 + i * 240;
        const h = 120 + rand(i + 3) * 50;
        return <rect key={i} x={x} y={840 - h} width="196" height={h} fill="#241d17" />;
      })}
    </g>
    {Array.from({ length: 8 }).map((_, i) => {
      const x = 60 + i * 190;
      const h = 104 + rand(i) * 44;
      return (
        <g key={i}>
          <rect x={x} y={904 - h} width="168" height={h} fill={i % 3 === 0 ? `url(#${id}-cont-a)` : "url(#cont-b)"} />
          <rect x={x} y={904 - h} width="168" height="9" fill={BRONZE} opacity="0.45" />
          <g opacity="0.32">
            {Array.from({ length: 7 }).map((_, k) => (
              <path key={k} d={`M${x + 14 + k * 22},${904 - h + 14} l0,${h - 26}`} stroke="#000" strokeWidth="4" />
            ))}
          </g>
        </g>
      );
    })}
    <rect y="904" width="1600" height="96" fill="#0a0908" />
    <Vignette id={`${id}-log-vig`} strength={0.58} />
  </SceneFrame>
);

export const scenes: Record<MediaSlot, (props: SceneProps) => React.ReactElement> = {
  "hero-export": HeroExport,
  plantation: Plantation,
  "coffee-cherries": CoffeeCherries,
  "coffee-beans": CoffeeBeans,
  "coffee-drying": CoffeeDrying,
  "pepper-vine": PepperVine,
  peppercorns: Peppercorns,
  "cardamom-plantation": CardamomPlantation,
  "cardamom-pods": CardamomPods,
  packing: Packing,
  logistics: Logistics,
  landscape: Landscape,
};
