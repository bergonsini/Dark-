import React from "react";
import { useCurrentFrame } from "remotion";
import { blink } from "../lib";

/**
 * Personagem cartoon original totalmente "riggado" em SVG.
 * Cada parte (pernas, braços com cotovelo, cabeça, olhos, pálpebras, sobrancelhas, boca)
 * é animável por props — as cenas controlam a pose quadro a quadro.
 *
 * Coordenadas locais: os pés ficam em (0,0); a cabeça em ~(0,-450).
 */
export type Mouth = "smile" | "grin" | "open" | "o" | "sad" | "flat" | "talk" | "yawn";
export type Hold = "none" | "spear" | "basket" | "meat" | "torch";

export type CavemanProps = {
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  variant?: "ugo" | "nara";
  /** ângulo do ombro em graus (0 = braço caído; 90 = esticado para o lado; 170 = para cima) */
  armL?: number;
  armR?: number;
  /** dobra do cotovelo em graus */
  elbowL?: number;
  elbowR?: number;
  /** direção do olhar -1..1 */
  lookX?: number;
  lookY?: number;
  /** -1 bravo/triste .. 0 normal .. 1 surpreso */
  brow?: number;
  browAngry?: number;
  mouth?: Mouth;
  mouthOpen?: number;
  eyesClosed?: number;
  eyeScale?: number;
  headTilt?: number;
  lean?: number;
  /** velocidade do ciclo de caminhada (0 = parado) */
  walk?: number;
  walkPhase?: number;
  /** pulinho/respiração */
  bounce?: number;
  squash?: number;
  sit?: boolean;
  hold?: Hold;
  glasses?: boolean;
  sweat?: boolean;
  blush?: boolean;
  seed?: number;
  opacity?: number;
};

const C = {
  ugo: { skin: "#f2b27a", skinDark: "#d98c55", hair: "#8a3b12", hairDark: "#5e2508", tunic: "#c9772f", tunicDark: "#8f4b17", spot: "#5a2c0c" },
  nara: { skin: "#e8a676", skinDark: "#c97d4c", hair: "#2b1a12", hairDark: "#140b06", tunic: "#5f8f3e", tunicDark: "#3d6526", spot: "#2c4a1a" },
};
const INK = "#2a1608";

const Arm: React.FC<{
  side: -1 | 1;
  angle: number;
  elbow: number;
  skin: string;
  tunic: string;
  children?: React.ReactNode;
}> = ({ side, angle, elbow, skin, tunic, children }) => (
  <g transform={`translate(${side * 72},-318) rotate(${-side * angle})`}>
    <line x1={0} y1={0} x2={0} y2={88} stroke={INK} strokeWidth={42} strokeLinecap="round" />
    <line x1={0} y1={0} x2={0} y2={88} stroke={skin} strokeWidth={32} strokeLinecap="round" />
    {/* manguinha de pele */}
    <ellipse cx={0} cy={8} rx={26} ry={30} fill={tunic} stroke={INK} strokeWidth={5} />
    <g transform={`translate(0,88) rotate(${-side * elbow})`}>
      <line x1={0} y1={0} x2={0} y2={78} stroke={INK} strokeWidth={40} strokeLinecap="round" />
      <line x1={0} y1={0} x2={0} y2={78} stroke={skin} strokeWidth={30} strokeLinecap="round" />
      <g transform="translate(0,88)">
        {children}
        <circle r={25} fill={skin} stroke={INK} strokeWidth={5} />
        <path d={`M ${-side * 18} -6 q ${-side * 14} 6 ${-side * 4} 18`} stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
    </g>
  </g>
);

const Leg: React.FC<{ side: -1 | 1; angle: number; knee: number; skin: string; sit?: boolean }> = ({ side, angle, knee, skin }) => (
  <g transform={`translate(${side * 38},-165) rotate(${angle})`}>
    <line x1={0} y1={0} x2={0} y2={80} stroke={INK} strokeWidth={46} strokeLinecap="round" />
    <line x1={0} y1={0} x2={0} y2={80} stroke={skin} strokeWidth={36} strokeLinecap="round" />
    <g transform={`translate(0,80) rotate(${knee})`}>
      <line x1={0} y1={0} x2={0} y2={70} stroke={INK} strokeWidth={44} strokeLinecap="round" />
      <line x1={0} y1={0} x2={0} y2={70} stroke={skin} strokeWidth={34} strokeLinecap="round" />
      {/* pé grandão */}
      <ellipse cx={-14} cy={82} rx={44} ry={22} fill={skin} stroke={INK} strokeWidth={6} />
      <path d="M -40 76 q 4 -6 10 0 M -26 72 q 4 -6 10 0" stroke={INK} strokeWidth={3.5} fill="none" />
    </g>
  </g>
);

