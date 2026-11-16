import React from "react";
import { random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTE, TINTA } from "./common";
import { timeline } from "./timeline";

/** Textos de TELEVENDAS do INUTILIDADES 0800 (HTML por cima da cena). Todos entram com "pop" no frame `at`. */

const pop = (f: number, at: number, fps: number, st = 260) => (f < at ? 0 : spring({ frame: f - at, fps, config: { damping: 9, stiffness: st, mass: 0.5 } }));

const contorno = (px: number): React.CSSProperties => ({ WebkitTextStroke: `${px}px ${TINTA}`, paintOrder: "stroke fill" });

export const Faixa: React.FC<{ texto: string; at: number; y?: number; cor?: string }> = ({ texto, at, y = 230, cor = "#FFD23F" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(f, at, fps);
  if (s <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: -20,
        right: -20,
        top: y,
        textAlign: "center",
        fontFamily: FONTE,
        fontWeight: 800,
        fontSize: 66,
        color: TINTA,
        background: cor,
        padding: "8px 0",
        transform: `rotate(-2deg) scaleX(${s})`,
        boxShadow: `0 10px 0 ${TINTA}`,
      }}
    >
      {texto}
    </div>
  );
};

/** Nome do produto, gigante, batendo na tela. */
export const NomeProduto: React.FC<{ linha1: string; linha2: string; at: number; y?: number; tam?: number }> = ({ linha1, linha2, at, y = 360, tam = 128 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s1 = pop(f, at, fps, 300);
  const s2 = pop(f, at + 6, fps, 300);
  if (s1 <= 0) return null;
  const base: React.CSSProperties = { fontFamily: FONTE, fontWeight: 800, lineHeight: 0.95, ...contorno(16), textShadow: `0 12px 0 ${TINTA}` };
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center" }}>
      <div style={{ ...base, fontSize: tam, color: "#fff", transform: `scale(${s1})` }}>{linha1}</div>
      <div style={{ ...base, fontSize: tam * 0.85, color: "#FF4B3E", transform: `scale(${s2}) rotate(-2deg)` }}>{linha2}</div>
    </div>
  );
};

/** Estrela de preço: "DE R$ 999" riscado e o preço novo. */
export const EstrelaPreco: React.FC<{ de?: string; por: string; extra?: string; at: number; porAt?: number; x?: number; y?: number; tam?: number }> = ({
  de,
  por,
  extra,
  at,
  porAt,
  x = 640,
  y = 560,
  tam = 400,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(f, at, fps);
  if (s <= 0) return null;
  const sp = porAt === undefined ? 1 : pop(f, porAt, fps, 320);
  const risco = porAt === undefined ? 1 : Math.min(1, Math.max(0, (f - porAt + 4) / 6));
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: tam,
        height: tam,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONTE,
        fontWeight: 800,
        color: TINTA,
        transform: `rotate(${10 + Math.sin(f * 0.2) * 3}deg) scale(${s})`,
        background: "#FFD23F",
        clipPath:
          "polygon(50% 0,61% 12%,78% 6%,80% 23%,96% 28%,88% 43%,100% 55%,86% 65%,90% 83%,72% 83%,64% 98%,50% 88%,36% 98%,28% 83%,10% 83%,14% 65%,0 55%,12% 43%,4% 28%,20% 23%,22% 6%,39% 12%)",
      }}
    >
      {de && (
        <div style={{ position: "relative", fontSize: tam * 0.12, color: "#c0392b" }}>
          {de}
          <div style={{ position: "absolute", left: -6, top: "52%", height: 7, width: `${risco * 105}%`, background: "#c0392b", transform: "rotate(-8deg)" }} />
        </div>
      )}
      <div style={{ fontSize: tam * 0.22, lineHeight: 1, transform: `scale(${sp})` }}>{por}</div>
      {extra && <div style={{ fontSize: tam * 0.1 }}>{extra}</div>}
    </div>
  );
};

