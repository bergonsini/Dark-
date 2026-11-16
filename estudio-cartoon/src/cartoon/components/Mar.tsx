import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";

/** Elementos do vídeo "Por que o mar é salgado?" (SVG 1080x1920, contorno C.outline). */

const W = 1080;
const H = 1920;
const OL = { stroke: C.outline, strokeWidth: 7, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
export const MAR = { agua: "#1E88E5", aguaClara: "#4FC3F7", fundo: "#0B2F5C", areia: "#F6D58E", rocha: "#8D7B6B", rochaClara: "#B3A08E", sal: "#FFFFFF" };

const Tela: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      {children}
    </svg>
  </AbsoluteFill>
);

/** Ondas do mar (faixa que se mexe). */
const Ondas: React.FC<{ y: number; cor: string; amp?: number; fase?: number; ate?: number }> = ({ y, cor, amp = 18, fase = 0, ate = H }) => {
  const f = useCurrentFrame();
  const pts: string[] = [];
  for (let x = -20; x <= W + 20; x += 30) pts.push(`${x},${y + Math.sin(x / 70 + f * 0.12 + fase) * amp}`);
  return <polygon points={`${pts.join(" ")} ${W + 20},${ate} -20,${ate}`} fill={cor} {...OL} />;
};

/** Praia: céu, mar com ondas e areia. `nivel` = altura (y) da superfície do mar. */
export const Praia: React.FC<{ nivel?: number; areia?: boolean; ceu?: [string, string]; semCeu?: boolean }> = ({ nivel = 1050, areia = true, ceu = [C.skyDeep, C.sky], semCeu = false }) => (
  <Tela>
    <defs>
      <linearGradient id="ceuPraia" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={ceu[0]} />
        <stop offset="1" stopColor={ceu[1]} />
      </linearGradient>
    </defs>
    {!semCeu && <rect width={W} height={H} fill="url(#ceuPraia)" />}
    <Ondas y={nivel} cor={MAR.agua} amp={14} />
    <Ondas y={nivel + 60} cor={MAR.aguaClara} amp={10} fase={1.5} />
    {areia && <path d={`M-20 ${nivel + 330} Q 540 ${nivel + 250} 1100 ${nivel + 330} L1100 ${H} L-20 ${H} Z`} fill={MAR.areia} {...OL} />}
  </Tela>
);

/** Chuva caindo (traços). */
export const Chuva2D: React.FC<{ intensidade?: number; x0?: number; x1?: number; y0?: number; y1?: number }> = ({ intensidade = 1, x0 = 0, x1 = W, y0 = 0, y1 = H }) => {
  const f = useCurrentFrame();
  const n = Math.round(60 * intensidade);
  return (
    <Tela>
      {Array.from({ length: n }).map((_, i) => {
        const x = x0 + ((i * 137) % Math.max(1, x1 - x0));
        const y = y0 + ((i * 251 + f * 38) % Math.max(1, y1 - y0));
        return <path key={i} d={`M${x} ${y} l-10 46`} stroke="#9AD8FF" strokeWidth={7} strokeLinecap="round" opacity={0.85} />;
      })}
    </Tela>
  );
};

/** Montanha de rocha com rostinho. `desgaste` 0..1: rachaduras + pedacinhos (sais) caindo. */
export const Montanha: React.FC<{ x: number; y: number; s?: number; desgaste?: number; rosto?: boolean }> = ({ x, y, s = 1, desgaste = 0, rosto = true }) => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M-330 0 L-120 -420 L-40 -330 L60 -520 L330 0 Z" fill={MAR.rocha} {...OL} />
        <path d="M60 -520 L120 -400 L80 -380 L20 -440 Z" fill="#fff" {...OL} strokeWidth={5} />
        <path d="M-120 -420 L-160 -330 L-90 -350 Z" fill={MAR.rochaClara} stroke="none" />
        {desgaste > 0.1 && <path d="M-40 -260 l40 60 l-30 50 l40 70" fill="none" {...OL} strokeWidth={5} opacity={Math.min(1, desgaste * 2)} />}
        {desgaste > 0.4 && <path d="M120 -200 l-30 50 l35 40" fill="none" {...OL} strokeWidth={5} />}
        {rosto && (
          <g>
            <circle cx={-50} cy={-150} r={20} fill="#fff" {...OL} strokeWidth={5} />
            <circle cx={50} cy={-150} r={20} fill="#fff" {...OL} strokeWidth={5} />
            <circle cx={-46} cy={-146} r={9} fill={C.outline} />
            <circle cx={54} cy={-146} r={9} fill={C.outline} />
            <path d={desgaste > 0.5 ? "M-30 -90 Q0 -110 30 -90" : "M-30 -100 Q0 -75 30 -100"} fill="none" {...OL} strokeWidth={6} />
          </g>
        )}
        {desgaste > 0 &&
          Array.from({ length: 10 }).map((_, i) => {
            const q = ((f + i * 9) % 40) / 40;
            const px = -200 + i * 45 + Math.sin(i) * 20;
            return <rect key={i} x={px} y={-200 + q * 260} width={16} height={16} fill={i % 3 ? C.white : C.yellow} {...OL} strokeWidth={3} opacity={desgaste * (1 - q * 0.6)} transform={`rotate(${f * 4 + i * 30} ${px + 8} ${-192 + q * 260})`} />;
          })}
      </g>
    </Tela>
  );
};

