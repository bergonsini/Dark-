import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";

/** Elementos do vídeo "Por que cócega sozinho não funciona?" (SVG 1080x1920, contorno C.outline). */

const OL = { stroke: C.outline, strokeWidth: 7, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

const Tela: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {children}
    </svg>
  </AbsoluteFill>
);

/** Pena colorida balançando. `rot` = rotação base. */
export const PenaSvg: React.FC<{ cor?: string }> = ({ cor = "#FF7AB6" }) => (
  <g>
    <path d="M0 0 Q 60 -120 20 -300 Q -60 -170 0 0 Z" fill={cor} {...OL} strokeWidth={6} />
    <path d="M0 0 Q 15 -150 20 -300" fill="none" stroke={C.outline} strokeWidth={5} />
    {[0, 1, 2, 3].map((i) => (
      <path key={i} d={`M${8 + i * 3} ${-60 - i * 55} l 26 -22 M${6 + i * 3} ${-70 - i * 55} l -26 -18`} stroke="#fff" strokeWidth={4} opacity={0.7} />
    ))}
  </g>
);

/** Pena solta na tela, fazendo cosquinha (vai e volta). */
export const Pena: React.FC<{ x: number; y: number; s?: number; rot?: number; cor?: string; mexe?: boolean }> = ({ x, y, s = 1, rot = 0, cor, mexe = true }) => {
  const f = useCurrentFrame();
  const r = rot + (mexe ? Math.sin(f * 0.6) * 18 : 0);
  const dx = mexe ? Math.sin(f * 0.6) * 20 : 0;
  return (
    <Tela>
      <g transform={`translate(${x + dx} ${y}) rotate(${r}) scale(${s})`}>
        <PenaSvg cor={cor} />
      </g>
    </Tela>
  );
};

/**
 * Cérebro de lado (olhando para a direita): lobos rosados + CEREBELO listrado embaixo, atrás.
 * `destaque` 0..1 acende o cerebelo; `sinal` 0..1 dispara uma setinha "prevendo" até a mão.
 */
export const CerebroLado: React.FC<{ x: number; y: number; s?: number; destaque?: number; olhos?: boolean }> = ({ x, y, s = 1, destaque = 0, olhos = false }) => {
  const f = useCurrentFrame();
  const pulsa = 1 + destaque * Math.sin(f * 0.25) * 0.04;
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M-260 40 Q -320 -150 -160 -240 Q -40 -320 100 -270 Q 260 -230 290 -80 Q 320 60 200 110 Q 60 150 -60 120 Q -200 140 -260 40 Z" fill="#FFB3C7" {...OL} strokeWidth={10} />
        <g fill="none" stroke="#E57399" strokeWidth={9} strokeLinecap="round">
          <path d="M-200 -120 Q -150 -170 -90 -130 Q -40 -90 10 -150" />
          <path d="M40 -220 Q 80 -160 150 -190 Q 210 -210 230 -130" />
          <path d="M-180 10 Q -110 -40 -40 10 Q 30 60 100 0 Q 170 -50 240 10" />
          <path d="M-60 -230 Q -40 -180 -80 -140" />
        </g>
        {/* tronco */}
        <path d="M-40 120 Q -30 200 -60 280 L20 280 Q 30 200 40 120 Z" fill="#F48FB1" {...OL} />
        {/* cerebelo (atrás = esquerda, embaixo) */}
        <g transform={`translate(-170 130) scale(${pulsa})`}>
          {destaque > 0 && <ellipse rx={150} ry={110} fill={C.yellow} opacity={0.5 * destaque} />}
          <ellipse rx={120} ry={80} fill={destaque > 0.5 ? "#FF8C42" : "#F48FB1"} {...OL} strokeWidth={9} />
          {[-40, -10, 20, 50].map((dy, i) => (
            <path key={i} d={`M-100 ${dy - 10} Q 0 ${dy + 10} 100 ${dy - 10}`} fill="none" stroke={C.outline} strokeWidth={4} opacity={0.6} />
          ))}
        </g>
        {olhos && (
          <g>
            <ellipse cx={130} cy={-60} rx={28} ry={36} fill="#fff" {...OL} strokeWidth={5} />
            <ellipse cx={220} cy={-50} rx={28} ry={36} fill="#fff" {...OL} strokeWidth={5} />
            <circle cx={140} cy={-55} r={14} fill={C.outline} />
            <circle cx={230} cy={-45} r={14} fill={C.outline} />
          </g>
        )}
      </g>
    </Tela>
  );
};

