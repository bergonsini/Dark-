import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";

/** Elementos do vídeo "Por que o bocejo é contagioso?" (SVG 1080x1920, contorno C.outline). */

const OL = { stroke: C.outline, strokeWidth: 7, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

const Tela: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {children}
    </svg>
  </AbsoluteFill>
);

/**
 * Carinha bocejando (rosto redondo grande). `k` 0..1 abre a boca num bocejo enorme, fecha os olhos e solta "aaah".
 * `cor` da pele; `cabelo` opcional.
 */
export const RostoBocejo: React.FC<{ x: number; y: number; s?: number; k: number; cor?: string; cabelo?: string; oculos?: boolean }> = ({ x, y, s = 1, k, cor = "#c98b5e", cabelo = "#3a2414", oculos = false }) => {
  const abre = Math.sin(Math.min(1, k) * Math.PI);
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <circle r={220} fill={cor} {...OL} strokeWidth={10} />
        <path d="M-200 -80 Q -210 -240 0 -250 Q 210 -240 200 -80 Q 120 -180 0 -170 Q -120 -180 -200 -80 Z" fill={cabelo} {...OL} />
        {/* olhos: fechando durante o bocejo */}
        {[-1, 1].map((l) => (
          <g key={l} transform={`translate(${l * 80} -40)`}>
            {abre > 0.4 ? (
              <path d="M-35 0 Q 0 20 35 0" fill="none" {...OL} strokeWidth={9} />
            ) : (
              <>
                <ellipse rx={32} ry={38} fill="#fff" {...OL} strokeWidth={6} />
                <circle cx={6} cy={4} r={15} fill={C.outline} />
              </>
            )}
            {oculos && <circle r={52} fill="none" {...OL} strokeWidth={8} />}
          </g>
        ))}
        {/* lágrima do bocejo */}
        {abre > 0.7 && <path d="M120 -10 q 10 25 0 35 q -10 -10 0 -35 Z" fill="#7fd6ff" {...OL} strokeWidth={3} />}
        {/* boca */}
        <ellipse cx={0} cy={95} rx={40 + abre * 50} ry={12 + abre * 95} fill="#6b1020" {...OL} strokeWidth={7} />
        {abre > 0.3 && <ellipse cx={0} cy={95 + abre * 55} rx={30 + abre * 20} ry={12 + abre * 18} fill="#ff6b8a" />}
      </g>
    </Tela>
  );
};

/** Cérebro com termômetro: `temp` 0..1 (vermelho quente → azul frio) e fluxo de ar azul entrando. */
export const CerebroFrio: React.FC<{ x: number; y: number; s?: number; temp: number; ar?: boolean }> = ({ x, y, s = 1, temp, ar = false }) => {
  const f = useCurrentFrame();
  const cor = `rgb(${Math.round(255 - (255 - 170) * (1 - temp))},${Math.round(150 + 60 * (1 - temp))},${Math.round(170 + 70 * (1 - temp))})`;
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M-260 40 Q -320 -150 -160 -240 Q -40 -320 100 -270 Q 260 -230 290 -80 Q 320 60 200 110 Q 60 150 -60 120 Q -200 140 -260 40 Z" fill={cor} {...OL} strokeWidth={10} />
        <g fill="none" stroke="#c0567a" strokeWidth={9} strokeLinecap="round" opacity={0.7}>
          <path d="M-200 -120 Q -150 -170 -90 -130 Q -40 -90 10 -150" />
          <path d="M40 -220 Q 80 -160 150 -190 Q 210 -210 230 -130" />
          <path d="M-180 10 Q -110 -40 -40 10 Q 30 60 100 0 Q 170 -50 240 10" />
        </g>
        {/* termômetro */}
        <g transform="translate(330 -60)">
          <rect x={-26} y={-180} width={52} height={260} rx={26} fill="#fff" {...OL} strokeWidth={6} />
          <rect x={-12} y={-160 + (1 - temp) * 150} width={24} height={230 - (1 - temp) * 150} rx={12} fill={temp > 0.5 ? C.red : C.blue} />
          <circle cy={90} r={44} fill={temp > 0.5 ? C.red : C.blue} {...OL} strokeWidth={6} />
        </g>
        {ar &&
          [0, 1, 2].map((i) => {
            const q = ((f + i * 12) % 36) / 36;
            return <path key={i} d={`M${-420 + q * 260} ${180 - q * 120 + i * 30} q 40 -30 80 0 t 80 0`} fill="none" stroke="#7fd6ff" strokeWidth={14} strokeLinecap="round" opacity={1 - q} />;
          })}
      </g>
    </Tela>
  );
};

