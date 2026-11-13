import React from "react";
import { AbsoluteFill, Audio, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { mouthAt, Scene } from "../timeline";

export type SceneProps = { scene: Scene };

/** Frame local (f), frame global (g) e abertura da boca para lip-sync. */
export const useSceneFrame = (scene: Scene) => {
  const f = useCurrentFrame();
  const g = scene.startFrame + f;
  return { f, g, mouth: mouthAt(g) };
};

/** Mola 0..1 a partir de um frame local. */
export const useSpringAt = (at: number, config = { damping: 12, stiffness: 160 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - at, fps, config });
};

/** Posiciona um elemento de forma absoluta (x, y = canto superior esquerdo). */
export const Pos: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  scale?: number;
  rotate?: number;
  opacity?: number;
  origin?: string;
}> = ({ x, y, children, scale = 1, rotate = 0, opacity = 1, origin = "center bottom" }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `scale(${scale}) rotate(${rotate}deg)`, transformOrigin: origin, opacity }}>
    {children}
  </div>
);

export type SfxName = "whoosh" | "boom" | "pop" | "ding" | "sparkle" | "boing" | "click" | "riser" | "tada";

/** Efeito sonoro preso a um frame LOCAL da cena. */
export const Sfx: React.FC<{ at: number; name: SfxName; volume?: number }> = ({ at, name, volume = 0.6 }) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={60} layout="none" name={`sfx:${name}`}>
    <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);

export const Full: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg }) => (
  <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>{children}</AbsoluteFill>
);

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp01(t);
