import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, RAINBOW } from "../theme";

/** Sol com rosto (personagem secundário fixo). */
export const Sol: React.FC<{ x: number; y: number; r?: number; cor?: string; feliz?: boolean; piscadela?: number }> = ({
  x,
  y,
  r = 110,
  cor = C.yellow,
  feliz = true,
  piscadela = -999,
}) => {
  const f = useCurrentFrame();
  const rot = f * 0.6;
  const pulse = 1 + Math.sin(f * 0.15) * 0.04;
  const wink = f - piscadela >= 0 && f - piscadela < 14;
  return (
    <svg style={{ position: "absolute", left: x - r * 2, top: y - r * 2, overflow: "visible" }} width={r * 4} height={r * 4} viewBox={`${-r * 2} ${-r * 2} ${r * 4} ${r * 4}`}>
      <g transform={`rotate(${rot}) scale(${pulse})`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <path key={i} d={`M ${-r * 0.16} ${-r * 1.15} L 0 ${-r * 1.6} L ${r * 0.16} ${-r * 1.15} Z`} transform={`rotate(${i * 30})`} fill={C.orange} stroke={C.outline} strokeWidth={6} strokeLinejoin="round" />
        ))}
      </g>
      <circle r={r} fill={cor} stroke={C.outline} strokeWidth={8} />
      <circle cx={-r * 0.35} cy={-r * 0.12} r={r * 0.1} fill={C.outline} />
      {wink ? (
        <path d={`M ${r * 0.22} ${-r * 0.12} q ${r * 0.13} ${-r * 0.1} ${r * 0.26} 0`} stroke={C.outline} strokeWidth={7} fill="none" strokeLinecap="round" />
      ) : (
        <circle cx={r * 0.35} cy={-r * 0.12} r={r * 0.1} fill={C.outline} />
      )}
      <ellipse cx={-r * 0.55} cy={r * 0.2} rx={r * 0.15} ry={r * 0.08} fill={C.orange} opacity={0.7} />
      <ellipse cx={r * 0.55} cy={r * 0.2} rx={r * 0.15} ry={r * 0.08} fill={C.orange} opacity={0.7} />
      <path d={feliz ? `M ${-r * 0.3} ${r * 0.22} Q 0 ${r * 0.55} ${r * 0.3} ${r * 0.22}` : `M ${-r * 0.25} ${r * 0.35} Q 0 ${r * 0.2} ${r * 0.25} ${r * 0.35}`} stroke={C.outline} strokeWidth={8} fill="none" strokeLinecap="round" />
    </svg>
  );
};

/** Feixe de luz reto que "se desenha" de (x1,y1) até (x2,y2) conforme progresso 0..1. */
export const Feixe: React.FC<{ x1: number; y1: number; x2: number; y2: number; cor?: string; largura?: number; p: number; brilho?: boolean }> = ({
  x1,
  y1,
  x2,
  y2,
  cor = C.white,
  largura = 22,
  p,
  brilho = true,
}) => {
  const t = Math.max(0, Math.min(1, p));
  const xe = x1 + (x2 - x1) * t;
  const ye = y1 + (y2 - y1) * t;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {brilho && <line x1={x1} y1={y1} x2={xe} y2={ye} stroke={cor} strokeWidth={largura * 2.2} strokeLinecap="round" opacity={0.25} />}
      <line x1={x1} y1={y1} x2={xe} y2={ye} stroke={cor} strokeWidth={largura} strokeLinecap="round" />
    </svg>
  );
};

/** Raio de luz em zigue-zague (luz sendo espalhada). Desenha-se progressivamente e tem um "fóton" na ponta. */
export const RaioZigue: React.FC<{ pontos: [number, number][]; cor: string; p: number; largura?: number }> = ({ pontos, cor, p, largura = 14 }) => {
  const segs = pontos.slice(1).map((pt, i) => Math.hypot(pt[0] - pontos[i][0], pt[1] - pontos[i][1]));
  const total = segs.reduce((a, b) => a + b, 0);
  const len = total * Math.max(0, Math.min(1, p));
  let acc = 0;
  let head: [number, number] = pontos[0];
  for (let i = 0; i < segs.length; i++) {
    if (acc + segs[i] >= len) {
      const k = (len - acc) / segs[i];
      head = [pontos[i][0] + (pontos[i + 1][0] - pontos[i][0]) * k, pontos[i][1] + (pontos[i + 1][1] - pontos[i][1]) * k];
      break;
    }
    acc += segs[i];
    head = pontos[i + 1];
  }
  const d = pontos.map((pt, i) => `${i ? "L" : "M"} ${pt[0]} ${pt[1]}`).join(" ");
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <path d={d} stroke={cor} strokeWidth={largura * 2.4} opacity={0.25} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${len} ${total + 10}`} />
      <path d={d} stroke={cor} strokeWidth={largura} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${len} ${total + 10}`} />
      {p > 0 && p < 1 && <circle cx={head[0]} cy={head[1]} r={largura * 1.3} fill={C.white} stroke={cor} strokeWidth={6} />}
    </svg>
  );
};

