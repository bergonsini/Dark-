import data from "./timeline.json";

export type Word = { text: string; startFrame: number; endFrame: number };
export type Line = { text: string; startFrame: number; endFrame: number; words: Word[] };
export type Scene = { id: string; startFrame: number; endFrame: number; lines: Line[] };
export type Timeline = {
  fps: number;
  durationInFrames: number;
  durationSeconds: number;
  engine: string;
  scenes: Scene[];
  mouth: number[];
};

export const timeline = data as Timeline;

export const getScene = (id: string): Scene => {
  const s = timeline.scenes.find((x) => x.id === id);
  if (!s) throw new Error(`Cena não encontrada: ${id}`);
  return s;
};

/** Abertura da boca (0..1) no frame global, suavizada para não "tremer". */
export const mouthAt = (globalFrame: number): number => {
  const m = timeline.mouth;
  const get = (f: number) => (f >= 0 && f < m.length ? m[f] : 0);
  const v = get(globalFrame) * 0.6 + get(globalFrame - 1) * 0.25 + get(globalFrame + 1) * 0.15;
  return Math.min(1, v * 1.15);
};

/** Frame local (relativo ao início da cena) em que começa a linha i. */
export const lineStart = (scene: Scene, i: number) => scene.lines[i].startFrame - scene.startFrame;
export const lineEnd = (scene: Scene, i: number) => scene.lines[i].endFrame - scene.startFrame;
