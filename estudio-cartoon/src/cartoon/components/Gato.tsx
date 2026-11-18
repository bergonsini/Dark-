import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";

/** Elementos do vídeo "Como o gato sempre cai de pé?" (SVG 1080x1920, contorno C.outline). */

const W = 1080;
const H = 1920;
const OL = { stroke: C.outline, strokeWidth: 7, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
export const GATO = { pelo: "#F4A340", listra: "#D9822B", barriga: "#FFE0B2", rosa: "#FF8FA3" };

const Tela: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {children}
    </svg>
  </AbsoluteFill>
);

/**
 * Gato laranja de perfil (cabeça à direita). O corpo é dividido em DUAS metades que giram separadas:
 * `viradoFrente`/`viradoTras` 0 = de pé (patas pra baixo) … 1 = de cabeça pra baixo (patas pra cima).
 * É assim que o reflexo de endireitamento funciona: primeiro gira a frente, depois a parte de trás.
 */
export const Gato: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
  viradoFrente?: number;
  viradoTras?: number;
  expr?: "feliz" | "assustado" | "focado" | "orgulhoso";
  medalha?: boolean;
  semCanvas?: boolean;
}> = ({ x, y, s = 1, rot = 0, viradoFrente = 0, viradoTras = 0, expr = "feliz", medalha = false, semCanvas = false }) => {
  const f = useCurrentFrame();
  const sF = Math.cos(viradoFrente * Math.PI);
  const sT = Math.cos(viradoTras * Math.PI);
  const pisca = (f + 13) % 90 < 3;
  const tail = Math.sin(f * 0.15) * 12;
  const g = (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {/* METADE DE TRÁS: corpo, patas traseiras, rabo */}
      <g transform={`scale(1 ${sT})`}>
        <path d={`M-150 -10 C -230 -40, -250 -120, ${-215 + tail} -190`} fill="none" stroke={C.outline} strokeWidth={34} strokeLinecap="round" />
        <path d={`M-150 -10 C -230 -40, -250 -120, ${-215 + tail} -190`} fill="none" stroke={GATO.pelo} strokeWidth={22} strokeLinecap="round" />
        {[-120, -60].map((lx) => (
          <g key={lx}>
            <rect x={lx - 20} y={10} width={40} height={110} rx={18} fill={GATO.pelo} {...OL} />
            <ellipse cx={lx} cy={122} rx={28} ry={14} fill={GATO.barriga} {...OL} strokeWidth={5} />
          </g>
        ))}
        <path d="M0 -70 L-130 -70 Q -175 -70 -175 -10 Q -175 50 -130 50 L0 50 Z" fill={GATO.pelo} {...OL} />
        <path d="M-40 -66 l -10 40 M-80 -66 l -10 40 M-120 -64 l -8 36" stroke={GATO.listra} strokeWidth={10} strokeLinecap="round" />
        <path d="M0 30 L-120 30 Q -150 30 -150 10" fill="none" stroke={GATO.barriga} strokeWidth={14} />
      </g>
      {/* METADE DA FRENTE: corpo, patas dianteiras, cabeça */}
      <g transform={`scale(1 ${sF})`}>
        {[50, 110].map((lx) => (
          <g key={lx}>
            <rect x={lx - 20} y={10} width={40} height={110} rx={18} fill={GATO.pelo} {...OL} />
            <ellipse cx={lx} cy={122} rx={28} ry={14} fill={GATO.barriga} {...OL} strokeWidth={5} />
          </g>
        ))}
        <path d="M-2 -70 L130 -70 Q 175 -70 175 -10 Q 175 50 130 50 L-2 50 Z" fill={GATO.pelo} {...OL} />
        <path d="M40 -66 l 10 40 M80 -66 l 10 40" stroke={GATO.listra} strokeWidth={10} strokeLinecap="round" />
        <g transform="translate(190 -90)">
          <path d="M-60 -40 L-50 -120 L-10 -70 Z M60 -40 L50 -120 L10 -70 Z" fill={GATO.pelo} {...OL} />
          <path d="M-48 -60 L-44 -100 L-24 -74 Z M48 -60 L44 -100 L24 -74 Z" fill={GATO.rosa} />
          <circle cx={0} cy={0} r={82} fill={GATO.pelo} {...OL} />
          <path d="M-30 -78 l 6 26 M0 -82 l 0 28 M30 -78 l -6 26" stroke={GATO.listra} strokeWidth={8} strokeLinecap="round" />
          {pisca ? (
            <path d="M-46 -6 q 16 10 32 0 M14 -6 q 16 10 32 0" fill="none" {...OL} strokeWidth={6} />
          ) : (
            <>
              <ellipse cx={-30} cy={-8} rx={18} ry={expr === "assustado" ? 26 : 22} fill="#C5E86C" {...OL} strokeWidth={5} />
              <ellipse cx={30} cy={-8} rx={18} ry={expr === "assustado" ? 26 : 22} fill="#C5E86C" {...OL} strokeWidth={5} />
              <ellipse cx={-30} cy={-8} rx={expr === "focado" ? 4 : 8} ry={16} fill={C.outline} />
              <ellipse cx={30} cy={-8} rx={expr === "focado" ? 4 : 8} ry={16} fill={C.outline} />
              {expr === "focado" && <path d="M-52 -36 L-10 -28 M10 -28 L52 -36" {...OL} strokeWidth={7} />}
            </>
          )}
          <path d="M-10 20 L10 20 L0 32 Z" fill={GATO.rosa} {...OL} strokeWidth={4} />
          {expr === "assustado" ? (
            <ellipse cx={0} cy={50} rx={14} ry={18} fill="#6B1020" {...OL} strokeWidth={4} />
          ) : (
            <path d="M-20 40 Q -10 52 0 40 Q 10 52 20 40" fill="none" {...OL} strokeWidth={5} />
          )}
          <path d="M-30 30 L-95 18 M-30 40 L-95 46 M30 30 L95 18 M30 40 L95 46" stroke={C.outline} strokeWidth={4} />
          {medalha && (
            <g>
              <path d="M-30 70 L0 120 L30 70" fill="none" stroke="#3A86FF" strokeWidth={12} />
              <circle cx={0} cy={130} r={28} fill="#FFC21A" {...OL} strokeWidth={5} />
            </g>
          )}
        </g>
      </g>
    </g>
  );
  return semCanvas ? g : <Tela>{g}</Tela>;
};

