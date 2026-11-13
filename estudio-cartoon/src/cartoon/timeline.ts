import data from "./timeline.json";

/**
 * timeline.json é GERADO por .claude/skills/cartoon-explainer/scripts/generate_audio.py
 * a partir de roteiro.json. Nunca edite os frames à mão: mude o roteiro e gere de novo.
 */
export type Word = { text: string; startFrame: number; endFrame: number };
export type Line = { text: string; startFrame: number; endFrame: number; words: Word[] };
export type Scene = { id: string; startFrame: number; endFrame: number; lines: Line[] };
export type Timeline = {
  titulo: string;
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
  if (!s) throw new Error(`Cena não encontrada no timeline.json: ${id}`);
  return s;
};

/** Abertura da boca (0..1) no frame global, suavizada. */
export const mouthAt = (globalFrame: number): number => {
  const m = timeline.mouth;
  const get = (f: number) => (f >= 0 && f < m.length ? m[f] : 0);
  const v = get(globalFrame) * 0.6 + get(globalFrame - 1) * 0.25 + get(globalFrame + 1) * 0.15;
  return Math.min(1, v * 1.15);
};

/** Frame LOCAL (relativo ao início da cena) em que começa / termina a fala i. */
export const lineStart = (scene: Scene, i: number) => scene.lines[Math.min(i, scene.lines.length - 1)].startFrame - scene.startFrame;
export const lineEnd = (scene: Scene, i: number) => scene.lines[Math.min(i, scene.lines.length - 1)].endFrame - scene.startFrame;
/** Frame LOCAL em que a palavra (primeira ocorrência, sem acento/pontuação) é falada. */
export const wordAt = (scene: Scene, word: string): number => {
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9-]/g, "");
  for (const l of scene.lines) for (const w of l.words) if (norm(w.text) === norm(word)) return w.startFrame - scene.startFrame;
  return 0;
};
/** A narração está falando neste frame global? (usado para abaixar a música) */
export const isSpeaking = (g: number) =>
  timeline.scenes.some((s) => s.lines.some((l) => g >= l.startFrame - 4 && g <= l.endFrame + 4));
