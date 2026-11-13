import React from 'react';
import {AbsoluteFill} from 'remotion';
import {wobble} from '../lib';

const OUT = '#2B170B';

export const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill>
    <svg width="1080" height="1920" viewBox="0 0 1080 1920">
      {children}
    </svg>
  </AbsoluteFill>
);

/** Raios girando — fundo de alto impacto para o gancho e o final. */
export const Rays: React.FC<{frame: number; c1: string; c2: string; cx?: number; cy?: number}> = ({
  frame,
  c1,
  c2,
  cx = 540,
  cy = 900,
}) => {
  const n = 16;
  return (
    <g>
      <rect width="1080" height="1920" fill={c1} />
      <g transform={`translate(${cx},${cy}) rotate(${frame * 0.6})`}>
        {Array.from({length: n}).map((_, i) => {
          const a1 = (i / n) * Math.PI * 2;
          const a2 = ((i + 0.5) / n) * Math.PI * 2;
          const R = 2400;
          return (
            <path
              key={i}
              d={`M 0 0 L ${Math.cos(a1) * R} ${Math.sin(a1) * R} L ${Math.cos(a2) * R} ${Math.sin(a2) * R} Z`}
              fill={c2}
            />
          );
        })}
      </g>
      <radialGradient id="vign" cx="50%" cy="50%" r="70%">
        <stop offset="55%" stopColor="rgba(0,0,0,0)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.45)" />
      </radialGradient>
      <rect width="1080" height="1920" fill="url(#vign)" />
    </g>
  );
};

export const Cloud: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={0.95}>
    <ellipse cx={0} cy={0} rx={90} ry={45} fill="#fff" />
    <ellipse cx={-70} cy={15} rx={60} ry={35} fill="#fff" />
    <ellipse cx={75} cy={15} rx={65} ry={35} fill="#fff" />
    <ellipse cx={20} cy={-30} rx={55} ry={40} fill="#fff" />
  </g>
);

export const Fern: React.FC<{x: number; y: number; s?: number; frame: number; color?: string}> = ({
  x,
  y,
  s = 1,
  frame,
  color = '#3E8E3A',
}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {[-60, -30, 0, 30, 60].map((a, i) => (
      <g key={i} transform={`rotate(${a + Math.sin(frame / 15 + i) * 4})`}>
        <path d="M 0 0 Q -25 -110 0 -230 Q 25 -110 0 0 Z" fill={color} stroke={OUT} strokeWidth={5} />
      </g>
    ))}
  </g>
);

export const PalmTree: React.FC<{x: number; y: number; s?: number; frame: number}> = ({x, y, s = 1, frame}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M -20 0 Q -10 -250 40 -480 L 75 -475 Q 30 -250 25 0 Z" fill="#8A5A30" stroke={OUT} strokeWidth={7} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <path
        key={i}
        transform={`translate(58,-480) rotate(${i * 60 + Math.sin(frame / 12 + i) * 6})`}
        d="M 0 0 Q 90 -60 210 10 Q 100 -10 0 0 Z"
        fill="#3F9A45"
        stroke={OUT}
        strokeWidth={6}
      />
    ))}
  </g>
);

export const Volcano: React.FC<{x: number; y: number; frame: number}> = ({x, y, frame}) => (
  <g transform={`translate(${x},${y})`}>
    {[0, 1, 2, 3].map((i) => {
      const t = ((frame + i * 25) % 100) / 100;
      return (
        <circle
          key={i}
          cx={Math.sin(t * 6 + i) * 30 + t * 60}
          cy={-330 - t * 380}
          r={40 + t * 70}
          fill="#7d7d8a"
          opacity={0.75 * (1 - t)}
        />
      );
    })}
    <path d="M -330 0 L -70 -320 L 70 -320 L 330 0 Z" fill="#6B4F45" stroke={OUT} strokeWidth={8} strokeLinejoin="round" />
    <path d="M -70 -320 L -40 -260 L -10 -300 L 20 -240 L 45 -290 L 70 -320 Z" fill="#FF6A1F" />
  </g>
);

