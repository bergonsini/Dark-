import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";

/** Elementos do vídeo "Por que a gente soluça?" (SVG 1080x1920, contorno C.outline). */

const W = 1080;
const H = 1920;
const OL = { stroke: C.outline, strokeWidth: 7, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

const Tela: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {children}
    </svg>
  </AbsoluteFill>
);

/**
 * Tronco "por dentro": dois pulmões e o DIAFRAGMA (cúpula vermelha embaixo).
 * `respira` 0..1 anima o sobe-e-desce normal; `tranco` (frame local do espasmo) dá um puxão seco pra baixo.
 */
export const TroncoDiafragma: React.FC<{ x: number; y: number; s?: number; respira?: number; tranco?: number; destaque?: boolean }> = ({
  x,
  y,
  s = 1,
  respira = 1,
  tranco = -999,
  destaque = false,
}) => {
  const f = useCurrentFrame();
  const t = f - tranco;
  const puxao = t >= 0 && t < 14 ? Math.sin((t / 14) * Math.PI) * 90 : 0;
  const mov = Math.sin(f * 0.12) * 30 * respira + puxao;
  const infla = 1 + (mov / 300) * 0.6;
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M-300 -460 Q -330 -100 -280 300 L280 300 Q 330 -100 300 -460 Q 0 -560 -300 -460 Z" fill="#FCE4EC" {...OL} strokeWidth={10} />
        <g transform={`translate(0 ${-140}) scale(1 ${infla}) translate(0 140)`}>
          <path d="M-40 -380 Q -250 -380 -240 -100 Q -230 60 -60 40 Q -30 -100 -40 -380 Z" fill="#F48FB1" {...OL} />
          <path d="M40 -380 Q 250 -380 240 -100 Q 230 60 60 40 Q 30 -100 40 -380 Z" fill="#F48FB1" {...OL} />
          <path d="M0 -480 L0 -380 M0 -380 L-40 -340 M0 -380 L40 -340" fill="none" {...OL} strokeWidth={14} />
        </g>
        <path
          d={`M-270 ${140 + mov} Q 0 ${-40 + mov} 270 ${140 + mov}`}
          fill="none"
          stroke={destaque ? "#E53935" : "#C62828"}
          strokeWidth={destaque ? 34 : 24}
          strokeLinecap="round"
        />
        {puxao > 10 && (
          <g stroke={C.yellow} strokeWidth={10} strokeLinecap="round">
            <path d={`M-200 ${200 + mov} l -30 40 M0 ${130 + mov} l 0 50 M200 ${200 + mov} l 30 40`} />
          </g>
        )}
      </g>
    </Tela>
  );
};

/** Cordas vocais vistas de cima (a "porta" do ar): `fecha` 0..1 fecha num estalo. */
export const CordasVocais: React.FC<{ x: number; y: number; s?: number; fecha?: number }> = ({ x, y, s = 1, fecha = 0 }) => {
  const ab = (1 - fecha) * 0.32;
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <ellipse cx={0} cy={0} rx={240} ry={300} fill="#E57373" {...OL} strokeWidth={10} />
        <ellipse cx={0} cy={0} rx={200} ry={260} fill="#8E2F2F" />
        <g transform={`rotate(${ab * 57.3} 0 -220)`}>
          <path d="M0 -220 Q -40 0 -10 220 L-60 220 Q -110 0 -10 -220 Z" fill="#FFF3E0" {...OL} />
        </g>
        <g transform={`rotate(${-ab * 57.3} 0 -220)`}>
          <path d="M0 -220 Q 40 0 10 220 L60 220 Q 110 0 10 -220 Z" fill="#FFF3E0" {...OL} />
        </g>
      </g>
    </Tela>
  );
};

