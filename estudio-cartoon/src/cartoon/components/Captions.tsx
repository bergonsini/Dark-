import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BODY_FONT } from "../fonts";
import { C } from "../theme";
import { timeline, Word } from "../timeline";

/**
 * Legendas sincronizadas palavra por palavra (estilo Reels/TikTok), lidas do timeline.json.
 * Blocos curtos (até 3 palavras); a palavra falada no momento fica destacada.
 */
type Chunk = { words: Word[]; start: number; end: number };
const MAX_WORDS = 3;
const endsClause = (w: Word) => /[,.?!:;…]$/.test(w.text);

const buildChunks = (): Chunk[] => {
  const chunks: Chunk[] = [];
  for (const scene of timeline.scenes) {
    for (const line of scene.lines) {
      const groups: Word[][] = [];
      let cur: Word[] = [];
      for (const w of line.words) {
        cur.push(w);
        if (cur.length >= MAX_WORDS || endsClause(w)) {
          groups.push(cur);
          cur = [];
        }
      }
      if (cur.length) {
        const last = groups[groups.length - 1];
        if (cur.length === 1 && last && last.length < 4 && !endsClause(last[last.length - 1])) last.push(...cur);
        else groups.push(cur);
      }
      groups.forEach((g, i) => {
        const next = groups[i + 1];
        chunks.push({ words: g, start: g[0].startFrame, end: next ? next[0].startFrame : line.endFrame + 6 });
      });
    }
  }
  return chunks;
};

export const CHUNKS = buildChunks();

export const Captions: React.FC<{ top?: number; hideScenes?: string[] }> = ({ top = 1300, hideScenes = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (timeline.scenes.some((s) => hideScenes.includes(s.id) && frame >= s.startFrame && frame < s.endFrame)) return null;
  const chunk = CHUNKS.find((c) => frame >= c.start && frame < c.end);
  if (!chunk) return null;
  const s = spring({ frame: frame - chunk.start, fps, config: { damping: 12, stiffness: 240, mass: 0.5 } });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 60,
        right: 60,
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "0 26px",
        transform: `scale(${0.75 + s * 0.25})`,
        opacity: Math.min(1, s * 2),
      }}
    >
      {chunk.words.map((w, i) => {
        const active = frame >= w.startFrame && frame < (chunk.words[i + 1]?.startFrame ?? chunk.end);
        return (
          <span
            key={i}
            style={{
              fontFamily: BODY_FONT,
              fontWeight: 900,
              fontSize: 86,
              lineHeight: 1.15,
              textTransform: "uppercase",
              color: active ? C.yellow : C.white,
              display: "inline-block",
              transform: `scale(${active ? 1.08 : 1}) translateY(${active ? -6 : 0}px)`,
              WebkitTextStroke: `14px ${C.outline}`,
              paintOrder: "stroke fill",
              textShadow: `0 8px 0 ${C.outline}`,
            }}
          >
            {w.text.replace(/[,;]$/, "")}
          </span>
        );
      })}
    </div>
  );
};
