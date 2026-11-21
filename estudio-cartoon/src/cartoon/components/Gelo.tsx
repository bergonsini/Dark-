import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";

/** Elementos do vídeo "Por que o gelo boia?" (SVG 1080x1920, contorno C.outline). */

const OL = { stroke: C.outline, strokeWidth: 7, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const AGUA = "#7cc8f2";
const AGUA_ESC = "#3f9fd6";
const GELO = "#e6f7ff";

const Tela: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {children}
    </svg>
  </AbsoluteFill>
);

/** Cubo de gelo cartoon (com brilho e carinha opcional). */
const Cubo: React.FC<{ x: number; y: number; s?: number; rot?: number; rosto?: "feliz" | "susto" | null }> = ({ x, y, s = 1, rot = 0, rosto = "feliz" }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-80} y={-80} width={160} height={160} rx={26} fill={GELO} {...OL} />
    <path d="M-55 -50 L-20 -50 M-55 -30 L-40 -30" stroke="#fff" strokeWidth={12} strokeLinecap="round" />
    <path d="M30 40 Q50 30 55 10" fill="none" stroke="#b5e3f7" strokeWidth={8} strokeLinecap="round" />
    {rosto && (
      <g>
        <circle cx={-25} cy={0} r={9} fill={C.outline} />
        <circle cx={25} cy={0} r={9} fill={C.outline} />
        {rosto === "feliz" ? <path d="M-18 25 Q0 40 18 25" fill="none" {...OL} strokeWidth={6} /> : <ellipse cx={0} cy={30} rx={10} ry={13} fill={C.outline} />}
      </g>
    )}
  </g>
);

/**
 * Copo d'água: à esquerda o cubo de gelo boiando, e (opcional) um bloco "sólido comum" afundando para comparação.
 * `afunda` 0..1 leva o bloco cinza ao fundo; `boia` 0..1 faz o gelo subir até flutuar.
 */
export const CopoGelo: React.FC<{ x: number; y: number; s?: number; boia?: number; comparar?: boolean; afunda?: number }> = ({ x, y, s = 1, boia = 1, comparar = false, afunda = 0 }) => {
  const f = useCurrentFrame();
  const bob = Math.sin(f * 0.12) * 6;
  const yGelo = -120 + (1 - boia) * 260 + bob;
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M-260 -320 L260 -320 L220 300 Q0 330 -220 300 Z" fill="#f4fbff" opacity={0.6} {...OL} strokeWidth={9} />
        <path d="M-245 -140 L245 -140 L220 300 Q0 330 -220 300 Z" fill={AGUA} opacity={0.85} />
        <path d={`M-245 -140 Q -120 ${-152 + bob * 0.3} 0 -140 T 245 -140`} fill="none" stroke="#fff" strokeWidth={8} opacity={0.8} />
        <Cubo x={comparar ? -90 : 0} y={yGelo} s={0.9} rot={Math.sin(f * 0.07) * 6} rosto="feliz" />
        {comparar && (
          <g transform={`translate(110 ${-60 + afunda * 290})`}>
            <rect x={-62} y={-62} width={124} height={124} rx={14} fill="#9aa3ae" {...OL} />
            <circle cx={-18} cy={-4} r={8} fill={C.outline} />
            <circle cx={18} cy={-4} r={8} fill={C.outline} />
            <ellipse cx={0} cy={26} rx={9} ry={12} fill={C.outline} />
          </g>
        )}
        <path d="M-200 -300 L-180 260" stroke="#fff" strokeWidth={14} strokeLinecap="round" opacity={0.6} />
      </g>
    </Tela>
  );
};

/**
 * Moléculas de água (O vermelho + 2 H brancos). `k` 0..1: 0 = líquido (bagunçadas e juntinhas, se mexendo),
 * 1 = gelo (rede hexagonal "de mãos dadas", com buracos no meio). `maos` mostra as ligações.
 */
