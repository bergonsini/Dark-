import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {T, f, pop} from '../lib';

export const TITLE_FONT = 'Luckiest Guy, Nunito, sans-serif';
export const BODY_FONT = 'Nunito, sans-serif';

/** Texto grande com contorno grosso, cada palavra entra com "pop". */
export const BigText: React.FC<{
  text: string;
  top: number;
  at?: number;
  stagger?: number;
  size?: number;
  color?: string;
  stroke?: string;
  highlight?: Record<string, string>;
  rotate?: number;
  width?: number;
}> = ({text, top, at = 0, stagger = 4, size = 110, color = '#fff', stroke = '#1A0E05', highlight = {}, rotate = 0, width = 980}) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div
        style={{
          position: 'absolute',
          top,
          width,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: `0 ${size * 0.42}px`,
          transform: `rotate(${rotate}deg)`,
          fontFamily: TITLE_FONT,
          fontSize: size,
          lineHeight: 1.08,
          textAlign: 'center',
        }}
      >
        {words.map((w, i) => {
          const p = pop(frame, at + i * stagger);
          const key = w.replace(/[^\p{L}\d]/gu, '').toUpperCase();
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                color: highlight[key] ?? color,
                transform: `scale(${p}) translateY(${(1 - p) * 60}px)`,
                opacity: Math.min(1, p * 3),
                WebkitTextStroke: `${size * 0.14}px ${stroke}`,
                paintOrder: 'stroke fill',
                textShadow: `0 ${size * 0.09}px 0 ${stroke}`,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Faixa/etiqueta colorida. */
export const Badge: React.FC<{
  text: string;
  x: number;
  y: number;
  p: number;
  bg: string;
  color?: string;
  size?: number;
  rotate?: number;
}> = ({text, x, y, p, bg, color = '#fff', size = 64, rotate = -3}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `translate(-50%,-50%) rotate(${rotate}deg) scale(${p})`,
      background: bg,
      color,
      fontFamily: TITLE_FONT,
      fontSize: size,
      padding: `${size * 0.22}px ${size * 0.5}px ${size * 0.08}px`,
      borderRadius: size * 0.4,
      border: `${Math.max(6, size * 0.1)}px solid #1A0E05`,
      boxShadow: `0 ${size * 0.14}px 0 #1A0E05`,
      whiteSpace: 'nowrap',
      WebkitTextStroke: `${size * 0.08}px #1A0E05`,
      paintOrder: 'stroke fill',
    }}
  >
    {text}
  </div>
);

/** Legendas sincronizadas: grupos de até 3 palavras, palavra atual destacada. */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / T.fps;

  // agrupa palavras em blocos curtos (quebra em pontuação)
  const groups: (typeof T.words)[] = [];
  let cur: typeof T.words = [];
  T.words.forEach((w) => {
    cur.push(w);
    if (cur.length >= 3 || /[,.!?:]$/.test(w.word)) {
      groups.push(cur);
      cur = [];
    }
  });
  if (cur.length) groups.push(cur);

  const gi = groups.findIndex((g, i) => {
    const next = groups[i + 1];
    const end = next ? Math.min(next[0].start, g[g.length - 1].end + 0.5) : g[g.length - 1].end + 0.6;
    return t >= g[0].start - 0.05 && t < end;
  });
  if (gi < 0) return null;
  const g = groups[gi];
  const enter = pop(frame, f(g[0].start - 0.05), 11);

  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div
        style={{
          position: 'absolute',
          top: 1330,
          width: 960,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0 40px',
          transform: `scale(${0.7 + enter * 0.3})`,
          fontFamily: BODY_FONT,
          fontWeight: 900,
          fontSize: 92,
          lineHeight: 1.1,
          textTransform: 'uppercase',
        }}
      >
        {g.map((w, i) => {
          const active = t >= w.start - 0.02 && t < (g[i + 1]?.start ?? w.end + 0.6);
          const said = t >= w.start - 0.02;
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                color: active ? '#FFE135' : said ? '#fff' : 'rgba(255,255,255,0.85)',
                transform: `scale(${active ? 1.12 : 1}) rotate(${active ? -2 : 0}deg)`,
                WebkitTextStroke: '14px #000',
                paintOrder: 'stroke fill',
                textShadow: '0 8px 0 #000',
              }}
            >
              {w.word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
