import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";

/** Elementos do vídeo "Por que o dedo enruga na água?" (SVG 1080x1920, contorno C.outline). */

const OL = { stroke: C.outline, strokeWidth: 7, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const PELE = "#C98B5E";
const PELE_CLARA = "#E0A97E";

const Tela: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {children}
    </svg>
  </AbsoluteFill>
);

/** Rugas na ponta de um dedo (linhas onduladas). `k` 0..1 intensidade, `seed` muda o desenho. */
const RugasPonta: React.FC<{ w: number; y0: number; k: number; seed?: number }> = ({ w, y0, k, seed = 0 }) => {
  if (k <= 0.02) return null;
  return (
    <g fill="none" stroke="#8A5530" strokeWidth={5} strokeLinecap="round" opacity={Math.min(1, k * 1.4)}>
      {[0, 1, 2, 3, 4].map((i) => {
        const y = y0 + i * 26;
        const a = 8 * k * (1 + ((i + seed) % 3) * 0.4);
        return <path key={i} d={`M${-w / 2 + 10} ${y} q ${w / 8} ${-a} ${w / 4} 0 t ${w / 4} 0 t ${w / 4} 0 t ${w / 4 - 20} 0`} />;
      })}
    </g>
  );
};

/**
 * Mão aberta (palma para a câmera, dedos para cima). `rugas` 0..1 enruga as pontas dos dedos;
 * `molhada` solta gotinhas; `curativo` põe um band-aid no indicador (nervo cortado = sem rugas nele).
 */
export const Mao: React.FC<{ x: number; y: number; s?: number; rugas?: number; molhada?: boolean; curativo?: boolean; rot?: number }> = ({
  x,
  y,
  s = 1,
  rugas = 0,
  molhada = false,
  curativo = false,
  rot = 0,
}) => {
  const f = useCurrentFrame();
  const dedos = [
    { x: -150, h: 300, w: 92, r: -12 },
    { x: -55, h: 360, w: 96, r: -4 },
    { x: 45, h: 380, w: 96, r: 2 },
    { x: 140, h: 330, w: 92, r: 9 },
  ];
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
        {/* polegar */}
        <g transform="translate(-200 60) rotate(-50)">
          <rect x={-46} y={-230} width={92} height={240} rx={46} fill={PELE} {...OL} />
          <RugasPonta w={92} y0={-210} k={rugas} seed={3} />
        </g>
        {dedos.map((d, i) => (
          <g key={i} transform={`translate(${d.x} -80) rotate(${d.r})`}>
            <rect x={-d.w / 2} y={-d.h} width={d.w} height={d.h + 60} rx={d.w / 2} fill={PELE} {...OL} />
            <RugasPonta w={d.w} y0={-d.h + 22} k={curativo && i === 1 ? 0 : rugas} seed={i} />
            {curativo && i === 1 && (
              <g>
                <rect x={-d.w / 2 - 4} y={-d.h * 0.55} width={d.w + 8} height={60} rx={14} fill="#FFE0B2" {...OL} strokeWidth={5} />
                <circle cx={-14} cy={-d.h * 0.55 + 30} r={5} fill="#D7A86E" />
                <circle cx={14} cy={-d.h * 0.55 + 30} r={5} fill="#D7A86E" />
              </g>
            )}
            <path d={`M${-d.w / 2 + 18} ${-d.h * 0.35} q ${d.w / 2 - 18} 12 ${d.w - 36} 0`} fill="none" stroke="#9C6440" strokeWidth={4} opacity={0.6} />
          </g>
        ))}
        {/* palma */}
        <path d="M-210 -60 Q -220 200 -120 300 L120 300 Q 220 200 200 -60 Z" fill={PELE} {...OL} />
        <path d="M-120 60 Q 0 120 120 40 M-80 150 Q 10 180 110 140" fill="none" stroke="#9C6440" strokeWidth={5} opacity={0.6} />
        <rect x={-130} y={290} width={260} height={160} fill={PELE} {...OL} />
        {molhada &&
          [0, 1, 2, 3].map((i) => {
            const q = ((f + i * 11) % 40) / 40;
            return <path key={i} d={`M${-120 + i * 80} ${-200 + q * 500} q 14 22 0 30 q -14 -8 0 -30 Z`} fill="#4FC3F7" stroke="#0277BD" strokeWidth={3} opacity={1 - q} />;
          })}
      </g>
    </Tela>
  );
};