export const Landscape: React.FC<{frame: number; pan?: number}> = ({frame, pan = 0}) => (
  <g>
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5BC0F0" />
        <stop offset="0.7" stopColor="#BDE8F7" />
        <stop offset="1" stopColor="#FFE3A3" />
      </linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#sky)" />
    <g transform={`translate(860,320) rotate(${frame})`}>
      {Array.from({length: 12}).map((_, i) => (
        <rect key={i} x={-8} y={-170} width={16} height={50} rx={8} fill="#FFC93C" transform={`rotate(${i * 30})`} />
      ))}
      <circle r={95} fill="#FFD84A" stroke="#F2A93B" strokeWidth={8} />
    </g>
    <Cloud x={((frame * 1.2 + 200) % 1400) - 200} y={260} s={1.1} />
    <Cloud x={((frame * 0.8 + 900) % 1400) - 200} y={480} s={0.8} />
    <g transform={`translate(${-pan * 0.2},0)`}>
      <Volcano x={300} y={1150} frame={frame} />
      <path d="M -200 1150 L 150 880 L 420 1150 Z M 500 1150 L 850 820 L 1300 1150 Z" fill="#8A7C9C" stroke={OUT} strokeWidth={7} />
    </g>
    <g transform={`translate(${-pan * 0.5},0)`}>
      <path d="M -300 1250 Q 100 1050 500 1200 Q 900 1060 1400 1220 L 1400 1920 L -300 1920 Z" fill="#7FB55A" stroke={OUT} strokeWidth={7} />
    </g>
    <g transform={`translate(${-pan},0)`}>
      <path d="M -400 1500 Q 300 1400 1500 1480 L 1500 1920 L -400 1920 Z" fill="#D9B276" stroke={OUT} strokeWidth={7} />
      {[[-80, 1560], [240, 1700], [700, 1590], [1000, 1760], [1300, 1620]].map(([rx, ry], i) => (
        <ellipse key={i} cx={rx} cy={ry} rx={40} ry={18} fill="#B48D57" />
      ))}
      <PalmTree x={-40} y={1540} s={1.1} frame={frame} />
      <Fern x={1010} y={1530} frame={frame} />
      <Fern x={120} y={1910} s={1.2} frame={frame} color="#2F7A33" />
    </g>
  </g>
);

export const NightSky: React.FC<{frame: number}> = ({frame}) => (
  <g>
    <defs>
      <linearGradient id="night" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0B1033" />
        <stop offset="1" stopColor="#3A2B5E" />
      </linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#night)" />
    {Array.from({length: 45}).map((_, i) => {
      const sx = (i * 197) % 1080;
      const sy = (i * 311) % 1100;
      const tw = 0.5 + 0.5 * Math.sin(frame / 6 + i);
      return <circle key={i} cx={sx} cy={sy} r={2 + (i % 3)} fill="#fff" opacity={0.3 + tw * 0.7} />;
    })}
    <circle cx={820} cy={300} r={90} fill="#FFF4C7" />
    <circle cx={850} cy={280} r={80} fill="#0E1438" />
  </g>
);

export const Fire: React.FC<{x: number; y: number; s?: number; frame: number}> = ({x, y, s = 1, frame}) => {
  const t = frame / 3;
  const flame = (w: number, h: number, color: string, seed: number) => {
    const sx = 1 + wobble(t, seed) * 0.12;
    const sy = 1 + wobble(t * 1.2, seed + 3) * 0.18;
    const lean = wobble(t * 0.8, seed + 7) * 18;
    return (
      <path
        transform={`scale(${sx},${sy})`}
        d={`M ${-w} 0 Q ${-w} ${-h * 0.5} ${lean} ${-h} Q ${w} ${-h * 0.5} ${w} 0 Q 0 ${h * 0.18} ${-w} 0 Z`}
        fill={color}
      />
    );
  };
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <circle cx={0} cy={-80} r={330 + wobble(t, 1) * 20} fill="url(#glow)" />
      <defs>
        <radialGradient id="glow">
          <stop offset="0" stopColor="rgba(255,170,60,0.55)" />
          <stop offset="1" stopColor="rgba(255,120,30,0)" />
        </radialGradient>
      </defs>
      {flame(95, 270, '#E8361C', 0)}
      {flame(70, 210, '#FF8A1F', 2)}
      {flame(42, 140, '#FFD43B', 4)}
      {Array.from({length: 8}).map((_, i) => {
        const p = ((frame * 1.5 + i * 23) % 60) / 60;
        return (
          <circle key={i} cx={Math.sin(i * 3 + p * 5) * 60} cy={-120 - p * 300} r={7 * (1 - p)} fill="#FFC53D" opacity={1 - p} />
        );
      })}
      <rect x={-130} y={-20} width={260} height={42} rx={21} fill="#7A4A2A" stroke={OUT} strokeWidth={7} transform="rotate(12)" />
      <rect x={-130} y={-20} width={260} height={42} rx={21} fill="#8F5A33" stroke={OUT} strokeWidth={7} transform="rotate(-12)" />
      {[-150, -75, 0, 75, 150].map((sx, i) => (
        <ellipse key={i} cx={sx} cy={30} rx={38} ry={24} fill="#8E8E99" stroke={OUT} strokeWidth={6} />
      ))}
    </g>
  );
};