/** Rio serpenteando com grãozinhos de sal descendo pela correnteza. */
const RIO_PTS: [number, number][] = [
  [180, 560], [300, 700], [220, 860], [420, 980], [600, 1080], [520, 1230], [760, 1330], [900, 1480],
];
const ptRio = (t: number): [number, number] => {
  const n = RIO_PTS.length - 1;
  const k = Math.min(n - 1e-6, Math.max(0, t * n));
  const i = Math.floor(k);
  const u = k - i;
  return [RIO_PTS[i][0] + (RIO_PTS[i + 1][0] - RIO_PTS[i][0]) * u, RIO_PTS[i][1] + (RIO_PTS[i + 1][1] - RIO_PTS[i][1]) * u];
};
export const Rio: React.FC<{ graos?: number; vel?: number }> = ({ graos = 1, vel = 1 }) => {
  const f = useCurrentFrame();
  const d = `M ${RIO_PTS.map((p) => p.join(" ")).join(" L ")}`;
  return (
    <Tela>
      <path d={d} fill="none" stroke={C.outline} strokeWidth={96} strokeLinejoin="round" strokeLinecap="round" />
      <path d={d} fill="none" stroke={MAR.aguaClara} strokeWidth={80} strokeLinejoin="round" strokeLinecap="round" />
      {Array.from({ length: Math.round(14 * graos) }).map((_, i) => {
        const t = ((f * 0.006 * vel + i / 14) % 1 + 1) % 1;
        const [x, y] = ptRio(t);
        return <rect key={i} x={x - 9 + Math.sin(i * 3) * 18} y={y - 9} width={18} height={18} fill={C.white} {...OL} strokeWidth={3} transform={`rotate(${f * 3 + i * 40} ${x} ${y})`} />;
      })}
    </Tela>
  );
};

/** Vapor subindo (ondinhas) a partir de uma faixa do mar. */
export const Vapor: React.FC<{ y: number; forca?: number }> = ({ y, forca = 1 }) => {
  const f = useCurrentFrame();
  return (
    <Tela>
      {Array.from({ length: 7 }).map((_, i) => {
        const q = ((f + i * 13) % 70) / 70;
        const x = 120 + i * 140;
        const yy = y - q * 520;
        return (
          <path
            key={i}
            d={`M${x} ${yy} q 22 -30 0 -60 q -22 -30 0 -60`}
            fill="none"
            stroke="#fff"
            strokeWidth={12}
            strokeLinecap="round"
            opacity={forca * (1 - q) * 0.9}
          />
        );
      })}
    </Tela>
  );
};

/** Grãos de sal que ficam no mar (aparecem e se acumulam: `qtd` 0..1). */
export const SalNoMar: React.FC<{ y: number; qtd: number }> = ({ y, qtd }) => {
  const f = useCurrentFrame();
  const n = Math.round(40 * qtd);
  return (
    <Tela>
      {Array.from({ length: n }).map((_, i) => {
        const x = 40 + ((i * 173) % 1000);
        const yy = y + 60 + ((i * 97) % 420);
        return <rect key={i} x={x} y={yy + Math.sin(f * 0.1 + i) * 6} width={20} height={20} fill={C.white} {...OL} strokeWidth={3} transform={`rotate(${i * 25} ${x + 10} ${yy + 10})`} />;
      })}
    </Tela>
  );
};

