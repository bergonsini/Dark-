import React, { createContext, useContext } from "react";
import { Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { mouthAt, Scene } from "./timeline";

export type CenaProps = { scene: Scene };
/** Frame local, frame global e abertura de boca (lip-sync com a narração). */
export const useCena = (scene: Scene) => {
  const f = useCurrentFrame();
  const g = scene.startFrame + f;
  return { f, g, mouth: mouthAt(g) };
};

/** Duração da cena (para o efeito sonoro terminar com fade antes do corte seco). */
export const CenaTiming = createContext<{ len: number }>({ len: 1e9 });

export type SfxNome = "whoosh" | "boom" | "pop" | "ding" | "sparkle" | "boing" | "click" | "riser" | "tada" | "ronco" | "borbulha" | "apito" | "tum" | "alarme";
export const Sfx: React.FC<{ at: number; nome: SfxNome; vol?: number }> = ({ at, nome, vol = 0.6 }) => {
  const { len } = useContext(CenaTiming);
  const start = Math.max(0, Math.round(at));
  const dur = Math.min(60, len - start);
  if (dur <= 2) return null;
  return (
    <Sequence from={start} durationInFrames={dur} layout="none" name={`sfx:${nome}`}>
      <Audio src={staticFile(`titorei/audio/sfx/${nome}.wav`)} volume={(fr) => vol * Math.min(1, (dur - fr) / 4)} />
    </Sequence>
  );
};

/** Valor em "degraus": devolve o item cujo frame já passou (útil para trocar expressão/pose a cada fala). */
export const passo = <T,>(f: number, itens: [number, T][]): T => {
  let v = itens[0][1];
  for (const [at, x] of itens) if (f >= at) v = x;
  return v;
};
