import type { ProductArtSpec } from "@/lib/catalog/types";

type Props = {
  art: ProductArtSpec;
  /** Unique per instance on a page, used to scope the SVG gradient ids. */
  uid: string;
  className?: string;
  title?: string;
};

/** Pick dark or light label text depending on how dark the bottle is. */
function isDark(hex: string): boolean {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 110;
}

export function ProductArt({ art, uid, className, title }: Props) {
  const ink = isDark(art.body) ? "#f7f2eb" : "#1d1a24";
  const gloss = `${uid}-gloss`;
  const glow = `${uid}-glow`;
  const shade = `${uid}-shade`;

  const label = (x: number, y: number, w: number, h: number) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={isDark(art.body) ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.55)"} />
      <text x={x + w / 2} y={y + h * 0.38} textAnchor="middle" fontSize={13} letterSpacing={4} fontWeight={700} fill={ink}>
        DEWLUNE
      </text>
      <line x1={x + w / 2 - 16} x2={x + w / 2 + 16} y1={y + h * 0.52} y2={y + h * 0.52} stroke={art.accent} strokeWidth={2} />
      <text x={x + w / 2} y={y + h * 0.78} textAnchor="middle" fontSize={11} letterSpacing={2} fontWeight={600} fill={ink} opacity={0.75}>
        {art.label}
      </text>
    </g>
  );

  let bottle: React.ReactNode;
  switch (art.shape) {
    case "dropper":
      bottle = (
        <g>
          <path d="M178 118 q0 -34 22 -34 q22 0 22 34 v52 h-44z" fill="#2a2433" />
          <rect x={166} y={166} width={68} height={44} rx={8} fill={art.accent} />
          <path d="M150 230 q0 -20 22 -20 h56 q22 0 22 20 v178 q0 22 -22 22 h-56 q-22 0 -22 -22z" fill={art.body} />
          <path d="M150 230 q0 -20 22 -20 h56 q22 0 22 20 v178 q0 22 -22 22 h-56 q-22 0 -22 -22z" fill={`url(#${shade})`} />
          {label(160, 290, 80, 70)}
          <rect x={160} y={222} width={10} height={180} rx={5} fill={`url(#${gloss})`} />
        </g>
      );
      break;
    case "pump":
      bottle = (
        <g>
          <path d="M196 100 h44 a8 8 0 0 1 0 16 h-24 v30 h-20z" fill="#2a2433" />
          <rect x={178} y={142} width={44} height={34} rx={6} fill={art.accent} />
          <path d="M140 196 q0 -20 22 -20 h76 q22 0 22 20 v214 q0 22 -22 22 h-76 q-22 0 -22 -22z" fill={art.body} />
          <path d="M140 196 q0 -20 22 -20 h76 q22 0 22 20 v214 q0 22 -22 22 h-76 q-22 0 -22 -22z" fill={`url(#${shade})`} />
          {label(156, 270, 88, 78)}
          <rect x={150} y={190} width={11} height={220} rx={5} fill={`url(#${gloss})`} />
        </g>
      );
      break;
    case "tube":
      bottle = (
        <g>
          <path d="M146 112 h108 l-8 10 h-92z" fill={art.accent} />
          <path d="M150 122 h100 l-14 250 h-72z" fill={art.body} />
          <path d="M150 122 h100 l-14 250 h-72z" fill={`url(#${shade})`} />
          <rect x={160} y={372} width={80} height={56} rx={10} fill={art.accent} />
          {label(165, 220, 70, 74)}
          <rect x={160} y={132} width={10} height={220} rx={5} fill={`url(#${gloss})`} />
        </g>
      );
      break;
    case "jar":
      bottle = (
        <g>
          <rect x={112} y={236} width={176} height={54} rx={14} fill={art.accent} />
          <rect x={112} y={236} width={176} height={14} rx={7} fill="rgba(255,255,255,0.25)" />
          <path d="M104 300 q0 -14 14 -14 h164 q14 0 14 14 v104 q0 26 -26 26 h-140 q-26 0 -26 -26z" fill={art.body} />
          <path d="M104 300 q0 -14 14 -14 h164 q14 0 14 14 v104 q0 26 -26 26 h-140 q-26 0 -26 -26z" fill={`url(#${shade})`} />
          {label(146, 314, 108, 76)}
          <rect x={116} y={298} width={12} height={110} rx={6} fill={`url(#${gloss})`} />
        </g>
      );
      break;
    default:
      bottle = (
        <g>
          <rect x={170} y={116} width={60} height={58} rx={10} fill={art.accent} />
          <path d="M146 196 q0 -22 24 -22 h60 q24 0 24 22 v212 q0 22 -22 22 h-64 q-22 0 -22 -22z" fill={art.body} />
          <path d="M146 196 q0 -22 24 -22 h60 q24 0 24 22 v212 q0 22 -22 22 h-64 q-22 0 -22 -22z" fill={`url(#${shade})`} />
          {label(158, 270, 84, 78)}
          <rect x={156} y={190} width={10} height={220} rx={5} fill={`url(#${gloss})`} />
        </g>
      );
  }

  return (
    <svg
      viewBox="0 0 400 500"
      className={className}
      role="img"
      aria-label={title}
      style={{ fontFamily: "var(--font-manrope), system-ui, sans-serif" }}
    >
      <defs>
        <radialGradient id={glow} cx="50%" cy="42%" r="55%">
          <stop offset="0" stopColor={art.accent} stopOpacity={0.45} />
          <stop offset="1" stopColor={art.accent} stopOpacity={0} />
        </radialGradient>
        <linearGradient id={gloss} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={0.6} />
          <stop offset="1" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <linearGradient id={shade} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity={0} />
          <stop offset="0.75" stopColor="#000" stopOpacity={0.04} />
          <stop offset="1" stopColor="#000" stopOpacity={0.16} />
        </linearGradient>
      </defs>
      <circle cx={200} cy={250} r={175} fill={`url(#${glow})`} />
      <ellipse cx={200} cy={440} rx={110} ry={12} fill="#000" opacity={0.1} />
      {bottle}
    </svg>
  );
}
