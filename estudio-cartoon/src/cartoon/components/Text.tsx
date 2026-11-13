import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TITLE_FONT } from "../fonts";
import { C } from "../theme";

/** Título que "bate" na tela com mola (use no gancho e em palavras-chave). */
export const TitleSlam: React.FC<{
  text: string;
  at?: number;
  top: number;
  size?: number;
  color?: string;
  rotate?: number;
  wobble?: boolean;
}> = ({ text, at = 0, top, size = 120, color = C.yellow, rotate = -3, wobble = true }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 9, stiffness: 180, mass: 0.7 } });
  const w = wobble ? Math.sin((f - at) * 0.15) * 1.5 : 0;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 40,
        right: 40,
        textAlign: "center",
        fontFamily: TITLE_FONT,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.0,
        color,
        WebkitTextStroke: `16px ${C.outline}`,
        paintOrder: "stroke fill",
        textShadow: `0 12px 0 ${C.outline}`,
        transform: `scale(${0.3 + s * 0.7}) rotate(${rotate + w}deg)`,
        opacity: Math.min(1, s * 3),
      }}
    >
      {text}
    </div>
  );
};

/** Etiqueta (pílula) para rótulos curtos dentro da cena. */
export const Tag: React.FC<{ text: string; x: number; y: number; at?: number; bg?: string; color?: string; size?: number }> = ({
  text,
  x,
  y,
  at = 0,
  bg = C.white,
  color = C.outline,
  size = 54,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 10, stiffness: 200 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${s})`,
        background: bg,
        color,
        fontFamily: TITLE_FONT,
        fontWeight: 800,
        fontSize: size,
        padding: "10px 34px",
        borderRadius: 999,
        border: `7px solid ${C.outline}`,
        boxShadow: `0 8px 0 ${C.outline}`,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};
