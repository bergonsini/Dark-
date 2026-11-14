import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";

/**
 * Objetos de geologia (vídeo "Por que vulcões existem?"), todos vetoriais e animados por frame.
 * Coordenadas no quadro inteiro (1080x1920), exceto quando indicado.
 */

export const GEO = {
  rocha: "#7A4A3A",
  rochaSombra: "#5A3328",
  lava: "#FF5A1F",
  lavaClara: "#FFB020",
  lavaBrilho: "#FFE066",
  cinza: "#6E6A75",
  fumaca: "#B9B4BF",
  crosta: "#8B5A3C",
  manto: "#E2552B",
  mantoEscuro: "#B83A1E",
  nucleoExt: "#FF9A1F",
  nucleoInt: "#FFE680",
  oceano: "#2F7FD8",
  terra: "#4FB35A",
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Vulcão com cratera, lava escorrendo, fumaça e erupção (erupcao 0..1). Base no ponto (x, y). */
export const Vulcao: React.FC<{
  x: number;
  y: number;
  s?: number;
  erupcao?: number;
  lava?: number;
  fumaca?: number;
  verde?: boolean;
}> = ({ x, y, s = 1, erupcao = 0, lava = 0, fumaca = 0.4, verde = false }) => {
  const f = useCurrentFrame();
  const W = 360 * s;
  const H = 520 * s;
  const top = y - H;
  const cw = 80 * s;
  const glow = 0.4 + 0.3 * Math.sin(f * 0.3) + erupcao * 0.4;
  const rocha = verde ? "#5E8F4A" : GEO.rocha;
  const sombra = verde ? "#4A7339" : GEO.rochaSombra;
  // fluxos de lava pelas encostas
  const flows = [
    `M ${x - cw * 0.5} ${top + 8} Q ${x - W * 0.35} ${top + H * 0.4} ${x - W * 0.55} ${y - 10}`,
    `M ${x + cw * 0.3} ${top + 8} Q ${x + W * 0.2} ${top + H * 0.5} ${x + W * 0.45} ${y - 10}`,
    `M ${x} ${top + 10} Q ${x - W * 0.05} ${top + H * 0.6} ${x - W * 0.1} ${y - 10}`,
  ];
  // partículas de lava (bombas) em arco: determinísticas
  const bombs = Array.from({ length: 22 }).map((_, i) => {
    const per = 26 + (i % 5) * 4;
    const ph = ((f + i * 7) % per) / per;
    const ang = ((i * 53) % 120 - 60) * (Math.PI / 180);
    const v = (520 + (i % 4) * 120) * s * erupcao;
    const px = x + Math.sin(ang) * v * ph;
    const py = top - (Math.cos(ang) * v * ph - 900 * s * ph * ph * 0.9);
    return { px, py, r: (10 + (i % 3) * 6) * s * (1 - ph * 0.4), o: erupcao > 0.05 ? 1 - ph * 0.3 : 0, c: i % 3 === 0 ? GEO.lavaBrilho : i % 3 === 1 ? GEO.lavaClara : GEO.lava };
  });
  const puffs = Array.from({ length: 9 }).map((_, i) => {
    const per = 80;
    const ph = ((f + i * 9) % per) / per;
    const k = fumaca + erupcao * 0.8;
    return {
      cx: x + Math.sin(i * 1.7 + f * 0.02) * 40 * s + (i % 2 ? 1 : -1) * ph * 60 * s,
      cy: top - 30 * s - ph * (380 + erupcao * 500) * s,
      r: (40 + ph * 120 + erupcao * 60) * s,
      o: k * (1 - ph) * 0.8,
      c: erupcao > 0.4 ? GEO.cinza : GEO.fumaca,
    };
  });
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {puffs.map((p, i) => (
        <circle key={`p${i}`} cx={p.cx} cy={p.cy} r={p.r} fill={p.c} opacity={p.o} stroke={C.outline} strokeWidth={4 * p.o} />
      ))}
      {erupcao > 0.05 && (
        <path
          d={`M ${x - cw * 0.6} ${top + 6} Q ${x} ${top - 340 * s * erupcao - Math.sin(f * 0.5) * 20 * s} ${x + cw * 0.6} ${top + 6} Z`}
          fill={GEO.lava}
          stroke={C.outline}
          strokeWidth={6}
        />
      )}
      {erupcao > 0.05 && (
        <path d={`M ${x - cw * 0.3} ${top + 6} Q ${x} ${top - 220 * s * erupcao} ${x + cw * 0.3} ${top + 6} Z`} fill={GEO.lavaBrilho} />
      )}
      <path
        d={`M ${x - W} ${y} L ${x - cw} ${top} Q ${x} ${top + 26 * s} ${x + cw} ${top} L ${x + W} ${y} Z`}
        fill={rocha}
        stroke={C.outline}
        strokeWidth={8}
        strokeLinejoin="round"
      />
      <path d={`M ${x + cw * 0.2} ${top + 20 * s} L ${x + W} ${y} L ${x + W * 0.35} ${y} Z`} fill={sombra} opacity={0.7} />
      {verde && (
        <path d={`M ${x - W} ${y} L ${x - W * 0.6} ${y - H * 0.4} Q ${x} ${y - H * 0.3} ${x + W * 0.6} ${y - H * 0.4} L ${x + W} ${y} Z`} fill={C.grass} stroke={C.outline} strokeWidth={6} />
      )}
      <ellipse cx={x} cy={top + 6} rx={cw} ry={18 * s} fill={GEO.lava} stroke={C.outline} strokeWidth={6} opacity={verde ? 0 : 1} />
      <ellipse cx={x} cy={top + 6} rx={cw * 0.6} ry={9 * s} fill={GEO.lavaBrilho} opacity={verde ? 0 : glow} />
      {flows.map((d, i) => {
        const p = interpolate(lava, [i * 0.15, i * 0.15 + 0.7], [0, 1], clamp);
        return (
          <g key={`f${i}`}>
            <path d={d} stroke={C.outline} strokeWidth={30 * s + 8} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 2`} opacity={p > 0 ? 1 : 0} />
            <path d={d} stroke={GEO.lava} strokeWidth={30 * s} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 2`} opacity={p > 0 ? 1 : 0} />
            <path d={d} stroke={GEO.lavaClara} strokeWidth={10 * s} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 2`} opacity={p > 0 ? 0.9 : 0} />
          </g>
        );
      })}
      {bombs.map((b, i) => (
        <circle key={`b${i}`} cx={b.px} cy={b.py} r={b.r} fill={b.c} stroke={C.outline} strokeWidth={4} opacity={b.o} />
      ))}
    </svg>
  );
};

/** Céu de vulcão: degradê escuro-alaranjado com cinzas caindo. */
export const CeuVulcanico: React.FC<{ chao?: number; brilho?: number }> = ({ chao = 1300, brilho = 0.5 }) => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="ceuv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2A1838" />
          <stop offset="0.55" stopColor="#7A2E3A" />
          <stop offset="1" stopColor="#E0663A" />
        </linearGradient>
        <radialGradient id="glowv" cx="0.5" cy="0.45" r="0.5">
          <stop offset="0" stopColor="#FFB020" stopOpacity={0.55 * brilho} />
          <stop offset="1" stopColor="#FFB020" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#ceuv)" />
      <rect width={1080} height={1920} fill="url(#glowv)" />
      {Array.from({ length: 40 }).map((_, i) => {
        const x = ((i * 271 + f * (1 + (i % 3))) % 1180) - 50;
        const y = ((i * 467 + f * (2 + (i % 4))) % 1500);
        return <circle key={i} cx={x} cy={y} r={2 + (i % 3)} fill="#3A2A33" opacity={0.6} />;
      })}
      <path d={`M -50 ${chao - 40} Q 300 ${chao - 110} 600 ${chao - 30} T 1150 ${chao - 60} L 1150 1960 L -50 1960 Z`} fill="#4A2A24" stroke={C.outline} strokeWidth={7} />
      <path d={`M -50 ${chao + 30} Q 400 ${chao - 40} 800 ${chao + 20} T 1150 ${chao + 10} L 1150 1960 L -50 1960 Z`} fill="#3A211D" stroke={C.outline} strokeWidth={7} />
    </svg>
  );
};

/** Subsolo em camadas (para a "descida"). Altura total 1920*3; use `desce` (px) para rolar. */
export const Subsolo: React.FC<{ desce: number }> = ({ desce }) => {
  const f = useCurrentFrame();
  const camadas = [
    { y: -900, h: 1600, c: C.sky },
    { y: 700, h: 120, c: C.grass },
    { y: 820, h: 500, c: "#9C6B45" },
    { y: 1320, h: 700, c: "#7E5236" },
    { y: 2020, h: 900, c: "#A0402A" },
    { y: 2920, h: 900, c: GEO.manto },
    { y: 3820, h: 1940, c: GEO.nucleoExt },
  ];
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(0 ${-desce})`}>
        {camadas.map((k, i) => (
          <rect key={i} x={-20} y={k.y} width={1120} height={k.h + 4} fill={k.c} />
        ))}
        {camadas.slice(2).map((k, i) => (
          <path key={`l${i}`} d={`M -20 ${k.y} Q 270 ${k.y - 30} 540 ${k.y} T 1100 ${k.y}`} stroke={C.outline} strokeWidth={6} fill="none" />
        ))}
        {/* pedrinhas e bolhas de calor */}
        {Array.from({ length: 60 }).map((_, i) => {
          const y = 860 + ((i * 97) % 4800);
          const x = (i * 331) % 1080;
          const quente = y > 2900;
          const bob = quente ? Math.sin(f * 0.1 + i) * 10 : 0;
          return quente ? (
            <circle key={i} cx={x} cy={y + bob} r={10 + (i % 4) * 6} fill={GEO.lavaBrilho} opacity={0.5} />
          ) : (
            <ellipse key={i} cx={x} cy={y} rx={16 + (i % 3) * 8} ry={10 + (i % 2) * 5} fill="#5A3B28" stroke={C.outline} strokeWidth={4} />
          );
        })}
        <rect x={-20} y={700} width={1120} height={20} fill={C.grassDark} />
      </g>
    </svg>
  );
};

/** Corte da Terra: planeta com uma fatia aberta mostrando crosta, manto e núcleos (revela 0..1). */
export const CorteTerra: React.FC<{ cx: number; cy: number; r: number; revela: number; calor?: number }> = ({ cx, cy, r, revela, calor = 0 }) => {
  const f = useCurrentFrame();
  const a0 = -Math.PI / 2;
  const a1 = a0 + (Math.PI / 2) * Math.max(0.001, Math.min(1, revela)) * 1.0;
  const sector = (rr: number) => {
    const x0 = cx + rr * Math.cos(a0);
    const y0 = cy + rr * Math.sin(a0);
    const x1 = cx + rr * Math.cos(a1);
    const y1 = cy + rr * Math.sin(a1);
    return `M ${cx} ${cy} L ${x0} ${y0} A ${rr} ${rr} 0 0 1 ${x1} ${y1} Z`;
  };
  const layers = [
    { k: 1, c: GEO.crosta },
    { k: 0.94, c: GEO.manto },
    { k: 0.55, c: GEO.nucleoExt },
    { k: 0.3, c: GEO.nucleoInt },
  ];
  const pulse = 1 + Math.sin(f * 0.15) * 0.03;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs>
        <clipPath id="terra-clip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r * 1.06} fill="#7EC8FF" opacity={0.35} />
      <circle cx={cx} cy={cy} r={r} fill={GEO.oceano} />
      <g clipPath="url(#terra-clip)">
        {[0, 1].map((k) => {
          const off = ((f * 0.8) % (r * 2)) - k * r * 2;
          return (
            <g key={k} transform={`translate(${off} 0)`}>
              <path d={`M ${cx - r * 0.9} ${cy - r * 0.4} q ${r * 0.3} ${-r * 0.3} ${r * 0.6} 0 q ${r * 0.1} ${r * 0.4} ${-r * 0.2} ${r * 0.7} q ${-r * 0.4} ${-r * 0.1} ${-r * 0.4} ${-r * 0.7} z`} fill={GEO.terra} />
              <path d={`M ${cx + r * 0.1} ${cy + r * 0.1} q ${r * 0.4} ${-r * 0.2} ${r * 0.6} ${r * 0.2} q ${-r * 0.1} ${r * 0.4} ${-r * 0.5} ${r * 0.4} z`} fill={GEO.terra} />
              <path d={`M ${cx + r * 1.1} ${cy - r * 0.4} q ${r * 0.3} ${-r * 0.3} ${r * 0.6} 0 q ${r * 0.1} ${r * 0.4} ${-r * 0.2} ${r * 0.7} q ${-r * 0.4} ${-r * 0.1} ${-r * 0.4} ${-r * 0.7} z`} fill={GEO.terra} />
            </g>
          );
        })}
      </g>
      {layers.map((l, i) => (
        <path key={i} d={sector(r * l.k * (i === 3 ? pulse : 1))} fill={l.c} stroke={C.outline} strokeWidth={5} />
      ))}
      {/* ondas de calor saindo do núcleo */}
      {calor > 0 &&
        Array.from({ length: 6 }).map((_, i) => {
          const ph = ((f + i * 10) % 60) / 60;
          const rr = r * (0.3 + ph * 0.9);
          const ang = a0 + ((i + 0.5) / 6) * (Math.PI / 2);
          const x = cx + Math.cos(ang) * rr;
          const y = cy + Math.sin(ang) * rr;
          return (
            <path
              key={`h${i}`}
              d={`M ${x - 18} ${y} q 9 -14 18 0 t 18 0`}
              stroke={GEO.lavaBrilho}
              strokeWidth={7}
              fill="none"
              strokeLinecap="round"
              opacity={calor * (1 - ph)}
              transform={`rotate(${(ang * 180) / Math.PI + 90} ${x} ${y})`}
            />
          );
        })}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.outline} strokeWidth={8} />
    </svg>
  );
};

