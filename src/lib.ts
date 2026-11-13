import {interpolate, spring} from 'remotion';
import timeline from './timeline.json';

export type Word = {word: string; start: number; end: number};
export type Scene = {id: string; start: number; end: number};
export type Timeline = {
  fps: number;
  durationInFrames: number;
  seconds: number;
  scenes: Scene[];
  words: Word[];
  mouth: number[];
};

export const T = timeline as Timeline;
export const FPS = T.fps;
export const W = 1080;
export const H = 1920;

export const f = (seconds: number) => Math.round(seconds * FPS);

export const sceneFrames = (id: string) => {
  const s = T.scenes.find((x) => x.id === id);
  if (!s) throw new Error(`Cena não encontrada: ${id}`);
  return {from: f(s.start), duration: f(s.end) - f(s.start)};
};

const clean = (w: string) =>
  w
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');

/** Frame LOCAL (dentro da cena) em que uma palavra da narração começa. */
export const wordAt = (sceneId: string, word: string, nth = 0): number => {
  const s = T.scenes.find((x) => x.id === sceneId)!;
  const target = clean(word);
  const hits = T.words.filter(
    (w) => w.start >= s.start - 0.01 && w.start < s.end && clean(w.word).startsWith(target),
  );
  const hit = hits[nth] ?? hits[0];
  if (!hit) return 0;
  return f(hit.start) - f(s.start);
};

/** Abertura da boca (0..1) no frame global, suavizada. */
export const mouthAt = (globalFrame: number) => {
  const m = T.mouth;
  const g = (i: number) => m[Math.max(0, Math.min(m.length - 1, i))] ?? 0;
  const v = g(globalFrame) * 0.6 + g(globalFrame - 1) * 0.2 + g(globalFrame + 1) * 0.2;
  return Math.min(1, v * 1.15);
};

export const pop = (frame: number, at: number, damping = 9) =>
  spring({frame: frame - at, fps: FPS, config: {damping, mass: 0.6, stiffness: 160}});

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const lerp = (frame: number, input: number[], output: number[]) =>
  interpolate(frame, input, output, clamp);

/** Ruído suave determinístico para tremores/fogo. */
export const wobble = (t: number, seed = 0) =>
  Math.sin(t * 1.3 + seed) * 0.5 + Math.sin(t * 2.7 + seed * 2.1) * 0.3 + Math.sin(t * 5.1 + seed * 0.7) * 0.2;