/**
 * Corte da ponta do dedo: pele por cima, vasinhos de sangue embaixo e o nervo (amarelo) mandando sinal.
 * `aperta` 0..1 estreita os vasos e faz a pele dobrar; `sinal` liga os raiozinhos no nervo.
 */
export const CortePele: React.FC<{ x: number; y: number; s?: number; aperta: number; sinal?: boolean }> = ({ x, y, s = 1, aperta, sinal = false }) => {
  const f = useCurrentFrame();
  const a = aperta * 46;
  let pele = `M-420 ${-120}`;
  for (let i = 0; i < 8; i++) pele += ` Q ${-420 + i * 105 + 52} ${-120 - (i % 2 ? a : -a)} ${-420 + (i + 1) * 105} -120`;
  const vasoR = 34 - aperta * 22;
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x={-440} y={-260} width={880} height={560} rx={40} fill="#BFE9FF" {...OL} strokeWidth={10} />
        {/* água por cima */}
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M${-380 + i * 170} -210 q 20 -16 40 0 t 40 0`} fill="none" stroke="#4FC3F7" strokeWidth={6} />
        ))}
        <path d={`${pele} L420 280 L-420 280 Z`} fill={PELE_CLARA} {...OL} strokeWidth={8} />
        <rect x={-420} y={-40} width={840} height={320} fill="#F2C29B" />
        {/* vasos */}
        {[-260, 0, 260].map((vx, i) => (
          <g key={i}>
            <ellipse cx={vx} cy={60} rx={110} ry={vasoR + 6} fill="#B71C1C" opacity={0.25} />
            <rect x={vx - 100} y={60 - vasoR} width={200} height={vasoR * 2} rx={vasoR} fill="#E53935" {...OL} strokeWidth={5} />
            {[0, 1, 2].map((k) => {
              const q = ((f * 2 + k * 30 + i * 13) % 90) / 90;
              return <circle key={k} cx={vx - 90 + q * 180} cy={60} r={Math.max(4, vasoR * 0.4)} fill="#FFCDD2" />;
            })}
          </g>
        ))}
        {/* nervo */}
        <path d="M-420 200 Q -200 160 0 200 Q 200 240 420 200" fill="none" stroke="#FBC02D" strokeWidth={18} strokeLinecap="round" />
        {sinal &&
          [0, 1, 2].map((k) => {
            const q = ((f * 3 + k * 40) % 120) / 120;
            const px = -420 + q * 840;
            return <path key={k} d={`M${px} 175 l 14 22 l -10 4 l 14 24`} fill="none" stroke="#FFEB3B" strokeWidth={8} strokeLinecap="round" />;
          })}
      </g>
    </Tela>
  );
};

/** Banheira (frente) — vai NA FRENTE do personagem; espuma em cima. */
export const BanheiraFrente: React.FC<{ y?: number }> = ({ y = 1360 }) => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <g transform={`translate(540 ${y})`}>
        {Array.from({ length: 9 }).map((_, i) => (
          <circle key={i} cx={-380 + i * 95} cy={-10 + Math.sin(f * 0.1 + i) * 6} r={60 + (i % 3) * 10} fill="#fff" {...OL} strokeWidth={5} />
        ))}
        <path d="M-470 0 L470 0 L430 300 Q 0 340 -430 300 Z" fill="#ECEFF1" {...OL} strokeWidth={10} />
        <path d="M-420 60 L420 60" stroke="#CFD8DC" strokeWidth={12} />
        <path d="M-380 300 l -30 70 M380 300 l 30 70" {...OL} strokeWidth={18} />
        {[0, 1, 2].map((i) => {
          const q = ((f + i * 25) % 75) / 75;
          return <circle key={i} cx={-200 + i * 200} cy={-60 - q * 260} r={18 + q * 14} fill="none" stroke="#81D4FA" strokeWidth={5} opacity={1 - q} />;
        })}
      </g>
    </Tela>
  );
};

/** Pneu de chuva (com sulcos) girando. */
export const Pneu: React.FC<{ x: number; y: number; s?: number; gira?: boolean }> = ({ x, y, s = 1, gira = true }) => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s}) rotate(${gira ? f * 3 : 0})`}>
        <circle r={220} fill="#37474F" {...OL} strokeWidth={10} />
        {Array.from({ length: 16 }).map((_, i) => (
          <g key={i} transform={`rotate(${i * 22.5})`}>
            <path d="M-20 -218 L0 -180 L20 -218" fill="none" stroke="#212121" strokeWidth={10} />
          </g>
        ))}
        <circle r={120} fill="#90A4AE" {...OL} strokeWidth={8} />
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={Math.cos((i / 5) * Math.PI * 2) * 70} cy={Math.sin((i / 5) * Math.PI * 2) * 70} r={14} fill="#546E7A" />
        ))}
        <circle r={26} fill="#546E7A" {...OL} strokeWidth={5} />
      </g>
    </Tela>
  );
};

