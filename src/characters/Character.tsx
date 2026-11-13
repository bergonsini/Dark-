import React from 'react';

export type Expression = 'happy' | 'shock' | 'think' | 'sleep' | 'grin';

export type CharacterProps = {
  variant?: 'gruk' | 'una';
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  frame: number;
  talk?: number; // 0..1 abertura da boca (lip-sync)
  look?: [number, number]; // direção do olhar -1..1
  armL?: number; // graus (0 = braço caído, 90 = horizontal, 170 = para cima)
  armR?: number;
  expression?: Expression;
  prop?: 'club' | 'spear' | 'stick' | 'berries' | 'none';
  walking?: boolean;
  sitting?: boolean;
  tilt?: number;
  squash?: number; // 1 = normal; <1 achata, >1 estica
};

const SKIN = {gruk: '#E3A576', una: '#EDB58A'};
const SKIN_DARK = {gruk: '#C98757', una: '#D4966A'};
const OUT = '#3B2314';
const SW = 7;

const Leopard: React.FC<{id: string; base: string; spot: string}> = ({id, base, spot}) => (
  <pattern id={id} width="70" height="70" patternUnits="userSpaceOnUse">
    <rect width="70" height="70" fill={base} />
    <ellipse cx="15" cy="18" rx="10" ry="7" fill={spot} />
    <ellipse cx="50" cy="30" rx="8" ry="10" fill={spot} />
    <ellipse cx="28" cy="55" rx="9" ry="6" fill={spot} />
    <circle cx="60" cy="62" r="5" fill={spot} />
  </pattern>
);

const Arm: React.FC<{
  side: 1 | -1;
  angle: number;
  skin: string;
  prop?: CharacterProps['prop'];
  frame: number;
}> = ({side, angle, skin, prop, frame}) => {
  // side = -1 (esquerda do espectador) gira horário para fora; side = 1 anti-horário
  const rot = side === -1 ? angle : -angle;
  return (
    <g transform={`translate(${side * 82}, -300) rotate(${rot})`}>
      <rect x={-22} y={-10} width={44} height={135} rx={22} fill={skin} stroke={OUT} strokeWidth={SW} />
      {prop === 'club' && (
        <g transform="translate(0,135) rotate(-75)">
          <path
            d="M -20 -10 L 120 -22 Q 190 -40 205 0 Q 190 40 120 22 L -20 10 Z"
            fill="#9C6B3C"
            stroke={OUT}
            strokeWidth={SW}
          />
          <path d="M 130 -10 L 175 -14 M 140 10 L 180 8" stroke="#6E4523" strokeWidth={5} strokeLinecap="round" />
        </g>
      )}
      {prop === 'spear' && (
        <g transform="translate(0,135) rotate(-90)">
          <rect x={-120} y={-9} width={330} height={18} rx={9} fill="#9C6B3C" stroke={OUT} strokeWidth={6} />
          <path d="M 205 -24 L 275 0 L 205 24 Z" fill="#9AA4AE" stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
          <path d="M 195 -14 L 215 14 M 215 -14 L 195 14" stroke="#C9A36B" strokeWidth={5} />
        </g>
      )}
      {prop === 'stick' && (
        <g transform="translate(0,135) rotate(-110)">
          <rect x={-10} y={-7} width={230} height={14} rx={7} fill="#8A5A30" stroke={OUT} strokeWidth={5} />
          <g transform={`translate(225,0) rotate(${Math.sin(frame / 6) * 6})`}>
            <ellipse cx={0} cy={0} rx={48} ry={34} fill="#B5452B" stroke={OUT} strokeWidth={6} />
            <ellipse cx={-12} cy={-10} rx={18} ry={9} fill="#E07A4F" />
            <rect x={36} y={-12} width={40} height={24} rx={12} fill="#F3E5C8" stroke={OUT} strokeWidth={5} />
          </g>
        </g>
      )}
      {prop === 'berries' && (
        <g transform="translate(0,150)">
          {[
            [-18, 0],
            [14, -6],
            [0, 18],
            [22, 18],
            [-20, 26],
          ].map(([bx, by], i) => (
            <circle key={i} cx={bx} cy={by} r={15} fill={i % 2 ? '#7B2FBF' : '#E0284F'} stroke={OUT} strokeWidth={4} />
          ))}
        </g>
      )}
      <circle cx={0} cy={135} r={28} fill={skin} stroke={OUT} strokeWidth={SW} />
    </g>
  );
};

