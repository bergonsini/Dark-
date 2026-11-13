import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

/**
 * Câmera virtual 2D. Tudo dentro dela se move junto: pan, zoom, rotação e tremida.
 * keyframes: posições da câmera ao longo da cena (frames LOCAIS). Entre elas há easing suave.
 *   x/y = deslocamento do quadro em px (positivo move o conteúdo para direita/baixo)
 *   zoom = 1 normal, 1.3 aproxima
 * Dica: sempre deixe a câmera "viva" (um leve push-in ou deriva), nunca 100% parada.
 */
export type CamKey = { f: number; x?: number; y?: number; zoom?: number; rot?: number };

export const Camera: React.FC<{
  keys?: CamKey[];
  /** frames LOCAIS com impacto (tremida curta) */
  shakes?: number[];
  shakeAmp?: number;
  /** ponto de foco do zoom em % */
  origin?: string;
  children: React.ReactNode;
}> = ({ keys = [{ f: 0, zoom: 1.08 }, { f: 300, zoom: 1 }], shakes = [], shakeAmp = 18, origin = "50% 55%", children }) => {
  const f = useCurrentFrame();
  const ks = [...keys].sort((a, b) => a.f - b.f);
  const val = (k: "x" | "y" | "zoom" | "rot", def: number) => {
    if (ks.length === 1) return ks[0][k] ?? def;
    const frames = ks.map((x) => x.f);
    const vals = ks.map((x) => x[k] ?? def);
    return interpolate(f, frames, vals, {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
  };
  let sx = 0;
  let sy = 0;
  for (const s of shakes) {
    const t = f - s;
    if (t >= 0 && t <= 14) {
      const k = 1 - t / 14;
      sx += Math.sin(t * 2.9) * shakeAmp * k;
      sy += Math.cos(t * 3.7) * shakeAmp * k;
    }
  }
  const drift = Math.sin(f * 0.03) * 4;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transformOrigin: origin,
          transform: `translate(${val("x", 0) + sx}px, ${val("y", 0) + sy + drift}px) scale(${val("zoom", 1)}) rotate(${val("rot", 0)}deg)`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Camada com parallax: profundidade 0 (fundo distante) .. 1 (primeiro plano). */
export const Parallax: React.FC<{ depth: number; dx?: number; children: React.ReactNode }> = ({ depth, dx = 0, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `translateX(${(dx - f * 0.6) * depth}px)` }}>{children}</AbsoluteFill>;
};