/** Botão de volume (painel de mixagem): `v` 0..1 posição; rótulo "SENSAÇÃO". */
export const Volume: React.FC<{ x: number; y: number; s?: number; v: number; rotulo?: string }> = ({ x, y, s = 1, v, rotulo = "SENSAÇÃO" }) => {
  const ky = 180 - v * 360;
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x={-140} y={-280} width={280} height={560} rx={30} fill="#37474F" {...OL} strokeWidth={10} />
        <rect x={-14} y={-200} width={28} height={400} rx={14} fill="#111" />
        <rect x={-14} y={ky} width={28} height={200 - ky} rx={14} fill={v > 0.6 ? C.red : v > 0.3 ? C.yellow : C.green} />
        {[-180, -90, 0, 90, 180].map((ty) => (
          <path key={ty} d={`M40 ${ty} L80 ${ty}`} stroke="#B0BEC5" strokeWidth={6} />
        ))}
        <rect x={-70} y={ky - 26} width={140} height={52} rx={12} fill="#ECEFF1" {...OL} strokeWidth={6} />
        <text x={0} y={250} textAnchor="middle" fontSize={40} fontWeight={800} fill="#fff" fontFamily="'Baloo 2'">
          {rotulo}
        </text>
      </g>
    </Tela>
  );
};

/** Robozinho de laboratório com um braço que segura a pena. `atraso` mostra o relógio "+0,2 s". */
export const RoboPena: React.FC<{ x: number; y: number; s?: number; atraso?: boolean }> = ({ x, y, s = 1, atraso = false }) => {
  const f = useCurrentFrame();
  const braco = Math.sin(f * 0.3) * 20;
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x={-130} y={-60} width={260} height={240} rx={30} fill="#B0BEC5" {...OL} strokeWidth={9} />
        <rect x={-100} y={-250} width={200} height={170} rx={30} fill="#CFD8DC" {...OL} strokeWidth={9} />
        <path d="M0 -250 L0 -310" {...OL} strokeWidth={9} />
        <circle cx={0} cy={-320} r={18} fill={f % 20 < 10 ? C.red : "#FFCDD2"} {...OL} strokeWidth={5} />
        <rect x={-70} y={-210} width={140} height={70} rx={20} fill="#263238" />
        <circle cx={-35} cy={-175} r={16} fill={"#4DD0E1"} />
        <circle cx={35} cy={-175} r={16} fill={"#4DD0E1"} />
        <rect x={-50} y={0} width={100} height={60} rx={10} fill="#90A4AE" {...OL} strokeWidth={5} />
        <g transform={`translate(130 0) rotate(${-40 + braco})`}>
          <rect x={0} y={-18} width={220} height={36} rx={18} fill="#90A4AE" {...OL} strokeWidth={6} />
          <g transform="translate(230 0) rotate(60)">
            <PenaSvg cor={C.green} />
          </g>
        </g>
        <rect x={-110} y={180} width={80} height={60} rx={12} fill="#78909C" {...OL} strokeWidth={6} />
        <rect x={30} y={180} width={80} height={60} rx={12} fill="#78909C" {...OL} strokeWidth={6} />
        {atraso && (
          <g transform="translate(-130 -380) scale(0.8)">
            <circle r={90} fill="#fff" {...OL} strokeWidth={8} />
            <path d={`M0 0 L0 -60 M0 0 L${Math.sin(f * 0.4) * 50} ${-Math.cos(f * 0.4) * 50}`} {...OL} strokeWidth={8} />
          </g>
        )}
      </g>
    </Tela>
  );
};