/** Lupa no ouvido interno: labirinto (caracol + canais) e uma "bolha de nível" que aponta pro CHÃO. */
export const OuvidoInterno: React.FC<{ x: number; y: number; s?: number; aponta?: number }> = ({ x, y, s = 1, aponta = 0 }) => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <circle cx={0} cy={0} r={260} fill="#FFF3E0" {...OL} strokeWidth={14} />
        <path d="M180 180 L300 300" {...OL} strokeWidth={34} />
        <g fill="none" stroke="#FF8FA3" strokeWidth={22} strokeLinecap="round">
          <path d="M-60 40 a 50 50 0 1 1 50 50 a 30 30 0 1 1 -30 -30" />
          <path d="M0 -20 q 40 -140 120 -60 q 40 60 -40 60" />
          <path d="M10 -40 q -80 -120 -150 -30" />
        </g>
        <g transform={`translate(0 150)`}>
          <rect x={-130} y={-30} width={260} height={60} rx={30} fill="#BFE6FF" {...OL} strokeWidth={6} />
          <circle cx={Math.sin(f * 0.2) * 80 * (1 - aponta)} cy={0} r={22} fill="#fff" {...OL} strokeWidth={4} />
        </g>
        {aponta > 0 && (
          <g opacity={aponta}>
            <path d="M0 210 L0 330" stroke={C.red} strokeWidth={22} strokeLinecap="round" />
            <path d="M-50 290 L0 350 L50 290" fill="none" stroke={C.red} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
      </g>
    </Tela>
  );
};

