import React from "react";
import { useCurrentFrame } from "remotion";
import { C, OUTLINE_W } from "../theme";

/**
 * PERSONAGEM PRINCIPAL ("Tito"): o MESMO em todas as cenas.
 *
 * Regras de consistência (ver .claude/skills/cartoon-explainer/references/personagem.md):
 *  - Nunca desenhe outro protagonista nem troque cores/proporções entre cenas.
 *  - Toda variação vem das props: expressão, pose, olhar, boca (lip-sync), corpo.
 *  - Para criar um personagem novo, edite APENAS o objeto VISUAL abaixo.
 *
 * Tamanho nativo: 400 x 800 (viewBox). Use `altura` para escalar.
 */
export const VISUAL = {
  nome: "Tito",
  pele: "#C98B5E",
  peleSombra: "#A86F48",
  cabelo: "#2B1D16",
  camisa: C.yellow,
  camisaSombra: "#E8B400",
  estampa: C.orange,
  short: C.blue,
  tenis: C.red,
  oculos: C.outline,
  bochecha: "#FF8A80",
};

export type Expressao = "neutro" | "feliz" | "animado" | "surpreso" | "pensativo" | "preocupado" | "encantado" | "bravo";
export type Pose =
  | "parado"
  | "acenando"
  | "apontando"
  | "apontandoCima"
  | "pensando"
  | "explicando"
  | "comemorando"
  | "assustado"
  | "andando"
  | "maosNaCintura";

type Braco = { ombro: number; cotovelo: number };
type PoseDef = { L: Braco; R: Braco };

/** Ângulos em graus. ombro: 0 = caído, 90 = horizontal p/ fora, 170 = para cima. cotovelo: dobra para dentro. */
const poseBase = (pose: Pose, f: number): PoseDef => {
  const s = Math.sin(f * 0.25);
  switch (pose) {
    case "acenando":
      return { L: { ombro: 12, cotovelo: 8 }, R: { ombro: 150 + s * 12, cotovelo: 25 + s * 25 } };
    case "apontando":
      return { L: { ombro: 10, cotovelo: 10 }, R: { ombro: 95, cotovelo: 0 } };
    case "apontandoCima":
      return { L: { ombro: 12, cotovelo: 8 }, R: { ombro: 160, cotovelo: 5 } };
    case "pensando":
      return { L: { ombro: 30, cotovelo: 110 }, R: { ombro: 20, cotovelo: 150 } };
    case "explicando":
      return { L: { ombro: 35 + s * 8, cotovelo: 70 + s * 10 }, R: { ombro: 45 - s * 10, cotovelo: 60 - s * 12 } };
    case "comemorando":
      return { L: { ombro: 155 + s * 10, cotovelo: 15 }, R: { ombro: 155 - s * 10, cotovelo: 15 } };
    case "assustado":
      return { L: { ombro: 120, cotovelo: 70 }, R: { ombro: 120, cotovelo: 70 } };
    case "andando":
      return { L: { ombro: 10 + Math.sin(f * 0.45) * 22, cotovelo: 20 }, R: { ombro: 10 - Math.sin(f * 0.45) * 22, cotovelo: 20 } };
    case "maosNaCintura":
      return { L: { ombro: 40, cotovelo: 120 }, R: { ombro: 40, cotovelo: 120 } };
    default:
      return { L: { ombro: 8 + s * 2, cotovelo: 10 }, R: { ombro: 8 - s * 2, cotovelo: 10 } };
  }
};

const mixB = (a: Braco, b: Braco, t: number): Braco => ({
  ombro: a.ombro + (b.ombro - a.ombro) * t,
  cotovelo: a.cotovelo + (b.cotovelo - a.cotovelo) * t,
});

