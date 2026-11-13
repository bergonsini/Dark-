import React from "react";
import { useCurrentFrame } from "remotion";
import { FPS, SEGMENTS, Word, outline, pop } from "../lib";

type Page = { words: Word[]; start: number; end: number };

/** Agrupa as palavras de cada trecho em "páginas" curtas de até 3 palavras (estilo Reels/TikTok). */
const buildPages = (): Page[] => {
  const pages: Page[] = [];
  for (const s of SEGMENTS) {
    let cur: Word[] = [];
    const flush = () => {
      if (cur.length) pages.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
      cur = [];
    };
    for (const w of s.words) {
      cur.push(w);
      const len = cur.map((x) => x.word).join(" ").length;
      if (/[,.?!:…]$/.test(w.word) || cur.length >= 3 || len > 16) flush();
    }
    flush();
  }
  // cada página fica até a próxima começar (no máx. +0.5s depois de terminar)
  for (let i = 0; i < pages.length; i++) {
    const next = pages[i + 1];
    pages[i].end = next ? Math.min(next.start, pages[i].end + 0.5) : pages[i].end + 0.6;
  }
  return pages;
};

const PAGES = buildPages();
const COLORS = ["#ffd60a", "#4cc9f0", "#80ed99", "#ff9f1c", "#ff70a6"];

export const Captions: React.FC<{ y?: number | ((t: number) => number) }> = ({ y: yProp = 1520 }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const idx = PAGES.findIndex((p) => t >= p.start - 0.05 && t < p.end);
  if (idx < 0) return null;
  const page = PAGES[idx];
  const y = typeof yProp === "function" ? yProp(t) : yProp;
  const startF = Math.round(page.start * FPS) - 2;
  const s = pop(frame, startF, 10, 0.5);
  const hl = COLORS[idx % COLORS.length];
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: y,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 0",
        transform: `scale(${0.7 + 0.3 * s})`,
        opacity: Math.min(1, s * 2),
      }}
    >
      {page.words.map((w, i) => {
        const active = t >= w.start - 0.03 && t < w.end + 0.05;
        const spoken = t >= w.start - 0.03;
        return (
          <span
            key={i}
            style={{
              fontFamily: "Baloo",
              fontWeight: 800,
              fontSize: 92,
              lineHeight: 1.15,
              textTransform: "uppercase",
              color: active ? hl : spoken ? "white" : "rgba(255,255,255,0.92)",
              transform: `translateY(${active ? -8 : 0}px) rotate(${active ? -2 : 0}deg)`,
              display: "inline-block",
              margin: "0 14px",
              textShadow: outline(7),
            }}
          >
            {w.word}
          </span>
        );
      })}
    </div>
  );
};
