import React from "react";
import { C } from "../theme";

/** Fogueira com chamas animadas (formas mudam a cada frame). */
export const Fire: React.FC<{ frame: number; size?: number; style?: React.CSSProperties }> = ({ frame, size = 300, style }) => {
  const f = (o: number, a: number) => Math.sin(frame / 3 + o) * a;
  const flame = (w: number, h: number, color: string, o: number) => (
    <path
      d={`M ${150 - w} 250 Q ${150 - w - 10 + f(o, 8)} ${250 - h * 0.5} ${150 + f(o + 1, 14)} ${250 - h + f(o + 2, 10)} Q ${150 + w + 10 + f(o + 3, 8)} ${250 - h * 0.5} ${150 + w} 250 Z`}
      fill={color}
    />
  );
  return (
    <svg viewBox="0 0 300 320" width={size} height={(size * 320) / 300} style={{ overflow: "visible", ...style }}>
      <circle cx={150} cy={210} r={150 + f(0, 8)} fill="rgba(255,170,40,0.18)" />
      {flame(80, 230, "#FF5A1F", 0)}
      {flame(58, 180, "#FF9F1C", 1.7)}
      {flame(34, 120, "#FFE14D", 3.1)}
      {/* faíscas */}
      {[0, 1, 2, 3].map((i) => {
        const t = ((frame + i * 11) % 40) / 40;
        return <circle key={i} cx={110 + i * 28 + Math.sin(t * 8 + i) * 12} cy={200 - t * 220} r={6 * (1 - t)} fill="#FFD93B" opacity={1 - t} />;
      })}
      {/* lenha */}
      <rect x={50} y={240} width={200} height={34} rx={17} fill="#7A4A26" stroke={C.outline} strokeWidth={6} transform="rotate(12 150 257)" />
      <rect x={50} y={240} width={200} height={34} rx={17} fill="#8E5A2E" stroke={C.outline} strokeWidth={6} transform="rotate(-12 150 257)" />
      {[30, 80, 220, 270].map((x, i) => (
        <ellipse key={i} cx={x} cy={290} rx={26} ry={18} fill="#8C8C96" stroke={C.outline} strokeWidth={5} />
      ))}
    </svg>
  );
};

export const BerryBush: React.FC<{ frame: number; size?: number; style?: React.CSSProperties }> = ({ frame, size = 300, style }) => {
  const sway = Math.sin(frame / 10) * 2;
  return (
    <svg viewBox="0 0 300 240" width={size} height={(size * 240) / 300} style={{ overflow: "visible", ...style }}>
      <g transform={`rotate(${sway} 150 240)`}>
        <ellipse cx={150} cy={150} rx={140} ry={90} fill="#2F8F46" stroke={C.outline} strokeWidth={7} />
        <ellipse cx={90} cy={110} rx={70} ry={60} fill="#3BAA55" stroke={C.outline} strokeWidth={7} />
        <ellipse cx={200} cy={100} rx={80} ry={66} fill="#3BAA55" stroke={C.outline} strokeWidth={7} />
        {[
          [70, 120],
          [120, 90],
          [180, 70],
          [230, 120],
          [150, 150],
          [90, 180],
          [210, 175],
          [260, 160],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={15} fill={i % 3 === 0 ? "#7B2CBF" : "#E63946"} stroke={C.outline} strokeWidth={4} />
            <circle cx={x - 5} cy={y - 5} r={4} fill="rgba(255,255,255,0.7)" />
          </g>
        ))}
      </g>
    </svg>
  );
};

