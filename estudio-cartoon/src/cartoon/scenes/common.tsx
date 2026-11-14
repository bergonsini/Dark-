import React, { createContext, useContext } from "react";
import { AbsoluteFill, Audio, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { mouthAt, Scene } from "../timeline";
import { TRANSITION_FRAMES } from "../config";

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

export type SfxName = "whoosh" | "boom" | "pop" | "ding" | "sparkle" | "boing" | "click" | "riser" | "tada" | "ronco" | "borbulha";

/**
 * Duração da cena e posição no vídeo, fornecidas pelo CartoonExplainer. O Sfx usa isso para nunca
 * tocar durante as transições: ali a cena é remontada, o áudio se divide em dois e a emenda estala.
 */
export const SceneTiming = createContext<{ len: number; first: boolean; last: boolean }>({ len: 1e9, first: true, last: true });

/** Efeito sonoro preso a um frame LOCAL da cena (fora das janelas de transição, com fade no corte). */
export const Sfx: React.FC<{ at: number; name: SfxName; volume?: number }> = ({ at, name, volume = 0.6 }) => {
  const tm = useContext(SceneTiming);
  const start = Math.max(Math.round(at), tm.first ? 0 : TRANSITION_FRAMES);
  const fim = tm.last ? start + 60 : tm.len;
  const dur = Math.min(60, fim - start);
  if (dur <= 2) return null;
  return (
    <Sequence from={start} durationInFrames={dur} layout="none" name={`sfx:${name}`}>
      <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={(fr) => volume * Math.min(1, (dur - fr) / 4)} />
    </Sequence>
  );
};

export const Full: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg }) => (
  <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>{children}</AbsoluteFill>
);

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp01(t);