/** Prisma de vidro. */
export const Prisma: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useCurrentFrame();
  const shine = 0.3 + 0.2 * Math.sin(f * 0.1);
  return (
    <svg style={{ position: "absolute", left: x - 160 * s, top: y - 160 * s, overflow: "visible" }} width={320 * s} height={300 * s} viewBox="0 0 320 300">
      <path d="M 160 10 L 310 280 L 10 280 Z" fill="rgba(190,230,255,0.55)" stroke={C.outline} strokeWidth={9} strokeLinejoin="round" />
      <path d="M 160 50 L 120 200" stroke={C.white} strokeWidth={10} strokeLinecap="round" opacity={shine + 0.3} />
      <path d="M 175 80 L 160 130" stroke={C.white} strokeWidth={8} strokeLinecap="round" opacity={shine} />
    </svg>
  );
};

/** Partícula do ar (molécula) com carinha. Treme levemente o tempo todo. */
export const Molecula: React.FC<{ x: number; y: number; r?: number; seed?: number; hit?: number }> = ({ x, y, r = 34, seed = 0, hit = -999 }) => {
  const f = useCurrentFrame();
  const jx = Math.sin(f * 0.2 + seed) * 4;
  const jy = Math.cos(f * 0.17 + seed * 2) * 4;
  const dt = f - hit;
  const squish = dt >= 0 && dt < 10 ? 1 + Math.sin((dt / 10) * Math.PI) * 0.35 : 1;
  return (
    <svg style={{ position: "absolute", left: x - r + jx, top: y - r + jy, overflow: "visible" }} width={r * 2} height={r * 2} viewBox={`${-r} ${-r} ${r * 2} ${r * 2}`}>
      <g transform={`scale(${squish} ${2 - squish})`}>
        <circle r={r} fill="#B9D8FF" stroke={C.outline} strokeWidth={6} />
        <circle cx={-r * 0.3} cy={-r * 0.1} r={r * 0.12} fill={C.outline} />
        <circle cx={r * 0.3} cy={-r * 0.1} r={r * 0.12} fill={C.outline} />
        <path d={`M ${-r * 0.2} ${r * 0.25} Q 0 ${r * (dt >= 0 && dt < 14 ? 0.55 : 0.4)} ${r * 0.2} ${r * 0.25}`} stroke={C.outline} strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
};

/** Olho grande (visão humana). */
export const OlhoGrande: React.FC<{ x: number; y: number; s?: number; corIris?: string }> = ({ x, y, s = 1, corIris = C.blue }) => {
  const f = useCurrentFrame();
  const t = f % 110;
  const blink = t < 7 ? Math.sin((t / 7) * Math.PI) : 0;
  const look = Math.sin(f * 0.05) * 18;
  return (
    <svg style={{ position: "absolute", left: x - 170 * s, top: y - 110 * s, overflow: "visible" }} width={340 * s} height={220 * s} viewBox="-170 -110 340 220">
      <path d="M -160 0 Q 0 -150 160 0 Q 0 150 -160 0 Z" fill={C.white} stroke={C.outline} strokeWidth={9} />
      <g transform={`scale(1 ${1 - blink})`}>
        <circle cx={look} r={62} fill={corIris} stroke={C.outline} strokeWidth={6} />
        <circle cx={look} r={28} fill={C.outline} />
        <circle cx={look + 18} cy={-20} r={12} fill={C.white} />
      </g>
      {blink > 0.1 && <path d={`M -160 0 Q 0 ${-150 + blink * 150} 160 0`} fill={C.pink} stroke={C.outline} strokeWidth={9} />}
    </svg>
  );
};

/** Planeta (Terra, Marte...). */
export const Planeta: React.FC<{ x: number; y: number; r?: number; cor: string; detalhe: string; atmosfera?: string }> = ({ x, y, r = 150, cor, detalhe, atmosfera }) => {
  const f = useCurrentFrame();
  const off = (f * 0.8) % (r * 2);
  return (
    <svg style={{ position: "absolute", left: x - r * 1.3, top: y - r * 1.3, overflow: "visible" }} width={r * 2.6} height={r * 2.6} viewBox={`${-r * 1.3} ${-r * 1.3} ${r * 2.6} ${r * 2.6}`}>
      {atmosfera && <circle r={r * 1.18} fill={atmosfera} opacity={0.45} />}
      <defs>
        <clipPath id={`pl-${cor.replace("#", "")}`}>
          <circle r={r} />
        </clipPath>
      </defs>
      <circle r={r} fill={cor} />
      <g clipPath={`url(#pl-${cor.replace("#", "")})`}>
        {[-1, 0, 1].map((k) => (
          <g key={k} transform={`translate(${k * r * 2 - off + r} 0)`}>
            <ellipse cx={-r * 0.4} cy={-r * 0.3} rx={r * 0.35} ry={r * 0.22} fill={detalhe} />
            <ellipse cx={r * 0.3} cy={r * 0.25} rx={r * 0.45} ry={r * 0.25} fill={detalhe} />
            <ellipse cx={-r * 0.2} cy={r * 0.65} rx={r * 0.25} ry={r * 0.12} fill={detalhe} />
          </g>
        ))}
      </g>
      <circle r={r} fill="none" stroke={C.outline} strokeWidth={8} />
    </svg>
  );
};

/** Explosão de brilhos a partir de um frame. */
export const Brilhos: React.FC<{ x: number; y: number; at: number; cor?: string; n?: number; raio?: number }> = ({ x, y, at, cor = C.yellow, n = 10, raio = 220 }) => {
  const f = useCurrentFrame();
  const t = (f - at) / 24;
  if (t < 0 || t > 1) return null;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2;
        const d = raio * Math.sqrt(t);
        const s = 18 * (1 - t);
        const cx = x + Math.cos(a) * d;
        const cy = y + Math.sin(a) * d;
        return <path key={i} d={`M ${cx} ${cy - s} L ${cx + s * 0.3} ${cy} L ${cx} ${cy + s} L ${cx - s * 0.3} ${cy} Z M ${cx - s} ${cy} L ${cx} ${cy + s * 0.3} L ${cx + s} ${cy} L ${cx} ${cy - s * 0.3} Z`} fill={i % 2 ? cor : C.white} />;
      })}
    </svg>
  );
};

