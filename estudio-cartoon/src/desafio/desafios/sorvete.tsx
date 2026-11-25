import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { FONTE, MONO, Resultado, Som } from "../neon";
import { CronometroToon, FundoParque, PainelToon, textoToon, TOON } from "../cartoon";

/**
 * DESAFIO (estilo CARTOON): "Pause antes do sorvete cair no chão!" — a bola de sorvete escorrega da casquinha
 * (centralizada) e cai em queda livre; o alvo é pausar no 0:00.00 (a bola encosta na linha, logo acima da calçada).
 * Lá embaixo, três formigas esperam de boca aberta. 5 tentativas cada vez mais rápidas, em LOOP. Passou: SPLAT e festa
 * das formigas. QUADRO SECRETO de 1 frame. Textos nas zonas seguras.
 */

type Rodada = { T: number; sabor: string; cobertura: string };
export const RODADAS: Rodada[] = [
  { T: 72, sabor: "#FF9EC4", cobertura: "#FF5C9A" },
  { T: 63, sabor: "#FFE7A8", cobertura: "#7A4A2A" },
  { T: 56, sabor: "#9BE7B0", cobertura: "#3E9A48" },
  { T: 50, sabor: "#B79BFF", cobertura: "#6A4BD6" },
  { T: 44, sabor: "#8A5A3C", cobertura: "#4A2C1A" },
];
const POS = 24;
export const DURACAO = RODADAS.reduce((a, r) => a + r.T + POS, 0);

