import React from "react";
import { Audio, Sequence, spring, staticFile, useCurrentFrame } from "remotion";

/**
 * Kit NEON/ARCADE do canal 4 (desafio do pause). Fundo escuro roxo, grade em perspectiva, estrelas e textos que brilham.
 * Sem personagem fixo e SEM narração: só texto, efeitos sonoros e música.
 */

export const NEON = {
  fundo1: "#1A0B3D",
  fundo2: "#3A0F5E",
  rosa: "#FF2BD6",
  ciano: "#2BF3FF",
  amarelo: "#FFE45C",
  laranja: "#FF8A2B",
  verde: "#3DFF8A",
  vermelho: "#FF3B5C",
  branco: "#FFFFFF",
};
export const FONTE = "'Baloo 2', 'Nunito', sans-serif";
export const MONO = "'DejaVu Sans Mono', monospace";

/** Brilho neon em texto HTML. */
export const brilho = (cor: string, forte = 1): React.CSSProperties => ({
  color: "#fff",
  textShadow: `0 0 ${6 * forte}px #fff, 0 0 ${14 * forte}px ${cor}, 0 0 ${28 * forte}px ${cor}, 0 0 ${48 * forte}px ${cor}`,
});

/** Filtro SVG de brilho (use filter="url(#neon)"). Coloque <DefsNeon/> uma vez dentro do <svg>. */
export const DefsNeon: React.FC = () => (
  <defs>
    <filter id="neon" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="7" result="b1" />
      <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="b2" />
      <feMerge>
        <feMergeNode in="b2" />
        <feMergeNode in="b1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <linearGradient id="ceuNeon" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={NEON.fundo1} />
      <stop offset="1" stopColor={NEON.fundo2} />
    </linearGradient>
  </defs>
);

/** Fundo: degradê, estrelas piscando e a grade em perspectiva rolando (estilo fliperama anos 80). */
export const FundoNeon: React.FC<{ horizonte?: number }> = ({ horizonte = 1450 }) => {
  const f = useCurrentFrame();
  const linhas: React.ReactNode[] = [];
  for (let i = 0; i < 10; i++) {
    const q = ((i + (f * 0.06) % 1) / 10) ** 2;
    const y = horizonte + q * (1920 - horizonte);
    linhas.push(<path key={`h${i}`} d={`M0 ${y} L1080 ${y}`} />);
  }
  for (let i = -8; i <= 8; i++) linhas.push(<path key={`v${i}`} d={`M${540 + i * 40} ${horizonte} L${540 + i * 260} 1920`} />);
  return (
    <g>
      <rect width={1080} height={1920} fill="url(#ceuNeon)" />
      {Array.from({ length: 60 }).map((_, i) => {
        const x = (i * 197) % 1080;
        const y = (i * 331) % horizonte;
        const a = 0.3 + 0.7 * Math.abs(Math.sin(f * 0.07 + i));
        return <circle key={i} cx={x} cy={y} r={i % 5 === 0 ? 3.5 : 2} fill="#fff" opacity={a} />;
      })}
      <rect y={horizonte} width={1080} height={1920 - horizonte} fill="#12052A" />
      <g stroke={NEON.rosa} strokeWidth={3} opacity={0.75} filter="url(#neon)">
        {linhas}
      </g>
      <rect x={0} y={horizonte - 3} width={1080} height={6} fill={NEON.ciano} filter="url(#neon)" />
    </g>
  );
};

/** Cronômetro grande estilo display digital: "0:02.47". */
export const Cronometro: React.FC<{ seg: number; y: number; cor?: string; piscando?: boolean }> = ({ seg, y, cor = NEON.vermelho, piscando = false }) => {
  const f = useCurrentFrame();
  const neg = seg < 0;
  const s = Math.abs(seg);
  const txt = `${neg ? "+" : ""}${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}.${String(Math.floor((s * 100) % 100)).padStart(2, "0")}`;
  const vis = piscando ? Math.floor(f / 4) % 2 === 0 : true;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center" }}>
      <span
        style={{
          display: "inline-block",
          padding: "8px 40px",
          background: "rgba(10,0,20,.85)",
          border: `5px solid ${cor}`,
          borderRadius: 22,
          boxShadow: `0 0 26px ${cor}, inset 0 0 18px ${cor}55`,
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 130,
          letterSpacing: 4,
          opacity: vis ? 1 : 0.35,
          ...brilho(cor, 1),
        }}
      >
        {txt}
      </span>
    </div>
  );
};