/** Termômetro (nivel 0..1). Canto superior esquerdo em (x, y). */
export const Termometro: React.FC<{ x: number; y: number; nivel: number; h?: number }> = ({ x, y, nivel, h = 360 }) => {
  const f = useCurrentFrame();
  const fill = Math.max(0, Math.min(1, nivel)) * (h - 60);
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={120} height={h + 80}>
      <rect x={38} y={0} width={44} height={h} rx={22} fill={C.white} stroke={C.outline} strokeWidth={7} />
      <rect x={48} y={h - 20 - fill} width={24} height={fill + 20} rx={12} fill={C.red} />
      <circle cx={60} cy={h + 20} r={42} fill={C.red} stroke={C.outline} strokeWidth={7} />
      <circle cx={48} cy={h + 8} r={10} fill={C.white} opacity={0.6} />
      {[0.25, 0.5, 0.75].map((k) => (
        <line key={k} x1={82} x2={100} y1={h * (1 - k)} y2={h * (1 - k)} stroke={C.outline} strokeWidth={5} />
      ))}
      {nivel > 0.9 && <circle cx={60} cy={h - 20 - fill} r={14 + Math.sin(f * 0.5) * 4} fill={GEO.lavaBrilho} opacity={0.7} />}
    </svg>
  );
};