export const LigueJa: React.FC<{ at: number; numero?: string }> = ({ at, numero = "0800-BUM-BUM" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(f, at, fps);
  if (s <= 0) return null;
  const pisca = Math.floor((f - at) / 8) % 2 === 0;
  return (
    <div
      style={{
        position: "absolute",
        left: 30,
        right: 30,
        bottom: 130,
        textAlign: "center",
        fontFamily: FONTE,
        fontWeight: 800,
        fontSize: numero.length > 12 ? 60 : 74,
        color: "#fff",
        background: pisca ? "#E8282B" : "#C21A1D",
        border: "8px solid #fff",
        borderRadius: 24,
        padding: "10px 0",
        boxShadow: `0 12px 0 ${TINTA}`,
        transform: `scale(${s})`,
      }}
    >
      📞 LIGUE JÁ! {numero}
    </div>
  );
};

/** Selo inclinado ("100% EFICAZ*", "DEPOIMENTO REAL*", "+1 GRÁTIS!"). */
export const Selo: React.FC<{ texto: string; at: number; x: number; y: number; cor?: string; rot?: number; tam?: number }> = ({
  texto,
  at,
  x,
  y,
  cor = "#E8282B",
  rot = 8,
  tam = 52,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(f, at, fps);
  if (s <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        fontFamily: FONTE,
        fontWeight: 800,
        fontSize: tam,
        lineHeight: 1,
        textAlign: "center",
        color: "#fff",
        background: cor,
        padding: "16px 26px",
        borderRadius: 18,
        border: "6px solid #fff",
        boxShadow: `0 8px 0 ${TINTA}`,
        transform: `rotate(${rot}deg) scale(${s})`,
        whiteSpace: "pre",
      }}
    >
      {texto}
    </div>
  );
};

/** Tarja de nome (terço inferior) do depoimento. */
export const Terco: React.FC<{ nome: string; sub: string; at: number }> = ({ nome, sub, at }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(f, at, fps, 200);
  if (s <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        bottom: 80,
        background: TINTA,
        color: "#fff",
        padding: "12px 34px",
        borderLeft: "22px solid #FFD23F",
        display: "flex",
        flexDirection: "column",
        fontFamily: FONTE,
        fontWeight: 800,
        transform: `translateX(${(1 - s) * -700}px)`,
      }}
    >
      <span style={{ fontSize: 70, lineHeight: 1 }}>{nome}</span>
      <span style={{ fontSize: 38, color: "#FFD23F" }}>{sub}</span>
    </div>
  );
};

/** Onomatopeia grande (CRASH!, NHAC!, TSSS…). */
export const Onomatopeia: React.FC<{ texto: string; at: number; dur?: number; x?: number; y?: number; cor?: string; rot?: number; tam?: number }> = ({
  texto,
  at,
  dur = 30,
  x = 540,
  y = 560,
  cor = "#FFD23F",
  rot = -6,
  tam = 120,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at || f > at + dur) return null;
  const s = pop(f, at, fps, 380);
  return (
    <div
      style={{
        position: "absolute",
        left: x - 500,
        width: 1000,
        top: y,
        textAlign: "center",
        fontFamily: FONTE,
        fontWeight: 800,
        fontSize: tam,
        color: cor,
        ...contorno(16),
        textShadow: `0 10px 0 ${TINTA}`,
        transform: `rotate(${rot}deg) scale(${s})`,
      }}
    >
      {texto}
    </div>
  );
};

