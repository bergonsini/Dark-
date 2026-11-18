import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";

/** Elementos do vídeo "Como surgiu o chocolate?" (SVG 1080x1920, contorno C.outline). */

const W = 1080;
const H = 1920;
const OL = { stroke: C.outline, strokeWidth: 7, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
export const CHOC = { leite: "#8B5A3C", amargo: "#4E2A1A", cacau: "#E89A2C", cacauEsc: "#B86A12", polpa: "#FFF6E3", semente: "#6D3B1F" };

const Tela: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {children}
    </svg>
  </AbsoluteFill>
);

/** Fruto do cacau (cabaça com gomos). `aberto` 0..1 parte ao meio e mostra a polpa branca com as sementes. */
export const Cacau: React.FC<{ x: number; y: number; s?: number; aberto?: number; rosto?: boolean }> = ({ x, y, s = 1, aberto = 0, rosto = true }) => {
  const f = useCurrentFrame();
  const d = aberto * 110;
  const metade = (lado: -1 | 1) => (
    <g transform={`translate(${lado * d} 0) rotate(${lado * aberto * 14})`}>
      <clipPath id={`cac${lado}${x}${y}`}>
        <rect x={lado < 0 ? -200 : 0} y={-320} width={200} height={640} />
      </clipPath>
      <g clipPath={`url(#cac${lado}${x}${y})`}>
        <path d="M0 -300 C 150 -260, 170 200, 0 300 C -170 200, -150 -260, 0 -300 Z" fill={aberto > 0 ? CHOC.polpa : CHOC.cacau} {...OL} />
        {aberto === 0 && <path d="M-60 -250 Q -100 0 -60 260 M60 -250 Q 100 0 60 260 M0 -290 L0 290" fill="none" stroke={CHOC.cacauEsc} strokeWidth={10} />}
        {aberto > 0 &&
          Array.from({ length: 9 }).map((_, i) => (
            <ellipse key={i} cx={(i % 2 ? 40 : -40) * lado * -1} cy={-200 + i * 50} rx={34} ry={22} fill={CHOC.semente} {...OL} strokeWidth={5} />
          ))}
      </g>
    </g>
  );
  return (
    <Tela>
      <g transform={`translate(${x} ${y + Math.sin(f * 0.1) * 6}) scale(${s})`}>
        {metade(-1)}
        {metade(1)}
        {rosto && aberto < 0.2 && (
          <g>
            <circle cx={-40} cy={-40} r={20} fill="#fff" {...OL} strokeWidth={5} />
            <circle cx={40} cy={-40} r={20} fill="#fff" {...OL} strokeWidth={5} />
            <circle cx={-36} cy={-36} r={9} fill={C.outline} />
            <circle cx={44} cy={-36} r={9} fill={C.outline} />
            <path d="M-30 20 Q 0 50 30 20" fill="none" {...OL} strokeWidth={6} />
          </g>
        )}
      </g>
    </Tela>
  );
};

/** Pirâmide maia em degraus, no meio da floresta. */
export const PiramideMaia: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <Tela>
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={-300 + i * 50} y={-90 - i * 90} width={600 - i * 100} height={90} fill={i % 2 ? "#C9A86A" : "#B8955A"} {...OL} />
      ))}
      <rect x={-60} y={-560} width={120} height={110} fill="#A88648" {...OL} />
      <rect x={-50} y={-450} width={100} height={450} fill="#D7BC82" {...OL} strokeWidth={5} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <path key={i} d={`M-50 ${-30 - i * 54} L50 ${-30 - i * 54}`} stroke={C.outline} strokeWidth={4} />
      ))}
    </g>
  </Tela>
);