/** Placas tectônicas vistas de cima, se afastando/encostando (t 0..1). Rachaduras com lava. */
export const Placas: React.FC<{ t: number; x?: number; y?: number }> = ({ t, x = 90, y = 420 }) => {
  const f = useCurrentFrame();
  // 4 placas com bordas compartilhadas; cada uma desliza numa direção
  const P = [
    { d: "M 0 0 L 520 0 L 470 260 L 300 330 L 0 300 Z", dx: -1, dy: -0.6, c: "#7DB86A" },
    { d: "M 520 0 L 900 0 L 900 360 L 640 380 L 470 260 Z", dx: 1, dy: -0.5, c: "#C9A15A" },
    { d: "M 0 300 L 300 330 L 380 700 L 0 700 Z", dx: -0.9, dy: 0.7, c: "#5FA3D9" },
    { d: "M 300 330 L 470 260 L 640 380 L 900 360 L 900 700 L 380 700 Z", dx: 0.8, dy: 0.8, c: "#D97C5F" },
  ];
  const k = t * 26;
  const cracks = "M 520 0 L 470 260 L 300 330 L 0 300 M 470 260 L 640 380 L 900 360 M 300 330 L 380 700";
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={900} height={700}>
      <path d={cracks} stroke={GEO.lava} strokeWidth={10 + t * 26} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.95} />
      <path d={cracks} stroke={GEO.lavaBrilho} strokeWidth={4 + t * 8} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.6 + 0.3 * Math.sin(f * 0.3)} />
      {P.map((p, i) => (
        <g key={i} transform={`translate(${p.dx * k} ${p.dy * k})`}>
          <path d={p.d} fill={p.c} stroke={C.outline} strokeWidth={8} strokeLinejoin="round" />
        </g>
      ))}
      {/* setas de movimento */}
      {[
        [200, 140, 200],
        [720, 170, -20],
        [150, 520, 150],
        [650, 560, 40],
      ].map(([ax, ay, rot], i) => {
        const pulse = Math.sin(f * 0.2 + i) * 8;
        return (
          <g key={`a${i}`} transform={`translate(${ax + P[i].dx * k + P[i].dx * pulse} ${ay + P[i].dy * k + P[i].dy * pulse}) rotate(${Math.atan2(P[i].dy, P[i].dx) * (180 / Math.PI) + 0 * rot})`}>
            <path d="M -50 -14 L 20 -14 L 20 -34 L 60 0 L 20 34 L 20 14 L -50 14 Z" fill={C.white} stroke={C.outline} strokeWidth={6} strokeLinejoin="round" />
          </g>
        );
      })}
    </svg>
  );
};