export type Resultado = "cedoDemais" | "cedo" | "perto" | "bateu";
const ROTULO: Record<Resultado, [string, string]> = {
  cedoDemais: ["CEDO DEMAIS", NEON.laranja],
  cedo: ["CEDO", NEON.amarelo],
  perto: ["PERTO!", NEON.verde],
  bateu: ["BATEU!", NEON.vermelho],
};

/**
 * Painel de resultado (no topo): "FOGUETE 2/5", o veredito colorido, a diferença em ms e uma régua com o alvo no meio.
 * `ms` negativo = pausou antes; positivo = passou do ponto. `at` = frame em que o veredito aparece (antes disso: "…").
 */
export const PainelResultado: React.FC<{ n: number; total: number; res: Resultado; ms: number; at: number; y?: number }> = ({ n, total, res, ms, at, y = 330 }) => {
  const f = useCurrentFrame();
  const mostra = f >= at;
  const s = mostra ? spring({ frame: f - at, fps: 30, config: { damping: 10, stiffness: 260, mass: 0.5 } }) : 0;
  const [txt, cor] = ROTULO[res];
  const pos = Math.max(0, Math.min(1, 0.5 + ms / 3000));
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: y,
        padding: "18px 30px 22px",
        background: "rgba(10,0,25,.82)",
        border: `4px solid ${mostra ? cor : NEON.ciano}`,
        borderRadius: 20,
        boxShadow: `0 0 24px ${mostra ? cor : NEON.ciano}`,
        fontFamily: FONTE,
        fontWeight: 800,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 30, color: "#C9B8FF" }}>
        <span>
          FOGUETE {n}/{total}
        </span>
        <span>ALVO: 0:00.00</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 104 }}>
        <span style={{ fontSize: 86, transform: `scale(${mostra ? 0.6 + s * 0.4 : 1})`, transformOrigin: "left center", ...brilho(mostra ? cor : NEON.ciano, 0.8) }}>
          {mostra ? txt : "• • •"}
        </span>
        <span style={{ fontFamily: MONO, fontSize: 46, ...brilho(mostra ? cor : NEON.ciano, 0.6) }}>{mostra ? `${ms > 0 ? "+" : ""}${ms} ms` : ""}</span>
      </div>
      <div style={{ position: "relative", height: 22, borderRadius: 11, background: `linear-gradient(90deg, ${NEON.laranja}, ${NEON.amarelo} 40%, ${NEON.verde} 50%, ${NEON.vermelho} 60%, ${NEON.vermelho})`, opacity: 0.85 }}>
        <div style={{ position: "absolute", left: "50%", top: -10, width: 6, height: 42, marginLeft: -3, background: "#fff", boxShadow: "0 0 10px #fff" }} />
        {mostra && <div style={{ position: "absolute", left: `${pos * 100}%`, top: -16, width: 0, height: 0, marginLeft: -16, borderLeft: "16px solid transparent", borderRight: "16px solid transparent", borderTop: `24px solid ${cor}`, filter: `drop-shadow(0 0 8px ${cor})` }} />}
      </div>
    </div>
  );
};

/** Efeito sonoro em frame LOCAL. */
export const Som: React.FC<{ at: number; nome: string; vol?: number; dur?: number }> = ({ at, nome, vol = 0.6, dur = 60 }) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={dur} layout="none" name={`sfx:${nome}`}>
    <Audio src={staticFile(`desafio/audio/sfx/${nome}.wav`)} volume={(fr) => Math.min(1, vol * 1.5) * Math.min(1, (dur - fr) / 4)} />
  </Sequence>
);
