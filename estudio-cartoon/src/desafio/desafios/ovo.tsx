import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { brilho, Cronometro, DefsNeon, FONTE, FundoNeon, MONO, NEON, PainelResultado, Resultado, Som } from "../neon";

/**
 * DESAFIO: "Pause antes do ovo cair na frigideira!" — o ovo cai (centralizado) em queda livre; o alvo é pausar
 * no 0:00.00 (a base do ovo encosta na linha, logo acima da frigideira). 5 ovos cada vez mais rápidos, em LOOP.
 * Passou do ponto: o ovo racha e vira ovo frito. QUADRO SECRETO de 1 frame. Textos nas zonas seguras.
 */

type Rodada = { T: number };
export const RODADAS: Rodada[] = [{ T: 75 }, { T: 66 }, { T: 58 }, { T: 52 }, { T: 46 }];
const POS = 24;
export const DURACAO = RODADAS.reduce((a, r) => a + r.T + POS, 0);

const X = 540;
const Y_TOPO = 820; // base do ovo no começo
const Y_LINHA = 1330; // 0:00.00
const Y_PANELA = 1360; // superfície da frigideira
const yBase = (t: number, T: number) => (t <= T ? Y_TOPO + (Y_LINHA - Y_TOPO) * Math.pow(Math.max(0, t) / T, 2) : Math.min(Y_PANELA, Y_LINHA + (t - T) * 12));

const Ovo: React.FC<{ base: number; gira: number }> = ({ base, gira }) => (
  <g transform={`translate(${X} ${base - 95}) rotate(${gira})`} filter="url(#neon)">
    <path d="M0 -95 C 60 -95 80 -10 72 30 C 64 80 30 95 0 95 C -30 95 -64 80 -72 30 C -80 -10 -60 -95 0 -95 Z" fill="#12052A" stroke={NEON.branco} strokeWidth={8} />
    <path d="M-30 -55 Q -45 -20 -40 10" fill="none" stroke={NEON.ciano} strokeWidth={6} strokeLinecap="round" opacity={0.8} />
  </g>
);

const OvoFrito: React.FC<{ t: number }> = ({ t }) => {
  const k = Math.min(1, t / 8);
  return (
    <g transform={`translate(${X} ${Y_PANELA - 6})`} filter="url(#neon)">
      <ellipse rx={60 + k * 120} ry={14 + k * 26} fill="#12052A" stroke={NEON.branco} strokeWidth={7} />
      <ellipse cx={-10} cy={-6} rx={18 + k * 26} ry={8 + k * 14} fill={NEON.amarelo} />
      {t < 10 &&
        [0, 1, 2, 3, 4, 5].map((i) => {
          const a = Math.PI + (i / 5) * Math.PI;
          const r = 60 + t * 16;
          return <path key={i} d={`M${Math.cos(a) * r * 0.7} ${Math.sin(a) * r * 0.4} L${Math.cos(a) * r} ${Math.sin(a) * r * 0.6}`} stroke={NEON.branco} strokeWidth={8} strokeLinecap="round" />;
        })}
      {t >= 6 &&
        [0, 1, 2].map((i) => {
          const q = ((t * 1.5 + i * 8) % 24) / 24;
          return <path key={`v${i}`} d={`M${-60 + i * 60} ${-40 - q * 120} q 14 -20 0 -40 q -14 -20 0 -40`} fill="none" stroke="#fff" strokeWidth={5} opacity={(1 - q) * 0.8} />;
        })}
    </g>
  );
};

const Frigideira: React.FC = () => (
  <g filter="url(#neon)">
    <path d={`M${X - 240} ${Y_PANELA} L${X + 240} ${Y_PANELA} Q ${X + 220} ${Y_PANELA + 90} ${X} ${Y_PANELA + 95} Q ${X - 220} ${Y_PANELA + 90} ${X - 240} ${Y_PANELA} Z`} fill="#12052A" stroke={NEON.rosa} strokeWidth={9} />
    <rect x={X + 240} y={Y_PANELA + 18} width={220} height={30} rx={15} fill="#12052A" stroke={NEON.rosa} strokeWidth={8} />
    {[0, 1, 2, 3, 4].map((i) => (
      <path key={i} d={`M${X - 160 + i * 80} ${Y_PANELA + 140} q -18 -30 0 -50 q 18 25 0 50`} fill={NEON.laranja} opacity={0.8} />
    ))}
  </g>
);

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
  const quebra = r.T + 3;
  const { res, ms } = veredito(f, r.T);
  const secreto = f === r.T;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <DefsNeon />
        <FundoNeon horizonte={1560} />
        <Frigideira />
        <g filter="url(#neon)">
          {Array.from({ length: 13 }).map((_, i) => (
            <rect key={i} x={120 + i * 66} y={Y_LINHA - 3} width={40} height={6} rx={3} fill={NEON.vermelho} opacity={Math.abs(i - 6) < 2 ? 0 : 1} />
          ))}
        </g>
        <text x={960} y={Y_LINHA - 16} textAnchor="end" fontSize={34} fill={NEON.vermelho} fontFamily={MONO} fontWeight={700}>
          0:00.00
        </text>
        {f < quebra && <Ovo base={base} gira={f * 4} />}
        {f >= quebra && <OvoFrito t={f - quebra} />}
      </svg>
      <PainelResultado n={n} total={RODADAS.length} res={res} ms={ms} at={-999} y={270} nome="OVO" rotulos={{ bateu: "QUEBROU!" }} />
      <Cronometro seg={(r.T - f) / 30} y={505} />
      {secreto && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)" }}>
          <div style={{ position: "absolute", left: 40, width: 860, top: 1080, textAlign: "center", fontFamily: FONTE, fontWeight: 800, lineHeight: 1.05 }}>
            <div style={{ fontSize: 140, ...brilho(NEON.verde, 1.2) }}>PERFEITO!</div>
            <div style={{ fontSize: 60, marginTop: 14, ...brilho(NEON.amarelo, 0.8) }}>🥚 VOCÊ SALVOU O OVO</div>
            <div style={{ fontSize: 58, marginTop: 18, ...brilho(NEON.rosa, 0.8) }}>COMENTA "SALVEI" 👇</div>
          </div>
        </div>
      )}
      <Som at={0} nome="whoosh" vol={0.3} dur={20} />
      {[16, 10, 6, 3].map((d) => (r.T - d > 0 ? <Som key={d} at={r.T - d} nome="click" vol={0.4} dur={8} /> : null))}
      <Som at={quebra} nome="pop" vol={0.45} dur={10} />
      <Som at={quebra + 4} nome="borbulha" vol={0.3} dur={POS - 6} />
    </AbsoluteFill>
  );
};

export const DesafioOvo: React.FC = () => {
  let t = 0;
  return (
    <AbsoluteFill style={{ background: NEON.fundo1 }}>
      {RODADAS.map((r, i) => {
        const from = t;
        t += r.T + POS;
        return (
          <Sequence key={i} from={from} durationInFrames={r.T + POS} name={`ovo ${i + 1}`}>
            <Tentativa r={r} n={i + 1} />
          </Sequence>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: FONTE, fontWeight: 800, lineHeight: 1.0 }}>
        <div style={{ fontSize: 76, ...brilho(NEON.rosa, 0.9) }}>PAUSE ANTES DO OVO</div>
        <div style={{ fontSize: 76, ...brilho(NEON.ciano, 0.9) }}>CAIR NA FRIGIDEIRA! 🍳</div>
      </div>
    </AbsoluteFill>
  );
};