/** Fundo do mar com fonte hidrotermal (chaminé soltando "fumaça" quente cheia de minerais). */
export const FundoMarFonte: React.FC<{ jorro?: number }> = ({ jorro = 1 }) => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <defs>
        <linearGradient id="abismo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1565C0" />
          <stop offset="1" stopColor={MAR.fundo} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#abismo)" />
      {Array.from({ length: 12 }).map((_, i) => {
        const q = ((f * 0.8 + i * 23) % 160) / 160;
        return <circle key={`b${i}`} cx={80 + i * 85} cy={1700 - q * 1600} r={8 + (i % 3) * 4} fill="none" stroke="#9AD8FF" strokeWidth={4} opacity={0.6} />;
      })}
      <path d="M-20 1620 Q 300 1540 540 1600 T 1100 1580 L1100 1940 L-20 1940 Z" fill="#3E2F28" {...OL} />
      <path d="M440 1600 L480 1180 L600 1180 L640 1600 Z" fill="#4A3A30" {...OL} />
      <path d="M470 1260 L610 1260 M460 1380 L620 1380" stroke="#2A1E18" strokeWidth={8} />
      {Array.from({ length: 9 }).map((_, i) => {
        const q = ((f + i * 7) % 60) / 60;
        return <circle key={i} cx={540 + Math.sin(f * 0.1 + i) * (30 + q * 90)} cy={1170 - q * 620} r={50 + q * 90} fill="#2B2B2B" opacity={jorro * (1 - q) * 0.85} />;
      })}
      {Array.from({ length: 14 }).map((_, i) => {
        const q = ((f + i * 5) % 70) / 70;
        const x = 540 + Math.sin(i * 2.3) * (40 + q * 260);
        const y = 1150 - q * 700;
        return <rect key={`m${i}`} x={x} y={y} width={16} height={16} fill={i % 2 ? C.yellow : C.white} {...OL} strokeWidth={3} opacity={jorro * (1 - q)} />;
      })}
      <g transform="translate(220 1560)">
        <path d="M0 0 q -20 -80 10 -160 M30 0 q 30 -90 0 -180" fill="none" stroke="#E57373" strokeWidth={18} strokeLinecap="round" />
      </g>
    </Tela>
  );
};

/** Copo de água do mar com a pilha de sal ao lado (35 g por litro). */
export const CopoSal: React.FC<{ x: number; y: number; s?: number; pilha?: number }> = ({ x, y, s = 1, pilha = 1 }) => (
  <Tela>
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-120 -320 L120 -320 L95 0 L-95 0 Z" fill="#E3F2FD" {...OL} />
      <path d="M-112 -230 L112 -230 L95 0 L-95 0 Z" fill={MAR.aguaClara} {...OL} />
      <text x={0} y={-110} textAnchor="middle" fontSize={56} fontWeight={800} fill={C.white} stroke={C.outline} strokeWidth={8} paintOrder="stroke" fontFamily="'Baloo 2'">
        1 L
      </text>
      <g transform={`translate(260 0) scale(${pilha})`}>
        <path d="M-130 0 Q 0 -190 130 0 Z" fill={C.white} {...OL} />
        <path d="M-60 -50 l12 -12 M10 -90 l12 -12 M50 -40 l12 -12" stroke="#B0BEC5" strokeWidth={6} />
      </g>
    </g>
  </Tela>
);

/** Prédio de 40 andares ao lado de uma camada de sal da mesma altura. `sobe` 0..1. */
export const PredioSal: React.FC<{ sobe: number; chao?: number }> = ({ sobe, chao = 1500 }) => {
  const hPred = 1000;
  const hSal = hPred * sobe;
  return (
    <Tela>
      <rect x={-20} y={chao} width={W + 40} height={H - chao + 20} fill={C.grass} {...OL} />
      <g>
        <rect x={140} y={chao - hPred} width={300} height={hPred} fill="#90A4AE" {...OL} />
        {Array.from({ length: 20 }).map((_, r) =>
          [0, 1, 2].map((c) => <rect key={`${r}-${c}`} x={170 + c * 90} y={chao - hPred + 20 + r * 49} width={60} height={30} fill="#FFF59D" stroke={C.outline} strokeWidth={3} />),
        )}
        <text x={290} y={chao - hPred - 30} textAnchor="middle" fontSize={64} fontWeight={800} fill={C.white} stroke={C.outline} strokeWidth={10} paintOrder="stroke" fontFamily="'Baloo 2'">
          40 ANDARES
        </text>
      </g>
      <rect x={520} y={chao - hSal} width={560} height={hSal} fill={C.white} {...OL} />
      {hSal > 60 &&
        Array.from({ length: 30 }).map((_, i) => (
          <rect key={i} x={540 + ((i * 97) % 500)} y={chao - hSal + 20 + ((i * 131) % Math.max(20, hSal - 40))} width={14} height={14} fill="#CFD8DC" />
        ))}
    </Tela>
  );
};
