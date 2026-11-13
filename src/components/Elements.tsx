import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { clamp, outline, pop } from "../lib";

const INK = "#2a1608";

// ---------------------------------------------------------------- Texto grande
export const BigText: React.FC<{
  text: string;
  at?: number; // frame (local) em que aparece
  x?: number;
  y: number;
  size?: number;
  color?: string;
  stroke?: string;
  rotate?: number;
  wobble?: boolean;
  font?: "Bangers" | "Baloo";
  width?: number;
  bg?: string;
  out?: number; // frame em que some
}> = ({ text, at = 0, x = 540, y, size = 120, color = "#ffd60a", stroke = INK, rotate = 0, wobble = true, font = "Bangers", width = 1000, bg, out }) => {
  const frame = useCurrentFrame();
  const s = pop(frame, at);
  if (frame < at) return null;
  const leave = out !== undefined ? interpolate(frame, [out, out + 8], [1, 0], clamp) : 1;
  if (leave <= 0) return null;
  const wob = wobble ? Math.sin((frame - at) * 0.12) * 2 : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y,
        width,
        textAlign: "center",
        transform: `translateY(-50%) scale(${s * leave}) rotate(${rotate + wob}deg)`,
        fontFamily: font,
        fontWeight: font === "Baloo" ? 800 : 400,
        fontSize: size,
        lineHeight: 1.0,
        letterSpacing: font === "Bangers" ? 3 : 0,
        color,
        textShadow: bg ? undefined : outline(size / 14, stroke),
        whiteSpace: "pre-line",
      }}
    >
      {bg ? (
        <span
          style={{
            background: bg,
            padding: "10px 34px 4px",
            borderRadius: 28,
            border: `8px solid ${INK}`,
            boxShadow: `0 12px 0 ${INK}`,
            display: "inline-block",
          }}
        >
          {text}
        </span>
      ) : (
        text
      )}
    </div>
  );
};

