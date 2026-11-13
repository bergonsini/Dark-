import React from "react";
import { C } from "../theme";

/** Mamute cartoon original com tromba, orelhas, olhos e patas animados. */
export const Mammoth: React.FC<{
  frame: number;
  width?: number;
  /** 0..1: intensidade da pisada (levanta pata e balança o corpo) */
  stomp?: number;
  angry?: boolean;
  style?: React.CSSProperties;
}> = ({ frame, width = 560, stomp = 0, angry = false, style }) => {
  const trunk = Math.sin(frame / 7) * 12;
  const ear = Math.sin(frame / 5) * 6;
  const tail = Math.sin(frame / 4) * 15;
  const lift = Math.max(0, Math.sin(frame / 6)) * 24 * stomp;
  const lift2 = Math.max(0, -Math.sin(frame / 6)) * 24 * stomp;
  const sway = Math.sin(frame / 6) * 2.5 * stomp;
  const blink = (frame + 30) % 100 < 6 ? 1 : 0;
  const fur = "#7A4B2A";
  const furDark = "#5C351C";
  return (
    <svg viewBox="0 0 600 520" width={width} height={(width * 520) / 600} style={{ overflow: "visible", ...style }}>
      <ellipse cx={320} cy={505} rx={230} ry={18} fill="rgba(0,0,0,0.25)" />
      <g transform={`rotate(${sway} 320 500)`}>
        {/* rabo */}
        <g transform={`rotate(${tail} 520 250)`}>
          <path d="M 520 250 Q 570 280 560 330" fill="none" stroke={furDark} strokeWidth={12} strokeLinecap="round" />
          <ellipse cx={560} cy={338} rx={14} ry={20} fill={furDark} />
        </g>
        {/* patas traseiras */}
        <rect x={420} y={340 - lift2} width={70} height={160} rx={28} fill={furDark} stroke={C.outline} strokeWidth={7} />
        <rect x={210} y={340 - lift} width={70} height={160} rx={28} fill={furDark} stroke={C.outline} strokeWidth={7} />
        {/* corpo */}
        <path
          d="M 120 230 Q 150 70 330 70 Q 540 70 545 260 Q 550 390 440 400 L 190 400 Q 110 390 120 230 Z"
          fill={fur}
          stroke={C.outline}
          strokeWidth={8}
        />
        {/* pelos */}
        {[...Array(12)].map((_, i) => {
          const x = 200 + i * 28;
          const y = 120 + ((i * 37) % 60);
          return <path key={i} d={`M ${x} ${y} q 8 18 0 36`} fill="none" stroke={furDark} strokeWidth={6} strokeLinecap="round" />;
        })}
        <path d="M 180 395 l 20 30 l 18 -28 l 20 30 l 18 -30 l 20 30 l 18 -30 l 20 30 l 18 -30 l 20 30 l 18 -30 l 20 30 l 18 -30 l 20 28 l 20 -30" fill={fur} stroke={C.outline} strokeWidth={6} strokeLinejoin="round" />
        {/* patas da frente */}
        <rect x={160} y={350 + lift2 * 0} width={74} height={150} rx={28} fill={fur} stroke={C.outline} strokeWidth={7} transform={`translate(0 ${-lift2})`} />
        <rect x={360} y={350} width={74} height={150} rx={28} fill={fur} stroke={C.outline} strokeWidth={7} transform={`translate(0 ${-lift})`} />
        {/* cabeça */}
        <g>
          <circle cx={150} cy={190} r={110} fill={fur} stroke={C.outline} strokeWidth={8} />
          {/* topete */}
          <path d="M 110 90 q 20 -50 40 -10 q 20 -50 40 0" fill={furDark} stroke={C.outline} strokeWidth={6} />
          {/* orelha */}
          <g transform={`rotate(${ear} 220 170)`}>
            <path d="M 210 120 Q 300 120 290 210 Q 280 280 220 250 Z" fill={furDark} stroke={C.outline} strokeWidth={7} />
          </g>
          {/* olho */}
          <ellipse cx={120} cy={170} rx={20} ry={blink ? 3 : 24} fill={C.white} stroke={C.outline} strokeWidth={5} />
          {!blink && <circle cx={112} cy={174} r={11} fill={C.outline} />}
          {!blink && <circle cx={108} cy={169} r={4} fill={C.white} />}
          <path
            d={angry ? "M 90 130 L 150 150" : "M 92 136 Q 120 120 148 136"}
            stroke={C.outline}
            strokeWidth={9}
            strokeLinecap="round"
            fill="none"
          />
          {/* presas */}
          <path d="M 120 260 Q 60 330 0 280 Q 60 300 100 240 Z" fill="#FFF7E6" stroke={C.outline} strokeWidth={6} strokeLinejoin="round" />
          <path d="M 175 265 Q 130 345 60 320 Q 120 320 150 250 Z" fill="#FFF7E6" stroke={C.outline} strokeWidth={6} strokeLinejoin="round" />
          {/* tromba */}
          <g transform={`rotate(${trunk} 85 230)`}>
            <path
              d="M 95 210 Q 30 260 50 360 Q 60 410 20 420 Q 5 400 25 380 Q 40 350 30 300"
              fill="none"
              stroke={C.outline}
              strokeWidth={50}
              strokeLinecap="round"
            />
            <path
              d="M 95 210 Q 30 260 50 360 Q 60 410 20 420 Q 5 400 25 380 Q 40 350 30 300"
              fill="none"
              stroke={fur}
              strokeWidth={36}
              strokeLinecap="round"
            />
            {[260, 300, 340].map((y) => (
              <path key={y} d={`M ${30} ${y} q 18 6 36 0`} stroke={furDark} strokeWidth={4} fill="none" />
            ))}
          </g>
        </g>
      </g>
    </svg>
  );
};
