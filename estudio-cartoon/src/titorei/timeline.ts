import data from "./timeline.json";

/** Gerado por generate_audio.py a partir de titorei/roteiro.json. Não edite os frames à mão. */
export type Word = { text: string; startFrame: number; endFrame: number };
export type Line = { text: string; startFrame: number; endFrame: number; words: Word[] };
export type Scene = { id: string; capitulo?: string; startFrame: number; endFrame: number; lines: Line[] };
export type Timeline = { video?: string; titulo: string; fps: number; durationInFrames: number; durationSeconds: number; scenes: Scene[]; mouth: number[] };

export const timeline = data as Timeline;
export const getScene = (id: string) => {
  const s = timeline.scenes.find((x) => x.id === id);
  if (!s) throw new Error(`Cena não encontrada: ${id}`);
  return s;
};
export const mouthAt = (g: number) => {
  const m = timeline.mouth;
  const get = (f: number) => (f >= 0 && f < m.length ? m[f] : 0);
  return Math.min(1, (get(g) * 0.6 + get(g - 1) * 0.25 + get(g + 1) * 0.15) * 1.15);
};
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9-]/g, "");
/** Frame LOCAL da palavra (n-ésima ocorrência, começando em 1). */
export const wordAt = (scene: Scene, word: string, n = 1): number => {
  let k = 0;
  for (const l of scene.lines) for (const w of l.words) if (norm(w.text) === norm(word) && ++k === n) return w.startFrame - scene.startFrame;
  return 0;
};
export const lineStart = (scene: Scene, i: number) => scene.lines[Math.min(i, scene.lines.length - 1)].startFrame - scene.startFrame;
export const lineEnd = (scene: Scene, i: number) => scene.lines[Math.min(i, scene.lines.length - 1)].endFrame - scene.startFrame;
export const isSpeaking = (g: number) => timeline.scenes.some((s) => s.lines.some((l) => g >= l.startFrame - 4 && g <= l.endFrame + 4));