const X = 540;
const R = 80; // raio da bola
const Y_TOPO = 860; // base da bola no começo (em cima da casquinha)
const Y_LINHA = 1330; // 0:00.00
const Y_CHAO = 1360;
const OL = { stroke: TOON.contorno, strokeWidth: 8, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const yBase = (t: number, T: number) => (t <= T ? Y_TOPO + (Y_LINHA - Y_TOPO) * Math.pow(Math.max(0, t) / T, 2) : Math.min(Y_CHAO, Y_LINHA + (t - T) * 12));

/** Mão segurando a casquinha (vem da esquerda, no alto). `treme` sacode quando o sorvete cai. */
const Casquinha: React.FC<{ treme: number }> = ({ treme }) => (
  <g transform={`translate(${X - 150 + Math.sin(treme * 2.4) * 10 * Math.min(1, treme / 6)} ${Y_TOPO - 10}) rotate(${-28 + Math.sin(treme * 2.4) * 4 * Math.min(1, treme / 6)})`}>
    <path d="M-70 0 L70 0 L0 190 Z" fill="#E8B06A" {...OL} />
    <path d="M-45 30 L30 110 M-20 0 L45 70 M20 0 L55 30 M-55 40 L-10 150 M-25 15 L20 130" stroke="#C98B4A" strokeWidth={6} />
    <path d="M-60 120 Q -160 110 -330 150 L-330 250 Q -150 230 -30 200 Q 20 180 10 150 Q 0 120 -60 120 Z" fill="#F2C9A6" {...OL} />
    <path d="M-40 150 Q 0 140 30 120 M-30 175 Q 10 165 34 145" fill="none" stroke={TOON.contorno} strokeWidth={6} strokeLinecap="round" />
    <rect x={-360} y={145} width={80} height={110} rx={20} fill={TOON.azul} {...OL} />
  </g>
);

/** Bola de sorvete com carinha e cobertura escorrendo; os olhos arregalam enquanto cai. */
const Bola: React.FC<{ base: number; r: Rodada; susto: number; x: number; gira: number }> = ({ base, r, susto, x, gira }) => (
  <g transform={`translate(${x} ${base - R}) rotate(${gira})`}>
    <circle r={R} fill={r.sabor} {...OL} />
    <path d={`M${-R + 6} -16 Q -50 20 -30 -6 Q -10 30 10 -4 Q 30 26 50 -8 Q 66 14 ${R - 6} -16 Q ${R - 10} -60 0 ${-R + 2} Q ${-R + 10} -60 ${-R + 6} -16 Z`} fill={r.cobertura} {...OL} strokeWidth={6} />
    {[-40, -10, 25, 50].map((cx, i) => (
      <rect key={i} x={cx} y={-56 + (i % 2) * 14} width={16} height={7} rx={3} fill={[TOON.amarelo, TOON.azul, TOON.verde, "#fff"][i]} transform={`rotate(${i * 40} ${cx} ${-56})`} />
    ))}
    {[-1, 1].map((l) => (
      <g key={l} transform={`translate(${l * 26} 26)`}>
        <ellipse rx={11 + susto * 6} ry={13 + susto * 8} fill="#fff" stroke={TOON.contorno} strokeWidth={5} />
        <circle cy={-2 - susto * 3} r={6} fill={TOON.contorno} />
      </g>
    ))}
    <ellipse cx={0} cy={56} rx={8 + susto * 5} ry={4 + susto * 9} fill="#6b1020" stroke={TOON.contorno} strokeWidth={4} />
  </g>
);

/** Três formigas na calçada; `festa` 0..1 faz pular e erguer os braços (passou do ponto: sorvete pra elas). */
const Formigas: React.FC<{ festa: number; t: number }> = ({ festa, t }) => (
  <g>
    {[-200, 190, 330].map((dx, i) => {
      const pulo = festa > 0 ? Math.abs(Math.sin(t * 0.45 + i)) * 40 * festa : 0;
      return (
        <g key={i} transform={`translate(${X + dx} ${Y_CHAO + 70 - pulo}) scale(${i === 0 ? -1 : 1} 1)`}>
          {[-30, 0, 30].map((lx) => (
            <path key={lx} d={`M${lx} 0 L${lx - 12} 34`} stroke={TOON.contorno} strokeWidth={6} strokeLinecap="round" />
          ))}
          <ellipse cx={-42} cy={-6} rx={30} ry={24} fill="#3A2A2A" {...OL} strokeWidth={5} />
          <ellipse cx={0} cy={-10} rx={22} ry={18} fill="#3A2A2A" {...OL} strokeWidth={5} />
          <circle cx={36} cy={-26} r={26} fill="#3A2A2A" {...OL} strokeWidth={5} />
          <path d={`M44 -48 Q 50 -80 ${70} -86 M30 -50 Q 28 -84 44 -96`} fill="none" stroke={TOON.contorno} strokeWidth={5} strokeLinecap="round" />
          <circle cx={46} cy={-34} r={8} fill="#fff" />
          <circle cx={48} cy={-36} r={4} fill={TOON.contorno} />
          <ellipse cx={52} cy={-12} rx={7} ry={festa > 0 ? 9 : 5} fill="#FF7AB6" stroke={TOON.contorno} strokeWidth={3} />
          {festa > 0 && <path d="M20 -20 L4 -70 M24 -14 L50 -60" stroke={TOON.contorno} strokeWidth={6} strokeLinecap="round" />}
        </g>
      );
    })}
  </g>
);

/** SPLAT: bola esparramada na calçada com respingos. */
const Splat: React.FC<{ t: number; r: Rodada }> = ({ t, r }) => {
  const k = Math.min(1, t / 6);
  return (
    <g transform={`translate(${X} ${Y_CHAO - 4})`}>
      <path d={`M${-90 - k * 70} 8 Q ${-110 - k * 60} -30 -40 ${-30 - k * 10} Q 0 ${-60 + k * 10} 40 ${-30 - k * 10} Q ${110 + k * 60} -30 ${90 + k * 70} 8 Z`} fill={r.sabor} {...OL} />
      <path d="M-30 -26 Q 0 -40 30 -26" fill="none" stroke={r.cobertura} strokeWidth={14} strokeLinecap="round" />
      {t < 12 &&
        [0, 1, 2, 3, 4, 5].map((i) => {
          const a = Math.PI + 0.25 + (i / 5) * (Math.PI - 0.5);
          const d = 90 + t * 18;
          return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d * 0.7} r={14 - i % 3 * 3} fill={r.sabor} stroke={TOON.contorno} strokeWidth={4} />;
        })}
    </g>
  );
};

const veredito = (f: number, T: number): { res: Resultado; ms: number } => {
  const ms = Math.round(((f - T) * 1000) / 30);
  if (f > T) return { res: "bateu", ms };
  if (ms < -1000) return { res: "cedoDemais", ms };
  if (ms < -300) return { res: "cedo", ms };
  return { res: "perto", ms };
};