/** Prato de comida engolida às pressas + lata de refrigerante borbulhando. */
export const PratoRefri: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <ellipse cx={-120} cy={0} rx={200} ry={46} fill="#fff" {...OL} />
        <ellipse cx={-120} cy={-20} rx={120} ry={34} fill="#FFB74D" {...OL} strokeWidth={5} />
        <g stroke={C.outline} strokeWidth={8} strokeLinecap="round">
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${-330 - i * 20} ${-60 + i * 30} l -60 0`} opacity={0.6} />
          ))}
        </g>
        <g transform="translate(210 -10)">
          <rect x={-60} y={-210} width={120} height={210} rx={20} fill="#E53935" {...OL} />
          <rect x={-60} y={-150} width={120} height={60} fill="#fff" {...OL} strokeWidth={5} />
          {[0, 1, 2, 3, 4].map((i) => {
            const q = ((f + i * 8) % 30) / 30;
            return <circle key={i} cx={-30 + i * 15} cy={-220 - q * 160} r={10 + q * 6} fill="none" stroke="#90CAF9" strokeWidth={5} opacity={1 - q} />;
          })}
        </g>
      </g>
    </Tela>
  );
};

/** Calendário com páginas voando: de 1922 a 1990 (68 anos de soluço). `p` 0..1. */
export const Calendario68: React.FC<{ x: number; y: number; s?: number; p: number }> = ({ x, y, s = 1, p }) => {
  const ano = Math.round(1922 + p * 68);
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x={-230} y={-260} width={460} height={420} rx={22} fill="#fff" {...OL} strokeWidth={10} />
        <rect x={-230} y={-260} width={460} height={110} rx={22} fill="#E53935" {...OL} strokeWidth={10} />
        <text x={0} y={-180} textAnchor="middle" fontSize={64} fontWeight={800} fill="#fff" fontFamily="'Baloo 2'">
          ANO
        </text>
        <text x={0} y={60} textAnchor="middle" fontSize={180} fontWeight={800} fill={C.outline} fontFamily="'Baloo 2'">
          {ano}
        </text>
        {p > 0 && p < 1 && (
          <g transform={`translate(${p * 300} ${-p * 400}) rotate(${p * 60})`} opacity={1 - p}>
            <rect x={-200} y={-120} width={400} height={260} fill="#fff" {...OL} strokeWidth={6} />
          </g>
        )}
      </g>
    </Tela>
  );
};

/** Tela de ultrassom com um bebê na barriga soluçando (bolhinhas de "hic"). */
export const Ultrassom: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useCurrentFrame();
  const pulo = f % 30 < 4 ? -14 : 0;
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x={-300} y={-260} width={600} height={460} rx={30} fill="#37474F" {...OL} strokeWidth={10} />
        <path d="M-250 160 L0 -200 L250 160 Z" fill="#111" />
        <g transform={`translate(0 ${20 + pulo})`} fill="#E0E0E0" stroke="none" opacity={0.85}>
          <circle cx={-40} cy={-40} r={60} />
          <ellipse cx={30} cy={40} rx={80} ry={60} />
          <ellipse cx={90} cy={90} rx={30} ry={20} />
        </g>
        {f % 30 < 18 && (
          <text x={110} y={-60 - (f % 30) * 2} fontSize={46} fontWeight={800} fill={C.yellow} fontFamily="'Baloo 2'">
            hic!
          </text>
        )}
      </g>
    </Tela>
  );
};

/** As três simpatias: copo d'água de cabeça pra baixo, fantasma do susto ("BU!"), colher de açúcar. `quais` 0..3 aparecem. */
export const Simpatias: React.FC<{ y: number; quais: number; xis?: number }> = ({ y, quais, xis = 0 }) => (
  <Tela>
    {quais >= 1 && (
      <g transform={`translate(220 ${y}) rotate(160)`}>
        <path d="M-70 -110 L70 -110 L55 110 L-55 110 Z" fill="#E3F2FD" {...OL} />
        <path d="M-64 -40 L64 -40 L55 110 L-55 110 Z" fill="#64B5F6" {...OL} strokeWidth={5} />
      </g>
    )}
    {quais >= 2 && (
      <g transform={`translate(540 ${y})`}>
        <path d="M-100 120 Q -110 -130 0 -140 Q 110 -130 100 120 l -30 -30 l -35 30 l -35 -30 l -35 30 l -35 -30 Z" fill="#fff" {...OL} />
        <ellipse cx={-35} cy={-50} rx={16} ry={24} fill={C.outline} />
        <ellipse cx={35} cy={-50} rx={16} ry={24} fill={C.outline} />
        <ellipse cx={0} cy={10} rx={22} ry={28} fill={C.outline} />
        <text x={110} y={-120} fontSize={60} fontWeight={800} fill={C.outline} fontFamily="'Baloo 2'">
          BU!
        </text>
      </g>
    )}
    {quais >= 3 && (
      <g transform={`translate(860 ${y}) rotate(-20)`}>
        <ellipse cx={0} cy={-60} rx={80} ry={56} fill="#CFD8DC" {...OL} />
        <path d="M-60 -70 Q 0 -120 60 -70" fill="#fff" {...OL} strokeWidth={4} />
        <rect x={-14} y={-10} width={28} height={200} rx={12} fill="#CFD8DC" {...OL} />
      </g>
    )}
    {xis > 0 &&
      [220, 540, 860].map((cx) => (
        <path key={cx} d={`M${cx - 110} ${y - 130} L${cx + 110} ${y + 130} M${cx + 110} ${y - 130} L${cx - 110} ${y + 130}`} stroke={C.red} strokeWidth={22} strokeLinecap="round" opacity={xis} />
      ))}
  </Tela>
);

/** Placa de saúde: cruz + "MAIS DE 2 DIAS? → MÉDICO". */
export const PlacaMedico: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <Tela>
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-300} y={-150} width={600} height={300} rx={30} fill="#fff" {...OL} strokeWidth={10} />
      <rect x={-250} y={-60} width={120} height={120} rx={14} fill="#E53935" />
      <path d="M-190 -40 L-190 40 M-230 0 L-150 0" stroke="#fff" strokeWidth={26} strokeLinecap="round" />
      <text x={70} y={-10} textAnchor="middle" fontSize={56} fontWeight={800} fill={C.outline} fontFamily="'Baloo 2'">
        + DE 2 DIAS?
      </text>
      <text x={70} y={70} textAnchor="middle" fontSize={64} fontWeight={800} fill="#E53935" fontFamily="'Baloo 2'">
        MÉDICO!
      </text>
    </g>
  </Tela>
);