// ---------------------------------------------------------------- Fundo raios de sol
export const Sunburst: React.FC<{ c1: string; c2: string; speed?: number; cx?: number; cy?: number }> = ({ c1, c2, speed = 0.4, cx = 540, cy = 900 }) => {
  const frame = useCurrentFrame();
  const n = 18;
  return (
    <AbsoluteFill style={{ background: c1 }}>
      <svg width={1080} height={1920}>
        <g transform={`translate(${cx},${cy}) rotate(${frame * speed})`}>
          {Array.from({ length: n }).map((_, i) => {
            const a1 = (i / n) * Math.PI * 2;
            const a2 = ((i + 0.5) / n) * Math.PI * 2;
            const R = 2200;
            return <path key={i} d={`M 0 0 L ${Math.cos(a1) * R} ${Math.sin(a1) * R} L ${Math.cos(a2) * R} ${Math.sin(a2) * R} Z`} fill={c2} />;
          })}
        </g>
        <defs>
          <radialGradient id="vig">
            <stop offset="0.45" stopColor="black" stopOpacity={0} />
            <stop offset="1" stopColor="black" stopOpacity={0.55} />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#vig)" />
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Fogueira
export const Fire: React.FC<{ x: number; y: number; scale?: number; intensity?: number }> = ({ x, y, scale = 1, intensity = 1 }) => {
  const frame = useCurrentFrame();
  const flame = (w: number, h: number, color: string, ph: number) => {
    const j = (k: number) => Math.sin(frame * 0.45 + ph + k) * 10 + Math.sin(frame * 0.83 + ph * 2 + k) * 6;
    const hh = h * (0.9 + 0.1 * Math.sin(frame * 0.6 + ph)) * intensity;
    return (
      <path
        d={`M ${-w} 0 C ${-w - 10} ${-hh * 0.4} ${-w * 0.3 + j(1)} ${-hh * 0.6} ${j(2)} ${-hh} C ${w * 0.3 + j(3)} ${-hh * 0.6} ${w + 10} ${-hh * 0.4} ${w} 0 Q 0 ${w * 0.5} ${-w} 0 Z`}
        fill={color}
      />
    );
  };
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <defs>
        <radialGradient id="fireglow">
          <stop offset="0" stopColor="#ffb703" stopOpacity={0.55} />
          <stop offset="1" stopColor="#ff7b00" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={0} cy={-80} r={(420 + Math.sin(frame * 0.3) * 25) * intensity} fill="url(#fireglow)" />
      {/* pedras */}
      {[-120, -70, -10, 55, 115].map((px, i) => (
        <ellipse key={i} cx={px} cy={18} rx={36} ry={24} fill="#6c757d" stroke={INK} strokeWidth={6} />
      ))}
      {/* lenha */}
      <rect x={-130} y={-28} width={260} height={36} rx={18} fill="#7a4a1d" stroke={INK} strokeWidth={7} transform="rotate(12)" />
      <rect x={-130} y={-28} width={260} height={36} rx={18} fill="#8b5a2b" stroke={INK} strokeWidth={7} transform="rotate(-12)" />
      <g transform="translate(0,-20)">
        {flame(95, 300, "#e85d04", 0)}
        {flame(70, 230, "#f48c06", 1.3)}
        {flame(45, 160, "#ffba08", 2.1)}
        {flame(22, 90, "#fff3b0", 3)}
      </g>
      {/* faíscas */}
      {Array.from({ length: 14 }).map((_, i) => {
        const life = 50 + random(`sp${i}`) * 40;
        const t = ((frame + random(`so${i}`) * 100) % life) / life;
        const sx = (random(`sx${i}`) - 0.5) * 160 + Math.sin(frame * 0.1 + i) * 30 * t;
        return <circle key={i} cx={sx} cy={-120 - t * 420 * intensity} r={6 * (1 - t) + 2} fill="#ffd166" opacity={1 - t} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------- Partículas/brilhos
export const Sparkles: React.FC<{ count?: number; color?: string; seed?: string; area?: [number, number, number, number] }> = ({
  count = 16,
  color = "#fff3b0",
  seed = "s",
  area = [0, 0, 1080, 1920],
}) => {
  const frame = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: count }).map((_, i) => {
        const x = area[0] + random(`${seed}x${i}`) * area[2];
        const y = area[1] + random(`${seed}y${i}`) * area[3];
        const s = Math.max(0, Math.sin(frame * 0.12 + i * 1.7)) * (10 + random(`${seed}s${i}`) * 14);
        return (
          <path
            key={i}
            d={`M ${x} ${y - s * 2} L ${x + s * 0.5} ${y - s * 0.5} L ${x + s * 2} ${y} L ${x + s * 0.5} ${y + s * 0.5} L ${x} ${y + s * 2} L ${x - s * 0.5} ${y + s * 0.5} L ${x - s * 2} ${y} L ${x - s * 0.5} ${y - s * 0.5} Z`}
            fill={color}
          />
        );
      })}
    </svg>
  );
};

// ---------------------------------------------------------------- Barra de status
export const StatBar: React.FC<{ label: string; value: number; color: string; at: number; y: number; x?: number }> = ({ label, value, color, at, y, x = 140 }) => {
  const frame = useCurrentFrame();
  const s = pop(frame, at);
  const fill = interpolate(frame, [at + 5, at + 30], [0, value], clamp);
  if (frame < at) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 800, transform: `scale(${s})`, transformOrigin: "left center" }}>
      <div style={{ fontFamily: "Bangers", fontSize: 64, color: "white", textShadow: outline(5), letterSpacing: 2 }}>{label}</div>
      <div style={{ height: 54, borderRadius: 30, background: "#2a1608", border: "7px solid #2a1608", overflow: "hidden", boxShadow: "0 8px 0 rgba(0,0,0,0.35)" }}>
        <div style={{ width: `${fill}%`, height: "100%", borderRadius: 24, background: color, boxShadow: "inset 0 -10px 0 rgba(0,0,0,0.2), inset 0 8px 0 rgba(255,255,255,0.35)" }} />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- Ícones
export const RedX: React.FC<{ at: number; size?: number }> = ({ at, size = 260 }) => {
  const frame = useCurrentFrame();
  const s = pop(frame, at, 7);
  if (frame < at) return null;
  return (
    <g transform={`scale(${s * (1 + (1 - Math.min(1, (frame - at) / 6)) * 0.6)})`}>
      <path d={`M ${-size / 2} ${-size / 2} L ${size / 2} ${size / 2} M ${size / 2} ${-size / 2} L ${-size / 2} ${size / 2}`} stroke={INK} strokeWidth={60} strokeLinecap="round" />
      <path d={`M ${-size / 2} ${-size / 2} L ${size / 2} ${size / 2} M ${size / 2} ${-size / 2} L ${-size / 2} ${size / 2}`} stroke="#e63946" strokeWidth={40} strokeLinecap="round" />
    </g>
  );
};

export const CartIcon: React.FC = () => (
  <g>
    <path d="M -140 -90 L -100 -90 L -60 60 L 110 60 L 140 -50 L -85 -50" fill="none" stroke={INK} strokeWidth={22} strokeLinejoin="round" strokeLinecap="round" />
    <path d="M -80 -40 L 125 -40 L 100 45 L -55 45 Z" fill="#4cc9f0" stroke={INK} strokeWidth={10} />
    <circle cx={-40} cy={105} r={24} fill="#adb5bd" stroke={INK} strokeWidth={10} />
    <circle cx={90} cy={105} r={24} fill="#adb5bd" stroke={INK} strokeWidth={10} />
  </g>
);

export const FridgeIcon: React.FC = () => (
  <g>
    <rect x={-90} y={-150} width={180} height={300} rx={26} fill="#e9f5ff" stroke={INK} strokeWidth={12} />
    <line x1={-90} y1={-40} x2={90} y2={-40} stroke={INK} strokeWidth={10} />
    <rect x={50} y={-120} width={16} height={56} rx={8} fill={INK} />
    <rect x={50} y={-10} width={16} height={80} rx={8} fill={INK} />
  </g>
);

export const BerryBush: React.FC<{ x: number; y: number; scale?: number; picked?: number }> = ({ x, y, scale = 1, picked = 0 }) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame * 0.08) * 2;
  const berries = [
    [-90, -120], [-30, -170], [40, -150], [100, -100], [-60, -60], [20, -80], [80, -40], [-120, -30], [-10, -20],
  ];
  return (
    <g transform={`translate(${x},${y}) scale(${scale}) rotate(${sway})`}>
      {[[-80, -60, 100], [70, -60, 100], [0, -120, 120], [-20, -30, 110], [60, -130, 80], [-90, -130, 80]].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={i % 2 ? "#2d6a4f" : "#40916c"} stroke={INK} strokeWidth={8} />
      ))}
      {berries.slice(0, berries.length - Math.floor(picked)).map(([bx, by], i) => (
        <g key={i}>
          <circle cx={bx} cy={by} r={20} fill={i % 3 === 0 ? "#7b2cbf" : "#d62839"} stroke={INK} strokeWidth={5} />
          <circle cx={bx - 6} cy={by - 6} r={5} fill="white" opacity={0.7} />
        </g>
      ))}
    </g>
  );
};

