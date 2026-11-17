import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";

/** Elementos do vídeo "Por que a cebola faz chorar?" (SVG 1080x1920, contorno C.outline). */

const W = 1080;
const H = 1920;
const OL = { stroke: C.outline, strokeWidth: 7, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
export const CEB = { casca: "#B5651D", cascaClara: "#D9913F", polpa: "#F3E8FF", anel: "#D7B8F0", gas: "#C6F04A", lagrima: "#7FD3FF" };

const Tela: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {children}
    </svg>
  </AbsoluteFill>
);

/** A cebola-personagem: bulbo dourado com rostinho. `corte` 0..1 separa as metades e mostra os anéis. */
export const CebolaPersonagem: React.FC<{
  x: number;
  y: number;
  s?: number;
  expr?: "feliz" | "malandra" | "chorando" | "surpresa";
  corte?: number;
  /** modo sertanejo: chapéu de vaqueiro, violão e notinhas de sofrência */
  sertaneja?: boolean;
  /** 0..1: o chapéu sai voando */
  chapeuVoa?: number;
}> = ({ x, y, s = 1, expr = "feliz", corte = 0, sertaneja = false, chapeuVoa = 0 }) => {
  const f = useCurrentFrame();
  const bob = Math.sin(f * 0.12) * 6;
  const abre = corte * 120;
  const metade = (lado: -1 | 1) => (
    <g transform={`translate(${lado * abre} 0) rotate(${lado * corte * 12} 0 0)`}>
      <clipPath id={`meia${lado}${x}${y}`}>
        <rect x={lado < 0 ? -260 : 0} y={-420} width={260} height={520} />
      </clipPath>
      <g clipPath={`url(#meia${lado}${x}${y})`}>
        <path d="M0 -300 C 140 -300, 220 -160, 210 -40 C 200 60, 110 100, 0 100 C -110 100, -200 60, -210 -40 C -220 -160, -140 -300, 0 -300 Z" fill={corte > 0 ? CEB.polpa : CEB.casca} {...OL} />
        {corte > 0 &&
          [170, 130, 90, 50].map((r, i) => (
            <ellipse key={i} cx={0} cy={-90} rx={r} ry={r * 1.05} fill="none" stroke={CEB.anel} strokeWidth={10} />
          ))}
        {corte === 0 && <path d="M-150 -150 Q -90 -40 -120 60 M150 -150 Q 90 -40 120 60" fill="none" stroke={CEB.cascaClara} strokeWidth={10} />}
      </g>
    </g>
  );
  return (
    <Tela>
      <g transform={`translate(${x} ${y + bob}) scale(${s})`}>
        {/* raizinhas e brotinho */}
        <path d="M-30 100 l-20 40 M0 100 l0 46 M30 100 l20 40" fill="none" {...OL} strokeWidth={6} />
        <path d="M0 -300 Q -20 -380 -60 -420 M0 -300 Q 30 -380 70 -410" fill="none" stroke="#4CAF50" strokeWidth={16} strokeLinecap="round" />
        {metade(-1)}
        {metade(1)}
        {sertaneja && (
          <g>
            {/* violão */}
            <g transform={`translate(190 30) rotate(${30 + Math.sin(f * 0.5) * 4})`}>
              <rect x={-14} y={-300} width={28} height={220} fill="#8D6E63" {...OL} strokeWidth={5} />
              <circle cx={0} cy={-40} r={70} fill="#E0A15A" {...OL} />
              <circle cx={0} cy={40} r={86} fill="#E0A15A" {...OL} />
              <circle cx={0} cy={-10} r={22} fill={C.outline} />
              <path d="M-6 -300 L-6 60 M6 -300 L6 60" stroke="#eee" strokeWidth={2} />
            </g>
            {/* notinhas da sofrência */}
            {[0, 1, 2].map((i) => {
              const q = ((f + i * 14) % 42) / 42;
              return (
                <text key={i} x={160 + i * 60 + Math.sin(f * 0.2 + i) * 20} y={-260 - q * 260} fontSize={70} fill={C.outline} opacity={1 - q} fontFamily="'DejaVu Sans', sans-serif">
                  ♪
                </text>
              );
            })}
          </g>
        )}
        {(sertaneja || chapeuVoa > 0) && (
          <g transform={`translate(${chapeuVoa * 520} ${-chapeuVoa * 700}) rotate(${chapeuVoa * 540} 0 -330)`} opacity={chapeuVoa >= 1 ? 0 : 1}>
            <path d="M-240 -300 Q 0 -250 240 -300 Q 200 -260 0 -250 Q -200 -260 -240 -300 Z" fill="#8D5524" {...OL} />
            <path d="M-120 -290 Q -130 -420 0 -410 Q 130 -420 120 -290 Z" fill="#A0652F" {...OL} />
            <path d="M-118 -320 L118 -320" stroke="#5D3A1A" strokeWidth={16} />
          </g>
        )}
        {corte < 0.3 && (
          <g>
            {expr === "chorando" ? (
              <path d="M-90 -120 q 30 -20 60 0 M30 -120 q 30 -20 60 0" fill="none" {...OL} strokeWidth={8} />
            ) : (
              <>
                <ellipse cx={-60} cy={-120} rx={30} ry={expr === "surpresa" ? 40 : 34} fill="#fff" {...OL} strokeWidth={6} />
                <ellipse cx={60} cy={-120} rx={30} ry={expr === "surpresa" ? 40 : 34} fill="#fff" {...OL} strokeWidth={6} />
                <circle cx={-54} cy={-114} r={13} fill={C.outline} />
                <circle cx={66} cy={-114} r={13} fill={C.outline} />
                {expr === "malandra" && <path d="M-96 -146 L-26 -132 M26 -132 L96 -146" {...OL} strokeWidth={9} />}
              </>
            )}
            <path
              d={expr === "malandra" ? "M-50 -40 Q 0 -10 60 -50" : expr === "surpresa" ? "M-20 -40 a 20 24 0 1 0 40 0 a 20 24 0 1 0 -40 0" : "M-50 -50 Q 0 0 50 -50"}
              fill={expr === "surpresa" ? "#6B1020" : "none"}
              {...OL}
              strokeWidth={8}
            />
            <ellipse cx={-110} cy={-70} rx={22} ry={12} fill="#FF7AB6" opacity={0.5} />
            <ellipse cx={110} cy={-70} rx={22} ry={12} fill="#FF7AB6" opacity={0.5} />
          </g>
        )}
      </g>
    </Tela>
  );
};