/** Letrinhas miúdas que passam correndo (rodapé do comercial). */
export const Miudo: React.FC<{ texto: string; at: number; bottom?: number; tam?: number }> = ({ texto, at, bottom = 60, tam = 30 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return (
    <div style={{ position: "absolute", left: 30, right: 30, bottom, textAlign: "center", fontFamily: FONTE, fontWeight: 800, fontSize: tam, color: "#fff", opacity: 0.9, textShadow: `0 3px 0 ${TINTA}` }}>
      {texto}
    </div>
  );
};

/**
 * Legenda: a frase em blocos de até 3 palavras; a palavra falada fica AMARELA e maior.
 * Cor do "dono" da fala: Doutor (branco), Kuka (verde-claro), Rato (rosa).
 */
export const Legenda: React.FC<{ y?: number; pular?: string[] }> = ({ y = 1360, pular = [] }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  for (const s of timeline.scenes)
    for (const l of s.lines) {
      if (pular.includes(s.id) || f < l.startFrame || f > l.endFrame + 4) continue;
      const ws = l.words;
      let i = ws.findIndex((w, k) => f >= w.startFrame && f < (ws[k + 1]?.startFrame ?? l.endFrame + 5));
      if (i < 0) i = f < ws[0].startFrame ? 0 : ws.length - 1;
      const bloco = Math.floor(i / 3);
      const grupo = ws.slice(bloco * 3, bloco * 3 + 3);
      const ini = grupo[0].startFrame;
      const sIn = spring({ frame: f - ini, fps, config: { damping: 12, stiffness: 300, mass: 0.5 } });
      const cor = l.quem === "kuka" ? "#B8F5C4" : l.quem === "rato" ? "#FFC2CC" : "#FFFFFF";
      return (
        <div style={{ position: "absolute", left: 40, right: 40, top: y, textAlign: "center", transform: `scale(${0.7 + sIn * 0.3})` }}>
          {grupo.map((w, k) => {
            const atual = bloco * 3 + k === i;
            return (
              <span
                key={k}
                style={{
                  display: "inline-block",
                  margin: "0 12px",
                  fontFamily: FONTE,
                  fontWeight: 800,
                  fontSize: atual ? 104 : 92,
                  color: atual ? "#FFD23F" : cor,
                  ...contorno(15),
                  textShadow: `0 8px 0 ${TINTA}`,
                  textTransform: "uppercase",
                }}
              >
                {w.text.replace(/[.,;:!?…]+$/, "")}
              </span>
            );
          })}
        </div>
      );
    }
  return null;
};

/** Selinho do canal no canto (como logo de emissora). */
export const LogoCanal: React.FC = () => (
  <div
    style={{
      position: "absolute",
      right: 36,
      top: 34,
      fontFamily: FONTE,
      fontWeight: 800,
      fontSize: 34,
      lineHeight: 0.9,
      textAlign: "right",
      color: "#fff",
      opacity: 0.85,
      ...contorno(8),
    }}
  >
    INUTILIDADES
    <br />
    <span style={{ color: "#FFD23F", fontSize: 44 }}>0800</span>
  </div>
);

/** Interface da fita VHS: PLAY ▶, contador SP, linhas, vinheta, chiado e a faixa de "tracking". */
export const VHSInterface: React.FC<{ glitches: number[]; pausas?: [number, number][] }> = ({ glitches, pausas = [] }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seg = Math.floor(f / fps);
  const hh = `SP 0:${String(Math.floor(seg / 60)).padStart(2, "0")}:${String(seg % 60).padStart(2, "0")}`;
  const g = glitches.some((a) => f >= a && f < a + 8);
  const pausa = pausas.find(([a, b]) => f >= a && f < b);
  const faixaY = ((f * 9) % 2400) - 240;
  const hud: React.CSSProperties = { position: "absolute", fontFamily: "'DejaVu Sans Mono', monospace", fontWeight: 700, color: "#fff", textShadow: "3px 0 #f0f, -3px 0 #0ff" };
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(0,0,0,.20) 0 3px, transparent 3px 6px)" }} />
      <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 240px 50px rgba(0,0,0,.65)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: faixaY, height: 34, background: "rgba(255,255,255,.14)", filter: "blur(4px)" }} />
      {g &&
        Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: random(`gy${f}-${i}`) * 1920,
              height: 20 + random(`gh${f}-${i}`) * 60,
              background: `rgba(255,255,255,${0.15 + random(`ga${f}-${i}`) * 0.35})`,
              transform: `translateX(${(random(`gx${f}-${i}`) - 0.5) * 200}px)`,
            }}
          />
        ))}
      {pausa && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1500 + Math.sin(f * 1.3) * 30, height: 46, background: "rgba(255,255,255,.22)", filter: "blur(2px)", transform: `translateX(${Math.sin(f * 7) * 14}px)` }} />
      )}
      <div style={{ ...hud, left: 40, top: 36, fontSize: 50 }}>{g ? "◀◀ REW" : pausa ? "PAUSE ‖" : "PLAY ▶"}</div>
      <div style={{ ...hud, left: 40, top: 100, fontSize: 36 }}>{hh}</div>
    </div>
  );
};
