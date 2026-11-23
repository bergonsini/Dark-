import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { brilho, Cronometro, DefsNeon, FONTE, FundoNeon, MONO, NEON, PainelResultado, Resultado, Som } from "../neon";

/**
 * DESAFIO: "Pause antes do copo transbordar!" — uma torneira neon enche o copo (centralizado); o alvo é pausar
 * no 0:00.00 (a água encosta na borda). 5 copos cada vez mais rápidos, em LOOP. QUADRO SECRETO de 1 frame.
 * Textos nas zonas seguras (cronômetro no topo; quadro secreto em y≈1070–1450).
 */

type Rodada = { T: number; cor: string };
export const RODADAS: Rodada[] = [
  { T: 75, cor: NEON.ciano },
  { T: 66, cor: NEON.verde },
  { T: 58, cor: NEON.rosa },
  { T: 52, cor: NEON.amarelo },
  { T: 46, cor: NEON.laranja },
];
const POS = 22;
export const DURACAO = RODADAS.reduce((a, r) => a + r.T + POS, 0);

const X = 540;
const Y_FUNDO = 1490; // fundo do copo (por dentro)
const Y_BORDA = 1010; // borda = 0:00.00
const L_FUNDO = 150; // meia-largura no fundo
const L_BORDA = 210; // meia-largura na borda
const meia = (y: number) => L_FUNDO + ((Y_FUNDO - y) / (Y_FUNDO - Y_BORDA)) * (L_BORDA - L_FUNDO);
const yAgua = (t: number, T: number) => (t <= T ? Y_FUNDO - (Y_FUNDO - Y_BORDA) * Math.pow(Math.max(0, t) / T, 1.35) : Y_BORDA - Math.min(1, (t - T) / 5) * 12);

const Copo: React.FC<{ nivel: number; cor: string; transborda: number }> = ({ nivel, cor, transborda }) => {
  const f = useCurrentFrame();
  const m = meia(nivel);
  const onda = (k: number) => Math.sin(f * 0.6 + k) * 6;
  return (
    <g>
      {/* água */}
      <path
        d={`M${X - m} ${nivel + onda(0)} Q ${X - m / 2} ${nivel - 12 + onda(1)} ${X} ${nivel + onda(2)} T ${X + m} ${nivel + onda(3)} L${X + L_FUNDO} ${Y_FUNDO} L${X - L_FUNDO} ${Y_FUNDO} Z`}
        fill={cor}
        opacity={0.55}
        filter="url(#neon)"
      />
      {/* bolhas */}
      {[0, 1, 2, 3, 4].map((i) => {
        const q = ((f * 1.5 + i * 13) % 60) / 60;
        const by = Y_FUNDO - q * (Y_FUNDO - nivel);
        return by > nivel + 10 ? <circle key={i} cx={X - 90 + i * 45} cy={by} r={6 + (i % 3) * 3} fill="none" stroke="#fff" strokeWidth={3} opacity={0.7} /> : null;
      })}
      {/* transbordando: escorre pelos lados */}
      {transborda > 0 &&
        [-1, 1].map((l) => (
          <g key={l} filter="url(#neon)">
            <path d={`M${X + l * L_BORDA} ${Y_BORDA} q ${l * 30} 40 ${l * 26} ${200 * transborda}`} stroke={cor} strokeWidth={22} fill="none" strokeLinecap="round" opacity={0.8} />
            {[0, 1, 2].map((i) => {
              const q = ((f * 2 + i * 9) % 30) / 30;
              return <circle key={i} cx={X + l * (L_BORDA + 30 + i * 10)} cy={Y_BORDA + 60 + q * 520 * transborda} r={12} fill={cor} opacity={1 - q} />;
            })}
          </g>
        ))}
      {transborda > 0.3 && <ellipse cx={X} cy={1540} rx={360 * transborda} ry={40 * transborda} fill={cor} opacity={0.45} filter="url(#neon)" />}
      {/* vidro */}
      <path d={`M${X - L_BORDA} ${Y_BORDA - 20} L${X - L_FUNDO} ${Y_FUNDO} L${X + L_FUNDO} ${Y_FUNDO} L${X + L_BORDA} ${Y_BORDA - 20}`} fill="none" stroke={NEON.branco} strokeWidth={9} strokeLinejoin="round" filter="url(#neon)" />
      <rect x={X - L_FUNDO - 10} y={Y_FUNDO} width={2 * L_FUNDO + 20} height={30} rx={10} fill="#12052A" stroke={NEON.branco} strokeWidth={8} filter="url(#neon)" />
    </g>
  );
};

