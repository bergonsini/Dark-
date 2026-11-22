import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { timeline } from "./timeline";

/** Textos do PANELA DEPRESSÃO (estilo programa de TV trash). */
const FONTE = "'Baloo 2', 'Nunito', sans-serif";
const TINTA = "#2a0a2a";

/** Legenda de até 3 palavras, com a palavra falada em amarelo e maior. */
export const Legenda: React.FC<{ y?: number }> = ({ y = 1190 }) => {
  const f = useCurrentFrame();
  for (const s of timeline.scenes)
    for (const l of s.lines) {
      if (f < l.startFrame || f > l.endFrame + 4) continue;
      let i = l.words.findIndex((w, k) => f >= w.startFrame && f < (l.words[k + 1]?.startFrame ?? l.endFrame + 5));
      if (i < 0) i = 0;
      const ini = Math.floor(i / 3) * 3;
      const grupo = l.words.slice(ini, ini + 3);
      return (
        <div style={{ position: "absolute", left: 30, right: 30, top: y, textAlign: "center", fontFamily: FONTE, fontWeight: 800, lineHeight: 1.05 }}>
          {grupo.map((w, k) => {
            const atual = ini + k === i;
            const t = w.text.replace(/[.,;:!?…]+$/, "");
            return (
              <span
                key={k}
                style={{
                  display: "inline-block",
                  margin: "0 12px",
                  fontSize: atual ? 104 : 88,
                  color: atual ? "#ffd23f" : "#ffffff",
                  WebkitTextStroke: `16px ${TINTA}`,
                  paintOrder: "stroke fill",
                  textShadow: `0 8px 0 ${TINTA}`,
                  transform: atual ? "rotate(-2deg)" : undefined,
                }}
              >
                {t.toUpperCase()}
              </span>
            );
          })}
        </div>
      );
    }
  return null;
};

const NOMES: Record<string, [string, string, string]> = {
  apresentador: ["WANDERLEY FRITURA", "apresentador", "#ef4a2a"],
  juninho: ["JUNINHO", "participante · 14 derrotas", "#2fb36b"],
  zica: ["DONA ZICA", "participante · nunca cozinhou", "#ff8a2a"],
  francois: ["CHEF FRANÇOIS BISTECA", "jurado", "#3a3a48"],
  vo: ["VÓ LURDINHA", "jurada", "#c2185b"],
  misterioso: ["JURADO MISTERIOSO", "jurado", "#111"],
};
/** Tarja de nome (GC) de quem começou a falar, por 2 s. */
export const GC: React.FC<{ y?: number }> = ({ y = 390 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const vistos = new Set<string>();
  for (const s of timeline.scenes)
    for (const l of s.lines) {
      const q = l.quem ?? "";
      const primeira = !vistos.has(q);
      vistos.add(q);
      if (!primeira || !NOMES[q]) continue;
      if (f >= l.startFrame && f < l.startFrame + 66) {
        const [nome, papel, cor] = NOMES[q];
        const k = spring({ frame: f - l.startFrame, fps, config: { damping: 14, stiffness: 160 } });
        const sai = Math.min(1, Math.max(0, (l.startFrame + 66 - f) / 8));
        return (
          <div style={{ position: "absolute", left: 40, top: y, transform: `translateX(${(1 - k) * -700}px)`, opacity: sai }}>
            <div style={{ background: cor, color: "#fff", fontFamily: FONTE, fontWeight: 800, fontSize: 54, padding: "6px 26px", borderRadius: "18px 18px 18px 0", border: `6px solid ${TINTA}`, boxShadow: `0 8px 0 ${TINTA}` }}>{nome}</div>
            <div style={{ display: "inline-block", background: "#ffd23f", color: TINTA, fontFamily: "'Nunito'", fontWeight: 900, fontSize: 32, padding: "4px 18px", borderRadius: "0 0 14px 14px", border: `5px solid ${TINTA}`, borderTop: 0 }}>{papel}</div>
          </div>
        );
      }
    }
  return null;
};

/** Selo do programa no canto + "AO VIVO" piscando. */
export const LogoBug: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 36, top: 120, display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ background: "#ffd23f", color: TINTA, fontFamily: FONTE, fontWeight: 800, fontSize: 34, lineHeight: 0.95, padding: "8px 16px", borderRadius: 16, border: `5px solid ${TINTA}`, transform: "rotate(-4deg)", boxShadow: `0 6px 0 ${TINTA}` }}>
        PANELA
        <br />
        DEPRESSÃO
      </div>
      <div style={{ background: TINTA, color: "#fff", fontFamily: "'Nunito'", fontWeight: 900, fontSize: 26, padding: "6px 14px", borderRadius: 12 }}>
        <span style={{ color: f % 30 < 18 ? "#ff3b3b" : "#5a1a1a" }}>●</span> AO VIVO
      </div>
    </div>
  );
};

