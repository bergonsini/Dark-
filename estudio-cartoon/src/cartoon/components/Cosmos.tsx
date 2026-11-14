import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";

/**
 * Objetos de astronomia (vídeo "Como surgiu o Sistema Solar?"), todos vetoriais e animados por frame.
 * Coordenadas no quadro inteiro (1080x1920). Partículas usam hash determinístico (nada de Math.random).
 */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const hash = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const POEIRA = ["#FF9AD5", "#B69CFF", "#8FD3FF", "#FFFFFF", "#FFD6A5", "#FF7AB6"];

/**
 * Nebulosa de gás e poeira. contrai 0..1 (gravidade puxa ao centro), gira 0..1 (rotação),
 * achata 0..1 (vira disco), centro 0..1 (brilho do proto-Sol), gas 0..1 (nuvem difusa).
 */
export const Nebulosa: React.FC<{
  cx: number;
  cy: number;
  R: number;
  contrai?: number;
  gira?: number;
  achata?: number;
  centro?: number;
  gas?: number;
  n?: number;
}> = ({ cx, cy, R, contrai = 0, gira = 0.15, achata = 0, centro = 0, gas = 1, n = 170 }) => {
  const f = useCurrentFrame();
  const sy = 1 - 0.82 * achata;
  const blobs = Array.from({ length: 10 }).map((_, i) => {
    const a = hash(i, 1) * Math.PI * 2 + f * 0.004 * (i % 2 ? 1 : -1);
    const d = R * 0.55 * hash(i, 2) * (1 - 0.7 * contrai);
    return {
      x: cx + Math.cos(a) * d,
      y: cy + Math.sin(a) * d * sy,
      r: R * (0.35 + 0.3 * hash(i, 3)) * (1 - 0.55 * contrai),
      c: POEIRA[i % POEIRA.length],
    };
  });
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs>
        <radialGradient id="neb-blob">
          <stop offset="0" stopColor="#fff" stopOpacity={0.55} />
          <stop offset="1" stopColor="#fff" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="neb-centro">
          <stop offset="0" stopColor="#FFF6C8" stopOpacity={1} />
          <stop offset="0.4" stopColor="#FFC24A" stopOpacity={0.8} />
          <stop offset="1" stopColor="#FF7A3A" stopOpacity={0} />
        </radialGradient>
      </defs>
      {blobs.map((b, i) => (
        <g key={`g${i}`} opacity={gas * 0.55}>
          <ellipse cx={b.x} cy={b.y} rx={b.r} ry={b.r * sy} fill={b.c} opacity={0.35} />
          <ellipse cx={b.x} cy={b.y} rx={b.r * 0.8} ry={b.r * 0.8 * sy} fill="url(#neb-blob)" />
        </g>
      ))}
      {Array.from({ length: n }).map((_, i) => {
        const r0 = R * Math.sqrt(hash(i, 4));
        const th0 = hash(i, 5) * Math.PI * 2;
        const r = Math.max(18, r0 * (1 - 0.8 * contrai));
        const w = gira * 0.05 * (R / (r + 80));
        const a = th0 + w * f;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r * sy;
        const s = 2.5 + hash(i, 6) * 6;
        const tw = 0.55 + 0.45 * Math.sin(f * 0.12 + i);
        return <circle key={i} cx={x} cy={y} r={s} fill={POEIRA[i % POEIRA.length]} opacity={tw} />;
      })}
      {centro > 0 && <circle cx={cx} cy={cy} r={40 + centro * 190 + Math.sin(f * 0.2) * 6 * centro} fill="url(#neb-centro)" opacity={Math.min(1, centro * 1.4)} />}
    </svg>
  );
};