const Hand: React.FC<{ hold: Hold; frame: number }> = ({ hold, frame }) => {
  if (hold === "spear")
    return (
      <g transform="rotate(-8)">
        <rect x={-8} y={-260} width={16} height={420} rx={8} fill="#8b5a2b" stroke={INK} strokeWidth={5} />
        <path d="M 0 -330 L 26 -255 L 0 -268 L -26 -255 Z" fill="#9aa3ad" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <path d="M -12 -262 l 24 10 M -12 -248 l 24 10" stroke="#c94f2c" strokeWidth={6} />
      </g>
    );
  if (hold === "basket")
    return (
      <g transform="translate(0,40)">
        <path d="M -55 -10 Q 0 -90 55 -10" fill="none" stroke="#7a4a1d" strokeWidth={9} />
        <path d="M -62 -10 L 62 -10 L 46 60 L -46 60 Z" fill="#c8913f" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <path d="M -55 12 L 55 12 M -50 36 L 50 36" stroke="#8a5a1f" strokeWidth={5} />
        {[-30, -5, 22, 40, 8].map((x, i) => (
          <circle key={i} cx={x} cy={-18 - (i % 2) * 10} r={13} fill={i % 2 ? "#7b2cbf" : "#d62839"} stroke={INK} strokeWidth={4} />
        ))}
      </g>
    );
  if (hold === "meat")
    return (
      <g transform="rotate(-35)">
        <rect x={-6} y={-230} width={12} height={250} rx={6} fill="#7a4a1d" stroke={INK} strokeWidth={4} />
        <ellipse cx={0} cy={-210} rx={45} ry={38} fill="#a0361f" stroke={INK} strokeWidth={6} />
        <ellipse cx={-10} cy={-220} rx={20} ry={12} fill="#c85a3a" />
        <circle cx={-34} cy={-246} r={13} fill="#f3ead2" stroke={INK} strokeWidth={4} />
        <circle cx={34} cy={-178} r={13} fill="#f3ead2" stroke={INK} strokeWidth={4} />
        {[0, 1, 2].map((i) => {
          const p = ((frame * 0.8 + i * 20) % 60) / 60;
          return (
            <path
              key={i}
              d={`M ${-20 + i * 20} ${-260 - p * 90} q 12 -15 0 -30 q -12 -15 0 -30`}
              stroke="white"
              strokeWidth={6}
              fill="none"
              strokeLinecap="round"
              opacity={(1 - p) * 0.7}
            />
          );
        })}
      </g>
    );
  if (hold === "torch")
    return (
      <g>
        <rect x={-9} y={-200} width={18} height={230} rx={8} fill="#7a4a1d" stroke={INK} strokeWidth={5} />
        <path
          d={`M 0 ${-300 - Math.sin(frame * 0.5) * 12} C 40 -250 30 -205 0 -195 C -30 -205 -40 -250 0 ${-300 - Math.sin(frame * 0.5) * 12}`}
          fill="#ff9f1c"
          stroke="#e85d04"
          strokeWidth={6}
        />
      </g>
    );
  return null;
};