export const Character: React.FC<CharacterProps> = ({
  variant = 'gruk',
  x,
  y,
  scale = 1,
  flip = false,
  frame,
  talk = 0,
  look = [0, 0],
  armL = 10,
  armR = 10,
  expression = 'happy',
  prop = 'none',
  walking = false,
  sitting = false,
  tilt = 0,
  squash = 1,
}) => {
  const skin = SKIN[variant];
  const skinDark = SKIN_DARK[variant];
  const id = `${variant}-${Math.round(x)}-${Math.round(y)}`;
  const isGruk = variant === 'gruk';

  // respiração / balanço
  const breathe = 1 + Math.sin(frame / 9) * 0.015;
  const walkPhase = walking ? Math.sin(frame / 3.2) : 0;
  const bodyBob = walking ? Math.abs(Math.cos(frame / 3.2)) * -14 : Math.sin(frame / 9) * -3;
  const headTilt = tilt + Math.sin(frame / 14) * 3 + talk * 4 * Math.sin(frame / 2.5);

  // piscar
  const blinkCycle = (frame + (isGruk ? 0 : 41)) % 83;
  const blink = expression === 'sleep' ? 0.08 : blinkCycle < 3 ? 0.12 : 1;

  const lookX = look[0] * 11;
  const lookY = look[1] * 9;

  const browLift = expression === 'shock' ? -22 : expression === 'think' ? -8 : 0;
  const eyeScale = expression === 'shock' ? 1.18 : 1;

  // boca
  const mouthOpen = expression === 'shock' ? Math.max(0.75, talk) : talk;
  const legL = sitting ? -70 : walkPhase * 28;
  const legR = sitting ? 70 : -walkPhase * 28;

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${(flip ? -1 : 1) * scale * (2 - squash)}, ${scale * squash})`}
    >
      <defs>
        <Leopard id={`leo-${id}`} base={isGruk ? '#E8913A' : '#6FA34A'} spot={isGruk ? '#7A3E12' : '#3E6B26'} />
      </defs>
      {/* sombra */}
      <ellipse cx={0} cy={6} rx={sitting ? 150 : 115} ry={20} fill="rgba(0,0,0,0.22)" />

      <g transform={`translate(0, ${bodyBob + (sitting ? 110 : 0)})`}>
        {/* pernas */}
        {[
          [-38, legL],
          [38, legR],
        ].map(([lx, ang], i) => (
          <g key={i} transform={`translate(${lx}, -150) rotate(${ang})`}>
            <rect x={-23} y={-10} width={46} height={150} rx={22} fill={skin} stroke={OUT} strokeWidth={SW} />
            <ellipse cx={lx < 0 ? -10 : 10} cy={145} rx={40} ry={20} fill="#7A4A2A" stroke={OUT} strokeWidth={SW} />
          </g>
        ))}

        {/* cabelo longo (atrás) da Una */}
        {!isGruk && (
          <path
            d={`M -120 -470 Q -150 -300 -110 ${-230 + Math.sin(frame / 8) * 6} Q -40 -270 0 -300 Q 40 -270 110 ${
              -230 + Math.sin(frame / 8 + 1) * 6
            } Q 150 -300 120 -470 Z`}
            fill="#C2452D"
            stroke={OUT}
            strokeWidth={SW}
          />
        )}

        {/* tronco */}
        <g transform={`translate(0,-230) scale(1, ${breathe}) translate(0,230)`}>
          <ellipse cx={0} cy={-235} rx={92} ry={112} fill={skin} stroke={OUT} strokeWidth={SW} />
          <path
            d="M -95 -250 Q -60 -330 40 -345 L 90 -320 Q 105 -230 95 -150 L 70 -125 L 45 -150 L 20 -122 L -5 -150 L -30 -122 L -55 -150 L -80 -125 L -100 -150 Q -108 -200 -95 -250 Z"
            fill={`url(#leo-${id})`}
            stroke={OUT}
            strokeWidth={SW}
            strokeLinejoin="round"
          />
          {/* cinto de corda */}
          <path d="M -100 -185 Q 0 -165 100 -185" stroke="#5B3A1E" strokeWidth={12} fill="none" strokeLinecap="round" />
        </g>

        {/* braços */}
        <Arm side={-1} angle={armL} skin={skin} frame={frame} prop={prop === 'berries' ? 'berries' : 'none'} />
        <Arm side={1} angle={armR} skin={skin} frame={frame} prop={prop === 'berries' ? 'none' : prop} />

        {/* cabeça */}
        <g transform={`translate(0,-330) rotate(${headTilt}) translate(0,330)`}>
          {/* orelhas */}
          <circle cx={-108} cy={-440} r={26} fill={skin} stroke={OUT} strokeWidth={SW} />
          <circle cx={108} cy={-440} r={26} fill={skin} stroke={OUT} strokeWidth={SW} />
          <ellipse cx={0} cy={-440} rx={110} ry={115} fill={skin} stroke={OUT} strokeWidth={SW} />

          {/* cabelo */}
          {isGruk ? (
            <path
              d="M -112 -455 Q -130 -540 -80 -560 L -70 -600 L -35 -568 L -10 -615 L 15 -570 L 50 -605 L 62 -560 Q 125 -545 112 -455 Q 95 -505 60 -518 Q 20 -500 -10 -522 Q -45 -500 -80 -515 Q -100 -495 -112 -455 Z"
              fill="#4A2A16"
              stroke={OUT}
              strokeWidth={SW}
              strokeLinejoin="round"
            />
          ) : (
            <g>
              <path
                d="M -118 -440 Q -130 -560 0 -565 Q 130 -560 118 -440 Q 90 -510 30 -505 Q -20 -530 -60 -500 Q -100 -490 -118 -440 Z"
                fill="#C2452D"
                stroke={OUT}
                strokeWidth={SW}
              />
              {/* osso no cabelo */}
              <g transform="translate(60,-545) rotate(-25)">
                <rect x={-40} y={-8} width={80} height={16} rx={8} fill="#F6EFDC" stroke={OUT} strokeWidth={5} />
                <circle cx={-42} cy={-8} r={11} fill="#F6EFDC" stroke={OUT} strokeWidth={5} />
                <circle cx={-42} cy={8} r={11} fill="#F6EFDC" stroke={OUT} strokeWidth={5} />
                <circle cx={42} cy={-8} r={11} fill="#F6EFDC" stroke={OUT} strokeWidth={5} />
                <circle cx={42} cy={8} r={11} fill="#F6EFDC" stroke={OUT} strokeWidth={5} />
              </g>
            </g>
          )}

          {/* barba do Gruk */}
          {isGruk && (
            <path
              d="M -100 -425 Q -110 -330 -40 -300 L -20 -285 L 0 -300 L 20 -285 L 40 -300 Q 110 -330 100 -425 Q 70 -380 0 -375 Q -70 -380 -100 -425 Z"
              fill="#4A2A16"
              stroke={OUT}
              strokeWidth={SW}
              strokeLinejoin="round"
            />
          )}

          {/* bochechas da Una */}
          {!isGruk && (
            <>
              <ellipse cx={-62} cy={-405} rx={20} ry={12} fill="#F08A7E" opacity={0.7} />
              <ellipse cx={62} cy={-405} rx={20} ry={12} fill="#F08A7E" opacity={0.7} />
            </>
          )}

          {/* olhos */}
          {[-42, 42].map((ex) => (
            <g key={ex} transform={`translate(${ex}, -462) scale(${eyeScale}, ${blink * eyeScale})`}>
              {expression === 'sleep' ? (
                <path d="M -22 0 Q 0 14 22 0" stroke={OUT} strokeWidth={7} fill="none" strokeLinecap="round" />
              ) : (
                <>
                  <ellipse cx={0} cy={0} rx={27} ry={32} fill="#fff" stroke={OUT} strokeWidth={6} />
                  <circle cx={lookX} cy={lookY} r={13} fill="#1E140D" />
                  <circle cx={lookX + 5} cy={lookY - 5} r={4.5} fill="#fff" />
                  {!isGruk && (
                    <path
                      d={ex < 0 ? 'M -24 -22 L -36 -36 M -12 -30 L -18 -46' : 'M 24 -22 L 36 -36 M 12 -30 L 18 -46'}
                      stroke={OUT}
                      strokeWidth={5}
                      strokeLinecap="round"
                    />
                  )}
                </>
              )}
            </g>
          ))}

          {/* sobrancelha */}
          {isGruk ? (
            <path
              d={`M -80 ${-505 + browLift} Q -40 ${-525 + browLift} 0 ${-508 + browLift * 0.6} Q 40 ${
                -525 + (expression === 'think' ? -18 : browLift)
              } 80 ${-505 + browLift}`}
              stroke="#2E1A0C"
              strokeWidth={17}
              fill="none"
              strokeLinecap="round"
            />
          ) : (
            <>
              <path d={`M -66 ${-508 + browLift} Q -42 ${-520 + browLift} -20 ${-510 + browLift}`} stroke={OUT} strokeWidth={7} fill="none" strokeLinecap="round" />
              <path d={`M 20 ${-510 + browLift} Q 42 ${-520 + browLift} 66 ${-508 + browLift}`} stroke={OUT} strokeWidth={7} fill="none" strokeLinecap="round" />
            </>
          )}

          {/* nariz */}
          <ellipse cx={0} cy={-418} rx={isGruk ? 28 : 18} ry={isGruk ? 21 : 13} fill={skinDark} stroke={OUT} strokeWidth={6} />

          {/* boca */}
          <g transform="translate(0,-375)">
            {mouthOpen > 0.08 ? (
              <g>
                <ellipse cx={0} cy={0} rx={34 - mouthOpen * 6} ry={6 + mouthOpen * 24} fill="#5A1414" stroke={OUT} strokeWidth={6} />
                <ellipse cx={0} cy={4 + mouthOpen * 14} rx={16} ry={4 + mouthOpen * 7} fill="#E0606A" />
                <rect x={-18} y={-4 - mouthOpen * 22} width={36} height={9} rx={3} fill="#fff" />
              </g>
            ) : expression === 'sleep' ? (
              <ellipse cx={0} cy={0} rx={10} ry={8} fill="#5A1414" />
            ) : (
              <path
                d={expression === 'think' ? 'M -22 4 Q 0 -4 22 0' : 'M -34 -6 Q 0 30 34 -6'}
                stroke={OUT}
                strokeWidth={8}
                fill={expression === 'grin' ? '#fff' : 'none'}
                strokeLinecap="round"
              />
            )}
          </g>
        </g>
      </g>
    </g>
  );
};