/** Faixa de "capítulo" (banner de TV inclinado). */
export const Capitulo: React.FC<{ texto: string; at?: number; y?: number }> = ({ texto, at = 0, y = 250 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!texto || f < at) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 11, stiffness: 200 } });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", transform: `scale(${0.3 + s * 0.7}) rotate(-3deg)` }}>
      <div style={{ background: "#c2185b", border: `8px solid ${TINTA}`, borderRadius: 22, padding: "6px 40px 0", boxShadow: `0 10px 0 ${TINTA}`, fontFamily: FONTE, fontWeight: 800, fontSize: 84, color: "#ffd23f", WebkitTextStroke: `10px ${TINTA}`, paintOrder: "stroke fill", whiteSpace: "nowrap" }}>
        {texto}
      </div>
    </div>
  );
};

/** Onomatopeia que bate e some. */
export const Onomatopeia: React.FC<{ texto: string; at: number; x?: number; y?: number; dur?: number; cor?: string; rot?: number; tam?: number }> = ({ texto, at, x = 540, y = 700, dur = 24, cor = "#ffffff", rot = -10, tam = 140 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at || f > at + dur) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 7, stiffness: 300 } });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${s * 1.1}) rotate(${rot}deg)`, fontFamily: FONTE, fontWeight: 800, fontSize: tam, color: cor, WebkitTextStroke: `18px ${TINTA}`, paintOrder: "stroke fill", whiteSpace: "nowrap" }}>
      {texto}
    </div>
  );
};

/** Placa do nome do prato (cardápio chique de um prato horrível). */
export const NomePrato: React.FC<{ linha1: string; linha2: string; at: number; ate?: number; y?: number }> = ({ linha1, linha2, at, ate = 1e9, y = 1430 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at || f > ate) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 10, stiffness: 200 } });
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: y, transform: `scale(${s}) rotate(${Math.sin(f * 0.12) * 1.5}deg)`, background: "#fff8e8", border: `8px solid ${TINTA}`, borderRadius: 26, boxShadow: `0 10px 0 ${TINTA}`, padding: "10px 20px", textAlign: "center" }}>
      <div style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: 30, color: "#c2185b", letterSpacing: 3 }}>✦ NOME DO PRATO ✦</div>
      <div style={{ fontFamily: FONTE, fontWeight: 800, fontSize: 60, color: TINTA, lineHeight: 1.0 }}>{linha1}</div>
      <div style={{ fontFamily: FONTE, fontWeight: 800, fontSize: 52, color: "#ef4a2a", lineHeight: 1.0 }}>{linha2}</div>
    </div>
  );
};

/** Cronômetro digital gigante (preparo). */
export const Cronometro: React.FC<{ seg: number; y?: number }> = ({ seg, y = 380 }) => {
  const f = useCurrentFrame();
  const s = Math.max(0, seg);
  const txt = `00:${String(Math.ceil(s)).padStart(2, "0")}`;
  const urgente = s < 10;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center" }}>
      <span style={{ display: "inline-block", background: TINTA, border: `8px solid ${urgente && f % 10 < 5 ? "#ff3b3b" : "#ffd23f"}`, borderRadius: 26, padding: "4px 40px", fontFamily: "'DejaVu Sans Mono', monospace", fontWeight: 700, fontSize: 130, color: urgente ? "#ff5c5c" : "#ffd23f", boxShadow: `0 10px 0 #000` }}>{txt}</span>
    </div>
  );
};
