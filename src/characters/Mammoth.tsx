import React from "react";
import { useCurrentFrame } from "remotion";
import { blink } from "../lib";

const INK = "#2a1608";

/** Mamute cartoon original (vista lateral, olhando para a esquerda). Pés em (0,0). */
export const Mammoth: React.FC<{
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  walk?: number;
  trumpet?: number; // 0..1 levanta a tromba e abre a boca
  angry?: number;
}> = ({ x, y, scale = 1, flip, walk = 0, trumpet = 0, angry = 0 }) => {
  const frame = useCurrentFrame();
  const ph = frame * walk * 0.22;
  const bob = walk ? Math.abs(Math.sin(ph)) * 10 : Math.sin(frame * 0.08) * 3;
  const closed = blink(frame, 9);
  const sway = Math.sin(frame * 0.1) * 12 * (1 - trumpet);

  // tromba: curva de Bézier que balança ou levanta
  const tipX = -250 + sway * 0.5 - trumpet * 40;
  const tipY = -60 + sway - trumpet * 330;
  const trunk = `M -170 -250 C -230 -230 ${-250 - trumpet * 30} ${-170 - trumpet * 100} ${tipX} ${tipY}`;

  const leg = (lx: number, a: number, dark?: boolean) => (
    <g transform={`translate(${lx},-150) rotate(${a})`}>
      <rect x={-34} y={0} width={68} height={155} rx={26} fill={dark ? "#6b3f22" : "#82512c"} stroke={INK} strokeWidth={8} />
      <path d="M -26 140 l 0 12 M 0 142 l 0 12 M 26 140 l 0 12" stroke="#f0e2c4" strokeWidth={8} strokeLinecap="round" />
    </g>
  );

  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -scale : scale},${scale})`}>
      <ellipse cx={0} cy={6} rx={280} ry={30} fill="rgba(0,0,0,0.25)" />
      <g transform={`translate(0,${-bob})`}>
        {leg(-110, walk ? Math.sin(ph + 1.5) * 18 : 0, true)}
        {leg(120, walk ? Math.sin(ph + 4.6) * 18 : 0, true)}
        {/* rabo */}
        <path d={`M 250 -270 q 40 ${30 + Math.sin(frame * 0.3) * 20} 30 90`} stroke={INK} strokeWidth={10} fill="none" strokeLinecap="round" />
        {/* corpo peludo */}
        <path
          d="M -200 -260 Q -220 -420 -40 -440 Q 180 -460 260 -330 Q 300 -230 240 -150 L -170 -140 Q -230 -170 -200 -260 Z"
          fill="#9c6236"
          stroke={INK}
          strokeWidth={9}
        />
        {/* tufos de pelo */}
        {Array.from({ length: 12 }).map((_, i) => {
          const px = -160 + i * 36;
          const w = Math.sin(frame * 0.2 + i) * 4;
          return <path key={i} d={`M ${px} -150 q 10 ${30 + w} 22 0`} fill="#7a4523" stroke={INK} strokeWidth={6} />;
        })}
        {[[-60, -360], [40, -380], [140, -340], [0, -280], [120, -250], [-120, -300]].map(([fx, fy], i) => (
          <path key={i} d={`M ${fx} ${fy} q 16 -14 30 0 q 16 -14 30 0`} stroke="#6b3a1c" strokeWidth={7} fill="none" strokeLinecap="round" />
        ))}
        {leg(-60, walk ? Math.sin(ph) * 22 : 0)}
        {leg(170, walk ? Math.sin(ph + 3.1) * 22 : 0)}
        {/* cabeça */}
        <g transform={`rotate(${-trumpet * 8 + angry * 4}, -150, -300)`}>
          <path d="M -120 -380 Q -170 -470 -240 -400 Q -290 -330 -240 -250 Q -190 -200 -130 -250 Z" fill="#a56a3b" stroke={INK} strokeWidth={9} />
          {/* topete */}
          <path d="M -210 -440 q 10 -40 30 -10 q 10 -40 30 0" fill="#7a4523" stroke={INK} strokeWidth={7} />
          {/* orelha */}
          <path
            d={`M -130 -360 Q ${-60 + Math.sin(frame * 0.15) * 10} -380 -70 -300 Q -90 -250 -140 -280 Z`}
            fill="#8a5530"
            stroke={INK}
            strokeWidth={8}
          />
          {/* tromba */}
          <path d={trunk} stroke={INK} strokeWidth={70} fill="none" strokeLinecap="round" />
          <path d={trunk} stroke="#a56a3b" strokeWidth={56} fill="none" strokeLinecap="round" />
          {[0.3, 0.5, 0.7].map((t, i) => (
            <circle key={i} cx={-170 + (tipX + 170) * t} cy={-250 + (tipY + 250) * t} r={0} />
          ))}
          {/* presa */}
          <path d="M -200 -255 Q -260 -150 -330 -190 Q -260 -170 -215 -275 Z" fill="#fff6e0" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
          {/* boca */}
          {trumpet > 0.2 && <ellipse cx={-160} cy={-240} rx={20} ry={14 * trumpet + 4} fill="#5a1414" stroke={INK} strokeWidth={5} />}
          {/* olho */}
          <g transform="translate(-195,-355)">
            <g transform={`scale(1,${Math.max(0.05, 1 - closed)})`}>
              <ellipse rx={20} ry={24} fill="white" stroke={INK} strokeWidth={6} />
              <circle cx={-6} cy={2} r={10} fill={INK} />
              <circle cx={-2} cy={-3} r={3.5} fill="white" />
            </g>
            <path d={`M -26 ${-34 + angry * 8} L 22 ${-30 - angry * 6}`} stroke={INK} strokeWidth={9} strokeLinecap="round" />
          </g>
        </g>
      </g>
    </g>
  );
};