/** Raio X do gato: coluna em "contas" que dobra (flexível) e uma clavícula SOLTA, sem prender no resto. */
export const RaioXGato: React.FC<{ x: number; y: number; s?: number; dobra?: number; clavicula?: number }> = ({ x, y, s = 1, dobra = 0, clavicula = 0 }) => {
  const f = useCurrentFrame();
  const n = 14;
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x={-460} y={-330} width={920} height={660} rx={30} fill="#0D2238" {...OL} strokeWidth={10} />
        <path d="M-300 40 Q -340 -120 -200 -90 L 220 -90 Q 330 -170 380 -60 Q 400 40 300 40 Z" fill="none" stroke="#5FA8D3" strokeWidth={6} opacity={0.6} />
        {Array.from({ length: n }).map((_, i) => {
          const t = i / (n - 1);
          const px = -300 + t * 600;
          const py = -40 + Math.sin(t * Math.PI * 2 + f * 0.12) * 70 * dobra;
          return <rect key={i} x={px - 18} y={py - 22} width={36} height={44} rx={10} fill="#E3F2FD" stroke="#9EC9E8" strokeWidth={4} />;
        })}
        <g transform={`translate(${200 + Math.sin(f * 0.3) * 20 * clavicula} ${40 + Math.cos(f * 0.25) * 16 * clavicula}) rotate(${Math.sin(f * 0.2) * 20 * clavicula})`} opacity={clavicula > 0 ? 1 : 0.4}>
          <path d="M-50 0 Q 0 -24 50 0" fill="none" stroke="#FFF59D" strokeWidth={16} strokeLinecap="round" />
        </g>
      </g>
    </Tela>
  );
};

/** Toalha sendo torcida (a frente gira pra um lado e a de trás pro outro). `torce` 0..1. */
export const Toalha: React.FC<{ x: number; y: number; s?: number; torce: number }> = ({ x, y, s = 1, torce }) => (
  <Tela>
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {Array.from({ length: 8 }).map((_, i) => {
        const t = i / 7;
        const sk = (t - 0.5) * 2 * torce;
        return (
          <g key={i} transform={`translate(${-280 + i * 80} 0) scale(1 ${Math.cos(sk * 1.2)})`}>
            <rect x={-40} y={-90} width={80} height={180} fill={i % 2 ? "#4FC3F7" : "#FFFFFF"} {...OL} strokeWidth={5} />
          </g>
        );
      })}
    </g>
  </Tela>
);

/** Janela de apartamento: com `tela`, rede de proteção (e o gato seguro); sem, um X vermelho. */
export const JanelaTela: React.FC<{ x: number; y: number; s?: number; tela: boolean }> = ({ x, y, s = 1, tela }) => (
  <Tela>
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-220} y={-280} width={440} height={560} rx={10} fill="#8FD3FF" {...OL} strokeWidth={14} />
      <g fill="#fff">
        <ellipse cx={-60} cy={-160} rx={90} ry={34} />
        <ellipse cx={90} cy={-80} rx={70} ry={26} />
      </g>
      <rect x={-260} y={270} width={520} height={40} fill="#EEE" {...OL} />
      {tela ? (
        <g stroke="#555" strokeWidth={3} opacity={0.8}>
          {Array.from({ length: 12 }).map((_, i) => (
            <path key={`v${i}`} d={`M${-220 + i * 40} -280 L${-220 + i * 40} 280`} />
          ))}
          {Array.from({ length: 15 }).map((_, i) => (
            <path key={`h${i}`} d={`M-220 ${-280 + i * 40} L220 ${-280 + i * 40}`} />
          ))}
        </g>
      ) : (
        <path d="M-160 -200 L160 200 M160 -200 L-160 200" stroke={C.red} strokeWidth={30} strokeLinecap="round" />
      )}
    </g>
  </Tela>
);
