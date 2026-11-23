import data from "./timeline.json";

/** Gerado por generate_audio.py a partir de inutilidades/roteiro.json. Não edite os frames à mão. */
export type Word = { text: string; startFrame: number; endFrame: number };
export type Line = { text: string; quem?: string; startFrame: number; endFrame: number; words: Word[] };
export type Scene = { id: string; startFrame: number; endFrame: number; lines: Line[] };
export type Timeline = { video?: string; titulo: string; fps: number; durationInFrames: number; durationSeconds: number; scenes: Scene[]; mouth: number[] };

export const timeline = data as Timeline;
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9-]/g, "");
/** Frame LOCAL da palavra (n-ésima ocorrência, começando em 1). */
export const wordAt = (scene: Scene, word: string, n = 1): number => {
  let k = 0;
  for (const l of scene.lines) for (const w of l.words) if (norm(w.text) === norm(word) && ++k === n) return w.startFrame - scene.startFrame;
  throw new Error(`Palavra "${word}" não encontrada na cena ${scene.id}`);
};
export const lineStart = (scene: Scene, i: number) => scene.lines[Math.min(i, scene.lines.length - 1)].startFrame - scene.startFrame;
export const lineEnd = (scene: Scene, i: number) => scene.lines[Math.min(i, scene.lines.length - 1)].endFrame - scene.startFrame;
export const isSpeaking = (g: number) => timeline.scenes.some((s) => s.lines.some((l) => g >= l.startFrame - 4 && g <= l.endFrame + 4));
/** Quem está falando no frame global g (ou null). */
export const quemFala = (g: number): string | null => {
  for (const s of timeline.scenes) for (const l of s.lines) if (g >= l.startFrame && g <= l.endFrame) return l.quem ?? null;
  return null;
};
/** Abertura da boca do personagem `quem` no frame global g (0 se for outro falando). */
export const bocaDe = (g: number, quem: string) => {
  if (quemFala(g) !== quem) return 0;
  const m = timeline.mouth;
  const get = (f: number) => (f >= 0 && f < m.length ? m[f] : 0);
  return Math.min(1, (get(g) * 0.6 + get(g - 1) * 0.25 + get(g + 1) * 0.15) * 1.2);
};
export const getScene = (id: string) => {
  const s = timeline.scenes.find((x) => x.id === id);
  if (!s) throw new Error(`Cena não encontrada: ${id}`);
  return s;
};
