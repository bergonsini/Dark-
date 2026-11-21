import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { brilho, Cronometro, DefsNeon, FONTE, FundoNeon, MONO, NEON, PainelResultado, Resultado, Som } from "../neon";

/**
 * DESAFIO: "Pause antes do carro cair do penhasco!" — o carro neon acelera pela estrada (centralizado) rumo à
 * beirada; o alvo é pausar no 0:00.00 (o para-choque encosta na linha). 5 carros cada vez mais rápidos, em LOOP.
 * QUADRO SECRETO de 1 frame no 0:00.00. Textos nas zonas seguras (cronômetro no topo; quadro secreto em y≈1070–1450).
 */

type Rodada = { T: number; cor: string };
export const RODADAS: Rodada[] = [
  { T: 75, cor: NEON.ciano },
  { T: 66, cor: NEON.rosa },
  { T: 58, cor: NEON.verde },
  { T: 52, cor: NEON.amarelo },
  { T: 46, cor: NEON.laranja },
];
const POS = 24; // depois do 0:00.00: tomba e cai (com explosão lá embaixo), e já vem o próximo
export const DURACAO = RODADAS.reduce((a, r) => a + r.T + POS, 0);

const Y_ESTRADA = 1060; // topo do asfalto
const X_BEIRA = 790; // beirada do penhasco = linha do 0:00.00
const X_INICIO = -60; // para-choque no começo (fora da tela)
const ESC = 1.35; // escala do carro
const MEIO = 130 * ESC; // metade do comprimento do carro (já escalado)
const xNariz = (t: number, T: number) => (t <= T ? X_INICIO + (X_BEIRA - X_INICIO) * Math.pow(Math.max(0, t) / T, 1.5) : X_BEIRA + (t - T) * 22);

const Carro: React.FC<{ nariz: number; cor: string; queda: number }> = ({ nariz, cor, queda }) => {
  const f = useCurrentFrame();
  const cx = nariz - MEIO;
  const giro = queda * 70;
  const dy = queda * queda * 900;
  const roda = (rx: number) => (
    <g transform={`translate(${rx} 0) rotate(${f * 25})`}>
      <circle r={38} fill="#12052A" stroke={NEON.branco} strokeWidth={7} />
      <path d="M-26 0 L26 0 M0 -26 L0 26" stroke={cor} strokeWidth={6} />
    </g>
  );
  return (
    <g transform={`translate(${cx} ${Y_ESTRADA - 40 * ESC + dy}) rotate(${giro} ${MEIO - 60} 30) scale(${ESC})`} filter="url(#neon)">
      <path d="M-130 0 L-130 -60 Q -120 -78 -95 -80 L-60 -80 L-20 -140 L60 -140 L105 -80 L120 -78 Q 132 -70 130 -50 L130 0 Z" fill="#12052A" stroke={cor} strokeWidth={8} strokeLinejoin="round" />
      <path d="M-10 -128 L52 -128 L88 -84 L-40 -84 Z" fill="#12052A" stroke={NEON.branco} strokeWidth={4} opacity={0.8} />
      <circle cx={122} cy={-50} r={9} fill={NEON.amarelo} />
      <path d={`M140 -50 L${210 + Math.sin(f) * 6} -70 L${210 + Math.sin(f) * 6} -30 Z`} fill={NEON.amarelo} opacity={0.25} />
      <g transform="translate(0 0)">
        {roda(-75)}
        {roda(75)}
      </g>
    </g>
  );
};

const Penhasco: React.FC = () => (
  <g>
    <path d={`M0 ${Y_ESTRADA} L${X_BEIRA} ${Y_ESTRADA} L${X_BEIRA + 30} ${Y_ESTRADA + 60} L${X_BEIRA - 10} ${Y_ESTRADA + 160} L${X_BEIRA + 20} ${Y_ESTRADA + 300} L${X_BEIRA - 30} 1920 L0 1920 Z`} fill="#12052A" stroke={NEON.ciano} strokeWidth={7} strokeLinejoin="round" filter="url(#neon)" />
    <g filter="url(#neon)">
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={20 + i * 90} y={Y_ESTRADA + 22} width={50} height={8} rx={4} fill={NEON.amarelo} opacity={0.8} />
      ))}
    </g>
    <g transform={`translate(${X_BEIRA - 150} ${Y_ESTRADA - 190})`} filter="url(#neon)">
      <path d="M0 190 L0 40" stroke={NEON.branco} strokeWidth={8} />
      <path d="M-70 40 L0 -30 L70 40 Z" fill="#12052A" stroke={NEON.amarelo} strokeWidth={7} strokeLinejoin="round" />
      <text x={0} y={30} textAnchor="middle" fontSize={56} fontWeight={800} fill={NEON.amarelo} fontFamily={FONTE}>!</text>
    </g>
  </g>
);