/**
 * Corte lateral da subducção: placa oceânica afundando sob a continental, magma derretendo,
 * subindo até a câmara e alimentando o vulcão. Parâmetros 0..1: derrete, sobe, pressao.
 */
export const Subduccao: React.FC<{ derrete: number; sobe: number; pressao: number }> = ({ derrete, sobe, pressao }) => {
  const f = useCurrentFrame();
  const flow = (f * 1.5) % 80;
  const blobs = Array.from({ length: 7 }).map((_, i) => {
    const sx = 560 + (i % 4) * 40;
    const sy = 1240 + (i % 3) * 30;
    const tx = 720;
    const ty = 980;
    const p = interpolate(sobe, [i * 0.07, i * 0.07 + 0.55], [0, 1], clamp);
    return {
      x: sx + (tx - sx) * p + Math.sin(f * 0.1 + i) * 8,
      y: sy + (ty - sy) * p,
      r: (18 + (i % 3) * 7) * derrete * (1 - p * 0.5),
    };
  });
  const cam = 0.4 + pressao * 0.7 + Math.sin(f * 0.6) * 0.04 * pressao;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {/* manto */}
      <rect x={0} y={760} width={1080} height={1160} fill={GEO.manto} />
      {Array.from({ length: 8 }).map((_, i) => (
        <circle key={i} cx={(i * 173) % 1080} cy={1400 + ((i * 89 + f) % 400)} r={30} fill={GEO.mantoEscuro} opacity={0.4} />
      ))}
      {/* oceano à esquerda */}
      <rect x={0} y={700} width={480} height={70} fill={GEO.oceano} stroke={C.outline} strokeWidth={6} />
      {/* placa oceânica afundando (com listras que andam = movimento) */}
      <defs>
        <pattern id="listras" width={80} height={60} patternUnits="userSpaceOnUse" patternTransform={`translate(${flow} 0)`}>
          <rect width={80} height={60} fill="#4C5A7A" />
          <rect width={14} height={60} fill="#3A4663" />
        </pattern>
      </defs>
      <path d="M 0 770 L 480 770 Q 620 780 760 980 L 900 1400 L 820 1430 L 690 1030 Q 580 860 470 850 L 0 850 Z" fill="url(#listras)" stroke={C.outline} strokeWidth={7} strokeLinejoin="round" />
      {/* placa continental à direita */}
      <path d="M 470 700 L 1080 700 L 1080 900 L 820 900 Q 700 880 620 790 Q 560 730 470 760 Z" fill={GEO.crosta} stroke={C.outline} strokeWidth={7} strokeLinejoin="round" />
      {/* câmara magmática + conduto */}
      <path d={`M 720 ${980} L 720 600`} stroke={GEO.lava} strokeWidth={10 + pressao * 22} strokeLinecap="round" opacity={0.35 + sobe * 0.65} />
      <ellipse cx={720} cy={980} rx={90 * cam} ry={45 * cam} fill={GEO.lava} stroke={C.outline} strokeWidth={6} opacity={Math.min(1, sobe * 2)} />
      <ellipse cx={720} cy={975} rx={50 * cam} ry={20 * cam} fill={GEO.lavaBrilho} opacity={Math.min(1, sobe * 2) * 0.8} />
      {/* bolhas de magma */}
      {blobs.map((b, i) => (
        <circle key={i} cx={b.x} cy={b.y} r={Math.max(0, b.r)} fill={i % 2 ? GEO.lavaClara : GEO.lava} stroke={C.outline} strokeWidth={4} opacity={derrete > 0.02 ? 1 : 0} />
      ))}
    </svg>
  );
};