/** Faca de cozinha. `ang` em graus; origem no cabo. */
export const Faca: React.FC<{ x: number; y: number; s?: number; ang?: number; brilho?: boolean }> = ({ x, y, s = 1, ang = 0, brilho = false }) => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) rotate(${ang}) scale(${s})`}>
        <rect x={-180} y={-30} width={180} height={60} rx={20} fill="#6D4C41" {...OL} />
        <path d="M0 -36 L420 -36 Q 440 0 380 40 L0 40 Z" fill="#CFD8DC" {...OL} />
        <path d="M30 -12 L360 -12" stroke="#fff" strokeWidth={8} strokeLinecap="round" />
        {brilho && (
          <path
            transform={`translate(${300 + Math.sin(f * 0.3) * 40} -40) scale(${0.8 + Math.abs(Math.sin(f * 0.25)) * 0.6})`}
            d="M0 -30 L8 -8 L30 0 L8 8 L0 30 L-8 8 L-30 0 L-8 -8 Z"
            fill="#fff"
            stroke={C.yellow}
            strokeWidth={4}
          />
        )}
      </g>
    </Tela>
  );
};

/**
 * Células da cebola vistas "de perto": cada célula guarda dois ingredientes SEPARADOS (bolinhas amarelas e roxas).
 * `rompe` 0..1: as paredes se partem e os ingredientes se misturam (viram verdes = a reação).
 */
export const Celulas: React.FC<{ cx: number; cy: number; rompe?: number }> = ({ cx, cy, rompe = 0 }) => {
  const f = useCurrentFrame();
  const cel: React.ReactNode[] = [];
  let k = 0;
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 3; c++) {
      k++;
      const x = cx - 330 + c * 220 + (r % 2) * 40;
      const y = cy - 360 + r * 180;
      const quebra = Math.max(0, Math.min(1, rompe * 1.6 - (k % 4) * 0.12));
      cel.push(
        <g key={k}>
          <rect x={x} y={y} width={200} height={160} rx={36} fill="#F7EEFF" stroke={C.outline} strokeWidth={7} strokeDasharray={quebra > 0.2 ? "40 26" : undefined} />
          {[0, 1, 2].map((i) => {
            const mx = x + 50 + i * 50 + Math.sin(f * 0.2 + i + k) * 30 * quebra;
            const my = y + 50 + Math.cos(f * 0.17 + i * 2 + k) * 30 * quebra;
            return <circle key={`a${i}`} cx={quebra > 0.5 ? mx : x + 40 + i * 24} cy={quebra > 0.5 ? my : y + 50} r={13} fill={quebra > 0.7 ? CEB.gas : C.yellow} stroke={C.outline} strokeWidth={4} />;
          })}
          {[0, 1, 2].map((i) => {
            const mx = x + 50 + i * 50 + Math.cos(f * 0.19 + i + k) * 30 * quebra;
            const my = y + 110 + Math.sin(f * 0.21 + i + k) * 30 * quebra;
            return <circle key={`b${i}`} cx={quebra > 0.5 ? mx : x + 110 + i * 24} cy={quebra > 0.5 ? my : y + 110} r={13} fill={quebra > 0.7 ? CEB.gas : C.violet} stroke={C.outline} strokeWidth={4} />;
          })}
          {quebra <= 0.2 && <path d={`M${x + 100} ${y + 14} L${x + 100} ${y + 146}`} stroke="#C9B6E4" strokeWidth={6} strokeDasharray="10 10" />}
        </g>,
      );
    }
  return <Tela>{cel}</Tela>;
};

/** O gás (fator lacrimogêneo): nuvenzinha verde-amarelada com cara de travessa, voando de (x0,y0) até (x1,y1). */
export const GasTravesso: React.FC<{ x0: number; y0: number; x1: number; y1: number; t: number; s?: number }> = ({ x0, y0, x1, y1, t, s = 1 }) => {
  const f = useCurrentFrame();
  if (t <= 0) return null;
  const tt = Math.min(1, t);
  const x = x0 + (x1 - x0) * tt + Math.sin(f * 0.3) * 20;
  const y = y0 + (y1 - y0) * tt - Math.sin(tt * Math.PI) * 160;
  return (
    <Tela>
      {[0.15, 0.3, 0.45].map((d, i) => {
        const td = Math.max(0, tt - d);
        return <circle key={i} cx={x0 + (x1 - x0) * td} cy={y0 + (y1 - y0) * td - Math.sin(td * Math.PI) * 160} r={(18 - i * 4) * s} fill={CEB.gas} opacity={0.5} />;
      })}
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M-90 30 Q -120 -20 -70 -40 Q -60 -90 0 -80 Q 60 -100 80 -40 Q 130 -20 100 30 Z" fill={CEB.gas} {...OL} opacity={0.92} />
        <path d="M-40 -30 l20 8 M40 -30 l-20 8" {...OL} strokeWidth={7} />
        <circle cx={-26} cy={-14} r={8} fill={C.outline} />
        <circle cx={26} cy={-14} r={8} fill={C.outline} />
        <path d="M-24 8 Q 0 26 26 6" fill="none" {...OL} strokeWidth={6} />
      </g>
    </Tela>
  );
};

/** Olho gigante: `irrita` 0..1 (veias vermelhas, pálpebra pesada) e `lagrimas` 0..1 (escorrendo). */
export const OlhoChorao: React.FC<{ x: number; y: number; s?: number; irrita?: number; lagrimas?: number }> = ({ x, y, s = 1, irrita = 0, lagrimas = 0 }) => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M-300 0 Q 0 -230 300 0 Q 0 230 -300 0 Z" fill="#fff" {...OL} strokeWidth={10} />
        {irrita > 0 && (
          <g stroke="#E53935" strokeWidth={5} fill="none" opacity={irrita}>
            <path d="M-260 0 q 40 -10 70 -40 M-250 20 q 60 0 90 30 M250 -10 q -50 -10 -80 -40 M240 30 q -50 0 -90 30" />
          </g>
        )}
        <circle cx={0} cy={0} r={110} fill="#5D9CEC" {...OL} />
        <circle cx={0} cy={0} r={52} fill={C.outline} />
        <circle cx={30} cy={-34} r={18} fill="#fff" />
        <path d={`M-300 0 Q 0 ${-230 + irrita * 150} 300 0`} fill="#F2C29B" opacity={irrita * 0.9} {...OL} strokeWidth={10} />
        {lagrimas > 0 &&
          [-200, -120, 150, 220].map((lx, i) => {
            const q = ((f * 1.4 + i * 9) % 30) / 30;
            return (
              <path
                key={i}
                d={`M${lx} ${80 + q * 380 * lagrimas} q 22 34 0 46 q -22 -12 0 -46 Z`}
                fill={CEB.lagrima}
                {...OL}
                strokeWidth={4}
                opacity={lagrimas * (1 - q * 0.4)}
              />
            );
          })}
        {lagrimas > 0.4 && <path d="M-220 110 Q -230 300 -200 520 M200 110 Q 210 300 180 520" fill="none" stroke={CEB.lagrima} strokeWidth={30} strokeLinecap="round" opacity={0.7} />}
      </g>
    </Tela>
  );
};

/** Troféu dourado (IgNobel). */
export const Trofeu: React.FC<{ x: number; y: number; s?: number; texto?: string }> = ({ x, y, s = 1, texto = "IG NOBEL" }) => (
  <Tela>
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-140 -360 L140 -360 Q 140 -160 0 -120 Q -140 -160 -140 -360 Z" fill="#FFC21A" {...OL} />
      <path d="M-140 -330 Q -230 -330 -200 -240 Q -180 -190 -110 -180 M140 -330 Q 230 -330 200 -240 Q 180 -190 110 -180" fill="none" {...OL} strokeWidth={14} />
      <rect x={-26} y={-125} width={52} height={80} fill="#E5A800" {...OL} />
      <rect x={-110} y={-50} width={220} height={60} rx={10} fill="#6D4C41" {...OL} />
      <text x={0} y={-6} textAnchor="middle" fontSize={34} fontWeight={800} fill="#FFC21A" fontFamily="'Baloo 2'">
        {texto}
      </text>
      <text x={0} y={-240} textAnchor="middle" fontSize={70} fontWeight={800} fill="#fff" stroke={C.outline} strokeWidth={8} paintOrder="stroke" fontFamily="'Baloo 2'">
        🧅
      </text>
    </g>
  </Tela>
);

/** Bandeira do Japão. */
export const BandeiraJapao: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <Tela>
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-12} y={-20} width={14} height={340} fill="#8D6E63" {...OL} strokeWidth={5} />
      <rect x={0} y={-20} width={260} height={170} fill="#fff" {...OL} />
      <circle cx={130} cy={65} r={50} fill="#BC002D" />
    </g>
  </Tela>
);

/** Geladeira com a cebola dentro, geladinha (floquinhos). `abre` 0..1. */
export const GeladeiraCebola: React.FC<{ x: number; y: number; s?: number; abre?: number }> = ({ x, y, s = 1, abre = 1 }) => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x={-180} y={-700} width={360} height={700} rx={30} fill="#E3F2FD" {...OL} />
        <rect x={-160} y={-680} width={320} height={660} rx={20} fill="#B3E5FC" {...OL} strokeWidth={5} />
        <path d="M-160 -360 L160 -360" {...OL} strokeWidth={6} />
        <ellipse cx={0} cy={-430} rx={70} ry={64} fill={CEB.casca} {...OL} />
        <path d="M0 -494 q -10 -40 -30 -56 M0 -494 q 16 -40 36 -50" fill="none" stroke="#4CAF50" strokeWidth={10} strokeLinecap="round" />
        {[0, 1, 2, 3, 4].map((i) => {
          const q = ((f + i * 11) % 50) / 50;
          return <text key={i} x={-120 + i * 60} y={-600 + q * 220} fontSize={40} fill="#fff" opacity={1 - q}>❄</text>;
        })}
        <g transform={`translate(-180 -700) scale(${1 - abre} 1)`}>
          <rect x={0} y={0} width={360} height={700} rx={30} fill="#ECEFF1" {...OL} />
        </g>
      </g>
    </Tela>
  );
};
