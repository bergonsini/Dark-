import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BODY_FONT } from "../fonts";
import { C } from "../theme";
import { timeline, Word } from "../timeline";

type Chunk = { words: Word[]; start: number; end: number };

const MAX_WORDS = 3;

/** Divide cada frase da narração em blocos curtos (estilo TikTok). */
const buildChunks = (): Chunk[] => {
  const chunks: Chunk[] = [];
  for (const scene of timeline.scenes) {
    for (const line of scene.lines) {
      const groups: Word[][] = [];
      let cur: Word[] = [];
      for (const w of line.words) {
        cur.push(w);
        const endsClause = /[,.?!:]$/.test(w.text);
        if (cur.length >= MAX_WORDS || endsClause) {
          groups.push(cur);
          cur = [];
        }
      }
      if (cur.length) {
        if (cur.length === 1 && groups.length && groups[groups.length - 1].length < 4 && !/[,.?!:]$/.test(groups[groups.length - 1].slice(-1)[0].text)) {
          groups[groups.length - 1].push(...cur);
        } else {
          groups.push(cur);
        }
      }
      groups.forEach((g, i) => {
        const next = groups[i + 1];
        chunks.push({
          words: g,
          start: g[0].startFrame,
          end: next ? next[0].startFrame : line.endFrame + 8,
        });
      });
    }
  }
  return chunks;
};

const CHUNKS = buildChunks();

export const Captions: React.FC<{ top?: number; hideScenes?: string[] }> = ({ top = 1340, hideScenes = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hiddenRanges = timeline.scenes.filter((s) => hideScenes.includes(s.id));
  if (hiddenRanges.some((s) => frame >= s.startFrame && frame < s.endFrame)) return null;

  const chunk = CHUNKS.find((c) => frame >= c.start && frame < c.end);
  if (!chunk) return null;
  const s = spring({ frame: frame - chunk.start, fps, config: { damping: 11, stiffness: 220, mass: 0.5 } });

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 50,
        right: 50,
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "0 30px",
        transform: `scale(${0.7 + s * 0.3})`,
        opacity: Math.min(1, s * 2),
      }}
    >
      {chunk.words.map((w, i) => {
        const active = frame >= w.startFrame && frame < (chunk.words[i + 1]?.startFrame ?? chunk.end);
        const said = frame >= w.startFrame;
        return (
          <span
            key={i}
            style={{
              fontFamily: BODY_FONT,
              fontWeight: 900,
              fontSize: 92,
              lineHeight: 1.15,
              textTransform: "uppercase",
              color: active ? C.yellow : said ? C.white : "rgba(255,255,255,0.85)",
              display: "inline-block",
              transform: `scale(${active ? 1.06 : 1}) translateY(${active ? -6 : 0}px)`,
              WebkitTextStroke: `14px ${C.outline}`,
              paintOrder: "stroke fill",
              textShadow: `0 8px 0 ${C.outline}`,
            }}
          >
            {w.text.replace(/[,]$/, "")}
          </span>
        );
      })}
    </div>
  );
};
