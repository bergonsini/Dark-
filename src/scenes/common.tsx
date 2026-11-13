import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { mouthAt, Scene } from "../timeline";

export type SceneProps = { scene: Scene };

/** frame local, frame global e abertura da boca (lip-sync) para a cena. */
export const useSceneFrame = (scene: Scene) => {
  const f = useCurrentFrame();
  const g = scene.startFrame + f;
  return { f, g, mouth: mouthAt(g) };
};

/** Tremida de câmera determinística. */
export const shake = (f: number, at: number, dur = 12, amp = 22) => {
  const t = f - at;
  if (t < 0 || t > dur) return { x: 0, y: 0 };
  const k = 1 - t / dur;
  return { x: Math.sin(t * 2.7) * amp * k, y: Math.cos(t * 3.3) * amp * k };
};

/** Envolve a cena com "punch zoom" de entrada e tremidas opcionais. */
export const SceneWrap: React.FC<{ children: React.ReactNode; shakes?: number[]; bg?: string }> = ({ children, shakes = [], bg }) => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, 14], [1.12, 1], { extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
  let sx = 0;
  let sy = 0;
  for (const s of shakes) {
    const v = shake(f, s);
    sx += v.x;
    sy += v.y;
  }
  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px) scale(${zoom})` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Posiciona um elemento de forma absoluta. */
export const Pos: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  scale?: number;
  rotate?: number;
  opacity?: number;
  origin?: string;
  style?: React.CSSProperties;
}> = ({ x, y, children, scale = 1, rotate = 0, opacity = 1, origin = "center bottom", style }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `scale(${scale}) rotate(${rotate}deg)`,
      transformOrigin: origin,
      opacity,
      ...style,
    }}
  >
    {children}
  </div>
);

export const walkCycle = (f: number, speed = 0.5, amp = 22) => ({
  legL: Math.sin(f * speed) * amp,
  legR: -Math.sin(f * speed) * amp,
  armL: 15 - Math.sin(f * speed) * amp * 0.8,
  armR: 15 + Math.sin(f * speed) * amp * 0.8,
  bodyY: -Math.abs(Math.sin(f * speed)) * 14,
});

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const formatBR = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
