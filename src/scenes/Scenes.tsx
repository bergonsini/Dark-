import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, Easing} from 'remotion';
import {Character} from '../characters/Character';
import {Mammoth} from '../characters/Mammoth';
import {
  Brain,
  Bush,
  Fire,
  IconCart,
  IconHouse,
  IconPhone,
  Landscape,
  NightSky,
  Rays,
  RedX,
  Svg,
} from '../components/Scenery';
import {Badge, BigText, TITLE_FONT} from '../components/Text';
import {usePunchIn} from '../components/Transitions';
import {lerp, mouthAt, pop, sceneFrames, wordAt} from '../lib';

const shake = (frame: number, at: number, len = 12, amp = 18) => {
  const d = frame - at;
  if (d < 0 || d > len) return '';
  const k = (1 - d / len) * amp;
  return `translate(${Math.sin(d * 2.7) * k}px, ${Math.cos(d * 3.3) * k}px)`;
};

const QMark: React.FC<{x: number; y: number; frame: number; delay: number; color: string}> = ({x, y, frame, delay, color}) => {
  const p = pop(frame, delay, 7);
  return (
    <g transform={`translate(${x},${y + Math.sin((frame + delay * 3) / 6) * 14}) rotate(${Math.sin(frame / 8 + delay) * 14}) scale(${p})`}>
      <text
        textAnchor="middle"
        fontFamily={TITLE_FONT}
        fontSize={200}
        fill={color}
        stroke="#1A0E05"
        strokeWidth={14}
        paintOrder="stroke"
      >
        ?
      </text>
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* 1. GANCHO (0–3s): pergunta chamativa + Gruk pulando na tela          */
/* ------------------------------------------------------------------ */
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {from} = sceneFrames('hook');
  const jump = pop(frame, 3, 8);
  const y = interpolate(jump, [0, 1], [2500, 1760]);
  const landing = frame > 8 && frame < 20 ? 1 - Math.sin(((frame - 8) / 12) * Math.PI) * 0.12 : 1;
  const shocked = frame < 34;
  const zoom = interpolate(frame, [0, 100], [1, 1.08]);
  return (
    <AbsoluteFill style={{transform: `scale(${zoom}) ${shake(frame, 0, 10, 26)}`}}>
      <Svg>
        <Rays frame={frame} c1="#FF7A1A" c2="#FF9A3C" cy={1150} />
        <QMark x={150} y={1150} frame={frame} delay={16} color="#FFE135" />
        <QMark x={930} y={1050} frame={frame} delay={22} color="#fff" />
        <Character
          frame={frame}
          x={540}
          y={y}
          scale={1.3}
          squash={landing}
          talk={shocked ? 0 : mouthAt(from + frame)}
          expression={shocked ? 'shock' : 'happy'}
          armL={shocked ? 155 + Math.sin(frame / 2) * 10 : 30 + Math.sin(frame / 5) * 10}
          armR={shocked ? 155 - Math.sin(frame / 2) * 10 : 110 + Math.sin(frame / 4) * 20}
          prop={shocked ? 'none' : 'club'}
          look={[0, shocked ? -0.4 : 0.1]}
        />
      </Svg>
      <BigText
        text="VOCÊ SOBREVIVERIA 1 DIA COMO HOMEM DAS CAVERNAS?"
        top={150}
        at={-16}
        stagger={2}
        size={112}
        highlight={{SOBREVIVERIA: '#FFE135', '1': '#FFE135', CAVERNAS: '#4DF0FF'}}
        rotate={-2}
      />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 2. INTRO: conheça o Gruk — 40 mil anos atrás, sem casa/mercado/cel   */
/* ------------------------------------------------------------------ */
export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {from} = sceneFrames('intro');
  const punch = usePunchIn();
  const walkEnd = 34;
  const gx = lerp(frame, [0, walkEnd], [-250, 540]);
  const walking = frame < walkEnd;
  const tGruk = wordAt('intro', 'Gruk');
  const t40 = wordAt('intro', 'quarenta');
  const icons = [
    {at: wordAt('intro', 'casa'), x: 200, C: IconHouse},
    {at: wordAt('intro', 'mercado'), x: 540, C: IconCart},
    {at: wordAt('intro', 'celular'), x: 880, C: IconPhone},
  ];
  const tCel = icons[2].at;
  const waving = frame > tGruk - 4 && frame < t40 + 4;
  const nameP = pop(frame, tGruk);
  return (
    <AbsoluteFill style={{...punch}}>
      <AbsoluteFill style={{transform: shake(frame, tCel + 6, 12, 16)}}>
        <Svg>
          <Landscape frame={frame + 200} pan={lerp(frame, [0, 160], [0, 120])} />
          {icons.map(({at, x, C}, i) => {
            const p = pop(frame, at - 2);
            const xp = pop(frame, at + 7, 8);
            return (
              <g key={i} transform={`translate(${x},${620}) scale(${p * 1.05})`}>
                <circle r={135} fill="#fff" stroke="#1A0E05" strokeWidth={10} />
                <C />
                <RedX p={xp} />
              </g>
            );
          })}
          <Character
            frame={frame}
            x={gx}
            y={1720}
            scale={1.12}
            walking={walking}
            talk={mouthAt(from + frame)}
            expression={frame > tCel ? 'shock' : frame > icons[0].at ? 'think' : 'happy'}
            look={frame > icons[0].at - 4 ? [Math.sin(frame / 12) * 0.8, -0.9] : [0.3, 0]}
            armL={walking ? 20 + Math.sin(frame / 3.2) * 25 : 25}
            armR={waving ? 150 + Math.sin(frame / 2.5) * 25 : walking ? 20 - Math.sin(frame / 3.2) * 25 : frame > tCel ? 150 : 30}
            prop="club"
          />
        </Svg>
        <Badge text="GRUK" x={lerp(frame, [0, walkEnd], [-250, 540]) + 210} y={1000} p={nameP} bg="#FF4D6D" size={70} rotate={8} />
        <BigText text="40 MIL ANOS ATRÁS" top={150} at={t40 - 3} stagger={3} size={118} highlight={{'40': '#FFE135', MIL: '#FFE135'}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 3. DUAS ESCOLHAS: caçar o mamute (A) ou coletar frutas (B)           */
/* ------------------------------------------------------------------ */
const DangerMeter: React.FC<{x: number; level: number; p: number; color: string}> = ({x, level, p, color}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: 1600,
      transform: `translate(-50%,0) scale(${p})`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 14,
    }}
  >
    <div style={{fontFamily: TITLE_FONT, fontSize: 56, color: '#fff', WebkitTextStroke: '9px #1A0E05', paintOrder: 'stroke fill'}}>
      PERIGO
    </div>
    <div style={{display: 'flex', gap: 10}}>
      {Array.from({length: 5}).map((_, i) => (
        <div
          key={i}
          style={{
            width: 64,
            height: 46,
            borderRadius: 12,
            border: '6px solid #1A0E05',
            background: i < level ? color : 'rgba(255,255,255,0.35)',
            transform: `scaleY(${i < level ? 1 + Math.max(0, p - 1) : 1})`,
          }}
        />
      ))}
    </div>
  </div>
);

export const ChoiceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {from} = sceneFrames('choice');
  const punch = usePunchIn();
  const tA = wordAt('choice', 'enfrentar');
  const tMam = wordAt('choice', 'mamute');
  const tB = wordAt('choice', 'coletar');
  const tPerigo = wordAt('choice', 'perigo');
  const aIn = interpolate(frame, [tA - 6, tA + 6], [-560, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.4))});
  const bIn = interpolate(frame, [tB - 6, tB + 6], [560, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.4))});
  const talk = mouthAt(from + frame);
  const roarShake = shake(frame, tMam, 22, 14);
  const vs = pop(frame, tB + 4, 6);
  return (
    <AbsoluteFill style={{...punch}}>
      {/* antes das opções: Gruk pensando com fome */}
      <Svg>
        <Landscape frame={frame + 400} />
        <Character
          frame={frame}
          x={540}
          y={1720}
          scale={1.12}
          talk={talk}
          expression="think"
          look={[0.6, -0.6]}
          armL={40}
          armR={130 + Math.sin(frame / 4) * 10}
          prop="club"
        />
      </Svg>

      {/* Painel A */}
      <AbsoluteFill style={{width: 540, overflow: 'hidden', transform: `translateX(${aIn}px) ${roarShake}`}}>
        <svg width="540" height="1920">
          <defs>
            <linearGradient id="pa" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FF5E3A" />
              <stop offset="1" stopColor="#B3201A" />
            </linearGradient>
          </defs>
          <rect width="540" height="1920" fill="url(#pa)" />
          <rect y={1240} width="540" height="680" fill="#7A2A14" />
          <Mammoth x={385} y={1245} scale={0.42} flip frame={frame} angry walking={frame > tMam - 4 && frame < tMam + 26} trunkUp={frame > tMam ? 1 : 0} />
          <Character
            frame={frame}
            x={120}
            y={1250}
            scale={0.52}
            talk={talk}
            expression={frame > tMam ? 'shock' : 'grin'}
            look={[1, -0.2]}
            armL={30}
            armR={150 + Math.sin(frame / 3) * 10}
            prop="spear"
          />
        </svg>
        <Badge text="A) CAÇAR" x={270} y={330} p={pop(frame, tA)} bg="#E5202E" size={74} rotate={-4} />
        <DangerMeter x={270} level={5} p={pop(frame, tPerigo - 2)} color="#E5202E" />
      </AbsoluteFill>

      {/* Painel B */}
      <AbsoluteFill style={{left: 540, width: 540, overflow: 'hidden', transform: `translateX(${bIn}px)`}}>
        <svg width="540" height="1920">
          <defs>
            <linearGradient id="pb" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#6EE08A" />
              <stop offset="1" stopColor="#1F8A4C" />
            </linearGradient>
          </defs>
          <rect width="540" height="1920" fill="url(#pb)" />
          <rect y={1240} width="540" height="680" fill="#24603A" />
          <Bush x={395} y={1245} s={0.75} frame={frame} picked={lerp(frame, [tB, tB + 40], [0, 1])} />
          <Character
            frame={frame}
            variant="una"
            x={170}
            y={1250}
            scale={0.55}
            expression="happy"
            look={[0.8, 0]}
            armL={60 + Math.sin(frame / 5) * 15}
            armR={70 + Math.sin(frame / 4) * 20}
            prop="berries"
          />
        </svg>
        <Badge text="B) COLETAR" x={270} y={330} p={pop(frame, tB)} bg="#16A34A" size={70} rotate={4} />
        <DangerMeter x={270} level={1} p={pop(frame, tPerigo + 4)} color="#22C55E" />
      </AbsoluteFill>

      {/* divisor + VS */}
      <AbsoluteFill style={{opacity: vs > 0.01 ? 1 : 0}}>
        <div style={{position: 'absolute', left: 532, top: 0, width: 16, height: 1920, background: '#1A0E05'}} />
        <div
          style={{
            position: 'absolute',
            left: 540,
            top: 760,
            transform: `translate(-50%,-50%) scale(${vs * (1 + Math.sin(frame / 4) * 0.06)}) rotate(${Math.sin(frame / 6) * 10}deg)`,
            width: 190,
            height: 190,
            borderRadius: 95,
            background: '#FFE135',
            border: '12px solid #1A0E05',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: TITLE_FONT,
            fontSize: 96,
            paddingTop: 18,
            color: '#E5202E',
            WebkitTextStroke: '6px #1A0E05',
            paintOrder: 'stroke fill',
          }}
        >
          VS
        </div>
      </AbsoluteFill>

      {frame < tA && <BigText text="DUAS ESCOLHAS!" top={180} at={0} stagger={4} size={130} color="#FFE135" />}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 4. CURIOSIDADE: o fogo e o cérebro                                   */
/* ------------------------------------------------------------------ */
export const CuriosityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {from} = sceneFrames('curiosity');
  const punch = usePunchIn(0.25);
  const tFogo = wordAt('curiosity', 'fogo');
  const tCoz = wordAt('curiosity', 'cozinhar');
  const tCer = wordAt('curiosity', 'cerebro');
  const badge = pop(frame, 0, 6);
  const brain = pop(frame, tCer - 3, 7);
  const grow = 1 + Math.max(0, lerp(frame, [tCer, tCer + 30], [0, 0.35]));
  return (
    <AbsoluteFill style={{...punch}}>
      <Svg>
        <NightSky frame={frame} />
        <path d="M 0 1250 Q 540 1180 1080 1250 L 1080 1920 L 0 1920 Z" fill="#3B2A1E" />
        <Fire x={540} y={1240} s={lerp(frame, [tFogo - 4, tFogo + 8], [0.55, 1])} frame={frame} />
        <Character
          frame={frame}
          x={230}
          y={1290}
          scale={0.62}
          sitting
          talk={mouthAt(from + frame)}
          expression={frame > tCer ? 'shock' : 'happy'}
          look={[0.9, frame > tCer ? -0.9 : 0.2]}
          armL={20}
          armR={frame > tCoz - 6 ? 75 + Math.sin(frame / 6) * 6 : 25}
          prop={frame > tCoz - 6 ? 'stick' : 'none'}
        />
        <Character
          frame={frame}
          variant="una"
          x={870}
          y={1290}
          scale={0.58}
          sitting
          flip
          expression={frame > tCer ? 'shock' : 'happy'}
          look={[0.9, frame > tCer ? -0.9 : 0.3]}
          armL={30}
          armR={frame > tCer ? 150 : 40}
        />
        {/* cérebro crescendo */}
        <g transform={`translate(540,${720 + Math.sin(frame / 8) * 10}) scale(${brain * grow})`}>
          <circle r={210} fill="rgba(255,225,53,0.25)" />
          <Brain s={1.15} />
          {[-1, 1].map((sd) => (
            <path key={sd} transform={`translate(${sd * 200},${-30 - ((frame * 3) % 60)})`} d="M -25 30 L 0 -15 L 25 30 Z M -10 30 L 10 30 L 10 70 L -10 70 Z" fill="#4ADE80" stroke="#1A0E05" strokeWidth={6} />
          ))}
        </g>
      </Svg>
      <Badge text="VOCÊ SABIA?" x={540} y={190} p={badge * (1 + Math.sin(frame / 5) * 0.04)} bg="#FFE135" color="#E5202E" size={110} rotate={-4 + Math.sin(frame / 7) * 2} />
      {frame < tCer - 3 && frame >= tFogo - 3 && (
        <BigText text="O FOGO MUDOU TUDO!" top={420} at={tFogo - 3} stagger={3} size={108} highlight={{FOGO: '#FF8A1F'}} />
      )}
      {frame >= tCer - 3 && (
        <BigText text="CÉREBRO MAIOR!" top={330} at={tCer - 3} stagger={4} size={104} highlight={{CÉREBRO: '#FF9DB5'}} />
      )}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 5. NOITE NA CAVERNA: pinturas rupestres se desenhando                */
/* ------------------------------------------------------------------ */
const PAINT = '#B5502A';
export const NightScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {from} = sceneFrames('night');
  const punch = usePunchIn();
  const tPint = wordAt('night', 'pintando');
  const tDorm = wordAt('night', 'dormia');
  const draw = (start: number, len = 26) => lerp(frame, [start, start + len], [1, 0]);
  const art = [
    {d: 'M 300 520 Q 320 420 420 420 Q 520 410 560 470 Q 600 520 590 580 L 570 640 M 560 470 Q 620 520 610 600 Q 600 640 620 660 M 330 560 L 330 650 M 380 580 L 380 655 M 480 590 L 480 655 M 530 590 L 535 650 M 300 520 Q 290 580 330 600 L 540 600', at: tPint - 30},
    {d: 'M 760 470 m -15 0 a 15 15 0 1 0 30 0 a 15 15 0 1 0 -30 0 M 760 485 L 760 560 M 760 500 L 720 530 M 760 500 L 800 470 M 760 560 L 735 620 M 760 560 L 785 620 M 830 400 L 700 610', at: tPint - 18},
    {d: 'M 880 480 m -15 0 a 15 15 0 1 0 30 0 a 15 15 0 1 0 -30 0 M 880 495 L 880 570 M 880 510 L 840 540 M 880 510 L 920 490 M 880 570 L 855 630 M 880 570 L 905 630', at: tPint - 8},
    {d: 'M 200 300 m -50 0 a 50 50 0 1 0 100 0 a 50 50 0 1 0 -100 0 M 200 300 m -25 0 a 25 25 0 1 0 50 0', at: tPint},
    {d: 'M 860 260 L 860 330 M 830 270 L 840 330 M 890 270 L 880 330 M 905 300 L 885 340 M 820 330 Q 860 380 890 335', at: tPint + 8},
  ];
  const sleepy = frame > tDorm + 6;
  return (
    <AbsoluteFill style={{...punch}}>
      <Svg>
        <rect width="1080" height="1920" fill="#2A1A12" />
        <path d="M 0 0 L 1080 0 L 1080 1920 L 0 1920 Z M 60 1000 Q 40 300 540 160 Q 1040 300 1020 1000 Q 1000 1250 540 1260 Q 80 1250 60 1000 Z" fill="#1A0F09" fillRule="evenodd" />
        <path d="M 90 980 Q 70 330 540 190 Q 1010 330 990 980 Q 970 1180 540 1200 Q 110 1180 90 980 Z" fill="#8C6248" />
        {[[260, 900, 70], [820, 880, 60], [540, 980, 50], [180, 600, 40], [930, 650, 45]].map(([cx, cy, r], i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 0.6} fill="#7A523B" />
        ))}
        {art.map((a, i) => (
          <path key={i} d={a.d} pathLength={1} strokeDasharray={1} strokeDashoffset={draw(a.at)} stroke={PAINT} strokeWidth={17} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        ))}
        <rect y={1240} width="1080" height="700" fill="#3B2A1E" />
        <Fire x={540} y={1300} s={0.55} frame={frame} />
        {/* Una dormindo deitada */}
        <g transform="translate(680,1330) rotate(90)">
          <Character frame={frame} variant="una" x={0} y={0} scale={0.5} expression="sleep" armL={10} armR={10} />
        </g>
        {/* Gruk pintando, depois boceja e dorme */}
        <Character
          frame={frame}
          x={230}
          y={1360}
          scale={0.62}
          sitting={sleepy}
          talk={sleepy ? 0 : mouthAt(from + frame)}
          expression={sleepy ? 'sleep' : 'happy'}
          look={[0.6, -1]}
          armL={sleepy ? 15 : 30}
          armR={sleepy ? 15 : 140 + Math.sin(frame / 3) * 18}
          tilt={sleepy ? 14 : 0}
        />
        {['Z', 'z', 'Z'].map((z, i) => {
          const p = ((frame + i * 18) % 54) / 54;
          return (
            <text
              key={i}
              x={910 + p * 60 + i * 10}
              y={1150 - p * 230}
              fontFamily={TITLE_FONT}
              fontSize={60 + p * 40}
              fill="#BFE9FF"
              stroke="#1A0E05"
              strokeWidth={8}
              paintOrder="stroke"
              opacity={1 - p}
            >
              {z}
            </text>
          );
        })}
      </Svg>
      <Badge text="ARTE RUPESTRE" x={540} y={1060} p={pop(frame, tPint - 2)} bg="#B5502A" size={66} rotate={-3} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 6. FINAL: pergunta para comentar                                     */
/* ------------------------------------------------------------------ */
export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {from} = sceneFrames('cta');
  const punch = usePunchIn(0.2);
  const tAi = wordAt('cta', 'ai');
  const tCacar = wordAt('cta', 'cacar');
  const tColetar = wordAt('cta', 'coletar');
  const tCom = wordAt('cta', 'comenta');
  const pa = pop(frame, tCacar - 2);
  const pb = pop(frame, tColetar - 2);
  const pulseA = 1 + (Math.sin(frame / 4) > 0 ? 0.05 : 0);
  const pulseB = 1 + (Math.sin(frame / 4) <= 0 ? 0.05 : 0);
  const pc = pop(frame, tCom - 2, 7);
  const arrowY = Math.abs(Math.sin(frame / 5)) * 40;

  const card = (label: string, bg: string, p: number, pulse: number, x: number, rot: number, sub: string) => (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 560,
        width: 400,
        height: 300,
        transform: `translate(-50%,-50%) scale(${p * pulse}) rotate(${rot}deg)`,
        background: bg,
        borderRadius: 40,
        border: '12px solid #1A0E05',
        boxShadow: '0 18px 0 #1A0E05',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: TITLE_FONT,
        color: '#fff',
        WebkitTextStroke: '10px #1A0E05',
        paintOrder: 'stroke fill',
      }}
    >
      <div style={{fontSize: 96, lineHeight: 1, paddingTop: 20}}>{label}</div>
      <div style={{fontSize: 54, color: '#FFE135'}}>{sub}</div>
    </div>
  );

  return (
    <AbsoluteFill style={{...punch}}>
      <Svg>
        <Rays frame={frame} c1="#7B2FF7" c2="#9B5CFF" cy={700} />
        <rect y={1250} width="1080" height="700" fill="#4C1D95" />
        <Character
          frame={frame}
          x={250}
          y={1260}
          scale={0.7}
          talk={mouthAt(from + frame)}
          expression="happy"
          look={[0.2, -0.8]}
          armL={30}
          armR={frame > tCacar - 4 ? 160 + Math.sin(frame / 3) * 8 : 40}
          prop="club"
        />
        <Character
          frame={frame}
          variant="una"
          x={830}
          y={1260}
          scale={0.66}
          flip
          expression="grin"
          look={[0.2, -0.8]}
          armL={30}
          armR={frame > tColetar - 4 ? 160 + Math.sin(frame / 3 + 1) * 8 : 40}
          prop="berries"
        />
      </Svg>
      <BigText text="E AÍ?" top={90} at={tAi - 4} stagger={4} size={170} color="#FFE135" rotate={-3} />
      {card('CAÇAR', '#E5202E', pa, pulseA, 262, -4, 'O MAMUTE')}
      {card('COLETAR', '#16A34A', pb, pulseB, 818, 4, 'AS FRUTAS')}
      <div
        style={{
          position: 'absolute',
          left: 540,
          top: 560,
          transform: `translate(-50%,-50%) scale(${pb})`,
          fontFamily: TITLE_FONT,
          fontSize: 80,
          color: '#fff',
          WebkitTextStroke: '10px #1A0E05',
          paintOrder: 'stroke fill',
        }}
      >
        OU
      </div>
      <Badge text="COMENTA AQUI!" x={540} y={1620} p={pc * (1 + Math.sin(frame / 4) * 0.04)} bg="#FFE135" color="#E5202E" size={96} rotate={-3} />
      <div
        style={{
          position: 'absolute',
          left: 540,
          top: 1720 + arrowY,
          transform: `translate(-50%,0) scale(${pc})`,
        }}
      >
        <svg width="140" height="140" viewBox="-70 -70 140 140">
          <path d="M -25 -60 L 25 -60 L 25 0 L 55 0 L 0 60 L -55 0 L -25 0 Z" fill="#fff" stroke="#1A0E05" strokeWidth={10} strokeLinejoin="round" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
