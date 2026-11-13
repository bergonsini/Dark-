import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { TITLE_FONT } from "../fonts";
import { C } from "../theme";

export type TextPart = { text: string; color?: string; size?: number };

const stroke = (w: number): React.CSSProperties => ({
  WebkitTextStroke: `${w}px ${C.outline}`,
  paintOrder: "stroke fill",
  textShadow: `0 ${w * 0.8}px 0 ${C.outline}, 0 ${w * 1.6}px 18px rgba(0,0,0,0.35)`,
});

/**
 * Título grande e colorido: cada palavra entra com "pop" (mola) em sequência.
 * `delay` em frames, `stagger` frames entre palavras.
 */
export const PopTitle: React.FC<{
  frame: number;
  lines: TextPart[][];
  delay?: number;
  stagger?: number;
  top: number;
  size?: number;
  /** índice (global, contando todas as palavras) da palavra destacada */
  highlight?: number;
  exitAt?: number;
}> = ({ frame, lines, delay = 0, stagger = 3, top, size = 120, highlight = -1, exitAt }) => {
  const { fps } = useVideoConfig();
  let idx = 0;
  const exit = exitAt !== undefined ? interpolate(frame, [exitAt, exitAt + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 40,
        right: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        transform: `scale(${exit})`,
        opacity: exit,
      }}
    >
      {lines.map((ln, li) => (
        <div key={li} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 34px" }}>
          {ln.map((p) => {
            const my = idx++;
            const s = spring({ frame: frame - delay - my * stagger, fps, config: { damping: 9, stiffness: 160, mass: 0.6 } });
            const isHi = my === highlight;
            const fs = p.size ?? size;
            return (
              <span
                key={my}
                style={{
                  fontFamily: TITLE_FONT,
                  fontSize: fs,
                  lineHeight: 1.08,
                  color: isHi ? C.yellow : p.color ?? C.white,
                  display: "inline-block",
                  transform: `scale(${s * (isHi ? 1.06 : 1)}) rotate(${(1 - s) * -12}deg) translateY(${(1 - s) * 40}px)`,
                  opacity: Math.min(1, s * 1.5),
                  ...stroke(fs * 0.085),
                }}
              >
                {p.text}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Faixa/selo de destaque (ex.: "CURIOSIDADE!"). */
export const Badge: React.FC<{
  frame: number;
  text: string;
  bg: string;
  color?: string;
  top: number;
  size?: number;
  rotate?: number;
  delay?: number;
}> = ({ frame, text, bg, color = C.white, top, size = 90, rotate = -3, delay = 0 }) => {
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 140 } });
  const wob = Math.sin(frame / 6) * 1.5;
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: TITLE_FONT,
          fontSize: size,
          color,
          background: bg,
          padding: `${size * 0.18}px ${size * 0.45}px ${size * 0.06}px`,
          borderRadius: size * 0.3,
          border: `8px solid ${C.outline}`,
          boxShadow: `0 12px 0 ${C.outline}`,
          transform: `scale(${s}) rotate(${rotate + wob}deg)`,
          ...stroke(size * 0.06),
        }}
      >
        {text}
      </div>
    </div>
  );
};