/** Torneira neon com o filete d'água (some quando a rodada acaba). */
const Torneira: React.FC<{ cor: string; jorra: boolean }> = ({ cor, jorra }) => {
  const f = useCurrentFrame();
  return (
    <g filter="url(#neon)">
      <path d={`M${X - 300} 760 L${X - 60} 760 Q ${X} 760 ${X} 820 L${X} 850`} fill="none" stroke={NEON.ciano} strokeWidth={34} strokeLinecap="round" />
      <rect x={X - 330} y={720} width={60} height={80} rx={14} fill="#12052A" stroke={NEON.ciano} strokeWidth={7} />
      <circle cx={X - 200} cy={710} r={26} fill="#12052A" stroke={NEON.rosa} strokeWidth={7} />
      {jorra && <rect x={X - 12} y={860} width={24} height={Y_FUNDO - 880} rx={10} fill={cor} opacity={0.75 + Math.sin(f * 0.9) * 0.1} />}
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
  const nivel = yAgua(f, r.T);
  const transborda = f > r.T ? Math.min(1, (f - r.T) / 12) : 0;
  const { res, ms } = veredito(f, r.T);
  const secreto = f === r.T;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <DefsNeon />
        <FundoNeon horizonte={1560} />
        <Torneira cor={r.cor} jorra={f < r.T + 10} />
        <Copo nivel={Math.max(nivel, Y_BORDA - 12)} cor={r.cor} transborda={transborda} />
        <g filter="url(#neon)">
          {Array.from({ length: 6 }).map((_, i) => (
            <rect key={i} x={X - 330 + i * 44} y={Y_BORDA - 3} width={26} height={6} rx={3} fill={NEON.vermelho} />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <rect key={`d${i}`} x={X + 240 + i * 44} y={Y_BORDA - 3} width={26} height={6} rx={3} fill={NEON.vermelho} />
          ))}
        </g>
        <text x={X + 250} y={Y_BORDA - 18} fontSize={34} fill={NEON.vermelho} fontFamily={MONO} fontWeight={700}>
          0:00.00
        </text>
      </svg>
      <PainelResultado n={n} total={RODADAS.length} res={res} ms={ms} at={-999} y={270} nome="COPO" rotulos={{ bateu: "TRANSBORDOU!" }} />
      <Cronometro seg={(r.T - f) / 30} y={505} />
      {secreto && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)" }}>
          <div style={{ position: "absolute", left: 40, width: 860, top: 1080, textAlign: "center", fontFamily: FONTE, fontWeight: 800, lineHeight: 1.05 }}>
            <div style={{ fontSize: 140, ...brilho(NEON.verde, 1.2) }}>PERFEITO!</div>
            <div style={{ fontSize: 60, marginTop: 14, ...brilho(NEON.amarelo, 0.8) }}>🥤 NEM UMA GOTA NO CHÃO</div>
            <div style={{ fontSize: 58, marginTop: 18, ...brilho(NEON.rosa, 0.8) }}>COMENTA "SALVEI" 👇</div>
          </div>
        </div>
      )}
      <Som at={0} nome="chuva" vol={0.25} dur={r.T + 8} />
      {[16, 10, 6, 3].map((d) => (r.T - d > 0 ? <Som key={d} at={r.T - d} nome="click" vol={0.4} dur={8} /> : null))}
      <Som at={r.T + 1} nome="borbulha" vol={0.6} dur={POS - 2} />
    </AbsoluteFill>
  );
};

export const DesafioCopo: React.FC = () => {
  let t = 0;
  return (
    <AbsoluteFill style={{ background: NEON.fundo1 }}>
      {RODADAS.map((r, i) => {
        const from = t;
        t += r.T + POS;
        return (
          <Sequence key={i} from={from} durationInFrames={r.T + POS} name={`copo ${i + 1}`}>
            <Tentativa r={r} n={i + 1} />
          </Sequence>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: FONTE, fontWeight: 800, lineHeight: 1.0 }}>
        <div style={{ fontSize: 76, ...brilho(NEON.rosa, 0.9) }}>PAUSE ANTES DO COPO</div>
        <div style={{ fontSize: 76, ...brilho(NEON.ciano, 0.9) }}>TRANSBORDAR! 🥤</div>
      </div>
    </AbsoluteFill>
  );
};
