import React, { createContext, useContext } from "react";
import { Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { bocaDe, Scene } from "./timeline";

export type CenaProps = { scene: Scene };
export const W = 1080;
export const H = 1920;
export const TINTA = "#1b1340";
export const FONTE = "'Baloo 2', 'Nunito', sans-serif";

/** Frame local, frame global e a boca de cada personagem (lip-sync só de quem está falando). */
export const useCena = (scene: Scene) => {
  const f = useCurrentFrame();
  const g = scene.startFrame + f;
  return { f, g, boca: (quem: string) => bocaDe(g, quem) };
};

/** Duração da cena (para o efeito sonoro terminar com fade antes do corte seco). */
export const CenaTiming = createContext<{ len: number }>({ len: 1e9 });

export type SfxNome =
  | "whoosh" | "boom" | "pop" | "ding" | "sparkle" | "boing" | "click" | "riser" | "tada" | "ronco" | "borbulha" | "apito" | "tum" | "alarme" | "caixa" | "vhs" | "motor";
export const Sfx: React.FC<{ at: number; nome: SfxNome; vol?: number }> = ({ at, nome, vol = 0.6 }) => {
  const { len } = useContext(CenaTiming);
  const start = Math.max(0, Math.round(at));
  const dur = Math.min(60, len - start);
  if (dur <= 2) return null;
  return (
    <Sequence from={start} durationInFrames={dur} layout="none" name={`sfx:${nome}`}>
      <Audio src={staticFile(`inutilidades/audio/sfx/${nome}.wav`)} volume={(fr) => vol * Math.min(1, (dur - fr) / 4)} />
    </Sequence>
  );
};

export const mola = (f: number, at: number, st = 200, damping = 11) => spring({ frame: f - at, fps: 30, config: { damping, stiffness: st } });
export const lerp = (f: number, a: number, b: number, v0 = 0, v1 = 1) =>
  interpolate(f, [a, b], [v0, v1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
/** Tremida de câmera depois de um impacto (px). */
export const tremor = (f: number, at: number, forca = 26, dur = 14) => {
  const k = f >= at && f < at + dur ? (1 - (f - at) / dur) * forca : 0;
  return [Math.sin(f * 2.7) * k, Math.cos(f * 3.3) * k] as const;
};
/** Valor em "degraus": o item cujo frame já passou. */
export const passo = <T,>(f: number, itens: [number, T][]): T => {
  let v = itens[0][1];
  for (const [at, x] of itens) if (f >= at) v = x;
  return v;
};
export const piscar = (f: number, seed = 0) => {
  const p = (f + seed * 37) % 97;
  return p < 3 ? 1 : 0;
};
