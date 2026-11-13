import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';

export type TransitionType = 'swipe' | 'iris' | 'shutter' | 'flash' | 'zoom';

const HALF = 9; // frames antes/depois do corte

/**
 * Sobreposição que esconde o corte entre cenas. `at` = frame global do corte.
 */
export const Transition: React.FC<{at: number; type: TransitionType; color: string; color2?: string}> = ({
  at,
  type,
  color,
  color2 = '#FFE135',
}) => {
  const frame = useCurrentFrame();
  const d = frame - at;
  if (d < -HALF || d > HALF) return null;
  const p = interpolate(d, [-HALF, HALF], [0, 1], {easing: Easing.inOut(Easing.cubic)});

  if (type === 'swipe') {
    const x = interpolate(p, [0, 1], [-2600, 1500]);
    return (
      <AbsoluteFill>
        <svg width="1080" height="1920">
          <g transform={`translate(${x},0)`}>
            <path d="M 0 -100 L 1300 -100 L 900 2020 L -400 2020 Z" fill={color2} />
            <path d="M 160 -100 L 1460 -100 L 1060 2020 L -240 2020 Z" fill={color} />
            <path d="M 1300 -100 L 1400 -100 L 1000 2020 L 900 2020 Z" fill="#1A0E05" opacity={0.25} />
          </g>
        </svg>
      </AbsoluteFill>
    );
  }

  if (type === 'iris') {
    // fecha em círculo até o centro e reabre
    const r = d < 0 ? interpolate(d, [-HALF, 0], [1300, 0]) : interpolate(d, [0, HALF], [0, 1300]);
    return (
      <AbsoluteFill>
        <svg width="1080" height="1920">
          <defs>
            <mask id="iris">
              <rect width="1080" height="1920" fill="#fff" />
              <circle cx={540} cy={900} r={Math.max(0, r)} fill="#000" />
            </mask>
          </defs>
          <rect width="1080" height="1920" fill={color} mask="url(#iris)" />
          <circle cx={540} cy={900} r={Math.max(0, r)} fill="none" stroke={color2} strokeWidth={30} />
        </svg>
      </AbsoluteFill>
    );
  }

  if (type === 'shutter') {
    const n = 8;
    const cover = d < 0 ? interpolate(d, [-HALF, 0], [0, 1]) : interpolate(d, [0, HALF], [1, 0]);
    return (
      <AbsoluteFill>
        {Array.from({length: n}).map((_, i) => {
          const delay = (i % 2) * 0.15;
          const c = Math.max(0, Math.min(1, cover * 1.2 - delay));
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: (1920 / n) * i,
                height: 1920 / n + 2,
                left: i % 2 ? 1080 - 1080 * c : 0,
                width: 1080 * c,
                background: i % 2 ? color : color2,
              }}
            />
          );
        })}
      </AbsoluteFill>
    );
  }

  if (type === 'zoom') {
    const s = d < 0 ? interpolate(d, [-HALF, 0], [0, 30]) : 30;
    const o = d < 0 ? 1 : interpolate(d, [0, HALF], [1, 0]);
    return (
      <AbsoluteFill style={{opacity: o}}>
        <svg width="1080" height="1920">
          <g transform={`translate(540,900) scale(${s}) rotate(${d * 6})`}>
            <path d="M 0 -60 L 18 -18 L 60 -15 L 28 12 L 38 55 L 0 32 L -38 55 L -28 12 L -60 -15 L -18 -18 Z" fill={color} />
          </g>
          {d >= 0 && <rect width="1080" height="1920" fill={color} />}
        </svg>
      </AbsoluteFill>
    );
  }

  // flash
  const o = interpolate(Math.abs(d), [0, HALF], [1, 0]);
  return <AbsoluteFill style={{background: color, opacity: o}} />;
};

/** Entrada da cena: "soco" de zoom + leve rotação. */
export const usePunchIn = (strength = 0.18) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [0, 14], [1 + strength, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(2)),
  });
  const r = interpolate(frame, [0, 14], [strength * 12, 0], {extrapolateRight: 'clamp'});
  return {transform: `scale(${s}) rotate(${r}deg)`};
};