/** Dois potes com bolinhas: `p` 0..1 = quantas já passaram do pote da esquerda pro da direita. */
export const PotesBolinhas: React.FC<{ x: number; y: number; s?: number; p: number }> = ({ x, y, s = 1, p }) => {
  const n = 6;
  const passou = Math.floor(p * n);
  const cores = [C.red, C.blue, C.yellow, C.green, C.violet, C.orange];
  const pote = (px: number) => (
    <g transform={`translate(${px} 0)`}>
      <path d="M-150 -100 L150 -100 L120 110 Q 0 130 -120 110 Z" fill="#BBDEFB" opacity={0.85} {...OL} strokeWidth={8} />
      <path d="M-140 -40 L140 -40 L120 110 Q 0 130 -120 110 Z" fill="#4FC3F7" opacity={0.6} />
    </g>
  );
  const bola = (i: number, px: number, k: number) => <circle key={i} cx={px + ((k % 3) - 1) * 60} cy={70 - Math.floor(k / 3) * 50} r={26} fill={cores[i]} {...OL} strokeWidth={5} />;
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        {pote(-220)}
        {pote(220)}
        {Array.from({ length: n }).map((_, i) => (i < passou ? bola(i, 220, i) : bola(i, -220, i - passou)))}
        <path d="M-80 -170 Q 0 -240 80 -170" fill="none" {...OL} strokeWidth={8} />
        <path d="M60 -190 l 24 22 l -32 6" fill="none" {...OL} strokeWidth={8} />
      </g>
    </Tela>
  );
};

/** Ponta do dedo vista de perto com o padrão de rugas (igual nas duas vezes): `lado` mostra duas lado a lado com "=". */
export const PontaDigital: React.FC<{ x: number; y: number; s?: number; dupla?: boolean }> = ({ x, y, s = 1, dupla = false }) => {
  const ponta = (px: number, rot: number) => (
    <g transform={`translate(${px} 0) rotate(${rot})`}>
      <ellipse rx={150} ry={200} fill={PELE} {...OL} strokeWidth={9} />
      <g fill="none" stroke="#7A4A28" strokeWidth={7} strokeLinecap="round">
        <path d="M-110 -100 Q -60 -140 -10 -100 T 90 -110" />
        <path d="M-120 -40 Q -70 -70 -20 -30 Q 30 0 110 -50" />
        <path d="M-125 20 Q -50 -10 0 30 T 120 10" />
        <path d="M-110 80 Q -60 50 -10 90 T 100 70" />
        <path d="M-70 140 Q 0 110 70 140" />
      </g>
    </g>
  );
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        {dupla ? (
          <>
            {ponta(-210, -6)}
            {ponta(210, 6)}
            <text x={0} y={30} textAnchor="middle" fontSize={120} fontWeight={800} fill={C.outline} fontFamily="'Baloo 2'">
              =
            </text>
          </>
        ) : (
          ponta(0, 0)
        )}
      </g>
    </Tela>
  );
};