/** Bebê na barriga (ultrassom) bocejando: `k` 0..1 do bocejo. */
export const BebeBarriga: React.FC<{ x: number; y: number; s?: number; k: number }> = ({ x, y, s = 1, k }) => {
  const abre = Math.sin(Math.min(1, k) * Math.PI);
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x={-330} y={-300} width={660} height={560} rx={36} fill="#37474F" {...OL} strokeWidth={10} />
        <path d="M-290 230 L0 -250 L290 230 Z" fill="#111" />
        <g fill="#E0E0E0" opacity={0.9}>
          <circle cx={-10} cy={-20} r={90} />
          <ellipse cx={70} cy={110} rx={120} ry={80} />
          <ellipse cx={-60} cy={-20} rx={10} ry={abre > 0.4 ? 2 : 8} fill="#333" />
          <ellipse cx={30} cy={-20} rx={10} ry={abre > 0.4 ? 2 : 8} fill="#333" />
          <ellipse cx={-15} cy={30} rx={12 + abre * 14} ry={4 + abre * 26} fill="#333" />
        </g>
        {abre > 0.5 && (
          <text x={120} y={-90} fontSize={60} fontWeight={800} fill={C.yellow} fontFamily="'Baloo 2'">
            aaah…
          </text>
        )}
      </g>
    </Tela>
  );
};

/** Corrente de bocejos: N carinhas em fila; cada uma boceja depois da anterior (`f0` início, `passo` frames). */
export const FilaBocejo: React.FC<{ y: number; f0: number; passo?: number; s?: number }> = ({ y, f0, passo = 12, s = 0.42 }) => {
  const f = useCurrentFrame();
  const cores = ["#f2c9a6", "#8d5a3c", "#c98b5e", "#eab593"];
  const cab = ["#d9a441", "#1c1410", "#3a2414", "#9b59d0"];
  return (
    <>
      {[0, 1, 2, 3].map((i) => {
        const t = (f - f0 - i * passo) / 26;
        return <RostoBocejo key={i} x={150 + i * 260} y={y + (i % 2) * 90} s={s} k={Math.max(0, Math.min(1, t))} cor={cores[i]} cabelo={cab[i]} />;
      })}
    </>
  );
};

/** Cachorro sentado (frente) que boceja: `k` 0..1. */
export const Cachorro: React.FC<{ x: number; y: number; s?: number; k: number }> = ({ x, y, s = 1, k }) => {
  const abre = Math.sin(Math.min(1, k) * Math.PI);
  const f = useCurrentFrame();
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d={`M120 160 q 90 ${-40 + Math.sin(f * 0.5) * 20} 130 -100`} fill="none" stroke="#b07a50" strokeWidth={30} strokeLinecap="round" />
        <ellipse cx={0} cy={140} rx={170} ry={150} fill="#d9a06a" {...OL} strokeWidth={9} />
        <ellipse cx={0} cy={170} rx={90} ry={90} fill="#f3d6b4" />
        <ellipse cx={-150} cy={-90} rx={55} ry={110} fill="#8a5a36" {...OL} transform="rotate(20 -150 -90)" />
        <ellipse cx={150} cy={-90} rx={55} ry={110} fill="#8a5a36" {...OL} transform="rotate(-20 150 -90)" />
        <circle cx={0} cy={-60} r={150} fill="#d9a06a" {...OL} strokeWidth={9} />
        <ellipse cx={0} cy={10} rx={80} ry={60} fill="#f3d6b4" />
        {[-1, 1].map((l) => (abre > 0.4 ? <path key={l} d={`M${l * 55 - 25} -90 Q ${l * 55} -75 ${l * 55 + 25} -90`} fill="none" {...OL} strokeWidth={8} /> : <circle key={l} cx={l * 55} cy={-90} r={16} fill={C.outline} />))}
        <ellipse cx={0} cy={-20} rx={26} ry={18} fill={C.outline} />
        <ellipse cx={0} cy={45} rx={25 + abre * 35} ry={6 + abre * 55} fill="#6b1020" {...OL} strokeWidth={6} />
        {abre > 0.4 && <ellipse cx={0} cy={45 + abre * 35} rx={22} ry={14} fill="#ff6b8a" />}
      </g>
    </Tela>
  );
};