/** Manômetro (pressão 0..1). Centro em (x, y). */
export const Manometro: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) => {
  const f = useCurrentFrame();
  const ang = -120 + 240 * Math.min(1, p) + (p > 0.85 ? Math.sin(f * 1.3) * 6 : 0);
  return (
    <svg style={{ position: "absolute", left: x - 90, top: y - 90, overflow: "visible" }} width={180} height={180} viewBox="-90 -90 180 180">
      <circle r={80} fill={C.white} stroke={C.outline} strokeWidth={8} />
      <path d="M -60 35 A 70 70 0 0 1 -35 -60" stroke={C.green} strokeWidth={14} fill="none" />
      <path d="M -35 -60 A 70 70 0 0 1 35 -60" stroke={C.yellow} strokeWidth={14} fill="none" />
      <path d="M 35 -60 A 70 70 0 0 1 60 35" stroke={C.red} strokeWidth={14} fill="none" />
      <g transform={`rotate(${ang})`}>
        <path d="M -8 0 L 0 -62 L 8 0 Z" fill={C.outline} />
      </g>
      <circle r={12} fill={C.outline} />
    </svg>
  );
};

/** América do Sul estilizada com o Brasil destacado e a borda de placa (Andes) com vulcões. */
export const MapaAmericaSul: React.FC<{ brasil: number; borda: number; noronha: number }> = ({ brasil, borda, noronha }) => {
  const f = useCurrentFrame();
  const continente =
    "M 470 560 Q 560 520 640 550 Q 740 560 790 610 Q 870 650 940 760 Q 980 820 930 880 Q 880 960 840 1040 Q 780 1120 720 1180 Q 660 1240 640 1300 Q 610 1400 560 1480 Q 530 1540 520 1580 Q 490 1520 490 1440 Q 470 1320 460 1200 Q 450 1080 430 960 Q 400 860 380 780 Q 390 700 420 640 Q 440 590 470 560 Z";
  const br =
    "M 560 600 Q 640 590 720 600 Q 800 630 870 700 Q 930 770 925 830 Q 890 900 840 1000 Q 790 1080 730 1150 Q 690 1180 650 1160 Q 640 1080 610 1010 Q 570 940 520 900 Q 480 860 500 780 Q 530 700 560 600 Z";
  const vulcoes = [
    [415, 700],
    [400, 790],
    [420, 900],
    [440, 1010],
    [455, 1120],
    [470, 1250],
    [480, 1370],
  ];
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <path d={continente} fill="#9CCB7A" stroke={C.outline} strokeWidth={8} strokeLinejoin="round" />
      <path d={br} fill={C.green} stroke={C.outline} strokeWidth={6} opacity={brasil} />
      {/* borda da placa (Andes): linha tracejada vermelha */}
      <path
        d="M 400 600 Q 360 760 380 900 Q 400 1100 430 1300 Q 450 1450 470 1600"
        stroke={C.red}
        strokeWidth={12}
        fill="none"
        strokeDasharray="26 18"
        strokeDashoffset={-f * 2}
        pathLength={1000}
        opacity={borda}
      />
      {vulcoes.map(([x, y], i) => {
        const s = interpolate(borda, [i * 0.08, i * 0.08 + 0.3], [0, 1], clamp);
        return <path key={i} d={`M ${x - 22 * s} ${y + 16 * s} L ${x} ${y - 22 * s} L ${x + 22 * s} ${y + 16 * s} Z`} fill={GEO.lava} stroke={C.outline} strokeWidth={4} />;
      })}
      {/* Fernando de Noronha */}
      <circle cx={1000} cy={790} r={10 + noronha * 10 + Math.sin(f * 0.25) * 4 * noronha} fill={C.yellow} stroke={C.outline} strokeWidth={4} opacity={0.4 + noronha * 0.6} />
    </svg>
  );
};