/** Jarra maia despejando a bebida de cacau de bem alto (pra espumar) + pimenta. `despeja` 0..1. */
export const BebidaMaia: React.FC<{ x: number; y: number; s?: number; despeja?: number; pimenta?: number }> = ({ x, y, s = 1, despeja = 1, pimenta = 0 }) => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <g transform="translate(-140 -520) rotate(-35)">
          <path d="M-80 -90 L80 -90 L100 80 Q 0 130 -100 80 Z" fill="#C0582F" {...OL} />
          <path d="M-60 -20 L60 -20" stroke="#FFD23F" strokeWidth={10} />
        </g>
        {despeja > 0 && <path d={`M-50 -470 Q -30 ${-300} 0 -110`} fill="none" stroke={CHOC.leite} strokeWidth={26 * despeja} strokeLinecap="round" />}
        <path d="M-130 -120 L130 -120 L110 60 Q 0 100 -110 60 Z" fill="#C0582F" {...OL} />
        <path d="M-80 -60 l30 30 l30 -30 l30 30 l30 -30" fill="none" stroke="#FFD23F" strokeWidth={8} />
        <g fill="#E8C9A0" {...OL} strokeWidth={4}>
          {[-90, -40, 10, 60, 100].map((cx, i) => (
            <circle key={i} cx={cx} cy={-128 - Math.abs(Math.sin(f * 0.2 + i)) * 20} r={30} />
          ))}
        </g>
        {pimenta > 0 && (
          <g transform={`translate(240 ${-60 - (1 - pimenta) * 300}) rotate(${-30 + f * 2})`}>
            <path d="M0 0 Q 70 -10 120 60 Q 40 40 0 20 Z" fill="#E53935" {...OL} />
            <path d="M0 10 l -30 -20" stroke="#43A047" strokeWidth={14} strokeLinecap="round" />
          </g>
        )}
      </g>
    </Tela>
  );
};

/** Banca de mercado asteca: o pão custa sementes de cacau; `troco` 0..1 faz as sementinhas caírem na mão. */
export const MercadoAsteca: React.FC<{ x: number; y: number; s?: number; troco?: number }> = ({ x, y, s = 1, troco = 0 }) => (
  <Tela>
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-340} y={-60} width={680} height={260} fill="#A0652F" {...OL} />
      <path d="M-380 -360 L380 -360 L340 -260 L-340 -260 Z" fill="#E8282B" {...OL} />
      <path d="M-300 -260 L-300 -60 M300 -260 L300 -60" {...OL} strokeWidth={14} />
      {/* pão */}
      <ellipse cx={-150} cy={-110} rx={110} ry={56} fill="#E0A15A" {...OL} />
      <path d="M-200 -130 l20 -16 M-150 -136 l20 -16 M-100 -130 l20 -16" stroke="#B5753C" strokeWidth={8} strokeLinecap="round" />
      {/* placa de preço */}
      <rect x={60} y={-230} width={240} height={110} rx={12} fill="#FFF6E3" {...OL} />
      <text x={180} y={-160} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.outline} fontFamily="'Baloo 2'">
        PÃO =
      </text>
      {[0, 1, 2].map((i) => (
        <ellipse key={i} cx={130 + i * 50} cy={-138 + 26} rx={16} ry={11} fill={CHOC.semente} {...OL} strokeWidth={3} />
      ))}
      {/* troco caindo */}
      {troco > 0 &&
        Array.from({ length: 6 }).map((_, i) => (
          <ellipse key={i} cx={120 + (i % 3) * 60} cy={-40 + troco * (200 + (i % 2) * 30)} rx={22} ry={15} fill={CHOC.semente} {...OL} strokeWidth={4} opacity={troco} />
        ))}
    </g>
  </Tela>
);

/** Caravela no mar levando cacau e um saco de AÇÚCAR. */
export const Caravela: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <g transform={`translate(${x} ${y + Math.sin(f * 0.12) * 12}) rotate(${Math.sin(f * 0.1) * 3}) scale(${s})`}>
        <path d="M-300 0 L300 0 L230 120 L-230 120 Z" fill="#8B5A2B" {...OL} />
        <path d="M0 0 L0 -440" {...OL} strokeWidth={14} />
        <path d="M10 -420 Q 220 -300 10 -180 Z" fill="#fff" {...OL} />
        <path d="M-10 -400 Q -200 -290 -10 -170 Z" fill="#FFF6E3" {...OL} />
        <path d="M-60 -330 l40 0 M-60 -300 l40 0 M-35 -350 l0 70" stroke="#E8282B" strokeWidth={10} />
        <rect x={-220} y={-110} width={150} height={110} rx={20} fill="#F5F5F5" {...OL} />
        <text x={-145} y={-45} textAnchor="middle" fontSize={34} fontWeight={800} fill={C.outline} fontFamily="'Baloo 2'">
          AÇÚCAR
        </text>
        <rect x={60} y={-90} width={140} height={90} rx={14} fill={CHOC.cacau} {...OL} />
      </g>
    </Tela>
  );
};

