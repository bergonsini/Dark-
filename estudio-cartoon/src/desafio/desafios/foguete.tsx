import React from "react";
import { AbsoluteFill, Sequence, spring, useCurrentFrame } from "remotion";
import { brilho, Cronometro, DefsNeon, FONTE, FundoNeon, MONO, NEON, PainelResultado, Resultado, Som } from "../neon";

/**
 * DESAFIO: "Pause antes do foguete bater na Lua!" — o alvo é pausar quando o cronômetro marca 0:00.00 (o nariz do
 * foguete encosta na linha vermelha). 5 tentativas cada vez mais rápidas. QUADRO SECRETO: no frame exato do 0:00.00
 * (nas tentativas em que o foguete passa da linha) aparece "PERFEITO! COMENTA SALVEI" por 1 frame só.
 */

const INTRO = 45;
const FIM = 54;
type Rodada = { L: number; T: number; res: Resultado; para?: number; ms: number };
/** L = duração da tentativa; T = frame em que o nariz chega na linha (0:00.00); para = frame da "pausa" simulada. */
export const RODADAS: Rodada[] = [
  { L: 100, T: 75, res: "cedoDemais", para: 46, ms: -967 },
  { L: 92, T: 66, res: "bateu", ms: 267 },
  { L: 84, T: 58, res: "perto", para: 56, ms: -67 },
  { L: 78, T: 52, res: "cedo", para: 44, ms: -267 },
  { L: 72, T: 46, res: "bateu", ms: 200 },
];
export const DURACAO = INTRO + RODADAS.reduce((a, r) => a + r.L, 0) + FIM;

const Y_INICIO = 1440; // nariz do foguete na plataforma
const Y_LINHA = 960; // linha vermelha (0:00.00)
const Y_LUA = 790; // centro da Lua (raio 150): a superfície fica em 940
const yNariz = (t: number, T: number) => (t <= T ? Y_INICIO - (Y_INICIO - Y_LINHA) * Math.pow(Math.max(0, t) / T, 1.7) : Y_LINHA - Math.min(1, (t - T) / 6) * 20);

const Foguete: React.FC<{ y: number; fogo: number; tremor?: number }> = ({ y, fogo, tremor = 0 }) => {
  const f = useCurrentFrame();
  const tx = tremor ? Math.sin(f * 3.1) * tremor : 0;
  const ch = fogo * (1 + Math.sin(f * 2.1) * 0.25);
  return (
    <g transform={`translate(${540 + tx} ${y})`}>
      {fogo > 0 && (
        <g filter="url(#neon)">
          <path d={`M-40 250 Q 0 ${250 + 220 * ch} 40 250 Z`} fill={NEON.laranja} />
          <path d={`M-22 250 Q 0 ${250 + 130 * ch} 22 250 Z`} fill={NEON.amarelo} />
        </g>
      )}
      <g fill="#12052A" stroke={NEON.ciano} strokeWidth={7} strokeLinejoin="round" filter="url(#neon)">
        <path d="M0 0 C 60 50, 66 120, 60 210 L-60 210 C -66 120, -60 50, 0 0 Z" />
        <path d="M-60 150 L-110 250 L-60 225 Z M60 150 L110 250 L60 225 Z" stroke={NEON.rosa} />
        <rect x={-45} y={210} width={90} height={40} rx={8} stroke={NEON.rosa} />
        <circle cx={0} cy={100} r={26} stroke={NEON.amarelo} />
      </g>
    </g>
  );
};

const Lua: React.FC<{ treme?: number }> = ({ treme = 0 }) => {
  const f = useCurrentFrame();
  const tx = treme ? Math.sin(f * 2.7) * treme : 0;
  return (
    <g transform={`translate(${540 + tx} ${Y_LUA})`} filter="url(#neon)">
      <circle r={150} fill="#2A1A40" stroke={NEON.amarelo} strokeWidth={8} />
      <g fill="none" stroke={NEON.amarelo} strokeWidth={5} opacity={0.8}>
        <circle cx={-50} cy={-40} r={30} />
        <circle cx={55} cy={20} r={22} />
        <circle cx={-10} cy={70} r={16} />
        <circle cx={60} cy={-70} r={12} />
      </g>
    </g>
  );
};