/** Explosão de estrela (supernova) com anéis de choque, a partir do frame `at`. */
export const Supernova: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < -40) return null;
  const pre = interpolate(t, [-40, 0], [0.4, 1], clamp);
  const flash = interpolate(t, [0, 4, 30], [1, 1.6, 0], clamp);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {t < 0 && (
        <g transform={`translate(${x} ${y}) scale(${pre + Math.sin(f * 0.8) * 0.05})`}>
          <circle r={34} fill="#FFE9A8" stroke={C.outline} strokeWidth={5} />
          <circle r={56} fill="#FFE9A8" opacity={0.3} />
        </g>
      )}
      {t >= 0 &&
        [0, 8, 16].map((d, i) => {
          const rr = Math.max(0, t - d) * (26 - i * 4);
          const o = interpolate(t - d, [0, 60], [1, 0], clamp);
          return <circle key={i} cx={x} cy={y} r={rr} fill="none" stroke={["#FFFFFF", "#8FD3FF", "#FF9AD5"][i]} strokeWidth={18 - i * 4} opacity={o} />;
        })}
      {t >= 0 && <circle cx={x} cy={y} r={60 + flash * 140} fill="#FFFFFF" opacity={Math.min(1, flash)} />}
    </svg>
  );
};

type Corpo = { r: number; tam: number; cor: string; detalhe?: string; tipo?: "rocha" | "jupiter" | "saturno" | "gelo"; vel: number; fase: number };
export const ROCHOSOS: Corpo[] = [
  { r: 120, tam: 13, cor: "#A8A3A0", tipo: "rocha", vel: 1.0, fase: 0.3 },
  { r: 165, tam: 19, cor: "#E8C47A", tipo: "rocha", vel: 0.75, fase: 2.2 },
  { r: 212, tam: 21, cor: "#3A86FF", detalhe: "#3DDC84", tipo: "rocha", vel: 0.62, fase: 4.0 },
  { r: 258, tam: 16, cor: "#E2552B", tipo: "rocha", vel: 0.5, fase: 1.1 },
];
export const GIGANTES: Corpo[] = [
  { r: 335, tam: 50, cor: "#E8A266", detalhe: "#B86A3C", tipo: "jupiter", vel: 0.3, fase: 3.3 },
  { r: 405, tam: 40, cor: "#F2D49B", detalhe: "#D9B36B", tipo: "saturno", vel: 0.24, fase: 0.9 },
  { r: 462, tam: 28, cor: "#8FE3E8", tipo: "gelo", vel: 0.18, fase: 5.1 },
  { r: 512, tam: 27, cor: "#3A6FF0", tipo: "gelo", vel: 0.15, fase: 2.7 },
];

const CorpoSVG: React.FC<{ p: Corpo; x: number; y: number; s: number }> = ({ p, x, y, s }) => {
  const r = p.tam * s;
  if (r <= 0.5) return null;
  return (
    <g>
      {p.tipo === "saturno" && <ellipse cx={x} cy={y} rx={r * 2.1} ry={r * 0.6} fill="none" stroke="#E6CF9E" strokeWidth={r * 0.35} />}
      <circle cx={x} cy={y} r={r} fill={p.cor} stroke={C.outline} strokeWidth={4} />
      {p.tipo === "jupiter" &&
        [-0.45, -0.1, 0.25, 0.55].map((k, i) => <rect key={i} x={x - r * 0.95} y={y + k * r - r * 0.08} width={r * 1.9} height={r * 0.16} rx={r * 0.08} fill={p.detalhe} opacity={0.8} />)}
      {p.tipo === "jupiter" && <ellipse cx={x + r * 0.3} cy={y + r * 0.35} rx={r * 0.2} ry={r * 0.12} fill="#C2452D" />}
      {p.detalhe && p.tipo === "rocha" && <ellipse cx={x - r * 0.25} cy={y - r * 0.15} rx={r * 0.45} ry={r * 0.3} fill={p.detalhe} />}
      {p.tipo === "saturno" && <path d={`M ${x - r * 2.1} ${y} A ${r * 2.1} ${r * 0.6} 0 0 0 ${x + r * 2.1} ${y}`} fill="none" stroke="#E6CF9E" strokeWidth={r * 0.35} />}
    </g>
  );
};

/**
 * Sistema Solar em perspectiva: disco de poeira que se junta em planetas (acrecao 0..1), planetas
 * rochosos (rochosos 0..1) e gigantes (gigantes 0..1) orbitando. `centro` é desenhado entre os
 * corpos de trás e os da frente (ex.: o Sol).
 */