export const PoisonMushroom: React.FC<{ frame: number; size?: number; style?: React.CSSProperties }> = ({ frame, size = 160, style }) => {
  const wobble = Math.sin(frame / 3) * 6;
  return (
    <svg viewBox="0 0 160 190" width={size} height={(size * 190) / 160} style={{ overflow: "visible", ...style }}>
      <g transform={`rotate(${wobble} 80 180)`}>
        <rect x={58} y={90} width={44} height={90} rx={18} fill="#FFF3DC" stroke={C.outline} strokeWidth={6} />
        <path d="M 10 100 Q 10 10 80 10 Q 150 10 150 100 Z" fill="#9B5DE5" stroke={C.outline} strokeWidth={7} />
        {[
          [45, 55],
          [85, 35],
          [115, 70],
          [70, 80],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={11} fill="#E9FF70" />
        ))}
        {/* carinha de caveira */}
        <circle cx={70} cy={130} r={6} fill={C.outline} />
        <circle cx={90} cy={130} r={6} fill={C.outline} />
        <path d="M 68 155 l 6 -6 l 6 6 l 6 -6 l 6 6" stroke={C.outline} strokeWidth={4} fill="none" />
      </g>
    </svg>
  );
};

export const HouseIcon: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg viewBox="0 0 200 200" width={size} height={size}>
    <path d="M 20 100 L 100 30 L 180 100" fill="none" stroke={C.outline} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
    <rect x={45} y={95} width={110} height={85} fill="#FFB86B" stroke={C.outline} strokeWidth={8} />
    <path d="M 30 105 L 100 40 L 170 105 Z" fill="#E4572E" stroke={C.outline} strokeWidth={8} strokeLinejoin="round" />
    <rect x={85} y={125} width={34} height={55} fill="#8E5A2E" stroke={C.outline} strokeWidth={6} />
    <rect x={128} y={115} width={20} height={20} fill="#7FD1FF" stroke={C.outline} strokeWidth={5} />
  </svg>
);

export const CartIcon: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg viewBox="0 0 200 200" width={size} height={size}>
    <path d="M 20 40 L 50 40 L 70 130 L 165 130 L 180 65 L 58 65" fill="#3DB2FF" stroke={C.outline} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" />
    <rect x={80} y={35} width={30} height={30} fill="#FFD93B" stroke={C.outline} strokeWidth={6} />
    <circle cx={120} cy={45} r={16} fill="#E63946" stroke={C.outline} strokeWidth={6} />
    <circle cx={80} cy={160} r={16} fill="#555" stroke={C.outline} strokeWidth={6} />
    <circle cx={150} cy={160} r={16} fill="#555" stroke={C.outline} strokeWidth={6} />
  </svg>
);

export const PhoneIcon: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg viewBox="0 0 200 200" width={size} height={size}>
    <rect x={55} y={15} width={90} height={170} rx={18} fill="#2B2D42" stroke={C.outline} strokeWidth={8} />
    <rect x={66} y={34} width={68} height={120} rx={6} fill="#7FD1FF" />
    <rect x={74} y={46} width={24} height={24} rx={6} fill="#FF4D3D" />
    <rect x={104} y={46} width={24} height={24} rx={6} fill="#3DDC84" />
    <rect x={74} y={78} width={24} height={24} rx={6} fill="#FFD93B" />
    <rect x={104} y={78} width={24} height={24} rx={6} fill="#9B5DE5" />
    <circle cx={100} cy={168} r={8} fill="#EEE" />
  </svg>
);

export const RedX: React.FC<{ size?: number; progress: number }> = ({ size = 200, progress }) => (
  <svg viewBox="0 0 200 200" width={size} height={size} style={{ overflow: "visible" }}>
    <g opacity={progress > 0 ? 1 : 0} transform={`translate(100 100) scale(${0.4 + progress * 0.6}) translate(-100 -100)`}>
      <path d="M 30 30 L 170 170 M 170 30 L 30 170" stroke={C.outline} strokeWidth={40} strokeLinecap="round" />
      <path d="M 30 30 L 170 170 M 170 30 L 30 170" stroke={C.red} strokeWidth={26} strokeLinecap="round" />
    </g>
  </svg>
);