const Explosao: React.FC<{ t: number }> = ({ t }) => {
  if (t < 0 || t > 30) return null;
  const k = t / 30;
  return (
    <g transform={`translate(540 ${Y_LINHA - 20})`} filter="url(#neon)" opacity={1 - k}>
      {[0, 1, 2].map((i) => (
        <circle key={i} r={(60 + i * 70) * (0.3 + k * 1.4)} fill="none" stroke={[NEON.amarelo, NEON.laranja, NEON.rosa][i]} strokeWidth={14 - i * 3} />
      ))}
      {Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2;
        const r = 40 + k * 380;
        return <path key={`p${i}`} d={`M${Math.cos(a) * r * 0.6} ${Math.sin(a) * r * 0.6} L${Math.cos(a) * r} ${Math.sin(a) * r}`} stroke={i % 2 ? NEON.amarelo : NEON.ciano} strokeWidth={8} strokeLinecap="round" />;
      })}
    </g>
  );
};

/** Uma tentativa (frame local 0..L). */
const Tentativa: React.FC<{ r: Rodada; n: number }> = ({ r, n }) => {
  const f = useCurrentFrame();
  const parado = r.para !== undefined && f >= r.para;
  const tPos = parado ? (r.para as number) : f;
  const bate = r.res === "bateu" ? r.T + 6 : 9999;
  const voando = !parado && f < bate;
  const y = yNariz(tPos, r.T);
  const restante = (r.T - tPos) / 30;
  const fimVeredito = parado ? (r.para as number) + 2 : r.res === "bateu" ? bate + 2 : r.T;
  const secreto = r.res === "bateu" && f === r.T;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <DefsNeon />
        <FundoNeon />
        <Lua treme={f >= bate && f < bate + 12 ? 10 : 0} />
        <g filter="url(#neon)">
          {Array.from({ length: 19 }).map((_, i) => (
            <rect key={i} x={120 + i * 44} y={Y_LINHA - 4} width={28} height={8} rx={4} fill={NEON.vermelho} />
          ))}
        </g>
        <text x={960} y={Y_LINHA - 18} textAnchor="end" fontSize={34} fill={NEON.vermelho} fontFamily={MONO} fontWeight={700}>
          0:00.00
        </text>
        <rect x={410} y={Y_INICIO + 250} width={260} height={30} rx={8} fill="#12052A" stroke={NEON.rosa} strokeWidth={6} filter="url(#neon)" />
        {f < bate && <Foguete y={y} fogo={voando ? 1 : 0.25} tremor={voando ? 2 : 0} />}
        <Explosao t={f - bate} />
      </svg>
      {parado && <div style={{ position: "absolute", inset: 0, background: "rgba(43,243,255,.10)" }} />}
      {parado && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1180, textAlign: "center", fontFamily: FONTE, fontWeight: 800, fontSize: 90, ...brilho(NEON.ciano, 0.8) }}>‖ PAUSOU</div>
      )}
      <PainelResultado n={n} total={RODADAS.length} res={r.res} ms={r.ms} at={fimVeredito} y={330} />
      <Cronometro seg={f >= bate ? -(f - r.T) / 30 : restante} y={1730} cor={parado ? NEON.ciano : NEON.vermelho} piscando={parado} />
      {secreto && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONTE, fontWeight: 800 }}>
          <div style={{ fontSize: 150, ...brilho(NEON.verde, 1.2) }}>PERFEITO!</div>
          <div style={{ fontSize: 70, marginTop: 20, ...brilho(NEON.amarelo, 0.8) }}>🏆 VOCÊ SALVOU O FOGUETE</div>
          <div style={{ fontSize: 64, marginTop: 30, ...brilho(NEON.rosa, 0.8) }}>COMENTA "SALVEI" 👇</div>
        </div>
      )}
      <Som at={0} nome="riser" vol={0.35} />
      {[16, 10, 6, 3].map((d) => (r.T - d > 0 && (!r.para || r.T - d < r.para) ? <Som key={d} at={r.T - d} nome="click" vol={0.4} dur={8} /> : null))}
      {r.para !== undefined && <Som at={r.para} nome="vhs" vol={0.4} dur={20} />}
      {r.res === "perto" && <Som at={fimVeredito} nome="ding" vol={0.45} />}
      {r.res === "bateu" && <Som at={bate} nome="boom" vol={0.6} />}
    </AbsoluteFill>
  );
};