export const Caveman: React.FC<CavemanProps> = (p) => {
  const frame = useCurrentFrame();
  const v = p.variant ?? "ugo";
  const c = C[v];
  const seed = p.seed ?? (v === "ugo" ? 1 : 2);

  // --- corpo
  const walk = p.walk ?? 0;
  const phase = frame * walk * 0.25 + (p.walkPhase ?? 0);
  const legSwing = walk ? Math.sin(phase) * 28 : 0;
  const stepBob = walk ? Math.abs(Math.cos(phase)) * 14 : 0;
  const breathe = Math.sin(frame * 0.12 + seed) * 3;
  const bounce = (p.bounce ?? 0) * Math.abs(Math.sin(frame * 0.35));
  const squash = p.squash ?? 0;
  const lean = p.lean ?? 0;

  // --- rosto
  const closedBlink = blink(frame, seed);
  const closed = Math.max(p.eyesClosed ?? 0, closedBlink);
  const lookX = (p.lookX ?? 0) * 11;
  const lookY = (p.lookY ?? 0) * 9;
  const brow = p.brow ?? 0;
  const angry = p.browAngry ?? 0;
  const eyeScale = p.eyeScale ?? 1;
  const mouth = p.mouth ?? "smile";
  const mo = Math.max(0, Math.min(1, p.mouthOpen ?? (mouth === "open" ? 0.8 : mouth === "yawn" ? 1 : 0.5)));
  const hold = p.hold ?? "none";

  const sx = (p.flip ? -1 : 1) * (p.scale ?? 1) * (1 + squash * 0.08);
  const sy = (p.scale ?? 1) * (1 - squash * 0.08);

  const legL = p.sit ? -80 : legSwing;
  const legR = p.sit ? 80 : -legSwing;
  const kneeL = p.sit ? 80 : walk ? Math.max(0, -Math.sin(phase)) * 35 : 0;
  const kneeR = p.sit ? -80 : walk ? Math.max(0, Math.sin(phase)) * 35 : 0;
  const sitDrop = p.sit ? 120 : 0;

  const renderMouth = () => {
    const y = -378;
    switch (mouth) {
      case "smile":
        return <path d={`M -34 ${y - 6} Q 0 ${y + 26} 34 ${y - 6}`} stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" />;
      case "grin":
        return (
          <g>
            <path d={`M -42 ${y - 10} Q 0 ${y + 44} 42 ${y - 10} Z`} fill="#5a1414" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
            <path d={`M -36 ${y - 8} L 36 ${y - 8} L 30 ${y + 4} L -30 ${y + 4} Z`} fill="#fffbe8" />
            <ellipse cx={0} cy={y + 20} rx={16} ry={8} fill="#e5636b" />
          </g>
        );
      case "sad":
        return <path d={`M -30 ${y + 12} Q 0 ${y - 14} 30 ${y + 12}`} stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" />;
      case "flat":
        return <path d={`M -26 ${y + 2} L 26 ${y + 2}`} stroke={INK} strokeWidth={8} strokeLinecap="round" />;
      case "o":
        return <ellipse cx={0} cy={y + 4} rx={14} ry={18} fill="#5a1414" stroke={INK} strokeWidth={6} />;
      case "open":
      case "talk":
      case "yawn": {
        const h = 6 + mo * (mouth === "yawn" ? 52 : 38);
        const w = mouth === "yawn" ? 30 + mo * 6 : 34 - mo * 6;
        return (
          <g>
            <path
              d={`M ${-w} ${y - 6} Q 0 ${y - 14} ${w} ${y - 6} Q ${w * 0.9} ${y + h} 0 ${y + h} Q ${-w * 0.9} ${y + h} ${-w} ${y - 6} Z`}
              fill="#5a1414"
              stroke={INK}
              strokeWidth={7}
              strokeLinejoin="round"
            />
            {h > 18 && <ellipse cx={0} cy={y + h - 9} rx={w * 0.55} ry={Math.min(10, h / 4)} fill="#e5636b" />}
            <rect x={-w * 0.7} y={y - 9} width={w * 1.4} height={7} rx={3} fill="#fffbe8" />
          </g>
        );
      }
    }
  };

  const Eye: React.FC<{ cx: number; side: -1 | 1 }> = ({ cx, side }) => {
    const ry = 31 * eyeScale;
    const rx = 25 * eyeScale;
    const openY = Math.max(0.04, 1 - closed);
    return (
      <g transform={`translate(${cx},-452)`}>
        <g transform={`scale(1,${openY})`}>
          <ellipse rx={rx} ry={ry} fill="white" stroke={INK} strokeWidth={6} />
          <circle cx={lookX} cy={lookY + 3} r={13 * Math.min(1.15, eyeScale)} fill={INK} />
          <circle cx={lookX + 5} cy={lookY - 3} r={4.5} fill="white" />
        </g>
        {closed > 0.85 && <path d={`M ${-rx} 0 Q 0 12 ${rx} 0`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />}
        {/* sobrancelha */}
        <g transform={`translate(0,${-ry - 14 - brow * 14}) rotate(${side * angry * 16 + side * -brow * 4})`}>
          <path d={v === "ugo" ? "M -30 4 Q 0 -14 30 4" : "M -26 2 Q 0 -10 26 2"} stroke={v === "ugo" ? c.hairDark : INK} strokeWidth={v === "ugo" ? 14 : 8} strokeLinecap="round" fill="none" />
        </g>
        {v === "nara" && closed < 0.5 && (
          <path d={`M ${side * 18} ${-ry + 6} l ${side * 14} -10 M ${side * 6} ${-ry + 2} l ${side * 8} -12`} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        )}
      </g>
    );
  };

  return (
    <g transform={`translate(${p.x},${p.y}) scale(${sx},${sy})`} opacity={p.opacity ?? 1}>
      {/* sombra no chão */}
      <ellipse cx={0} cy={6} rx={120 - stepBob} ry={20} fill="rgba(0,0,0,0.25)" />
      <g transform={`translate(0,${-stepBob - bounce * 40 + sitDrop})`}>
        {/* pernas */}
        <Leg side={-1} angle={legL} knee={kneeL} skin={c.skin} />
        <Leg side={1} angle={legR} knee={kneeR} skin={c.skin} />

        <g transform={`rotate(${lean}, 0, -165)`}>
          {/* braço de trás */}
          <Arm side={1} angle={p.armR ?? 10} elbow={p.elbowR ?? 10} skin={c.skin} tunic={c.tunic}>
            <Hand hold={hold} frame={frame} />
          </Arm>

          {/* tronco */}
          <g transform={`translate(0,${breathe * 0.4})`}>
            <path
              d="M -82 -335 Q -110 -250 -100 -150 L 100 -150 Q 110 -250 82 -335 Q 0 -365 -82 -335 Z"
              fill={c.skin}
              stroke={INK}
              strokeWidth={7}
            />
            {/* túnica de pele com bainha irregular */}
            <path
              d="M -60 -345 L 90 -330 Q 112 -240 104 -150 L 80 -118 L 58 -146 L 34 -112 L 10 -144 L -14 -110 L -38 -142 L -62 -112 L -84 -146 L -106 -128 Q -112 -230 -60 -345 Z"
              fill={c.tunic}
              stroke={INK}
              strokeWidth={7}
              strokeLinejoin="round"
            />
            {[
              [-50, -260, 16, 11],
              [30, -290, 13, 9],
              [60, -210, 15, 10],
              [-20, -190, 12, 9],
              [-70, -180, 10, 8],
              [10, -240, 9, 7],
            ].map(([x, y, rx, ry], i) => (
              <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill={c.spot} opacity={0.8} />
            ))}
            {/* alça sobre o ombro */}
            <path d="M -60 -345 Q -20 -300 -10 -250" stroke={c.tunicDark} strokeWidth={8} fill="none" strokeLinecap="round" />
            {v === "nara" && (
              <g>
                {[-30, 0, 30].map((x, i) => (
                  <path key={i} d={`M ${x} -338 l 6 22 l 6 -22`} fill="#f3ead2" stroke={INK} strokeWidth={3} />
                ))}
              </g>
            )}
          </g>

          {/* cabeça */}
          <g transform={`rotate(${(p.headTilt ?? 0) + Math.sin(frame * 0.07 + seed) * 2}, 0, -350)`}>
            {/* cabelo de trás */}
            {v === "ugo" ? (
              <path
                d="M -110 -440 Q -130 -540 -40 -575 Q 20 -600 80 -565 Q 140 -530 112 -430 Q 100 -380 80 -390 L -80 -390 Q -100 -380 -110 -440 Z"
                fill={c.hair}
                stroke={INK}
                strokeWidth={7}
              />
            ) : (
              <path
                d="M -108 -450 Q -125 -560 0 -578 Q 125 -560 108 -450 L 118 -250 Q 90 -230 70 -260 L 80 -380 L -80 -380 L -70 -260 Q -90 -230 -118 -250 Z"
                fill={c.hair}
                stroke={INK}
                strokeWidth={7}
              />
            )}
            {/* orelhas */}
            <circle cx={-92} cy={-430} r={22} fill={c.skin} stroke={INK} strokeWidth={6} />
            <circle cx={92} cy={-430} r={22} fill={c.skin} stroke={INK} strokeWidth={6} />
            {/* rosto */}
            <ellipse cx={0} cy={-435} rx={92} ry={100} fill={c.skin} stroke={INK} strokeWidth={7} />
            {/* barba */}
            {v === "ugo" && (
              <path
                d="M -90 -430 Q -100 -330 -50 -300 Q -30 -280 0 -292 Q 30 -280 50 -300 Q 100 -330 90 -430 Q 70 -380 40 -395 Q 0 -410 -40 -395 Q -70 -380 -90 -430 Z"
                fill={c.hair}
                stroke={INK}
                strokeWidth={7}
                strokeLinejoin="round"
              />
            )}
            {/* franja */}
            {v === "ugo" ? (
              <path
                d="M -96 -470 Q -90 -545 -20 -548 Q 40 -560 96 -470 L 70 -505 L 60 -470 L 35 -508 L 20 -478 L -2 -510 L -18 -478 L -40 -508 L -55 -472 L -72 -505 Z"
                fill={c.hair}
                stroke={INK}
                strokeWidth={7}
                strokeLinejoin="round"
              />
            ) : (
              <g>
                <path d="M -96 -460 Q -60 -560 40 -540 Q 90 -520 96 -460 Q 40 -520 -10 -500 Q -60 -490 -96 -460 Z" fill={c.hair} stroke={INK} strokeWidth={7} />
                {/* osso no cabelo */}
                <g transform="translate(60,-545) rotate(-25)">
                  <rect x={-40} y={-7} width={80} height={14} rx={7} fill="#f3ead2" stroke={INK} strokeWidth={4} />
                  <circle cx={-40} cy={-8} r={10} fill="#f3ead2" stroke={INK} strokeWidth={4} />
                  <circle cx={-40} cy={8} r={10} fill="#f3ead2" stroke={INK} strokeWidth={4} />
                  <circle cx={40} cy={-8} r={10} fill="#f3ead2" stroke={INK} strokeWidth={4} />
                  <circle cx={40} cy={8} r={10} fill="#f3ead2" stroke={INK} strokeWidth={4} />
                </g>
              </g>
            )}
            {/* olhos */}
            <Eye cx={-36} side={-1} />
            <Eye cx={36} side={1} />
            {/* nariz */}
            <ellipse cx={0} cy={-412} rx={v === "ugo" ? 26 : 18} ry={v === "ugo" ? 20 : 14} fill={c.skinDark} stroke={INK} strokeWidth={6} />
            {(p.blush || v === "nara") && (
              <g opacity={0.5}>
                <ellipse cx={-58} cy={-400} rx={16} ry={9} fill="#ff6b6b" />
                <ellipse cx={58} cy={-400} rx={16} ry={9} fill="#ff6b6b" />
              </g>
            )}
            {renderMouth()}
            {p.glasses && (
              <g fill="none" stroke={INK} strokeWidth={7}>
                <circle cx={-36} cy={-452} r={36} fill="rgba(200,240,255,0.25)" />
                <circle cx={36} cy={-452} r={36} fill="rgba(200,240,255,0.25)" />
                <path d="M 0 -458 L 0 -458" />
                <path d="M -2 -456 Q 0 -464 2 -456" />
              </g>
            )}
            {p.sweat && (
              <g>
                {[0, 1].map((i) => {
                  const t = ((frame + i * 12) % 24) / 24;
                  return (
                    <path
                      key={i}
                      d="M 0 0 Q 10 16 0 24 Q -10 16 0 0 Z"
                      transform={`translate(${100 + i * 18},${-500 + t * 70}) scale(1.3)`}
                      fill="#7fd1ff"
                      stroke={INK}
                      strokeWidth={3}
                      opacity={1 - t}
                    />
                  );
                })}
              </g>
            )}
          </g>

          {/* braço da frente */}
          <Arm side={-1} angle={p.armL ?? 10} elbow={p.elbowL ?? 10} skin={c.skin} tunic={c.tunic} />
        </g>
      </g>
    </g>
  );
};
