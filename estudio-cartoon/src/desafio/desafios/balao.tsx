import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { brilho, Cronometro, DefsNeon, FONTE, FundoNeon, MONO, NEON, PainelResultado, Resultado, Som } from "../neon";

/**
 * DESAFIO: "Pause antes do balão estourar nos espinhos!" — o balão sobe (centralizado) até a fileira de espinhos;
 * o alvo é pausar no 0:00.00 (o topo do balão encosta na linha). 5 balões cada vez mais rápidos, em LOOP.
 * QUADRO SECRETO de 1 frame no 0:00.00: "PERFEITO! VOCÊ SALVOU O BALÃO — COMENTA 'SALVEI'".
 * Textos respeitam as zonas seguras (cronômetro no topo; quadro secreto em y≈1070–1450, sem encostar nos botões).
 */

type Rodada = { T: number; cor: string };
export const RODADAS: Rodada[] = [
  { T: 75, cor: NEON.rosa },
  { T: 66, cor: NEON.ciano },
  { T: 58, cor: NEON.verde },
  { T: 52, cor: NEON.amarelo },
  { T: 46, cor: NEON.laranja },
];
const POS = 22; // depois do 0:00.00: estoura (4 frames) + pedaços voando, e já sai o próximo
export const DURACAO = RODADAS.reduce((a, r) => a + r.T + POS, 0);

const X = 540;
const Y_INICIO = 1480; // topo do balão no começo
const Y_LINHA = 880; // ponta dos espinhos (0:00.00)
const R = 120; // raio do balão
const yTopo = (t: number, T: number) => (t <= T ? Y_INICIO - (Y_INICIO - Y_LINHA) * Math.pow(Math.max(0, t) / T, 1.6) : Y_LINHA - Math.min(1, (t - T) / 4) * 14);

const Balao: React.FC<{ topo: number; cor: string; aperta?: number }> = ({ topo, cor, aperta = 0 }) => {
  const f = useCurrentFrame();
  const bal = Math.sin(f * 0.25) * 6;
  const cy = topo + R * (1 - aperta * 0.15);
  return (
    <g filter="url(#neon)">
      <path d={`M${X} ${cy + R + 20} q ${-30 + bal} 80 0 160 t ${bal} 160`} fill="none" stroke="#fff" strokeWidth={5} opacity={0.8} />
      <ellipse cx={X} cy={cy} rx={R * (1 + aperta * 0.12)} ry={R * 1.18 * (1 - aperta * 0.15)} fill="#12052A" stroke={cor} strokeWidth={9} />
      <path d={`M${X - 18} ${cy + R * 1.18} l 18 22 l 18 -22 Z`} fill="#12052A" stroke={cor} strokeWidth={7} strokeLinejoin="round" />
      <path d={`M${X - 60} ${cy - 60} q 20 -40 60 -44`} fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.7} />
    </g>
  );
};

const Espinhos: React.FC = () => (
  <g filter="url(#neon)">
    <rect x={150} y={Y_LINHA - 130} width={780} height={34} rx={10} fill="#12052A" stroke={NEON.ciano} strokeWidth={7} />
    {Array.from({ length: 13 }).map((_, i) => {
      const x = 180 + i * 60;
      return <path key={i} d={`M${x - 22} ${Y_LINHA - 96} L${x} ${Y_LINHA} L${x + 22} ${Y_LINHA - 96} Z`} fill="#12052A" stroke={NEON.ciano} strokeWidth={6} strokeLinejoin="round" />;
    })}
  </g>
);

const Estouro: React.FC<{ t: number; cor: string }> = ({ t, cor }) => {
  if (t < 0 || t > 24) return null;
  const k = t / 24;
  return (
    <g transform={`translate(${X} ${Y_LINHA + R})`} filter="url(#neon)" opacity={1 - k}>
      <circle r={60 + k * 260} fill="none" stroke={NEON.amarelo} strokeWidth={10} />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2 + 0.3;
        const r = 30 + k * 360;
        return <rect key={i} x={Math.cos(a) * r - 16} y={Math.sin(a) * r - 10 + k * k * 160} width={32} height={20} rx={6} fill={cor} transform={`rotate(${i * 40 + k * 300} ${Math.cos(a) * r} ${Math.sin(a) * r})`} />;
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
  const estoura = r.T + 4;
  const topo = yTopo(f, r.T);
  const aperta = f > r.T ? Math.min(1, (f - r.T) / 4) : 0;
  const { res, ms } = veredito(f, r.T);
  const secreto = f === r.T;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <DefsNeon />
        <FundoNeon />
        <Espinhos />
        <g filter="url(#neon)">
          {Array.from({ length: 17 }).map((_, i) => (
            <rect key={i} x={150 + i * 46} y={Y_LINHA - 3} width={28} height={6} rx={3} fill={NEON.vermelho} opacity={0.9} />
          ))}
        </g>
        <text x={940} y={Y_LINHA + 44} textAnchor="end" fontSize={34} fill={NEON.vermelho} fontFamily={MONO} fontWeight={700}>
          0:00.00
        </text>
        {f < estoura && <Balao topo={topo} cor={r.cor} aperta={aperta} />}
        <Estouro t={f - estoura} cor={r.cor} />
      </svg>
      <PainelResultado n={n} total={RODADAS.length} res={res} ms={ms} at={-999} y={270} nome="BALÃO" rotulos={{ bateu: "ESTOUROU!" }} />
      <Cronometro seg={(r.T - f) / 30} y={505} />
      {secreto && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)" }}>
          <div style={{ position: "absolute", left: 40, width: 860, top: 1070, textAlign: "center", fontFamily: FONTE, fontWeight: 800, lineHeight: 1.05 }}>
            <div style={{ fontSize: 140, ...brilho(NEON.verde, 1.2) }}>PERFEITO!</div>
            <div style={{ fontSize: 60, marginTop: 14, ...brilho(NEON.amarelo, 0.8) }}>🎈 VOCÊ SALVOU O BALÃO</div>
            <div style={{ fontSize: 58, marginTop: 18, ...brilho(NEON.rosa, 0.8) }}>COMENTA "SALVEI" 👇</div>
          </div>
        </div>
      )}
      <Som at={0} nome="whoosh" vol={0.25} dur={20} />
      {[16, 10, 6, 3].map((d) => (r.T - d > 0 ? <Som key={d} at={r.T - d} nome="click" vol={0.4} dur={8} /> : null))}
      <Som at={estoura} nome="pop" vol={0.8} dur={POS - 4} />
      <Som at={estoura + 1} nome="boom" vol={0.35} dur={POS - 5} />
    </AbsoluteFill>
  );
};

export const DesafioBalao: React.FC = () => {
  let t = 0;
  return (
    <AbsoluteFill style={{ background: NEON.fundo1 }}>
      {RODADAS.map((r, i) => {
        const from = t;
        t += r.T + POS;
        return (
          <Sequence key={i} from={from} durationInFrames={r.T + POS} name={`balão ${i + 1}`}>
            <Tentativa r={r} n={i + 1} />
          </Sequence>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: FONTE, fontWeight: 800, lineHeight: 1.0 }}>
        <div style={{ fontSize: 76, ...brilho(NEON.rosa, 0.9) }}>PAUSE ANTES DO BALÃO</div>
        <div style={{ fontSize: 76, ...brilho(NEON.ciano, 0.9) }}>ESTOURAR! 🎈</div>
      </div>
    </AbsoluteFill>
  );
};
