import { continueRender, delayRender, Easing, interpolate, random, spring, staticFile } from "remotion";
import timings from "./data/timings.json";

export const FPS = 30;
export const W = 1080;
export const H = 1920;

export type Word = { word: string; start: number; end: number };
export type Segment = { id: string; text: string; start: number; end: number; words: Word[] };

export const SEGMENTS = timings.segments as Segment[];
export const TOTAL_SECONDS = timings.totalSeconds as number;
export const DURATION_FRAMES = Math.ceil((TOTAL_SECONDS + 0.4) * FPS);

export const seg = (id: string): Segment => {
  const s = SEGMENTS.find((x) => x.id === id);
  if (!s) throw new Error("segmento não encontrado: " + id);
  return s;
};

/** Momento (em segundos absolutos) em que uma palavra começa a ser falada num segmento. */
export const wordAt = (id: string, needle: string, nth = 0): number => {
  const s = seg(id);
  const clean = (w: string) => w.toLowerCase().replace(/[^a-zà-ú0-9]/gi, "");
  const hits = s.words.filter((w) => clean(w.word) === clean(needle));
  return (hits[nth] ?? hits[0] ?? s.words[0]).start;
};

export const f = (seconds: number) => Math.round(seconds * FPS);

/** Início de cada cena (em segundos). As cenas começam um pouco antes da fala. */
export const SCENE_ORDER = ["hook", "intro", "hunger", "choice", "hunt", "gather", "fire", "fact", "cta"] as const;
export type SceneId = (typeof SCENE_ORDER)[number];
export const sceneStart = (id: SceneId) => (id === "hook" ? 0 : seg(id).start - 0.12);
export const sceneEnd = (id: SceneId) => {
  const i = SCENE_ORDER.indexOf(id);
  return i === SCENE_ORDER.length - 1 ? DURATION_FRAMES / FPS : sceneStart(SCENE_ORDER[i + 1]);
};

// ---------------------------------------------------------------- animação
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const pop = (frame: number, at: number, damping = 9, mass = 0.6) =>
  spring({ frame: frame - at, fps: FPS, config: { damping, mass, stiffness: 180 } });

export const ease = (frame: number, a: number, b: number, from: number, to: number) =>
  interpolate(frame, [a, b], [from, to], { ...clamp, easing: Easing.inOut(Easing.cubic) });

export const wobble = (frame: number, speed = 0.15, amp = 1, phase = 0) =>
  Math.sin(frame * speed + phase) * amp;

/** Piscar natural e determinístico. Retorna 0 (aberto) .. 1 (fechado). */
export const blink = (frame: number, seed = 1) => {
  let t = 0;
  let k = 0;
  while (t < frame + 10) {
    const gap = 55 + Math.floor(random(`blink-${seed}-${k}`) * 70);
    t += gap;
    const d = frame - t;
    if (d >= 0 && d < 6) return [0.5, 1, 1, 0.6, 0.25, 0][d];
    k++;
  }
  return 0;
};

/** Boca "falando" sincronizada com as palavras da narração (0..1). */
export const talkAmount = (frameAbs: number, ids: string[]) => {
  const t = frameAbs / FPS;
  for (const id of ids) {
    const s = seg(id);
    for (const w of s.words) {
      if (t >= w.start && t <= w.end) {
        const p = (t - w.start) / Math.max(0.05, w.end - w.start);
        return Math.min(1, Math.abs(Math.sin(p * Math.PI * Math.max(1, Math.round((w.end - w.start) * 7)))) * 0.9 + 0.1);
      }
    }
  }
  return 0;
};

// ---------------------------------------------------------------- fontes
let fontsLoaded = false;
export const loadFonts = () => {
  if (fontsLoaded || typeof window === "undefined") return;
  fontsLoaded = true;
  const handle = delayRender("Carregando fontes");
  const fonts = [
    new FontFace("Bangers", `url(${staticFile("fonts/Bangers.woff2")}) format('woff2')`),
    new FontFace("Baloo", `url(${staticFile("fonts/Baloo2-800.woff2")}) format('woff2')`, { weight: "800" }),
    new FontFace("Baloo", `url(${staticFile("fonts/Baloo2-700.woff2")}) format('woff2')`, { weight: "700" }),
  ];
  Promise.all(fonts.map((ft) => ft.load()))
    .then((loaded) => {
      loaded.forEach((ft) => (document.fonts as unknown as { add: (f: FontFace) => void }).add(ft));
      continueRender(handle);
    })
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
};

/** Contorno grosso para texto (legibilidade máxima em qualquer fundo). */
export const outline = (px: number, color = "#1a0f08", shadow = true) => {
  const parts: string[] = [];
  const steps = 24;
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    parts.push(`${(Math.cos(a) * px).toFixed(1)}px ${(Math.sin(a) * px).toFixed(1)}px 0 ${color}`);
  }
  if (shadow) parts.push(`0px ${px * 1.6}px 0 ${color}`, `0 ${px * 2.4}px ${px * 2}px rgba(0,0,0,0.45)`);
  return parts.join(",");
};