/** Fábrica antiga de tijolo com chaminé soltando fumaça. */
export const FabricaAntiga: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        {[0, 1, 2].map((i) => {
          const q = ((f + i * 14) % 42) / 42;
          return <circle key={i} cx={220 + q * 60} cy={-560 - q * 300} r={50 + q * 50} fill="#9E9E9E" opacity={(1 - q) * 0.8} />;
        })}
        <rect x={180} y={-560} width={80} height={300} fill="#A84B36" {...OL} />
        <path d="M-320 0 L-320 -300 L-200 -380 L-200 -300 L-80 -380 L-80 -300 L40 -380 L40 -300 L320 -300 L320 0 Z" fill="#C0583F" {...OL} />
        {[-240, -120, 0, 120, 240].map((wx) => (
          <rect key={wx} x={wx - 30} y={-220} width={60} height={80} fill="#FFF59D" {...OL} strokeWidth={5} />
        ))}
        <rect x={-50} y={-110} width={100} height={110} fill="#5D4037" {...OL} />
      </g>
    </Tela>
  );
};

/** Barra de chocolate em quadradinhos (com papel). `mordida` tira um pedaço. */
export const BarraChocolate: React.FC<{ x: number; y: number; s?: number; rot?: number; cor?: string; mordida?: boolean }> = ({ x, y, s = 1, rot = 0, cor = CHOC.leite, mordida = false }) => (
  <Tela>
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-200} y={-120} width={400} height={360} rx={10} fill="#E8282B" {...OL} />
      <rect x={-200} y={-120} width={400} height={80} fill="#FFD23F" {...OL} />
      <g>
        {Array.from({ length: 3 }).map((_, c) =>
          Array.from({ length: 4 }).map((__, r) =>
            mordida && c === 2 && r === 0 ? null : (
              <rect key={`${c}-${r}`} x={-180 + c * 125} y={-300 + r * 90} width={115} height={80} rx={8} fill={cor} {...OL} strokeWidth={5} />
            ),
          ),
        )}
      </g>
      {mordida && <path d="M70 -300 q 30 30 0 60 q 40 20 30 60" fill="none" {...OL} strokeWidth={5} />}
    </g>
  </Tela>
);

/** Alpes suíços com bandeira e uma vaquinha (o leite do chocolate ao leite). */
export const AlpesVaca: React.FC<{ y?: number }> = ({ y = 1300 }) => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <path d={`M-40 ${y} L260 ${y - 520} L420 ${y - 300} L620 ${y - 640} L900 ${y - 260} L1120 ${y - 420} L1120 ${y} Z`} fill="#90A4AE" {...OL} />
      <path d={`M260 ${y - 520} L320 ${y - 430} L280 ${y - 410} L220 ${y - 450} Z M620 ${y - 640} L690 ${y - 530} L640 ${y - 510} L570 ${y - 560} Z`} fill="#fff" {...OL} strokeWidth={5} />
      <g transform={`translate(860 ${y - 520})`}>
        <path d="M0 0 L0 220" {...OL} strokeWidth={8} />
        <rect x={0} y={0} width={130} height={130} fill="#E53935" {...OL} />
        <path d="M65 25 L65 105 M25 65 L105 65" stroke="#fff" strokeWidth={22} />
      </g>
      <g transform={`translate(330 ${y - 30})`}>
        <rect x={-110} y={-130} width={220} height={120} rx={40} fill="#fff" {...OL} />
        <ellipse cx={-30} cy={-90} rx={40} ry={26} fill={C.outline} />
        {[-80, -40, 40, 80].map((lx) => (
          <rect key={lx} x={lx - 12} y={-20} width={24} height={60} fill="#fff" {...OL} strokeWidth={5} />
        ))}
        <g transform={`translate(130 ${-140 + Math.sin(f * 0.15) * 4})`}>
          <rect x={-50} y={-40} width={110} height={90} rx={30} fill="#fff" {...OL} />
          <ellipse cx={30} cy={30} rx={34} ry={20} fill="#FF8FA3" {...OL} strokeWidth={4} />
          <circle cx={-10} cy={-6} r={8} fill={C.outline} />
          <circle cx={30} cy={-6} r={8} fill={C.outline} />
          <path d="M-50 -40 l -20 -30 M50 -40 l 20 -30" {...OL} strokeWidth={8} />
        </g>
      </g>
    </Tela>
  );
};
