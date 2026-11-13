import React from "react";
import { C } from "../theme";

/**
 * Personagem cartoon original totalmente articulado em SVG.
 *  - "ugo": homem das cavernas (cabelo espetado, barba, pele de onça laranja)
 *  - "lia": mulher das cavernas (cabelo ruivo longo, osso no cabelo, roupa verde)
 *
 * Todas as partes são controladas por props numéricas, então cada cena
 * anima olhos, sobrancelhas, boca (lip-sync), braços, pernas, cabeça e corpo.
 */
export type Expression = "happy" | "surprised" | "worried" | "talk";
export type HeldItem = "none" | "spear" | "club" | "meat" | "berries" | "stick" | "torch";

export type CavepersonProps = {
  variant?: "ugo" | "lia";
  /** frame atual (para piscar automaticamente) */
  frame: number;
  /** abertura da boca 0..1 (lip-sync) */
  mouth?: number;
  expression?: Expression;
  /** direção do olhar: -1 (esquerda) .. 1 (direita) e vertical */
  lookX?: number;
  lookY?: number;
  /** sobrancelhas: 0 normal, 1 bem levantadas */
  brow?: number;
  /** braços: graus de abertura para fora (0 = caído, 180 = pra cima) */
  armL?: number;
  armR?: number;
  /** pernas: graus de rotação (caminhada) */
  legL?: number;
  legR?: number;
  /** inclinação da cabeça (graus) */
  headTilt?: number;
  /** deslocamento vertical do corpo (respiração/pulo) */
  bodyY?: number;
  /** achatar/esticar (squash & stretch) -0.2..0.2 */
  squash?: number;
  heldItem?: HeldItem;
  /** espelha horizontalmente o personagem */
  flip?: boolean;
  blinkSeed?: number;
  style?: React.CSSProperties;
  width?: number;
};