/** Ícones desenhados (sem depender de fontes de emoji). */
export const IconHouse: React.FC = () => (
  <g>
    <path d="M -90 -10 L 0 -95 L 90 -10 Z" fill="#E2453C" stroke={OUT} strokeWidth={8} strokeLinejoin="round" />
    <rect x={-70} y={-12} width={140} height={100} fill="#F7E3B5" stroke={OUT} strokeWidth={8} />
    <rect x={-20} y={25} width={40} height={63} fill="#8A5A30" stroke={OUT} strokeWidth={6} />
  </g>
);

export const IconCart: React.FC = () => (
  <g>
    <path d="M -100 -70 L -70 -70 L -45 40 L 75 40 L 95 -40 L -60 -40" fill="none" stroke={OUT} strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" />
    <path d="M -55 -40 L 92 -40 L 75 25 L -42 25 Z" fill="#3FA2E8" />
    <circle cx={-35} cy={70} r={16} fill={OUT} />
    <circle cx={65} cy={70} r={16} fill={OUT} />
  </g>
);

export const IconPhone: React.FC = () => (
  <g>
    <rect x={-55} y={-95} width={110} height={190} rx={20} fill="#222" stroke={OUT} strokeWidth={8} />
    <rect x={-42} y={-75} width={84} height={140} rx={8} fill="#6BD3FF" />
    <circle cx={0} cy={80} r={8} fill="#666" />
  </g>
);

export const RedX: React.FC<{p: number}> = ({p}) => (
  <g transform={`scale(${0.4 + p * 0.6}) rotate(${(1 - p) * -40})`} opacity={Math.min(1, p * 2)}>
    <path d="M -95 -95 L 95 95 M 95 -95 L -95 95" stroke="#fff" strokeWidth={46} strokeLinecap="round" />
    <path d="M -95 -95 L 95 95 M 95 -95 L -95 95" stroke="#E5202E" strokeWidth={30} strokeLinecap="round" />
  </g>
);

export const Bush: React.FC<{x: number; y: number; s?: number; frame: number; picked?: number}> = ({
  x,
  y,
  s = 1,
  frame,
  picked = 0,
}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={-90} rx={170} ry={110} fill="#3F8F3E" stroke={OUT} strokeWidth={7} />
    <ellipse cx={-100} cy={-60} rx={90} ry={70} fill="#4BA348" stroke={OUT} strokeWidth={7} />
    <ellipse cx={100} cy={-55} rx={95} ry={70} fill="#4BA348" stroke={OUT} strokeWidth={7} />
    {[
      [-110, -90],
      [-40, -150],
      [40, -100],
      [110, -80],
      [0, -50],
      [-70, -30],
      [80, -150],
    ].map(([bx, by], i) =>
      i < 7 - Math.floor(picked * 4) ? (
        <circle
          key={i}
          cx={bx}
          cy={by + Math.sin(frame / 8 + i) * 2}
          r={17}
          fill={i % 2 ? '#7B2FBF' : '#E0284F'}
          stroke={OUT}
          strokeWidth={4}
        />
      ) : null,
    )}
  </g>
);

export const Brain: React.FC<{s?: number}> = ({s = 1}) => (
  <g transform={`scale(${s})`}>
    <path
      d="M -120 10 Q -150 -60 -90 -100 Q -60 -150 0 -125 Q 60 -150 90 -100 Q 150 -60 120 10 Q 110 70 40 70 Q 0 95 -40 70 Q -110 70 -120 10 Z"
      fill="#FF9DB5"
      stroke={OUT}
      strokeWidth={9}
    />
    <path d="M 0 -120 L 0 70 M -80 -60 Q -40 -40 -70 0 M 80 -60 Q 40 -40 70 0 M -60 40 Q -30 20 -20 50 M 60 40 Q 30 20 20 50" stroke="#D9607F" strokeWidth={8} fill="none" strokeLinecap="round" />
  </g>
);
