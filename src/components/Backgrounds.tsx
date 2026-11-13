import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";

const INK = "#2a1608";

const Cloud: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = "white" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={0.9}>
    <ellipse cx={0} cy={0} rx={110} ry={50} fill={color} />
    <ellipse cx={-70} cy={15} rx={70} ry={40} fill={color} />
    <ellipse cx={75} cy={15} rx={75} ry={38} fill={color} />
    <ellipse cx={10} cy={-35} rx={70} ry={45} fill={color} />
  </g>
);

const Pterodactyl: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const frame = useCurrentFrame();
  const flap = Math.sin(frame * 0.4) * 30;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} fill="#3d2a4d">
      <path d={`M 0 0 L -90 ${-flap} L -40 10 Z`} />
      <path d={`M 0 0 L 90 ${-flap} L 40 10 Z`} />
      <ellipse cx={0} cy={5} rx={22} ry={12} />
      <path d="M 18 0 L 50 -6 L 20 10 Z" />
    </g>
  );
};

/** Paisagem pré-histórica ao amanhecer, com caverna, vulcão e sol nascendo. */
export const DawnLandscape: React.FC<{ sunRise: number; pan?: number }> = ({ sunRise, pan = 0 }) => {
  const frame = useCurrentFrame();
  const sunY = 1050 - sunRise * 450;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920}>
        <defs>
          <linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a2a6e" />
            <stop offset="0.45" stopColor="#c8517a" />
            <stop offset="0.75" stopColor="#ffa94d" />
          </linearGradient>
          <radialGradient id="sunglow">
            <stop offset="0" stopColor="#fff3b0" stopOpacity={0.9} />
            <stop offset="1" stopColor="#ffa94d" stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#dawn)" />
        <circle cx={700} cy={sunY} r={420} fill="url(#sunglow)" />
        <circle cx={700} cy={sunY} r={130} fill="#ffe066" stroke="#ffb703" strokeWidth={12} />
        <Cloud x={200 + frame * 0.6 - pan * 0.1} y={330} s={1.1} color="#ffd6e0" />
        <Cloud x={850 - frame * 0.4 - pan * 0.1} y={520} s={0.8} color="#ffe5ec" />
        <Pterodactyl x={-100 + frame * 5} y={420 + Math.sin(frame * 0.05) * 30} s={0.9} />
        <Pterodactyl x={-300 + frame * 5} y={480 + Math.sin(frame * 0.05 + 1) * 30} s={0.6} />
        {/* vulcão */}
        <g transform={`translate(${-pan * 0.2},0)`}>
          <path d="M 520 1150 L 760 760 L 840 760 L 1100 1150 Z" fill="#6d4c7d" />
          <path d="M 760 760 Q 800 700 840 760 Z" fill="#ff6b35" />
          {[0, 1, 2].map((i) => {
            const t = ((frame + i * 30) % 90) / 90;
            return <circle key={i} cx={800 + Math.sin(t * 6 + i) * 30} cy={730 - t * 280} r={30 + t * 50} fill="#9d8189" opacity={(1 - t) * 0.6} />;
          })}
        </g>
        {/* montanhas */}
        <g transform={`translate(${-pan * 0.4},0)`}>
          <path d="M -200 1250 L 100 900 L 330 1150 L 520 980 L 800 1250 Z" fill="#7b4f8a" />
          <path d="M 400 1300 L 750 1000 L 1000 1180 L 1300 1300 Z" fill="#8e5a8f" />
        </g>
        {/* chão */}
        <path d="M 0 1300 Q 540 1220 1080 1300 L 1080 1920 L 0 1920 Z" fill="#b5835a" />
        <path d="M 0 1420 Q 540 1360 1080 1420 L 1080 1920 L 0 1920 Z" fill="#9c6b45" />
        {/* caverna */}
        <g transform={`translate(${-pan},0)`}>
          <path d="M -150 1500 Q -120 950 200 900 Q 480 920 520 1500 Z" fill="#7d6a5e" stroke={INK} strokeWidth={10} />
          <path d="M 40 1500 Q 50 1210 210 1190 Q 360 1210 370 1500 Z" fill="#2b1d16" stroke={INK} strokeWidth={10} />
          <path d="M 60 1000 l 40 30 M 300 980 l 30 40 M 420 1150 l -30 30" stroke="#5d4c43" strokeWidth={10} strokeLinecap="round" />
        </g>
        {/* plantinhas */}
        {[[620, 1520], [960, 1600], [120, 1700], [780, 1780]].map(([px, py], i) => (
          <g key={i} transform={`translate(${px - pan * 1.2},${py})`}>
            <path d="M 0 0 Q -30 -60 -50 -70 M 0 0 Q 0 -70 10 -90 M 0 0 Q 30 -60 55 -65" stroke="#3a7d44" strokeWidth={12} strokeLinecap="round" fill="none" />
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

/** Interior de caverna com pinturas rupestres. */
export const CaveInterior: React.FC = () => {
  const frame = useCurrentFrame();
  const flick = 0.85 + Math.sin(frame * 0.5) * 0.05 + Math.sin(frame * 1.3) * 0.03;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920}>
        <defs>
          <radialGradient id="cavelight" cx="0.5" cy="0.55" r="0.7">
            <stop offset="0" stopColor="#c98b52" />
            <stop offset="0.6" stopColor="#7a4b2a" />
            <stop offset="1" stopColor="#2b170b" />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#cavelight)" opacity={flick} />
        <rect width={1080} height={1920} fill="#2b170b" opacity={1 - flick} />
        {/* pinturas rupestres */}
        <g stroke="#7a1f0e" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.75}>
          <g transform="translate(180,520)">
            <ellipse cx={0} cy={0} rx={80} ry={40} fill="#7a1f0e" />
            <path d="M -50 30 l -10 60 M -20 30 l 0 60 M 30 30 l 0 60 M 60 30 l 10 60 M 75 -10 l 40 -40 l 10 10 M -80 -10 l -30 10" />
          </g>
          <g transform="translate(860,640)">
            <circle cx={0} cy={-80} r={18} fill="#7a1f0e" />
            <path d="M 0 -60 L 0 0 M 0 -40 L -30 -10 M 0 -40 L 40 -60 M 0 0 L -20 50 M 0 0 L 20 50 M 40 -60 L 90 -110" />
          </g>
          <g transform="translate(560,380)">
            <path d="M -60 0 Q 0 -60 60 0" />
            <circle cx={0} cy={-10} r={10} fill="#7a1f0e" />
          </g>
          {[[130, 820], [950, 900], [300, 300]].map(([hx, hy], i) => (
            <g key={i} transform={`translate(${hx},${hy})`} fill="#a0341f" stroke="none" opacity={0.6}>
              <ellipse cx={0} cy={0} rx={30} ry={36} />
              {[-28, -12, 4, 20].map((dx, k) => (
                <rect key={k} x={dx} y={-80} width={12} height={50} rx={6} />
              ))}
              <rect x={28} y={-30} width={12} height={40} rx={6} transform="rotate(40,34,-10)" />
            </g>
          ))}
        </g>
        {/* chão */}
        <path d="M 0 1450 Q 540 1380 1080 1450 L 1080 1920 L 0 1920 Z" fill="#4a2e1a" />
        {/* estalactites */}
        {Array.from({ length: 9 }).map((_, i) => {
          const x = i * 130 + 20;
          const h = 90 + random(`st${i}`) * 140;
          return <path key={i} d={`M ${x - 45} -5 L ${x} ${h} L ${x + 45} -5 Z`} fill="#3b2415" stroke={INK} strokeWidth={6} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

/** Campo aberto com rolagem lateral (parallax). */
export const Plains: React.FC<{ scroll: number; danger?: number }> = ({ scroll, danger = 0 }) => {
  const sky1 = danger > 0.5 ? "#ff8c61" : "#7ec8e3";
  const sky2 = danger > 0.5 ? "#ffd29d" : "#d9f2ff";
  const wrap = (x: number, w: number) => ((x % w) + w) % w;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920}>
        <defs>
          <linearGradient id="plainsky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={sky1} />
            <stop offset="1" stopColor={sky2} />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#plainsky)" />
        {[0, 1, 2].map((i) => (
          <Cloud key={i} x={wrap(200 + i * 420 - scroll * 0.1, 1400) - 160} y={300 + i * 90} s={0.9 + i * 0.15} />
        ))}
        {[0, 1].map((k) => (
          <path
            key={k}
            transform={`translate(${wrap(-scroll * 0.3, 1080) - 1080 * k},0)`}
            d="M 0 1150 L 200 900 L 380 1100 L 560 850 L 800 1150 L 960 950 L 1080 1150 L 1280 900 L 1460 1100 L 1640 850 L 1880 1150 L 2040 950 L 2160 1150 L 2160 1300 L 0 1300 Z"
            fill="#8fb996"
          />
        ))}
        <rect y={1250} width={1080} height={670} fill="#a7c957" />
        <rect y={1450} width={1080} height={470} fill="#8cb045" />
        {Array.from({ length: 14 }).map((_, i) => {
          const x = wrap(i * 160 - scroll, 2240) - 100;
          return (
            <path
              key={i}
              d={`M ${x} ${1520 + (i % 3) * 120} q -10 -40 -25 -50 M ${x} ${1520 + (i % 3) * 120} q 5 -45 15 -60`}
              stroke="#5c8a2b"
              strokeWidth={8}
              strokeLinecap="round"
              fill="none"
            />
          );
        })}
        {[0, 1, 2].map((i) => {
          const x = wrap(300 + i * 700 - scroll * 1.2, 2100) - 300;
          return <ellipse key={i} cx={x} cy={1820} rx={90} ry={40} fill="#8d99ae" stroke={INK} strokeWidth={8} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

/** Floresta com árvores em camadas e rolagem. */
export const Forest: React.FC<{ scroll: number }> = ({ scroll }) => {
  const wrap = (x: number, w: number) => ((x % w) + w) % w;
  const tree = (x: number, y: number, s: number, c1: string, c2: string, key: string) => (
    <g key={key} transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-28} y={-260} width={56} height={280} fill="#6b4226" stroke={INK} strokeWidth={8} />
      <circle cx={0} cy={-330} r={150} fill={c1} stroke={INK} strokeWidth={8} />
      <circle cx={-90} cy={-260} r={100} fill={c2} stroke={INK} strokeWidth={8} />
      <circle cx={95} cy={-270} r={105} fill={c2} stroke={INK} strokeWidth={8} />
    </g>
  );
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920}>
        <defs>
          <linearGradient id="forestsky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe8a3" />
            <stop offset="1" stopColor="#b7e4c7" />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#forestsky)" />
        {Array.from({ length: 6 }).map((_, i) => tree(wrap(i * 300 - scroll * 0.3, 1800) - 150, 1250, 0.7, "#95d5b2", "#74c69d", `b${i}`))}
        <rect y={1230} width={1080} height={700} fill="#74a64a" />
        {Array.from({ length: 5 }).map((_, i) => tree(wrap(i * 420 + 100 - scroll * 0.7, 2100) - 200, 1450, 1.1, "#52b788", "#40916c", `m${i}`))}
        <rect y={1440} width={1080} height={480} fill="#6a994e" />
        <path d="M 0 1600 Q 540 1560 1080 1600 L 1080 1700 Q 540 1660 0 1700 Z" fill="#c9a66b" />
      </svg>
    </AbsoluteFill>
  );
};

/** Céu noturno estrelado. */
export const NightSky: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920}>
        <defs>
          <linearGradient id="night" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0b1026" />
            <stop offset="0.7" stopColor="#1d2b5c" />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#night)" />
        {Array.from({ length: 60 }).map((_, i) => {
          const tw = 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.08 + i * 2.3));
          return <circle key={i} cx={random(`nx${i}`) * 1080} cy={random(`ny${i}`) * 1100} r={2 + random(`nr${i}`) * 4} fill="white" opacity={tw} />;
        })}
        <circle cx={170} cy={900} r={90} fill="#fdf0d5" />
        <circle cx={140} cy={875} r={18} fill="#e9d8a6" />
        <circle cx={195} cy={935} r={12} fill="#e9d8a6" />
        <path d="M -50 1250 L 150 1050 L 330 1200 L 520 1000 L 760 1220 L 950 1060 L 1150 1250 Z" fill="#141a33" />
        <path d="M 0 1300 Q 540 1240 1080 1300 L 1080 1920 L 0 1920 Z" fill="#2d2418" />
        {/* arbustos escuros nas laterais */}
        {[[60, 1330], [200, 1360], [900, 1340], [1030, 1370]].map(([bx, by], i) => (
          <circle key={i} cx={bx} cy={by} r={110} fill="#101a12" />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
