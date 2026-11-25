import React from "react";
import { useCurrentFrame } from "remotion";
import { FONTE, MONO, Resultado } from "./neon";

/**
 * Kit CARTOON do canal 4 (alternativa ao neon): céu de dia, sol, nuvens, contornos grossos escuros,
 * sombras sólidas (sem brilho). Mesma mecânica do desafio: painel ao vivo + cronômetro, nas mesmas zonas seguras.
 */

export const TOON = {
  contorno: "#1F1B2E",
  ceu1: "#5EC8FF",
  ceu2: "#BDEBFF",
  grama: "#6FD16B",
  gramaEsc: "#46A84A",
  calcada: "#E9DCC6",
  calcadaEsc: "#CDBB9C",
  amarelo: "#FFD23F",
  laranja: "#FF8C42",
  verde: "#3DDC84",
  vermelho: "#FF4D4D",
  rosa: "#FF7AB6",
  azul: "#3A86FF",
  branco: "#FFFFFF",
};

/** Texto cartoon: preenchimento colorido com contorno escuro grosso e sombra sólida. */
export const textoToon = (cor: string, borda = 10): React.CSSProperties => ({
  color: cor,
  WebkitTextStroke: `${borda}px ${TOON.contorno}`,
  paintOrder: "stroke fill",
  textShadow: `0 ${borda * 0.8}px 0 ${TOON.contorno}`,
});

/** Fundo de parque ensolarado: céu em degradê, sol girando, nuvens andando, morros, árvores e a calçada a partir de `chao`. */
export const FundoParque: React.FC<{ chao?: number }> = ({ chao = 1360 }) => {
  const f = useCurrentFrame();
  const OL = { stroke: TOON.contorno, strokeWidth: 7, strokeLinejoin: "round" as const };
  return (
    <g>
      <defs>
        <linearGradient id="ceuToon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={TOON.ceu1} />
          <stop offset="1" stopColor={TOON.ceu2} />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#ceuToon)" />
      {/* sol */}
      <g transform={`translate(900 780) rotate(${f * 1.2})`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={-10} y={-150} width={20} height={44} rx={10} fill={TOON.amarelo} {...OL} strokeWidth={5} transform={`rotate(${i * 30})`} />
        ))}
        <circle r={88} fill={TOON.amarelo} {...OL} />
      </g>
      {/* nuvens */}
      {[0, 1, 2].map((i) => {
        const x = ((i * 430 + f * (1.2 + i * 0.4)) % 1500) - 260;
        const y = 760 + i * 130;
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${0.8 + (i % 2) * 0.3})`}>
            <path d="M-110 30 Q -130 -30 -60 -30 Q -40 -80 20 -60 Q 80 -90 100 -30 Q 150 -20 130 30 Z" fill="#fff" {...OL} />
          </g>
        );
      })}
      {/* morros */}
      <path d={`M0 ${chao - 160} Q 260 ${chao - 330} 520 ${chao - 170} Q 800 ${chao - 340} 1080 ${chao - 180} L1080 ${chao} L0 ${chao} Z`} fill={TOON.gramaEsc} {...OL} />
      <path d={`M0 ${chao - 80} Q 300 ${chao - 190} 600 ${chao - 90} Q 860 ${chao - 170} 1080 ${chao - 90} L1080 ${chao} L0 ${chao} Z`} fill={TOON.grama} {...OL} />
      {/* árvores nas laterais */}
      {[90, 990].map((x, i) => (
        <g key={x} transform={`translate(${x} ${chao - 60})`}>
          <rect x={-22} y={-170} width={44} height={180} rx={10} fill="#9C6B3F" {...OL} />
          <circle cy={-250} r={110 + Math.sin(f * 0.08 + i) * 4} fill="#3FB560" {...OL} />
          <circle cx={-40} cy={-280} r={26} fill="#5CD27A" />
        </g>
      ))}
      {/* calçada */}
      <rect y={chao} width={1080} height={1920 - chao} fill={TOON.calcada} />
      <rect y={chao} width={1080} height={10} fill={TOON.contorno} />
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x={i * 200 - 10} y={chao} width={8} height={1920 - chao} fill={TOON.calcadaEsc} />
      ))}
      <rect y={chao + 220} width={1080} height={8} fill={TOON.calcadaEsc} />
    </g>
  );
};

/** Cronômetro cartoon: placa amarela com contorno grosso e sombra sólida; fica vermelha no último meio segundo. */
export const CronometroToon: React.FC<{ seg: number; y: number }> = ({ seg, y }) => {
  const neg = seg < 0;
  const s = Math.abs(seg);
  const txt = `${neg ? "+" : ""}${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}.${String(Math.floor((s * 100) % 100)).padStart(2, "0")}`;
  const quente = seg < 0.5;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center" }}>
      <span
        style={{
          display: "inline-block",
          padding: "4px 40px",
          background: quente ? TOON.vermelho : TOON.amarelo,
          border: `8px solid ${TOON.contorno}`,
          borderRadius: 30,
          boxShadow: `0 12px 0 ${TOON.contorno}`,
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 124,
          letterSpacing: 2,
          color: quente ? "#fff" : TOON.contorno,
        }}
      >
        {txt}
      </span>
    </div>
  );
};

const ROTULO: Record<Resultado, [string, string]> = {
  cedoDemais: ["CEDO DEMAIS", TOON.laranja],
  cedo: ["CEDO", TOON.amarelo],
  perto: ["PERTO!", TOON.verde],
  bateu: ["BATEU!", TOON.vermelho],
};

/** Painel ao vivo em versão cartoon (cartão branco, contorno grosso, veredito colorido com contorno). */
export const PainelToon: React.FC<{ n: number; total: number; res: Resultado; ms: number; y?: number; nome: string; rotulos?: Partial<Record<Resultado, string>> }> = ({ n, total, res, ms, y = 270, nome, rotulos }) => {
  const [txt0, cor] = ROTULO[res];
  const txt = rotulos?.[res] ?? txt0;
  const pos = Math.max(0, Math.min(1, 0.5 + ms / 3000));
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: y,
        padding: "14px 30px 22px",
        background: "#fff",
        border: `8px solid ${TOON.contorno}`,
        borderRadius: 30,
        boxShadow: `0 12px 0 ${TOON.contorno}`,
        fontFamily: FONTE,
        fontWeight: 800,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontWeight: 700, fontSize: 30, color: "#6B6480" }}>
        <span>
          {nome} {n}/{total}
        </span>
        <span>ALVO: 0:00.00</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 104 }}>
        <span style={{ fontSize: 84, ...textoToon(cor, 9) }}>{txt}</span>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 46, color: TOON.contorno }}>{`${ms > 0 ? "+" : ""}${ms} ms`}</span>
      </div>
      <div style={{ position: "relative", height: 26, borderRadius: 13, border: `5px solid ${TOON.contorno}`, background: `linear-gradient(90deg, ${TOON.laranja}, ${TOON.amarelo} 40%, ${TOON.verde} 50%, ${TOON.vermelho} 60%, ${TOON.vermelho})` }}>
        <div style={{ position: "absolute", left: "50%", top: -14, width: 8, height: 44, marginLeft: -4, background: TOON.contorno, borderRadius: 4 }} />
        <div style={{ position: "absolute", left: `${pos * 100}%`, top: -30, width: 0, height: 0, marginLeft: -18, borderLeft: "18px solid transparent", borderRight: "18px solid transparent", borderTop: `28px solid ${TOON.contorno}` }} />
      </div>
    </div>
  );
};
