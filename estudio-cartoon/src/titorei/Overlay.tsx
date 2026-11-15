import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { timeline } from "./timeline";

/** Fonte "pesada" das legendas e títulos do Titorei (já carregada pelo projeto). */
const FONTE = "'Baloo 2', 'Nunito', sans-serif";

/**
 * Legenda do Titorei: UMA palavra por vez, grande, branca com contorno preto, no centro da tela.
 * A palavra entra com um "pop". Lê os tempos do timeline do Titorei.
 */
export const LegendaPalavra: React.FC<{ y?: number }> = ({ y = 1130 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  let atual: { text: string; start: number } | null = null;
  for (const s of timeline.scenes)
    for (const l of s.lines)
      l.words.forEach((w, i) => {
        const fim = l.words[i + 1]?.startFrame ?? l.endFrame + 4;
        if (f >= w.startFrame && f < fim) atual = { text: w.text, start: w.startFrame };
      });
  if (!atual) return null;
  const a = atual as { text: string; start: number };
  const s = spring({ frame: f - a.start, fps, config: { damping: 10, stiffness: 320, mass: 0.4 } });
  const txt = a.text.replace(/[.,;:!?…]+$/, "");
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", transform: `scale(${0.6 + s * 0.4})` }}>
      <span
        style={{
          fontFamily: FONTE,
          fontWeight: 800,
          fontSize: 118,
          color: "#FFFFFF",
          WebkitTextStroke: "16px #111",
          paintOrder: "stroke fill",
          textShadow: "0 8px 0 #111",
          letterSpacing: 1,
        }}
      >
        {txt.charAt(0).toUpperCase() + txt.slice(1)}
      </span>
    </div>
  );
};

/** Título de "capítulo" (amarelo, contorno preto, levemente torto), no topo. */
export const Capitulo: React.FC<{ texto: string; at?: number; y?: number }> = ({ texto, at = 0, y = 230 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!texto || f < at) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 9, stiffness: 200 } });
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        right: 40,
        top: y,
        textAlign: "center",
        fontFamily: FONTE,
        fontWeight: 800,
        fontSize: 104,
        lineHeight: 0.95,
        color: "#FFD23F",
        WebkitTextStroke: "16px #111",
        paintOrder: "stroke fill",
        textShadow: "0 10px 0 #111",
        transform: `scale(${0.4 + s * 0.6}) rotate(-3deg)`,
      }}
    >
      {texto}
    </div>
  );
};

/** Onomatopeia/placa cômica ("POF!", "PLAU!") que bate e some. */
export const Onomatopeia: React.FC<{ texto: string; at: number; x?: number; y?: number; dur?: number; cor?: string; rot?: number }> = ({ texto, at, x = 540, y = 700, dur = 24, cor = "#FFFFFF", rot = -10 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at || f > at + dur) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 7, stiffness: 300 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${s * 1.1}) rotate(${rot}deg)`,
        fontFamily: FONTE,
        fontWeight: 800,
        fontSize: 140,
        color: cor,
        WebkitTextStroke: "18px #111",
        paintOrder: "stroke fill",
        whiteSpace: "nowrap",
      }}
    >
      {texto}
    </div>
  );
};

/** Placa amarela com texto preto (ex.: "PEÇO DEMISSÃO"). */
export const Placa: React.FC<{ texto: string; at: number; x?: number; y?: number; ate?: number }> = ({ texto, at, x = 540, y = 1400, ate = 1e9 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at || f > ate) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 9, stiffness: 220 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${s}) rotate(${Math.sin(f * 0.15) * 2}deg)`,
        background: "#FFD23F",
        border: "12px solid #111",
        padding: "14px 40px",
        fontFamily: FONTE,
        fontWeight: 800,
        fontSize: 82,
        color: "#111",
        whiteSpace: "nowrap",
      }}
    >
      {texto}
    </div>
  );
};