export const Moleculas: React.FC<{ x: number; y: number; s?: number; k: number }> = ({ x, y, s = 1, k }) => {
  const f = useCurrentFrame();
  // posições do gelo: dois hexágonos lado a lado (rede aberta)
  const R = 150;
  const hex = (cx: number, cy: number) => Array.from({ length: 6 }).map((_, i) => [cx + Math.cos((i / 6) * Math.PI * 2 + Math.PI / 6) * R, cy + Math.sin((i / 6) * Math.PI * 2 + Math.PI / 6) * R]);
  const pontosGelo = [...hex(-130, -130), ...hex(130, 130)].slice(0, 12);
  const pontosLiq = Array.from({ length: 12 }).map((_, i) => [Math.sin(i * 2.4) * 120 + Math.sin(f * 0.15 + i) * 22, Math.cos(i * 1.7) * 140 + Math.cos(f * 0.13 + i * 2) * 22]);
  const pts = pontosGelo.map(([gx, gy], i) => [pontosLiq[i][0] + (gx - pontosLiq[i][0]) * k, pontosLiq[i][1] + (gy - pontosLiq[i][1]) * k]);
  const ligacoes: [number, number][] = [];
  for (let h = 0; h < 2; h++) for (let i = 0; i < 6; i++) ligacoes.push([h * 6 + i, h * 6 + ((i + 1) % 6)]);
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        {k > 0.6 &&
          ligacoes.map(([a, b], i) => (
            <path key={i} d={`M${pts[a][0]} ${pts[a][1]} L${pts[b][0]} ${pts[b][1]}`} stroke={C.yellow} strokeWidth={10} strokeDasharray="14 10" opacity={(k - 0.6) / 0.4} />
          ))}
        {k > 0.85 && [[-130, -130], [130, 130]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={60} fill="#fff" opacity={0.35} stroke="#9fd8ff" strokeWidth={5} strokeDasharray="10 8" />)}
        {pts.map(([px, py], i) => {
          const a = k * 0.5 + i;
          return (
            <g key={i} transform={`translate(${px} ${py}) rotate(${(a * 57) % 360})`}>
              <circle cx={-34} cy={-26} r={20} fill="#fff" {...OL} strokeWidth={5} />
              <circle cx={34} cy={-26} r={20} fill="#fff" {...OL} strokeWidth={5} />
              <circle r={36} fill="#ef5350" {...OL} strokeWidth={6} />
              <circle cx={-10} cy={-10} r={8} fill="#fff" opacity={0.7} />
            </g>
          );
        })}
      </g>
    </Tela>
  );
};

/** Iceberg cortado pela linha d'água: 10% acima, 90% abaixo. */
export const Iceberg: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useCurrentFrame();
  const bob = Math.sin(f * 0.08) * 8;
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x={-540} y={-60} width={1080} height={820} fill={AGUA_ESC} opacity={0.9} />
        <path d={`M-540 -60 Q -270 ${-80 + bob} 0 -60 T 540 -60`} fill="none" stroke="#fff" strokeWidth={8} />
        <g transform={`translate(0 ${bob})`}>
          <path d="M-60 -60 L-20 -170 L30 -120 L70 -60 Z" fill="#fff" {...OL} />
          <path d="M-60 -60 L70 -60 L230 120 L180 380 L40 560 L-150 500 L-250 260 L-200 60 Z" fill="#cdeefc" opacity={0.9} {...OL} />
          <path d="M-120 100 L-40 260 M60 160 L120 330" stroke="#fff" strokeWidth={8} opacity={0.6} strokeLinecap="round" />
        </g>
      </g>
    </Tela>
  );
};