export const Root: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    <path d="M -30 -60 Q -50 40 0 120 Q 50 40 30 -60 Z" fill="#e07a2f" stroke={INK} strokeWidth={8} />
    <path d="M -10 -60 Q -40 -140 -60 -150 M 0 -60 Q 0 -150 10 -170 M 10 -60 Q 40 -140 60 -150" stroke="#2d6a4f" strokeWidth={16} strokeLinecap="round" fill="none" />
    <path d="M -15 0 l 20 4 M -10 40 l 18 4" stroke={INK} strokeWidth={5} />
  </g>
);

export const Brain: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame * 0.25) * 0.03;
  return (
    <g transform={`translate(${x},${y}) scale(${scale * pulse})`}>
      <path
        d="M -150 20 Q -190 -60 -120 -110 Q -110 -170 -40 -160 Q 0 -200 50 -165 Q 120 -185 140 -115 Q 200 -80 165 0 Q 190 70 120 100 Q 90 150 20 125 Q -30 160 -80 120 Q -160 120 -150 20 Z"
        fill="#ff8fab"
        stroke={INK}
        strokeWidth={12}
        strokeLinejoin="round"
      />
      <path
        d="M 0 -170 Q -20 -60 10 20 Q 30 80 0 130 M -110 -100 Q -60 -80 -80 -30 Q -100 20 -50 40 M 120 -110 Q 70 -70 100 -20 Q 130 30 80 60 M -140 60 Q -100 50 -90 90 M 60 -150 Q 40 -110 60 -80"
        fill="none"
        stroke="#c9184a"
        strokeWidth={10}
        strokeLinecap="round"
      />
    </g>
  );
};

export const Bolt: React.FC<{ x: number; y: number; scale?: number; rot?: number }> = ({ x, y, scale = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${scale}) rotate(${rot})`}>
    <path d="M 10 -90 L -50 10 L -5 10 L -20 90 L 50 -15 L 5 -15 Z" fill="#ffd60a" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
  </g>
);

export const CommentIcon: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    <path d="M -110 -80 Q -110 -120 -70 -120 L 70 -120 Q 110 -120 110 -80 L 110 20 Q 110 60 70 60 L -10 60 L -60 110 L -50 60 L -70 60 Q -110 60 -110 20 Z" fill="white" stroke={INK} strokeWidth={12} strokeLinejoin="round" />
    <circle cx={-50} cy={-30} r={16} fill={INK} />
    <circle cx={0} cy={-30} r={16} fill={INK} />
    <circle cx={50} cy={-30} r={16} fill={INK} />
  </g>
);

export const WolfEyes: React.FC<{ x: number; y: number; opacity: number; scale?: number }> = ({ x, y, opacity, scale = 1 }) => {
  const frame = useCurrentFrame();
  const b = Math.sin(frame * 0.05 + x) > 0.96 ? 0.1 : 1;
  return (
    <g transform={`translate(${x},${y}) scale(${scale},${scale * b})`} opacity={opacity}>
      <path d="M -40 0 Q -25 -16 -10 0 Q -25 8 -40 0 Z" fill="#ffee32" />
      <path d="M 10 0 Q 25 -16 40 0 Q 25 8 10 0 Z" fill="#ffee32" />
      <ellipse cx={-25} cy={-2} rx={3} ry={7} fill="black" />
      <ellipse cx={25} cy={-2} rx={3} ry={7} fill="black" />
    </g>
  );
};

/** Tremida de câmera (retorna transform CSS). */
export const shake = (frame: number, from: number, dur: number, amp = 18) => {
  const d = frame - from;
  if (d < 0 || d > dur) return "";
  const k = 1 - d / dur;
  return `translate(${Math.sin(d * 2.7) * amp * k}px, ${Math.cos(d * 3.3) * amp * k}px)`;
};