const Tentativa: React.FC<{ r: Rodada; n: number }> = ({ r, n }) => {
  const f = useCurrentFrame();
  const base = yBase(f, r.T);
  const cai = r.T + 3;
  const { res, ms } = veredito(f, r.T);
  const secreto = f === r.T;
  const susto = Math.min(1, f / (r.T * 0.6));
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <FundoParque chao={Y_CHAO} />
        <Casquinha treme={Math.max(0, f - cai)} />
        {/* linha do 0:00.00 (tracejada, estilo fita de "cuidado") */}
        {Array.from({ length: 13 }).map((_, i) => (
          <rect key={i} x={120 + i * 66} y={Y_LINHA - 5} width={40} height={10} rx={5} fill={TOON.vermelho} stroke={TOON.contorno} strokeWidth={3} opacity={Math.abs(i - 6) < 2 ? 0 : 1} />
        ))}
        <text x={960} y={Y_LINHA - 18} textAnchor="end" fontSize={34} fill={TOON.contorno} fontFamily={MONO} fontWeight={700}>
          0:00.00
        </text>
        <Formigas festa={f >= cai ? 1 : 0} t={f} />
        {f < cai && <Bola base={base} r={r} susto={susto} x={X - 150 + 150 * (1 - Math.pow(1 - Math.min(1, f / (r.T * 0.4)), 2))} gira={Math.min(1, f / (r.T * 0.4)) * 20} />}
        {f >= cai && <Splat t={f - cai} r={r} />}
      </svg>
      {f >= cai && f < cai + 16 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1110, textAlign: "center", fontFamily: FONTE, fontWeight: 800, fontSize: 130, transform: `rotate(-6deg) scale(${0.7 + Math.min(1, (f - cai) / 4) * 0.3})`, ...textoToon(TOON.rosa, 12) }}>
          SPLAT!
        </div>
      )}
      <PainelToon n={n} total={RODADAS.length} res={res} ms={ms} y={270} nome="SORVETE" rotulos={{ bateu: "SPLAT!" }} />
      <CronometroToon seg={(r.T - f) / 30} y={505} />
      {secreto && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,.55)" }}>
          <div style={{ position: "absolute", left: 40, width: 860, top: 1080, textAlign: "center", fontFamily: FONTE, fontWeight: 800, lineHeight: 1.05 }}>
            <div style={{ fontSize: 140, ...textoToon(TOON.verde, 12) }}>PERFEITO!</div>
            <div style={{ fontSize: 60, marginTop: 14, ...textoToon(TOON.amarelo, 8) }}>🍦 VOCÊ SALVOU O SORVETE</div>
            <div style={{ fontSize: 58, marginTop: 18, ...textoToon(TOON.rosa, 8) }}>COMENTA "SALVEI" 👇</div>
          </div>
        </div>
      )}
      <Som at={0} nome="whoosh" vol={0.3} dur={20} />
      {[16, 10, 6, 3].map((d) => (r.T - d > 0 ? <Som key={d} at={r.T - d} nome="click" vol={0.4} dur={8} /> : null))}
      <Som at={cai} nome="boing" vol={0.45} dur={14} />
      <Som at={cai + 2} nome="pop" vol={0.4} dur={10} />
      <Som at={cai + 6} nome="tada" vol={0.25} dur={POS - 8} />
    </AbsoluteFill>
  );
};

export const DesafioSorvete: React.FC = () => {
  let t = 0;
  return (
    <AbsoluteFill style={{ background: TOON.ceu1 }}>
      {RODADAS.map((r, i) => {
        const from = t;
        t += r.T + POS;
        return (
          <Sequence key={i} from={from} durationInFrames={r.T + POS} name={`sorvete ${i + 1}`}>
            <Tentativa r={r} n={i + 1} />
          </Sequence>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center", fontFamily: FONTE, fontWeight: 800, lineHeight: 1.0 }}>
        <div style={{ fontSize: 76, ...textoToon("#fff", 10) }}>PAUSE ANTES DO SORVETE</div>
        <div style={{ fontSize: 76, ...textoToon(TOON.amarelo, 10) }}>CAIR NO CHÃO! 🍦</div>
      </div>
    </AbsoluteFill>
  );
};