/** Abertura (título que bate na tela) e cartão final ("E VOCÊ?"). */
const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const s = spring({ frame: f, fps: 30, config: { damping: 9, stiffness: 200 } });
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <DefsNeon />
        <FundoNeon />
        <Lua />
        <Foguete y={Y_INICIO} fogo={0.3} tremor={2} />
      </svg>
      <Cronometro seg={RODADAS[0].T / 30} y={1730} />
      <Som at={0} nome="pop" vol={0.5} />
      <Som at={10} nome="tada" vol={0.35} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 430, textAlign: "center", fontFamily: FONTE, fontWeight: 800, transform: `scale(${s})` }}>
        <div style={{ fontSize: 96, ...brilho(NEON.ciano, 0.9) }}>PAUSE NO</div>
        <div style={{ fontFamily: MONO, fontSize: 150, ...brilho(NEON.vermelho, 1) }}>0:00.00</div>
      </div>
    </AbsoluteFill>
  );
};

const Final: React.FC = () => {
  const f = useCurrentFrame();
  const s = spring({ frame: f, fps: 30, config: { damping: 10, stiffness: 200 } });
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <DefsNeon />
        <FundoNeon />
        <Lua />
        <Foguete y={Y_INICIO} fogo={0.3} />
      </svg>
      <div style={{ position: "absolute", inset: 0, background: "rgba(10,0,25,.55)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontFamily: FONTE, fontWeight: 800, transform: `scale(${s})` }}>
        <div style={{ fontSize: 130, ...brilho(NEON.rosa, 1) }}>E VOCÊ?</div>
        <div style={{ fontSize: 70, marginTop: 30, ...brilho(NEON.ciano, 0.7) }}>CONSEGUE PAUSAR NO</div>
        <div style={{ fontFamily: MONO, fontSize: 140, ...brilho(NEON.vermelho, 1) }}>0:00.00?</div>
        <div style={{ fontSize: 60, marginTop: 40, ...brilho(NEON.amarelo, 0.7) }}>COMENTA QUANTOS ms 👇</div>
        <div style={{ fontSize: 60, marginTop: 20, opacity: Math.floor(f / 8) % 2 ? 1 : 0.4, ...brilho(NEON.verde, 0.7) }}>↻ TENTA DE NOVO</div>
      </div>
      <Som at={2} nome="tada" vol={0.4} />
    </AbsoluteFill>
  );
};

export const DesafioFoguete: React.FC = () => {
  let t = INTRO;
  return (
    <AbsoluteFill style={{ background: NEON.fundo1 }}>
      <Sequence from={0} durationInFrames={INTRO} name="intro">
        <Intro />
      </Sequence>
      {RODADAS.map((r, i) => {
        const from = t;
        t += r.L;
        return (
          <Sequence key={i} from={from} durationInFrames={r.L} name={`foguete ${i + 1}`}>
            <Tentativa r={r} n={i + 1} />
          </Sequence>
        );
      })}
      <Sequence from={t} durationInFrames={FIM} name="final">
        <Final />
      </Sequence>
      {/* título fixo no topo */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: FONTE, fontWeight: 800, lineHeight: 1.0 }}>
        <div style={{ fontSize: 76, ...brilho(NEON.rosa, 0.9) }}>PAUSE ANTES DO FOGUETE</div>
        <div style={{ fontSize: 76, ...brilho(NEON.ciano, 0.9) }}>BATER NA LUA! 🚀</div>
      </div>
    </AbsoluteFill>
  );
};