const Explosao: React.FC<{ t: number }> = ({ t }) => {
  if (t < 0 || t > 18) return null;
  const k = t / 18;
  return (
    <g transform={`translate(${X_BEIRA + 60} 1620)`} filter="url(#neon)" opacity={1 - k}>
      {[0, 1, 2].map((i) => (
        <circle key={i} r={(50 + i * 60) * (0.3 + k * 1.3)} fill="none" stroke={[NEON.amarelo, NEON.laranja, NEON.rosa][i]} strokeWidth={12 - i * 3} />
      ))}
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
  const nariz = xNariz(f, r.T);
  const tomba = r.T + 4;
  const queda = f > tomba ? Math.min(1, (f - tomba) / 14) : 0;
  const { res, ms } = veredito(f, r.T);
  const secreto = f === r.T;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <DefsNeon />
        <FundoNeon horizonte={1600} />
        <Penhasco />
        <g filter="url(#neon)">
          {Array.from({ length: 6 }).map((_, i) => (
            <rect key={i} x={X_BEIRA - 3} y={820 + i * 42} width={6} height={26} rx={3} fill={NEON.vermelho} />
          ))}
        </g>
        <text x={X_BEIRA + 14} y={850} fontSize={34} fill={NEON.vermelho} fontFamily={MONO} fontWeight={700}>
          0:00.00
        </text>
        {f < tomba + 16 && <Carro nariz={nariz} cor={r.cor} queda={queda} />}
        <Explosao t={f - (tomba + 14)} />
      </svg>
      <PainelResultado n={n} total={RODADAS.length} res={res} ms={ms} at={-999} y={270} nome="CARRO" rotulos={{ bateu: "CAIU!" }} />
      <Cronometro seg={(r.T - f) / 30} y={505} />
      {secreto && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)" }}>
          <div style={{ position: "absolute", left: 40, width: 860, top: 1120, textAlign: "center", fontFamily: FONTE, fontWeight: 800, lineHeight: 1.05 }}>
            <div style={{ fontSize: 140, ...brilho(NEON.verde, 1.2) }}>PERFEITO!</div>
            <div style={{ fontSize: 60, marginTop: 14, ...brilho(NEON.amarelo, 0.8) }}>🚗 VOCÊ SALVOU O CARRO</div>
            <div style={{ fontSize: 58, marginTop: 18, ...brilho(NEON.rosa, 0.8) }}>COMENTA "SALVEI" 👇</div>
          </div>
        </div>
      )}
      <Som at={0} nome="motor" vol={0.25} dur={r.T} />
      {[16, 10, 6, 3].map((d) => (r.T - d > 0 ? <Som key={d} at={r.T - d} nome="click" vol={0.4} dur={8} /> : null))}
      <Som at={tomba} nome="whoosh" vol={0.5} dur={14} />
      <Som at={tomba + 14} nome="boom" vol={0.55} dur={POS - 18} />
    </AbsoluteFill>
  );
};

export const DesafioCarro: React.FC = () => {
  let t = 0;
  return (
    <AbsoluteFill style={{ background: NEON.fundo1 }}>
      {RODADAS.map((r, i) => {
        const from = t;
        t += r.T + POS;
        return (
          <Sequence key={i} from={from} durationInFrames={r.T + POS} name={`carro ${i + 1}`}>
            <Tentativa r={r} n={i + 1} />
          </Sequence>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: FONTE, fontWeight: 800, lineHeight: 1.0 }}>
        <div style={{ fontSize: 76, ...brilho(NEON.rosa, 0.9) }}>PAUSE ANTES DO CARRO</div>
        <div style={{ fontSize: 76, ...brilho(NEON.ciano, 0.9) }}>CAIR DO PENHASCO! 🚗</div>
      </div>
    </AbsoluteFill>
  );
};