export const Brain: React.FC<{ frame: number; size?: number }> = ({ frame, size = 220 }) => {
  const pulse = 1 + Math.sin(frame / 4) * 0.04;
  return (
    <svg viewBox="0 0 220 180" width={size} height={(size * 180) / 220} style={{ overflow: "visible" }}>
      <g transform={`translate(110 90) scale(${pulse}) translate(-110 -90)`}>
        <path
          d="M 60 150 Q 10 140 18 95 Q 0 60 40 40 Q 50 8 95 18 Q 120 0 150 20 Q 200 20 198 65 Q 220 100 190 130 Q 180 160 140 152 Q 110 172 60 150 Z"
          fill="#FF8FB1"
          stroke={C.outline}
          strokeWidth={8}
        />
        <path d="M 110 22 Q 100 80 115 150" stroke={C.outline} strokeWidth={6} fill="none" />
        <path d="M 45 70 q 25 -10 40 10 M 50 110 q 20 -20 45 0 M 140 60 q 25 0 35 20 M 135 110 q 20 -15 45 5" stroke="#D45C83" strokeWidth={7} fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
};

export const ArrowDown: React.FC<{ size?: number; color?: string }> = ({ size = 160, color = C.yellow }) => (
  <svg viewBox="0 0 160 200" width={size} height={(size * 200) / 160}>
    <path d="M 50 10 L 110 10 L 110 100 L 150 100 L 80 190 L 10 100 L 50 100 Z" fill={color} stroke={C.outline} strokeWidth={10} strokeLinejoin="round" />
  </svg>
);

export const CommentIcon: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <svg viewBox="0 0 120 110" width={size} height={(size * 110) / 120}>
    <path d="M 15 15 H 105 V 75 H 50 L 25 100 V 75 H 15 Z" fill={C.white} stroke={C.outline} strokeWidth={8} strokeLinejoin="round" />
    <circle cx={40} cy={45} r={7} fill={C.outline} />
    <circle cx={60} cy={45} r={7} fill={C.outline} />
    <circle cx={80} cy={45} r={7} fill={C.outline} />
  </svg>
);

/** Pinturas rupestres que vão sendo "desenhadas" (progress 0..1). */
export const CavePainting: React.FC<{ progress: number; width?: number }> = ({ progress, width = 700 }) => {
  const dash = 1600;
  const p = (start: number) => Math.min(1, Math.max(0, (progress - start) / 0.35));
  const stroke = (start: number) => ({
    strokeDasharray: dash,
    strokeDashoffset: dash * (1 - p(start)),
  });
  const col = "#B5381F";
  return (
    <svg viewBox="0 0 700 300" width={width} height={(width * 300) / 700}>
      {/* mamute */}
      <path
        d="M 420 220 L 420 150 Q 410 70 500 60 Q 600 55 620 140 L 620 220 M 600 220 L 600 170 M 450 220 L 450 170 M 430 110 Q 390 140 400 200 M 430 120 Q 380 170 360 140"
        fill="none"
        stroke={col}
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={stroke(0)}
      />
      {/* caçadores palito */}
      {[90, 200, 300].map((x, i) => (
        <path
          key={x}
          d={`M ${x} 110 m -16 0 a 16 16 0 1 0 32 0 a 16 16 0 1 0 -32 0 M ${x} 126 L ${x} 190 M ${x} 190 L ${x - 25} 240 M ${x} 190 L ${x + 25} 240 M ${x} 150 L ${x + 40} 130 M ${x + 40} 160 L ${x + 80} 60`}
          fill="none"
          stroke={col}
          strokeWidth={10}
          strokeLinecap="round"
          style={stroke(0.2 + i * 0.1)}
        />
      ))}
      {/* mãos */}
      {[
        [40, 40],
        [660, 40],
      ].map(([x, y], i) => (
        <g key={i} opacity={p(0.55)} transform={`translate(${x} ${y}) scale(${0.5 + p(0.55) * 0.5})`}>
          <ellipse cx={0} cy={20} rx={22} ry={26} fill="#D9822B" />
          {[-18, -8, 2, 12].map((dx, k) => (
            <rect key={k} x={dx} y={-22} width={8} height={30} rx={4} fill="#D9822B" />
          ))}
          <rect x={18} y={6} width={8} height={24} rx={4} fill="#D9822B" transform="rotate(40 22 18)" />
        </g>
      ))}
    </svg>
  );
};