type ExprDef = { sorriso: number; bocaLarg: number; olhoEsc: number; pupila: number; sobY: number; sobAng: number; bochecha: number };
const EXPR: Record<Expressao, ExprDef> = {
  neutro: { sorriso: 0.3, bocaLarg: 1, olhoEsc: 1, pupila: 1, sobY: 0, sobAng: 0, bochecha: 0.4 },
  feliz: { sorriso: 1, bocaLarg: 1.15, olhoEsc: 0.95, pupila: 1, sobY: -4, sobAng: -4, bochecha: 0.8 },
  animado: { sorriso: 1.2, bocaLarg: 1.3, olhoEsc: 1.08, pupila: 1.1, sobY: -12, sobAng: -6, bochecha: 1 },
  surpreso: { sorriso: 0, bocaLarg: 0.7, olhoEsc: 1.2, pupila: 0.75, sobY: -20, sobAng: 0, bochecha: 0.3 },
  pensativo: { sorriso: -0.1, bocaLarg: 0.7, olhoEsc: 0.92, pupila: 1, sobY: -6, sobAng: 10, bochecha: 0.2 },
  preocupado: { sorriso: -0.6, bocaLarg: 0.85, olhoEsc: 1.05, pupila: 0.9, sobY: -8, sobAng: 14, bochecha: 0.2 },
  encantado: { sorriso: 1, bocaLarg: 1, olhoEsc: 1.12, pupila: 1.25, sobY: -10, sobAng: -3, bochecha: 1 },
  bravo: { sorriso: -0.5, bocaLarg: 0.9, olhoEsc: 0.9, pupila: 0.9, sobY: 6, sobAng: -16, bochecha: 0.1 },
};

export type PersonagemProps = {
  /** abertura da boca 0..1 (lip-sync: use `mouth` de useSceneFrame) */
  boca?: number;
  expressao?: Expressao;
  pose?: Pose;
  /** pose anterior + progresso 0..1, para trocar de pose suavemente */
  poseDe?: Pose;
  poseT?: number;
  /** olhar: -1..1 */
  olharX?: number;
  olharY?: number;
  /** inclinação da cabeça (graus) */
  cabeca?: number;
  /** deslocamento vertical extra (pulos) */
  corpoY?: number;
  /** squash & stretch: -0.25 (achatado) .. 0.25 (esticado) */
  squash?: number;
  /** ciclo de caminhada ativo */
  andando?: boolean;
  /** espelha (olha para a esquerda) */
  espelhar?: boolean;
  altura?: number;
  style?: React.CSSProperties;
};

const O = OUTLINE_W;

const BracoSVG: React.FC<{ lado: "L" | "R"; b: Braco }> = ({ lado, b }) => {
  const sx = lado === "L" ? 132 : 268;
  const sy = 350;
  const dir = lado === "L" ? 1 : -1;
  return (
    <g transform={`rotate(${dir * b.ombro} ${sx} ${sy})`}>
      <rect x={sx - 22} y={sy - 12} width={44} height={110} rx={22} fill={VISUAL.camisa} stroke={C.outline} strokeWidth={O} />
      <g transform={`rotate(${-dir * b.cotovelo} ${sx} ${sy + 88})`}>
        <rect x={sx - 18} y={sy + 80} width={36} height={92} rx={18} fill={VISUAL.pele} stroke={C.outline} strokeWidth={O} />
        <circle cx={sx} cy={sy + 178} r={26} fill={VISUAL.pele} stroke={C.outline} strokeWidth={O} />
        <path d={`M ${sx - 12} ${sy + 170} q 12 10 24 0`} fill="none" stroke={C.outline} strokeWidth={4} strokeLinecap="round" />
      </g>
    </g>
  );
};

const Perna: React.FC<{ lado: "L" | "R"; ang: number }> = ({ lado, ang }) => {
  const hx = lado === "L" ? 172 : 228;
  const hy = 540;
  const toe = lado === "L" ? -1 : 1;
  return (
    <g transform={`rotate(${ang} ${hx} ${hy})`}>
      <rect x={hx - 22} y={hy - 10} width={44} height={170} rx={20} fill={VISUAL.pele} stroke={C.outline} strokeWidth={O} />
      <path
        d={`M ${hx - 30 + toe * 8} ${hy + 175} q 0 -32 30 -32 q 34 0 ${36 + toe * 6} 32 z`}
        fill={VISUAL.tenis}
        stroke={C.outline}
        strokeWidth={O}
        strokeLinejoin="round"
      />
      <rect x={hx - 32 + toe * 6} y={hy + 168} width={72} height={14} rx={7} fill={C.white} stroke={C.outline} strokeWidth={5} />
    </g>
  );
};

const piscar = (f: number) => {
  const p = 96;
  const t = f % p;
  const t2 = (f + 41) % 233; // piscada dupla ocasional
  const a = t < 6 ? Math.sin((t / 6) * Math.PI) : 0;
  const b = t2 < 6 ? Math.sin((t2 / 6) * Math.PI) : 0;
  return Math.max(a, b);
};

