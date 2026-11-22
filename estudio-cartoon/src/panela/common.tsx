import React, { createContext, useContext } from "react";
import { Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { bocaDe, Scene } from "./timeline";

export type CenaProps = { scene: Scene };
/** Frame local, global e a boca de cada personagem (lip-sync só de quem fala). */
export const useCena = (scene: Scene) => {
  const f = useCurrentFrame();
  const g = scene.startFrame + f;
  return { f, g, boca: (quem: string) => bocaDe(g, quem) };
};
export const CenaTiming = createContext<{ len: number }>({ len: 1e9 });

export type SfxNome = "whoosh" | "boom" | "pop" | "ding" | "sparkle" | "boing" | "click" | "riser" | "tada" | "ronco" | "borbulha" | "apito" | "tum" | "alarme" | "caixa" | "motor";
export const Sfx: React.FC<{ at: number; nome: SfxNome; vol?: number }> = ({ at, nome, vol = 0.6 }) => {
  const { len } = useContext(CenaTiming);
  const start = Math.max(0, Math.round(at));
  const dur = Math.min(60, len - start);
  if (dur <= 2) return null;
  return (
    <Sequence from={start} durationInFrames={dur} layout="none" name={`sfx:${nome}`}>
      <Audio src={staticFile(`panela/audio/sfx/${nome}.wav`)} volume={(fr) => vol * Math.min(1, (dur - fr) / 4)} />
    </Sequence>
  );
};
export const lerp = (f: number, a: number, b: number, v0 = 0, v1 = 1) => interpolate(f, [a, b], [v0, v1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
export const mola = (f: number, at: number, st = 180, d = 10) => spring({ frame: f - at, fps: 30, config: { damping: d, stiffness: st } });