/** Congelador aberto com uma garrafa de vidro que racha. `racha` 0..1; `gelo` 0..1 (a água dentro vira gelo). */
export const GarrafaCongelador: React.FC<{ x: number; y: number; s?: number; racha: number; gelo: number }> = ({ x, y, s = 1, racha, gelo }) => {
  const f = useCurrentFrame();
  const treme = racha > 0.2 && racha < 1 ? Math.sin(f * 2.5) * 6 : 0;
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x={-330} y={-420} width={660} height={760} rx={40} fill="#eef3f7" {...OL} strokeWidth={10} />
        <rect x={-290} y={-380} width={580} height={680} rx={24} fill="#d8ecf7" {...OL} strokeWidth={6} />
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M${-250 + i * 120} -380 l 20 40 l 20 -40`} fill="#fff" {...OL} strokeWidth={4} />
        ))}
        <g transform={`translate(${treme} 40)`}>
          <path d="M-30 -300 L30 -300 L30 -220 Q 110 -170 110 -80 L110 220 Q 110 250 80 250 L-80 250 Q -110 250 -110 220 L-110 -80 Q -110 -170 -30 -220 Z" fill="#a7e3c9" opacity={0.75} {...OL} />
          <path d={`M-104 ${250 - 300 - gelo * 30} L104 ${250 - 300 - gelo * 30} L104 220 Q104 244 80 244 L-80 244 Q-104 244 -104 220 Z`} fill={gelo > 0.5 ? GELO : AGUA} opacity={0.9} />
          <rect x={-34} y={-330} width={68} height={40} rx={8} fill="#e53935" {...OL} strokeWidth={5} />
          {racha > 0 && (
            <g stroke={C.outline} strokeWidth={6} fill="none" strokeLinecap="round" opacity={Math.min(1, racha * 2)}>
              <path d="M-110 -20 L-60 10 L-80 60 L-20 100 L-40 160" />
              {racha > 0.5 && <path d="M110 -60 L60 -10 L90 40 L30 90" />}
              {racha > 0.8 && <path d="M-60 -180 L-20 -120 L-50 -60" />}
            </g>
          )}
        </g>
        {racha >= 1 &&
          [0, 1, 2, 3, 4, 5].map((i) => {
            const a = (i / 6) * Math.PI * 2;
            return <path key={i} d={`M${Math.cos(a) * 150} ${Math.sin(a) * 150 + 40} l ${Math.cos(a) * 60} ${Math.sin(a) * 60}`} stroke={C.yellow} strokeWidth={12} strokeLinecap="round" />;
          })}
      </g>
    </Tela>
  );
};

/** Lago no inverno em corte: neve em cima, camada de gelo, água líquida embaixo com peixinhos nadando. `gelo` 0..1. */
export const LagoInverno: React.FC<{ x: number; y: number; s?: number; gelo: number; cobertor?: boolean }> = ({ x, y, s = 1, gelo, cobertor = false }) => {
  const f = useCurrentFrame();
  const peixe = (px: number, py: number, cor: string, i: number) => {
    const dx = Math.sin(f * 0.05 + i * 2) * 120;
    const dir = Math.cos(f * 0.05 + i * 2) > 0 ? 1 : -1;
    return (
      <g key={i} transform={`translate(${px + dx} ${py + Math.sin(f * 0.2 + i) * 10}) scale(${dir} 1)`}>
        <path d="M-50 0 Q 0 -40 50 0 Q 0 40 -50 0 Z" fill={cor} {...OL} strokeWidth={5} />
        <path d="M-50 0 L-85 -28 L-85 28 Z" fill={cor} {...OL} strokeWidth={5} />
        <circle cx={25} cy={-6} r={7} fill={C.outline} />
        <path d="M35 10 Q 42 14 48 8" fill="none" stroke={C.outline} strokeWidth={4} />
      </g>
    );
  };
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M-540 -260 Q -300 -330 0 -290 Q 300 -330 540 -260 L540 -200 L-540 -200 Z" fill="#fff" {...OL} />
        <path d="M-540 -200 L540 -200 L520 520 Q 0 580 -520 520 Z" fill={AGUA_ESC} {...OL} strokeWidth={9} />
        <rect x={-540} y={-200} width={1080} height={110 * gelo} fill={GELO} {...OL} strokeWidth={6} />
        {gelo > 0.5 && (
          <g stroke="#9fd8ff" strokeWidth={6} opacity={0.8}>
            <path d="M-400 -170 l 60 40 M-100 -175 l 40 50 M250 -170 l 70 35" />
          </g>
        )}
        {cobertor && (
          <g>
            <path d="M-500 -205 Q -250 -240 0 -205 Q 250 -240 500 -205" fill="none" stroke={C.red} strokeWidth={14} strokeDasharray="30 18" />
          </g>
        )}
        {peixe(-200, 120, "#ffb74d", 0)}
        {peixe(150, 260, "#ff8a65", 1)}
        {peixe(-50, 380, "#fff176", 2)}
        {[0, 1, 2, 3].map((i) => {
          const q = ((f + i * 20) % 80) / 80;
          return <circle key={i} cx={-300 + i * 200} cy={480 - q * 380} r={10 + q * 8} fill="none" stroke="#bfe9ff" strokeWidth={4} opacity={1 - q} />;
        })}
      </g>
    </Tela>
  );
};

/** Cobertor de bolinhas cobrindo o Tito (só a cabeça pra fora). */
export const Cobertor: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useCurrentFrame();
  const tre = Math.sin(f * 1.8) * 4;
  return (
    <Tela>
      <g transform={`translate(${x + tre} ${y}) scale(${s})`}>
        <path d="M-230 -120 Q -260 -260 -120 -270 Q 0 -230 120 -270 Q 260 -260 230 -120 Q 260 120 180 220 L-180 220 Q -260 120 -230 -120 Z" fill="#7e57c2" {...OL} strokeWidth={9} />
        {[[-130, -150], [60, -170], [-40, -40], [140, -40], [-150, 60], [40, 90], [150, 150], [-80, 170]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={22} fill="#ffd54f" />
        ))}
      </g>
    </Tela>
  );
};