const Arm: React.FC<{
  side: "L" | "R";
  angle: number;
  skin: string;
  item: HeldItem;
}> = ({ side, angle, skin, item }) => {
  const sx = side === "L" ? 122 : 278;
  const sy = 322;
  const rot = side === "L" ? angle : -angle;
  return (
    <g transform={`rotate(${rot} ${sx} ${sy})`}>
      {side === "R" && item !== "none" ? <Item item={item} x={sx} y={sy + 138} /> : null}
      <rect x={sx - 21} y={sy - 10} width={42} height={140} rx={21} fill={skin} stroke={C.outline} strokeWidth={6} />
      {/* bracelete de couro */}
      <rect x={sx - 22} y={sy + 92} width={44} height={14} rx={6} fill="#7A4A26" stroke={C.outline} strokeWidth={4} />
      <circle cx={sx} cy={sy + 138} r={27} fill={skin} stroke={C.outline} strokeWidth={6} />
      <path d={`M ${sx - 10} ${sy + 128} q 10 10 20 0`} fill="none" stroke={C.outline} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};

const Item: React.FC<{ item: HeldItem; x: number; y: number }> = ({ item, x, y }) => {
  switch (item) {
    case "spear":
      return (
        <g>
          <rect x={x - 7} y={y - 260} width={14} height={380} rx={6} fill="#9C6A3A" stroke={C.outline} strokeWidth={5} />
          <path d={`M ${x} ${y - 330} L ${x + 26} ${y - 255} L ${x - 26} ${y - 255} Z`} fill="#B9C2CC" stroke={C.outline} strokeWidth={6} strokeLinejoin="round" />
          <path d={`M ${x - 12} ${y - 250} l 24 14 M ${x - 12} ${y - 236} l 24 14`} stroke="#E8D3A0" strokeWidth={5} />
        </g>
      );
    case "club":
      return (
        <g transform={`rotate(-20 ${x} ${y})`}>
          <path d={`M ${x - 10} ${y + 20} L ${x - 30} ${y - 170} Q ${x} ${y - 230} ${x + 30} ${y - 170} L ${x + 10} ${y + 20} Z`} fill="#9C6A3A" stroke={C.outline} strokeWidth={6} />
          <circle cx={x - 12} cy={y - 160} r={6} fill="#6E4520" />
          <circle cx={x + 10} cy={y - 120} r={5} fill="#6E4520" />
        </g>
      );
    case "meat":
      return (
        <g>
          <rect x={x - 6} y={y - 150} width={12} height={170} rx={5} fill="#9C6A3A" stroke={C.outline} strokeWidth={5} />
          <ellipse cx={x} cy={y - 170} rx={50} ry={40} fill="#C2452D" stroke={C.outline} strokeWidth={6} />
          <ellipse cx={x - 14} cy={y - 182} rx={18} ry={10} fill="#E8735A" />
          <circle cx={x - 12} cy={y - 214} r={12} fill="#FFF3DC" stroke={C.outline} strokeWidth={4} />
          <circle cx={x + 12} cy={y - 214} r={12} fill="#FFF3DC" stroke={C.outline} strokeWidth={4} />
        </g>
      );
    case "berries":
      return (
        <g>
          <path d={`M ${x - 55} ${y - 30} Q ${x} ${y + 60} ${x + 55} ${y - 30} Z`} fill="#B07A43" stroke={C.outline} strokeWidth={6} />
          {[-30, -8, 16, 36, -18, 6, 26].map((dx, i) => (
            <circle key={i} cx={x + dx} cy={y - 34 - (i > 3 ? 18 : 0)} r={13} fill={i % 2 ? "#D7263D" : "#7B2CBF"} stroke={C.outline} strokeWidth={4} />
          ))}
        </g>
      );
    case "stick":
      return (
        <g>
          <rect x={x - 5} y={y - 160} width={10} height={180} rx={5} fill="#9C6A3A" stroke={C.outline} strokeWidth={4} />
          <circle cx={x} cy={y - 165} r={13} fill="#C0392B" stroke={C.outline} strokeWidth={4} />
        </g>
      );
    case "torch":
      return (
        <g>
          <rect x={x - 8} y={y - 150} width={16} height={170} rx={6} fill="#9C6A3A" stroke={C.outline} strokeWidth={5} />
          <path d={`M ${x - 30} ${y - 150} Q ${x} ${y - 260} ${x + 30} ${y - 150} Z`} fill="#FF8A00" stroke={C.outline} strokeWidth={5} />
          <path d={`M ${x - 14} ${y - 152} Q ${x} ${y - 215} ${x + 14} ${y - 152} Z`} fill="#FFE14D" />
        </g>
      );
    default:
      return null;
  }
};

const blinkAmount = (frame: number, seed: number) => {
  // pisca a cada ~2,5-3,5 s, piscada dura 6 frames
  const period = 84 + (seed % 5) * 9;
  const t = (frame + seed * 17) % period;
  if (t < 6) return Math.sin((t / 6) * Math.PI);
  return 0;
};

export const Caveperson: React.FC<CavepersonProps> = ({
  variant = "ugo",
  frame,
  mouth = 0,
  expression = "happy",
  lookX = 0,
  lookY = 0,
  brow = 0,
  armL = 10,
  armR = 10,
  legL = 0,
  legR = 0,
  headTilt = 0,
  bodyY = 0,
  squash = 0,
  heldItem = "none",
  flip = false,
  blinkSeed = 0,
  style,
  width = 400,
}) => {
  const isUgo = variant === "ugo";
  const skin = C.skin;
  const fur = isUgo ? C.furUgo : C.furLia;
  const spot = isUgo ? C.furUgoSpot : C.furLiaSpot;
  const hair = isUgo ? C.hairUgo : C.hairLia;

  const blink = Math.max(blinkAmount(frame, blinkSeed), expression === "happy" && mouth < 0.05 ? 0 : 0);
  const surprised = expression === "surprised";
  const worried = expression === "worried";
  const eyeRy = surprised ? 36 : 30;
  const pupilR = surprised ? 9 : 13;
  const px = lookX * 9;
  const py = lookY * 9;

  const browLift = brow * 16 + (surprised ? 14 : 0);
  const browTiltL = worried ? -14 : surprised ? 6 : 0;
  const browTiltR = worried ? 14 : surprised ? -6 : 0;

  // boca: se está falando usa elipse aberta, se não, sorriso/surpresa
  const talking = mouth > 0.04;
  const height = width * 1.6;

  const breathe = Math.sin(frame / 9) * 3;

  return (
    <svg
      viewBox="0 0 400 640"
      width={width}
      height={height}
      style={{ overflow: "visible", ...style }}
    >
      <g transform={flip ? "translate(400 0) scale(-1 1)" : undefined}>
        {/* sombra no chão */}
        <ellipse cx={200} cy={628} rx={120 - bodyY * 0.3} ry={16} fill="rgba(0,0,0,0.25)" />
        <g transform={`translate(0 ${bodyY}) translate(200 630) scale(${1 + squash} ${1 - squash}) translate(-200 -630)`}>
          {/* cabelo longo da Lia (atrás) */}
          {!isUgo && (
            <path
              d="M 90 170 Q 70 330 120 380 L 280 380 Q 330 330 310 170 Z"
              fill={hair}
              stroke={C.outline}
              strokeWidth={6}
              transform={`rotate(${headTilt * 0.5} 200 300)`}
            />
          )}
          {/* pernas */}
          <g transform={`rotate(${legL} 172 440)`}>
            <rect x={150} y={430} width={46} height={160} rx={22} fill={skin} stroke={C.outline} strokeWidth={6} />
            <ellipse cx={160} cy={600} rx={42} ry={22} fill={skin} stroke={C.outline} strokeWidth={6} />
          </g>
          <g transform={`rotate(${legR} 228 440)`}>
            <rect x={204} y={430} width={46} height={160} rx={22} fill={skin} stroke={C.outline} strokeWidth={6} />
            <ellipse cx={240} cy={600} rx={42} ry={22} fill={skin} stroke={C.outline} strokeWidth={6} />
          </g>
          {/* braço esquerdo atrás do corpo */}
          <Arm side="L" angle={armL} skin={skin} item={heldItem} />
          {/* tronco */}
          <g transform={`translate(0 ${breathe * 0.4})`}>
            <path d="M 120 300 Q 200 270 280 300 L 292 470 Q 200 495 108 470 Z" fill={skin} stroke={C.outline} strokeWidth={6} />
            {/* pele de animal */}
            <path
              d={
                isUgo
                  ? "M 112 340 L 250 296 L 292 330 L 296 470 L 270 500 L 245 474 L 220 505 L 195 476 L 170 506 L 146 476 L 120 500 L 104 470 Z"
                  : "M 110 318 Q 200 300 290 318 L 296 470 L 272 502 L 246 476 L 220 506 L 196 478 L 170 506 L 146 478 L 122 502 L 104 470 Z"
              }
              fill={fur}
              stroke={C.outline}
              strokeWidth={6}
              strokeLinejoin="round"
            />
            {[
              [150, 380],
              [200, 360],
              [245, 400],
              [180, 440],
              [260, 455],
              [135, 445],
              [225, 335],
            ].map(([x, y], i) => (
              <ellipse key={i} cx={x} cy={y} rx={13} ry={9} fill={spot} transform={`rotate(${i * 25} ${x} ${y})`} />
            ))}
            {/* colar de dente */}
            <path d="M 160 300 Q 200 330 240 300" fill="none" stroke="#7A4A26" strokeWidth={5} />
            <path d="M 194 318 l 6 22 l 6 -22 z" fill="#FFF3DC" stroke={C.outline} strokeWidth={3} />
          </g>
          {/* braço direito na frente */}
          <Arm side="R" angle={armR} skin={skin} item={heldItem} />

          {/* cabeça */}
          <g transform={`rotate(${headTilt} 200 300) translate(0 ${breathe * 0.6})`}>
            {/* orelhas */}
            <ellipse cx={86} cy={195} rx={20} ry={28} fill={skin} stroke={C.outline} strokeWidth={6} />
            <ellipse cx={314} cy={195} rx={20} ry={28} fill={skin} stroke={C.outline} strokeWidth={6} />
            <ellipse cx={200} cy={185} rx={118} ry={120} fill={skin} stroke={C.outline} strokeWidth={6} />
            {/* bochechas */}
            <ellipse cx={128} cy={232} rx={22} ry={13} fill="#F08A6E" opacity={0.55} />
            <ellipse cx={272} cy={232} rx={22} ry={13} fill="#F08A6E" opacity={0.55} />

            {/* barba do Ugo */}
            {isUgo && (
              <path
                d="M 96 215 Q 100 330 200 336 Q 300 330 304 215 Q 290 260 250 250 Q 200 236 150 250 Q 110 260 96 215 Z"
                fill={hair}
                stroke={C.outline}
                strokeWidth={6}
              />
            )}

            {/* cabelo */}
            {isUgo ? (
              <path
                d="M 84 170 L 70 110 L 108 128 L 104 70 L 148 100 L 160 40 L 196 88 L 228 34 L 246 92 L 292 56 L 290 116 L 334 100 L 316 168 Q 300 120 200 118 Q 110 120 84 170 Z"
                fill={hair}
                stroke={C.outline}
                strokeWidth={6}
                strokeLinejoin="round"
              />
            ) : (
              <g>
                <path
                  d="M 80 190 Q 70 60 200 58 Q 330 60 320 190 Q 300 120 250 112 Q 230 140 200 128 Q 170 140 150 112 Q 100 120 80 190 Z"
                  fill={hair}
                  stroke={C.outline}
                  strokeWidth={6}
                  strokeLinejoin="round"
                />
                {/* osso no cabelo */}
                <g transform="rotate(-25 270 80)">
                  <rect x={232} y={72} width={76} height={16} rx={8} fill="#FFF3DC" stroke={C.outline} strokeWidth={4} />
                  <circle cx={232} cy={72} r={10} fill="#FFF3DC" stroke={C.outline} strokeWidth={4} />
                  <circle cx={232} cy={88} r={10} fill="#FFF3DC" stroke={C.outline} strokeWidth={4} />
                  <circle cx={308} cy={72} r={10} fill="#FFF3DC" stroke={C.outline} strokeWidth={4} />
                  <circle cx={308} cy={88} r={10} fill="#FFF3DC" stroke={C.outline} strokeWidth={4} />
                </g>
              </g>
            )}

            {/* olhos */}
            {[158, 242].map((ex, i) => (
              <g key={ex}>
                <ellipse cx={ex} cy={178} rx={27} ry={eyeRy} fill={C.white} stroke={C.outline} strokeWidth={5} />
                <circle cx={ex + px} cy={182 + py} r={pupilR} fill={C.outline} />
                <circle cx={ex + px + 4} cy={177 + py} r={4} fill={C.white} />
                {/* pálpebra (piscar) */}
                <clipPath id={`eye-${variant}-${i}-${blinkSeed}`}>
                  <ellipse cx={ex} cy={178} rx={27} ry={eyeRy} />
                </clipPath>
                <rect
                  x={ex - 30}
                  y={178 - eyeRy - 2}
                  width={60}
                  height={(eyeRy * 2 + 4) * blink}
                  fill={skin}
                  clipPath={`url(#eye-${variant}-${i}-${blinkSeed})`}
                />
                {!isUgo && (
                  <path
                    d={i === 0 ? `M ${ex - 26} ${170 - eyeRy + 12} l -12 -10 M ${ex - 18} ${165 - eyeRy + 10} l -8 -12` : `M ${ex + 26} ${170 - eyeRy + 12} l 12 -10 M ${ex + 18} ${165 - eyeRy + 10} l 8 -12`}
                    stroke={C.outline}
                    strokeWidth={4}
                    strokeLinecap="round"
                  />
                )}
              </g>
            ))}
            {/* sobrancelhas (Ugo tem monocelha grossa) */}
            {isUgo ? (
              <g transform={`translate(0 ${-browLift})`}>
                <path
                  d={`M 122 ${136 - browTiltL} Q 160 ${118 - browTiltL} 196 136 Q 200 132 204 136 Q 240 ${118 - browTiltR} 278 ${136 - browTiltR}`}
                  fill="none"
                  stroke={hair}
                  strokeWidth={16}
                  strokeLinecap="round"
                />
              </g>
            ) : (
              <g transform={`translate(0 ${-browLift})`}>
                <path d={`M 134 ${138 - browTiltL} Q 158 ${126 - browTiltL} 184 136`} fill="none" stroke={C.hairLia} strokeWidth={9} strokeLinecap="round" />
                <path d={`M 216 136 Q 242 ${126 - browTiltR} 266 ${138 - browTiltR}`} fill="none" stroke={C.hairLia} strokeWidth={9} strokeLinecap="round" />
              </g>
            )}

            {/* nariz */}
            <ellipse cx={200} cy={218} rx={isUgo ? 26 : 16} ry={isUgo ? 20 : 13} fill={C.skinShade} stroke={C.outline} strokeWidth={5} />

            {/* boca */}
            {talking ? (
              <g>
                <ellipse cx={200} cy={262} rx={28 + mouth * 6} ry={5 + mouth * 24} fill="#5A1414" stroke={C.outline} strokeWidth={5} />
                <ellipse cx={200} cy={262 + mouth * 14} rx={16} ry={4 + mouth * 8} fill="#E85A6A" />
                <rect x={186} y={257 - mouth * 22} width={28} height={8} rx={3} fill={C.white} />
              </g>
            ) : surprised ? (
              <ellipse cx={200} cy={265} rx={18} ry={22} fill="#5A1414" stroke={C.outline} strokeWidth={5} />
            ) : worried ? (
              <path d="M 172 270 Q 200 252 228 270" fill="none" stroke={C.outline} strokeWidth={7} strokeLinecap="round" />
            ) : (
              <g>
                <path d="M 164 252 Q 200 292 236 252 Z" fill="#5A1414" stroke={C.outline} strokeWidth={5} strokeLinejoin="round" />
                <path d="M 176 256 L 224 256 L 220 264 L 180 264 Z" fill={C.white} />
              </g>
            )}
          </g>
        </g>
      </g>
    </svg>
  );
};