/** Ilha vulcânica antiga (inspirada em Fernando de Noronha): pico verde, mar e ondas. */
export const IlhaVulcanica: React.FC<{ chao?: number }> = ({ chao = 1260 }) => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="ceuilha" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.skyDeep} />
          <stop offset="1" stopColor={C.sky} />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#ceuilha)" />
      <rect y={chao} width={1080} height={1920 - chao} fill={GEO.oceano} />
      {/* pico (morro) */}
      <path d={`M 120 ${chao} Q 260 ${chao - 160} 420 ${chao - 220} L 470 ${chao - 560} Q 520 ${chao - 600} 560 ${chao - 540} L 600 ${chao - 240} Q 800 ${chao - 160} 960 ${chao} Z`} fill="#5E9E4E" stroke={C.outline} strokeWidth={8} strokeLinejoin="round" />
      <path d={`M 470 ${chao - 560} Q 520 ${chao - 600} 560 ${chao - 540} L 580 ${chao - 380} Q 520 ${chao - 360} 455 ${chao - 390} Z`} fill="#6E6A75" stroke={C.outline} strokeWidth={6} />
      <path d={`M 120 ${chao} Q 300 ${chao - 30} 540 ${chao - 20} Q 780 ${chao - 30} 960 ${chao} Z`} fill="#F2D49B" stroke={C.outline} strokeWidth={6} />
      {Array.from({ length: 7 }).map((_, i) => {
        const x = ((i * 170 + f * 1.2) % 1240) - 80;
        return <path key={i} d={`M ${x} ${chao + 60 + (i % 3) * 70} q 25 -18 50 0 t 50 0`} stroke={C.white} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.8} />;
      })}
    </svg>
  );
};

/** Palmeira simples (balança ao vento). Base em (x, y). */
export const Palmeira: React.FC<{ x: number; y: number; s?: number; cresce?: number }> = ({ x, y, s = 1, cresce = 1 }) => {
  const f = useCurrentFrame();
  const sw = Math.sin(f * 0.06 + x) * 4;
  const k = Math.max(0, Math.min(1, cresce));
  if (k <= 0) return null;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <g transform={`translate(${x} ${y}) scale(${s * k}) rotate(${sw})`}>
        <path d="M -10 0 Q -20 -120 10 -240 L 26 -240 Q 0 -120 12 0 Z" fill="#9C6A3A" stroke={C.outline} strokeWidth={6} />
        {[-60, -20, 20, 60, 100, 140].map((a, i) => (
          <path key={i} d="M 18 -240 q 60 -40 130 10 q -70 -10 -130 -10 z" fill={i % 2 ? C.grass : C.grassDark} stroke={C.outline} strokeWidth={5} transform={`rotate(${a} 18 -240)`} />
        ))}
      </g>
    </svg>
  );
};
