import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../theme";

/** Fundo de raios girando (estilo "explosão" de desenho animado). */
export const Sunburst: React.FC<{ frame: number; c1: string; c2: string; center?: [number, number]; speed?: number }> = ({
  frame,
  c1,
  c2,
  center = [540, 800],
  speed = 0.4,
}) => {
  const rays = 18;
  const R = 2200;
  return (
    <AbsoluteFill style={{ background: c1 }}>
      <svg width={1080} height={1920}>
        <g transform={`translate(${center[0]} ${center[1]}) rotate(${frame * speed})`}>
          {[...Array(rays)].map((_, i) => {
            const a1 = (i / rays) * Math.PI * 2;
            const a2 = ((i + 0.5) / rays) * Math.PI * 2;
            return (
              <path
                key={i}
                d={`M 0 0 L ${Math.cos(a1) * R} ${Math.sin(a1) * R} L ${Math.cos(a2) * R} ${Math.sin(a2) * R} Z`}
                fill={c2}
              />
            );
          })}
        </g>
        <defs>
          <radialGradient id="vig" cx="50%" cy="45%" r="70%">
            <stop offset="55%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.45)" />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#vig)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Paisagem pré-histórica: céu, sol, nuvens, montanhas, vulcão, chão, samambaias. */
export const Landscape: React.FC<{ frame: number; mood?: "day" | "dusk"; groundY?: number }> = ({
  frame,
  mood = "day",
  groundY = 1180,
}) => {
  const sky = mood === "day" ? ["#5EC8FF", "#BFEFFF"] : ["#3A1C71", "#FF8C42"];
  const cloudX = (base: number, sp: number) => ((base + frame * sp) % 1500) - 250;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920}>
        <defs>
          <linearGradient id={`sky-${mood}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={sky[0]} />
            <stop offset="1" stopColor={sky[1]} />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill={`url(#sky-${mood})`} />
        {/* sol */}
        <g transform={`translate(860 300) rotate(${frame * 0.8})`}>
          {[...Array(12)].map((_, i) => (
            <rect key={i} x={-8} y={-150} width={16} height={40} rx={8} fill="#FFE14D" transform={`rotate(${i * 30})`} />
          ))}
        </g>
        <circle cx={860} cy={300} r={95} fill={mood === "day" ? "#FFD93B" : "#FF6B35"} stroke={C.outline} strokeWidth={6} />
        {/* nuvens */}
        {[
          [100, 220, 0.6],
          [700, 420, 0.9],
          [400, 160, 0.4],
        ].map(([b, y, s], i) => (
          <g key={i} transform={`translate(${cloudX(b, s)} ${y})`} opacity={0.95}>
            <ellipse cx={0} cy={0} rx={90} ry={40} fill="#FFF" />
            <ellipse cx={-55} cy={10} rx={55} ry={30} fill="#FFF" />
            <ellipse cx={60} cy={8} rx={60} ry={32} fill="#FFF" />
          </g>
        ))}
        {/* montanhas */}
        <path d={`M -50 ${groundY} L 180 700 L 380 ${groundY} Z`} fill={mood === "day" ? "#8E7CC3" : "#5B3A8C"} />
        <path d={`M 250 ${groundY} L 520 620 L 800 ${groundY} Z`} fill={mood === "day" ? "#7A6AB0" : "#4A2C7A"} />
        {/* vulcão com fumaça */}
        <path d={`M 640 ${groundY} L 860 760 L 940 760 L 1160 ${groundY} Z`} fill={mood === "day" ? "#6B4E3D" : "#3E2A20"} stroke={C.outline} strokeWidth={5} />
        <path d="M 860 760 L 880 800 L 900 770 L 920 805 L 940 760 Z" fill="#FF5A1F" />
        {[0, 1, 2].map((i) => {
          const t = ((frame + i * 25) % 75) / 75;
          return (
            <circle key={i} cx={900 + Math.sin(t * 6 + i) * 30 - t * 60} cy={740 - t * 300} r={30 + t * 60} fill="#B8B0B8" opacity={0.8 * (1 - t)} />
          );
        })}
        {/* chão */}
        <path d={`M 0 ${groundY} Q 540 ${groundY - 40} 1080 ${groundY} L 1080 1920 L 0 1920 Z`} fill={mood === "day" ? "#7CC36B" : "#4F8A44"} stroke={C.outline} strokeWidth={6} />
        <rect x={0} y={groundY + 260} width={1080} height={800} fill={mood === "day" ? "#C9925A" : "#8C6239"} />
        <path d={`M 0 ${groundY + 260} Q 270 ${groundY + 230} 540 ${groundY + 260} T 1080 ${groundY + 260}`} fill="none" stroke={C.outline} strokeWidth={6} />
        {/* pedras e samambaias */}
        {[
          [80, groundY + 120, 1],
          [980, groundY + 150, 1.2],
          [160, groundY + 420, 0.9],
          [900, groundY + 480, 1.1],
        ].map(([x, y, s], i) => (
          <ellipse key={i} cx={x} cy={y} rx={55 * s} ry={34 * s} fill="#9A9AA6" stroke={C.outline} strokeWidth={6} />
        ))}
        {[
          [40, groundY + 20],
          [1040, groundY + 30],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${Math.sin(frame / 12 + i) * 3})`}>
            {[-50, -25, 0, 25, 50].map((a) => (
              <path key={a} d="M 0 0 Q 10 -120 0 -220" stroke="#2E7D32" strokeWidth={22} fill="none" strokeLinecap="round" transform={`rotate(${a})`} />
            ))}
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

/** Interior da caverna à noite, com céu estrelado na entrada. */
export const CaveInterior: React.FC<{ frame: number; glow?: number }> = ({ frame, glow = 1 }) => {
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920}>
        <defs>
          <radialGradient id="fireglow" cx="50%" cy="62%" r="60%">
            <stop offset="0" stopColor={`rgba(255,160,60,${0.55 * glow})`} />
            <stop offset="1" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill="#0D1B3D" />
        {/* estrelas */}
        {[...Array(30)].map((_, i) => {
          const x = 660 + ((i * 137) % 420);
          const y = 560 + ((i * 89) % 600);
          const tw = 0.5 + 0.5 * Math.sin(frame / 6 + i);
          return <circle key={i} cx={x} cy={y} r={3 + (i % 3)} fill="#FFF" opacity={tw} />;
        })}
        <circle cx={870} cy={660} r={60} fill="#FFF6C9" />
        <circle cx={895} cy={645} r={52} fill="#0D1B3D" />
        {/* paredes da caverna (abertura à direita mostrando a noite) */}
        <path
          d="M 0 0 L 1080 0 L 1080 1920 L 0 1920 Z M 650 1180 Q 610 760 760 560 Q 880 430 1000 560 Q 1100 760 1070 1180 Z"
          fill="#4A3426"
          fillRule="evenodd"
        />
        <path d="M 650 1180 Q 610 760 760 560 Q 880 430 1000 560 Q 1100 760 1070 1180" fill="none" stroke={C.outline} strokeWidth={10} />
        {[...Array(10)].map((_, i) => (
          <ellipse key={i} cx={(i * 211) % 600} cy={100 + ((i * 173) % 1700)} rx={60} ry={30} fill="#3B281D" />
        ))}
        {/* chão */}
        <path d="M 0 1220 Q 540 1150 1080 1220 L 1080 1920 L 0 1920 Z" fill="#5C4030" stroke={C.outline} strokeWidth={8} />
        <rect width={1080} height={1920} fill="url(#fireglow)" />
      </svg>
    </AbsoluteFill>
  );
};