/** Pontos de interrogação flutuando. */
export const Interrogacoes: React.FC<{ x: number; y: number; at?: number }> = ({ x, y, at = 0 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {[0, 1, 2].map((i) => {
        const s = spring({ frame: f - at - i * 6, fps, config: { damping: 8 } });
        const fy = Math.sin((f + i * 20) * 0.12) * 14;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + (i - 1) * 110,
              top: y - (i === 1 ? 60 : 0) + fy,
              fontFamily: "'Baloo 2', sans-serif",
              fontWeight: 800,
              fontSize: 130 - i * 10,
              color: [C.yellow, C.pink, C.teal][i],
              WebkitTextStroke: `10px ${C.outline}`,
              paintOrder: "stroke fill",
              transform: `scale(${s}) rotate(${(i - 1) * 14}deg)`,
            }}
          >
            ?
          </div>
        );
      })}
    </>
  );
};

/** Seta animada (aponta para baixo por padrão), quicando. */
export const Seta: React.FC<{ x: number; y: number; rot?: number; cor?: string; at?: number }> = ({ x, y, rot = 0, cor = C.yellow, at = 0 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const b = Math.abs(Math.sin((f - at) * 0.18)) * 30;
  return (
    <svg style={{ position: "absolute", left: x - 70, top: y - 90 + b, overflow: "visible", transform: `rotate(${rot}deg)` }} width={140} height={180} viewBox="0 0 140 180">
      <path d="M 45 0 L 95 0 L 95 95 L 135 95 L 70 175 L 5 95 L 45 95 Z" fill={cor} stroke={C.outline} strokeWidth={9} strokeLinejoin="round" />
    </svg>
  );
};

/** Arco-íris em leque (as 6 cores), desenhado conforme p 0..1. */
export const LequeCores: React.FC<{ x: number; y: number; p: number; abertura?: number; comprimento?: number; largura?: number }> = ({
  x,
  y,
  p,
  abertura = 46,
  comprimento = 620,
  largura = 26,
}) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
    {RAINBOW.map((cor, i) => {
      const ang = ((i - (RAINBOW.length - 1) / 2) / (RAINBOW.length - 1)) * abertura;
      const rad = (ang * Math.PI) / 180;
      const L = comprimento * interpolate(p, [i * 0.08, i * 0.08 + 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return <line key={cor} x1={x} y1={y} x2={x + Math.cos(rad) * L} y2={y + Math.sin(rad) * L} stroke={cor} strokeWidth={largura} strokeLinecap="round" />;
    })}
  </svg>
);

/** Balão de comentário (CTA). */
export const BalaoComentario: React.FC<{ x: number; y: number; s: number; texto: string }> = ({ x, y, s, texto }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate(-50%, -50%) scale(${s})`,
      background: C.white,
      border: `8px solid ${C.outline}`,
      borderRadius: 40,
      padding: "24px 40px",
      fontFamily: "'Nunito', sans-serif",
      fontWeight: 900,
      fontSize: 52,
      color: C.outline,
      boxShadow: `0 10px 0 ${C.outline}`,
      whiteSpace: "nowrap",
    }}
  >
    {texto}
  </div>
);