export const SistemaSolar: React.FC<{
  cx: number;
  cy: number;
  acrecao?: number;
  rochosos?: number;
  gigantes?: number;
  disco?: number;
  inclina?: number;
  centro?: React.ReactNode;
}> = ({ cx, cy, acrecao = 1, rochosos = 1, gigantes = 1, disco = 0, inclina = 0.34, centro }) => {
  const f = useCurrentFrame();
  const todos = [...ROCHOSOS, ...GIGANTES];
  const pos = (p: Corpo) => {
    const a = p.fase + f * 0.02 * p.vel;
    return { x: cx + Math.cos(a) * p.r, y: cy + Math.sin(a) * p.r * inclina, frente: Math.sin(a) >= 0 };
  };
  const vis = (i: number) => (i < ROCHOSOS.length ? rochosos : gigantes);
  // poeira do disco: cada grão vai para "seu" planeta conforme a acreção
  const graos = Array.from({ length: 220 }).map((_, i) => {
    const k = i % todos.length;
    const r0 = 90 + hash(i, 7) * 450;
    const a0 = hash(i, 8) * Math.PI * 2 + f * 0.02 * (300 / (r0 + 60));
    const x0 = cx + Math.cos(a0) * r0;
    const y0 = cy + Math.sin(a0) * r0 * inclina;
    const alvo = pos(todos[k]);
    const e = Math.min(1, Math.max(0, (acrecao - hash(i, 9) * 0.3) / 0.7));
    const ee = e * e * (3 - 2 * e);
    return { x: x0 + (alvo.x - x0) * ee, y: y0 + (alvo.y - y0) * ee, o: (1 - ee * 0.9) * disco, c: POEIRA[i % POEIRA.length], s: 2 + hash(i, 10) * 4 };
  });
  const corpos = todos.map((p, i) => ({ p, ...pos(p), s: vis(i) }));
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {todos.map((p, i) => (
        <ellipse key={`o${i}`} cx={cx} cy={cy} rx={p.r} ry={p.r * inclina} fill="none" stroke="#FFFFFF" strokeWidth={2} opacity={0.18 * vis(i)} strokeDasharray="6 10" />
      ))}
      {corpos.filter((c) => !c.frente).map((c, i) => <CorpoSVG key={`b${i}`} p={c.p} x={c.x} y={c.y} s={c.s} />)}
      {graos.filter((g) => g.y < cy).map((g, i) => <circle key={`gb${i}`} cx={g.x} cy={g.y} r={g.s} fill={g.c} opacity={g.o} />)}
      <foreignObject x={0} y={0} width={1080} height={1920} style={{ overflow: "visible" }}>
        <div style={{ position: "relative", width: 1080, height: 1920 }}>{centro}</div>
      </foreignObject>
      {graos.filter((g) => g.y >= cy).map((g, i) => <circle key={`gf${i}`} cx={g.x} cy={g.y} r={g.s} fill={g.c} opacity={g.o} />)}
      {corpos.filter((c) => c.frente).map((c, i) => <CorpoSVG key={`f${i}`} p={c.p} x={c.x} y={c.y} s={c.s} />)}
    </svg>
  );
};

/**
 * Formação da Lua: Terra jovem (derretida) + planeta Theia que chega, bate (frame `hit`),
 * espalha detritos que formam um anel e depois a Lua.
 */