/** Rato rindo de cócegas (com ondas ultrassônicas finas saindo). `cocegas` liga o tremor e as ondas. */
export const RatoRindo: React.FC<{ x: number; y: number; s?: number; cocegas?: boolean }> = ({ x, y, s = 1, cocegas = true }) => {
  const f = useCurrentFrame();
  const t = cocegas ? Math.sin(f * 1.6) * 6 : 0;
  return (
    <Tela>
      <g transform={`translate(${x} ${y + t}) scale(${s})`}>
        <path d="M150 60 Q 300 60 320 -40" fill="none" stroke="#F8BBD0" strokeWidth={14} strokeLinecap="round" />
        <ellipse cx={20} cy={30} rx={170} ry={120} fill="#BDBDBD" {...OL} strokeWidth={9} />
        <ellipse cx={20} cy={60} rx={100} ry={60} fill="#EEEEEE" />
        <ellipse cx={-90} cy={-150} rx={60} ry={60} fill="#BDBDBD" {...OL} />
        <ellipse cx={-90} cy={-150} rx={34} ry={34} fill="#F8BBD0" />
        <ellipse cx={60} cy={-160} rx={60} ry={60} fill="#BDBDBD" {...OL} />
        <ellipse cx={60} cy={-160} rx={34} ry={34} fill="#F8BBD0" />
        <ellipse cx={-20} cy={-70} rx={120} ry={100} fill="#BDBDBD" {...OL} strokeWidth={9} />
        <path d="M-70 -90 q 15 -18 30 0 M10 -90 q 15 -18 30 0" fill="none" {...OL} strokeWidth={7} />
        <circle cx={-20} cy={-50} r={14} fill="#F06292" />
        <path d="M-60 -20 Q -20 30 20 -20 Z" fill="#6B1020" {...OL} strokeWidth={5} />
        <path d="M-90 -40 l -80 -10 M-90 -30 l -80 10 M50 -40 l 80 -10 M50 -30 l 80 10" stroke={C.outline} strokeWidth={3} />
        {cocegas &&
          [0, 1, 2].map((i) => {
            const q = ((f + i * 10) % 30) / 30;
            return (
              <path
                key={i}
                d={`M${60 + q * 220} ${-120 - q * 60} q 10 -16 20 0 t 20 0 t 20 0 t 20 0 t 20 0`}
                fill="none"
                stroke={C.violet}
                strokeWidth={5}
                opacity={1 - q}
              />
            );
          })}
      </g>
    </Tela>
  );
};

/** TV com um filme e um balão de "SPOILER!" (piada do final). `spoiler` mostra o "FIM" e o X de graça. */
export const TVSpoiler: React.FC<{ x: number; y: number; s?: number; spoiler?: boolean }> = ({ x, y, s = 1, spoiler = false }) => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x={-260} y={-190} width={520} height={360} rx={30} fill="#5D4037" {...OL} strokeWidth={10} />
        <rect x={-220} y={-155} width={400} height={290} rx={18} fill={spoiler ? "#111" : "#1E88E5"} {...OL} strokeWidth={6} />
        {!spoiler && (
          <g>
            <circle cx={-40 + Math.sin(f * 0.1) * 80} cy={-10} r={40} fill={C.yellow} {...OL} strokeWidth={5} />
            <path d="M-200 110 Q -100 40 0 110 Q 100 40 160 110" fill="#43A047" stroke="none" />
          </g>
        )}
        {spoiler && (
          <text x={-20} y={30} textAnchor="middle" fontSize={110} fontWeight={800} fill="#fff" fontFamily="'Baloo 2'">
            FIM
          </text>
        )}
        <circle cx={220} cy={-80} r={18} fill="#BCAAA4" {...OL} strokeWidth={4} />
        <circle cx={220} cy={0} r={18} fill="#BCAAA4" {...OL} strokeWidth={4} />
        <path d="M-120 -190 L-180 -290 M100 -190 L160 -290" fill="none" {...OL} strokeWidth={8} />
        <rect x={-200} y={170} width={40} height={60} fill="#3E2723" />
        <rect x={160} y={170} width={40} height={60} fill="#3E2723" />
      </g>
    </Tela>
  );
};