export const Personagem: React.FC<PersonagemProps> = ({
  boca = 0,
  expressao = "feliz",
  pose = "parado",
  poseDe,
  poseT = 1,
  olharX = 0,
  olharY = 0,
  cabeca = 0,
  corpoY = 0,
  squash = 0,
  andando = false,
  espelhar = false,
  altura = 800,
  style,
}) => {
  const f = useCurrentFrame();
  const e = EXPR[expressao];
  const p1 = poseBase(pose, f);
  const p0 = poseDe ? poseBase(poseDe, f) : p1;
  const t = Math.max(0, Math.min(1, poseT));
  const ease = t * t * (3 - 2 * t);
  const L = mixB(p0.L, p1.L, ease);
  const R = mixB(p0.R, p1.R, ease);

  const respira = Math.sin(f * 0.12) * 0.012;
  const passo = andando || pose === "andando" ? Math.sin(f * 0.45) : 0;
  const bob = andando || pose === "andando" ? -Math.abs(passo) * 16 : 0;
  const cabBalanço = Math.sin(f * 0.07) * 1.5 + boca * Math.sin(f * 0.6) * 2;
  const pisc = piscar(f);
  const eyeRy = 34 * e.olhoEsc * (1 - pisc * 0.95);
  const pupX = olharX * 12;
  const pupY = olharY * 10;
  const bw = 46 * e.bocaLarg;
  const open = Math.max(boca * 34, expressao === "surpreso" ? 22 : 0);
  const curve = e.sorriso * 22;

  const sy = 1 + squash + respira;
  const sx = 1 - squash * 0.6 - respira * 0.5;

  return (
    <svg
      viewBox="0 0 400 800"
      width={altura / 2}
      height={altura}
      style={{ overflow: "visible", ...style }}
    >
      <g transform={`${espelhar ? "translate(400 0) scale(-1 1)" : ""}`}>
        {/* sombra no chão */}
        <ellipse cx={200} cy={735} rx={120 * (1 - (corpoY + bob) / -400)} ry={18} fill="rgba(0,0,0,0.18)" />
        <g transform={`translate(0 ${corpoY + bob}) translate(200 730) scale(${sx} ${sy}) translate(-200 -730)`}>
          <Perna lado="L" ang={passo * 24} />
          <Perna lado="R" ang={-passo * 24} />
          <BracoSVG lado="L" b={L} />
          {/* tronco */}
          <path d="M 128 360 Q 128 318 170 314 L 230 314 Q 272 318 272 360 L 268 500 L 132 500 Z" fill={VISUAL.camisa} stroke={C.outline} strokeWidth={O} strokeLinejoin="round" />
          <path d="M 140 470 L 260 470" stroke={VISUAL.camisaSombra} strokeWidth={10} strokeLinecap="round" />
          {/* estampa: estrela */}
          <path
            d="M 200 372 l 11 22 24 3 -18 16 5 24 -22 -12 -22 12 5 -24 -18 -16 24 -3 z"
            fill={VISUAL.estampa}
            stroke={C.outline}
            strokeWidth={5}
            strokeLinejoin="round"
          />
          {/* short */}
          <path d="M 132 492 L 268 492 L 274 560 L 208 560 L 200 530 L 192 560 L 126 560 Z" fill={VISUAL.short} stroke={C.outline} strokeWidth={O} strokeLinejoin="round" />
          {/* pescoço */}
          <rect x={182} y={290} width={36} height={34} fill={VISUAL.peleSombra} stroke={C.outline} strokeWidth={O} />
          {/* CABEÇA */}
          <g transform={`rotate(${cabeca + cabBalanço} 200 300)`}>
            {/* cabelo de trás */}
            {[
              [110, 150, 46], [150, 100, 52], [210, 86, 56], [268, 110, 50], [300, 160, 40], [96, 200, 34], [306, 210, 30],
            ].map(([x, y, r], i) => (
              <circle key={i} cx={x} cy={y} r={r} fill={VISUAL.cabelo} stroke={C.outline} strokeWidth={O} />
            ))}
            {/* orelhas */}
            <circle cx={78} cy={210} r={26} fill={VISUAL.pele} stroke={C.outline} strokeWidth={O} />
            <circle cx={322} cy={210} r={26} fill={VISUAL.pele} stroke={C.outline} strokeWidth={O} />
            <ellipse cx={200} cy={200} rx={124} ry={118} fill={VISUAL.pele} stroke={C.outline} strokeWidth={O} />
            {/* franja */}
            {[[140, 110, 34], [185, 98, 36], [232, 102, 34], [270, 124, 28]].map(([x, y, r], i) => (
              <circle key={i} cx={x} cy={y} r={r} fill={VISUAL.cabelo} />
            ))}
            {/* bochechas */}
            <ellipse cx={128} cy={262} rx={24} ry={14} fill={VISUAL.bochecha} opacity={e.bochecha * 0.7} />
            <ellipse cx={272} cy={262} rx={24} ry={14} fill={VISUAL.bochecha} opacity={e.bochecha * 0.7} />
            {/* olhos */}
            {[150, 250].map((x, i) => (
              <g key={x}>
                <ellipse cx={x} cy={200} rx={30 * e.olhoEsc} ry={Math.max(2, eyeRy)} fill={C.white} stroke={C.outline} strokeWidth={5} />
                {eyeRy > 8 && (
                  <>
                    <circle cx={x + pupX} cy={204 + pupY} r={14 * e.pupila} fill={C.outline} />
                    <circle cx={x + pupX + 5} cy={197 + pupY} r={5 * e.pupila} fill={C.white} />
                    {expressao === "encantado" && <path d={`M ${x + pupX - 6} ${210 + pupY} l 3 -5 3 5`} stroke={C.white} strokeWidth={2} fill="none" />}
                  </>
                )}
                {/* óculos redondos: marca registrada do personagem */}
                <circle cx={x} cy={202} r={46} fill="none" stroke={VISUAL.oculos} strokeWidth={8} />
                {/* sobrancelha */}
                <path
                  d={`M ${x - 26} ${146 + e.sobY} Q ${x} ${134 + e.sobY} ${x + 26} ${146 + e.sobY}`}
                  transform={`rotate(${(i === 0 ? 1 : -1) * e.sobAng} ${x} ${142 + e.sobY})`}
                  stroke={VISUAL.cabelo}
                  strokeWidth={11}
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            ))}
            <path d="M 196 202 L 204 202" stroke={VISUAL.oculos} strokeWidth={8} />
            {/* nariz */}
            <ellipse cx={200} cy={240} rx={13} ry={9} fill={VISUAL.peleSombra} />
            {/* boca */}
            <g transform="translate(200 272)">
              {open > 3 ? (
                <>
                  <path
                    d={`M ${-bw} ${-curve * 0.3} Q 0 ${curve * 0.4 - 4} ${bw} ${-curve * 0.3} Q ${bw * 0.7} ${open + curve * 0.5} 0 ${open + curve * 0.6} Q ${-bw * 0.7} ${open + curve * 0.5} ${-bw} ${-curve * 0.3} Z`}
                    fill="#6B1E2B"
                    stroke={C.outline}
                    strokeWidth={6}
                    strokeLinejoin="round"
                  />
                  <ellipse cx={0} cy={open * 0.7 + curve * 0.4} rx={bw * 0.45} ry={Math.max(2, open * 0.28)} fill="#FF7A8A" />
                  <path d={`M ${-bw * 0.7} ${-curve * 0.2 + 2} Q 0 ${curve * 0.3 + 4} ${bw * 0.7} ${-curve * 0.2 + 2}`} stroke={C.white} strokeWidth={7} fill="none" />
                </>
              ) : (
                <path d={`M ${-bw} 0 Q 0 ${curve * 1.2} ${bw} 0`} stroke={C.outline} strokeWidth={8} strokeLinecap="round" fill="none" />
              )}
            </g>
          </g>
          <BracoSVG lado="R" b={R} />
        </g>
      </g>
    </svg>
  );
};

/** Coloca o personagem com os PÉS no ponto (x, pe). Use sempre isto nas cenas. */
export const PersonagemEm: React.FC<PersonagemProps & { x: number; pe: number; escala?: number; rot?: number }> = ({
  x,
  pe,
  altura = 640,
  escala = 1,
  rot = 0,
  ...rest
}) => (
  <div
    style={{
      position: "absolute",
      left: x - altura / 4,
      top: pe - altura * (735 / 800),
      transform: `scale(${escala}) rotate(${rot}deg)`,
      transformOrigin: `50% ${(735 / 800) * 100}%`,
    }}
  >
    <Personagem altura={altura} {...rest} />
  </div>
);
