import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";

/** Nuvem vetorial fofa. */
export const Nuvem: React.FC<{ x: number; y: number; s?: number; cor?: string; opacity?: number }> = ({ x, y, s = 1, cor = C.white, opacity = 1 }) => (
  <svg style={{ position: "absolute", left: x, top: y, overflow: "visible", opacity }} width={260 * s} height={120 * s} viewBox="0 0 260 120">
    <path
      d="M 40 100 Q 0 100 10 70 Q 20 40 60 50 Q 70 10 120 15 Q 170 5 180 45 Q 230 30 245 70 Q 260 100 220 100 Z"
      fill={cor}
      stroke={C.outline}
      strokeWidth={6}
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Céu + colinas, com nuvens em parallax. Mude `topo`/`base` para entardecer, noite, Marte...
 */
export const CeuCampo: React.FC<{
  topo?: string;
  base?: string;
  colina1?: string;
  colina2?: string;
  nuvens?: boolean;
  corNuvem?: string;
  chao?: number;
}> = ({ topo = C.skyDeep, base = C.sky, colina1 = C.grass, colina2 = C.grassDark, nuvens = true, corNuvem = C.white, chao = 1450 }) => {
  const f = useCurrentFrame();
  const drift = (speed: number, off: number) => ((off + f * speed) % 1500) - 300;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${topo} 0%, ${base} 75%)` }}>
      {nuvens && (
        <>
          <Nuvem x={drift(0.6, 100)} y={260} s={1.2} cor={corNuvem} />
          <Nuvem x={drift(0.35, 800)} y={480} s={0.8} cor={corNuvem} opacity={0.9} />
          <Nuvem x={drift(0.5, 1300)} y={150} s={0.9} cor={corNuvem} />
        </>
      )}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <path d={`M -50 ${chao - 60} Q 250 ${chao - 220} 560 ${chao - 80} T 1150 ${chao - 120} L 1150 1960 L -50 1960 Z`} fill={colina2} stroke={C.outline} strokeWidth={7} />
        <path d={`M -50 ${chao} Q 300 ${chao - 120} 700 ${chao - 20} T 1150 ${chao - 40} L 1150 1960 L -50 1960 Z`} fill={colina1} stroke={C.outline} strokeWidth={7} />
        {[120, 330, 640, 880].map((x, i) => (
          <path key={i} d={`M ${x} ${chao + 70 + (i % 2) * 40} l 10 -26 l 10 26 l 10 -20 l 6 20`} stroke={colina2} strokeWidth={6} fill="none" strokeLinecap="round" />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

/** Espaço com estrelas cintilando (fundo escuro para cenas de "laboratório"/explicação). */
export const Espaco: React.FC<{ topo?: string; base?: string; estrelas?: number }> = ({ topo = "#120C2E", base = "#2A1E5C", estrelas = 60 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 35%, ${base} 0%, ${topo} 75%)` }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: estrelas }).map((_, i) => {
          const x = (i * 397) % 1080;
          const y = (i * 653) % 1920;
          const r = 2 + (i % 3) * 1.5;
          const o = 0.4 + 0.6 * Math.abs(Math.sin(f * 0.05 + i));
          return <circle key={i} cx={x} cy={y} r={r} fill={C.white} opacity={o} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};
