import React from 'react';

const OUT = '#2B170B';
const FUR = '#8A5530';
const FUR_DARK = '#6A3D1F';

export const Mammoth: React.FC<{
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  frame: number;
  walking?: boolean;
  angry?: boolean;
  trunkUp?: number; // 0..1
}> = ({x, y, scale = 1, flip = false, frame, walking = false, angry = false, trunkUp = 0}) => {
  const ph = walking ? frame / 4 : 0;
  const bob = walking ? Math.abs(Math.sin(ph)) * -10 : Math.sin(frame / 12) * -4;
  const blink = frame % 71 < 3 ? 0.1 : 1;
  const ear = 1 + Math.sin(frame / 5) * 0.08;

  // tromba: cadeia de segmentos com onda
  const segs = 9;
  let px = 330;
  let py = -300;
  let ang = 95 - trunkUp * 150; // graus, 90 = para baixo
  const pts: [number, number][] = [[px, py]];
  for (let i = 0; i < segs; i++) {
    ang += Math.sin(frame / 7 + i * 0.6) * 4 + (trunkUp > 0.5 ? -9 : -3);
    const rad = (ang * Math.PI) / 180;
    px += Math.cos(rad) * 30;
    py += Math.sin(rad) * 30;
    pts.push([px, py]);
  }
  const trunkPath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');

  const legs = [-170, -70, 90, 180];

  return (
    <g transform={`translate(${x},${y}) scale(${(flip ? -1 : 1) * scale}, ${scale})`}>
      <ellipse cx={0} cy={8} rx={300} ry={30} fill="rgba(0,0,0,0.25)" />
      <g transform={`translate(0,${bob})`}>
        {legs.map((lx, i) => {
          const a = walking ? Math.sin(ph + (i % 2 ? Math.PI : 0)) * 14 : 0;
          return (
            <g key={i} transform={`translate(${lx},-170) rotate(${a})`}>
              <rect x={-42} y={-30} width={84} height={190} rx={34} fill={i % 2 ? FUR_DARK : FUR} stroke={OUT} strokeWidth={8} />
              <path d="M -38 150 Q 0 168 38 150" stroke="#E9D6B4" strokeWidth={10} fill="none" strokeLinecap="round" />
            </g>
          );
        })}

        {/* cauda */}
        <path
          d={`M -265 -320 Q -320 ${-300 + Math.sin(frame / 5) * 25} -310 -240`}
          stroke={FUR_DARK}
          strokeWidth={18}
          fill="none"
          strokeLinecap="round"
        />

        {/* corpo */}
        <path
          d="M -270 -300 Q -280 -470 -120 -500 Q 40 -560 180 -470 Q 280 -420 270 -300 Q 260 -170 120 -150 L -160 -150 Q -270 -170 -270 -300 Z"
          fill={FUR}
          stroke={OUT}
          strokeWidth={9}
        />
        {/* franja de pelo */}
        <path
          d="M -250 -220 L -230 -165 L -205 -215 L -180 -160 L -150 -212 L -120 -158 L -90 -210 L -60 -156 L -30 -210 L 0 -155 L 30 -210 L 60 -156 L 90 -210 L 120 -160 L 150 -215"
          stroke={FUR_DARK}
          strokeWidth={10}
          fill="none"
          strokeLinejoin="round"
        />
        <path d="M -150 -440 Q -100 -470 -40 -455 M -60 -400 Q 0 -420 60 -405" stroke={FUR_DARK} strokeWidth={9} fill="none" strokeLinecap="round" />

        {/* orelha */}
        <g transform={`translate(170,-400) scale(${ear},1)`}>
          <ellipse cx={-20} cy={0} rx={70} ry={90} fill={FUR_DARK} stroke={OUT} strokeWidth={8} />
        </g>

        {/* cabeça */}
        <path d="M 180 -470 Q 280 -560 350 -450 Q 380 -360 340 -290 Q 280 -260 230 -300 Q 170 -360 180 -470 Z" fill={FUR} stroke={OUT} strokeWidth={9} />

        {/* tromba */}
        <path d={trunkPath} stroke={OUT} strokeWidth={66} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={trunkPath} stroke={FUR} strokeWidth={50} fill="none" strokeLinecap="round" strokeLinejoin="round" />

        {/* presas */}
        <path d="M 300 -310 Q 380 -230 450 -300 Q 460 -320 440 -315 Q 380 -265 320 -330 Z" fill="#F7EEDB" stroke={OUT} strokeWidth={7} strokeLinejoin="round" />

        {/* olho */}
        <g transform={`translate(300,-415) scale(1,${blink})`}>
          <ellipse cx={0} cy={0} rx={20} ry={24} fill="#fff" stroke={OUT} strokeWidth={6} />
          <circle cx={6} cy={2} r={10} fill="#140b05" />
          <circle cx={9} cy={-3} r={3.5} fill="#fff" />
        </g>
        <path
          d={angry ? 'M 270 -460 L 335 -440' : 'M 275 -455 Q 300 -468 330 -455'}
          stroke={OUT}
          strokeWidth={10}
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </g>
  );
};