export const ImpactoLua: React.FC<{ cx: number; cy: number; hit: number }> = ({ cx, cy, hit }) => {
  const f = useCurrentFrame();
  const t = f - hit;
  const R = 170;
  const chegada = interpolate(t, [-40, 0], [0, 1], clamp);
  const tx = cx + 520 - chegada * (520 - R * 0.75);
  const ty = cy - 520 + chegada * (520 - R * 0.55);
  const flash = interpolate(t, [0, 3, 18], [0, 1, 0], clamp);
  const anel = interpolate(t, [4, 26], [0, 1], clamp);
  const lua = interpolate(t, [26, 46], [0, 1], clamp);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs>
        <radialGradient id="terra-jovem">
          <stop offset="0" stopColor="#FFB020" />
          <stop offset="0.7" stopColor="#E2552B" />
          <stop offset="1" stopColor="#8E2B1A" />
        </radialGradient>
      </defs>
      {/* detritos em anel (atrás da Terra) */}
      {t > 0 &&
        Array.from({ length: 70 }).map((_, i) => {
          const a = hash(i, 11) * Math.PI * 2 + f * 0.03;
          const rr = interpolate(anel, [0, 1], [R * 0.9, R * (1.7 + hash(i, 12) * 0.5)]) * (1 - lua * 0.6);
          const x = cx + Math.cos(a) * rr;
          const y = cy + Math.sin(a) * rr * 0.32;
          return <circle key={i} cx={x} cy={y} r={3 + hash(i, 13) * 6} fill={i % 2 ? "#B9B4BF" : "#FFB020"} opacity={(1 - lua) * (Math.sin(a) < 0 ? 0.9 : 0)} />;
        })}
      <circle cx={cx} cy={cy} r={R} fill="url(#terra-jovem)" stroke={C.outline} strokeWidth={8} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M ${cx - 90 + i * 50} ${cy - 60 + (i % 2) * 70} q 20 ${20 + i * 5} ${40} ${-10}`} stroke="#7A1E10" strokeWidth={8} fill="none" strokeLinecap="round" />
      ))}
      {t > 0 &&
        Array.from({ length: 70 }).map((_, i) => {
          const a = hash(i, 11) * Math.PI * 2 + f * 0.03;
          const rr = interpolate(anel, [0, 1], [R * 0.9, R * (1.7 + hash(i, 12) * 0.5)]) * (1 - lua * 0.6);
          const x = cx + Math.cos(a) * rr;
          const y = cy + Math.sin(a) * rr * 0.32;
          return <circle key={`f${i}`} cx={x} cy={y} r={3 + hash(i, 13) * 6} fill={i % 2 ? "#B9B4BF" : "#FFB020"} opacity={(1 - lua) * (Math.sin(a) >= 0 ? 0.9 : 0)} />;
        })}
      {t < 2 && (
        <g>
          <circle cx={tx} cy={ty} r={90} fill="#8C7B6B" stroke={C.outline} strokeWidth={7} />
          <circle cx={tx - 25} cy={ty - 20} r={16} fill="#6E5F52" />
          <circle cx={tx + 30} cy={ty + 25} r={11} fill="#6E5F52" />
        </g>
      )}
      {lua > 0 &&
        (() => {
          const a = f * 0.03;
          const lx = cx + Math.cos(a) * 330;
          const ly = cy + Math.sin(a) * 110;
          return (
            <g transform={`translate(${lx} ${ly}) scale(${lua})`}>
              <circle r={52} fill="#D9DEE8" stroke={C.outline} strokeWidth={6} />
              <circle cx={-15} cy={-12} r={10} fill="#B9BFCB" />
              <circle cx={18} cy={14} r={7} fill="#B9BFCB" />
            </g>
          );
        })()}
      {flash > 0 && <circle cx={cx + R * 0.75} cy={cy - R * 0.55} r={60 + flash * 220} fill="#FFFFFF" opacity={flash} />}
    </svg>
  );
};

/** Poeira de estrelas caindo e cintilando (ex.: sobre o personagem). */
export const PoeiraEstelar: React.FC<{ x: number; y: number; w: number; h: number; forca?: number }> = ({ x, y, w, h, forca = 1 }) => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {Array.from({ length: 45 }).map((_, i) => {
        const px = x + hash(i, 14) * w + Math.sin(f * 0.05 + i) * 12;
        const py = y + ((hash(i, 15) * h + f * (2 + hash(i, 16) * 3)) % h);
        const s = (5 + hash(i, 17) * 9) * (0.6 + 0.4 * Math.sin(f * 0.25 + i));
        return (
          <path
            key={i}
            d={`M ${px} ${py - s} L ${px + s * 0.3} ${py} L ${px} ${py + s} L ${px - s * 0.3} ${py} Z M ${px - s} ${py} L ${px} ${py + s * 0.3} L ${px + s} ${py} L ${px} ${py - s * 0.3} Z`}
            fill={POEIRA[i % POEIRA.length]}
            opacity={forca}
          />
        );
      })}
    </svg>
  );
};
