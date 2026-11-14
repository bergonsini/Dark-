import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BODY_FONT, TITLE_FONT } from "../fonts";
import { C } from "../theme";

/**
 * Objetos do vídeo "E se a Lua sumisse?". Vetoriais, animados por frame, determinísticos.
 * Coordenadas no quadro inteiro (1080x1920).
 */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const hash = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
    {children}
  </svg>
);

export const LUA = { cor: "#F4F1DE", sombra: "#D9D3B8", cratera: "#C9C2A3", noite: "#0B1030", noite2: "#1E2A5C" };

/** A Lua como personagem: rosto, expressões, suor, capacete de trabalho. */
export const LuaPersonagem: React.FC<{
  x: number;
  y: number;
  r?: number;
  expr?: "feliz" | "nervosa" | "orgulhosa";
  capacete?: boolean;
  opacity?: number;
  brilho?: number;
}> = ({ x, y, r = 140, expr = "feliz", capacete = false, opacity = 1, brilho = 1 }) => {
  const f = useCurrentFrame();
  const piscar = f % 100 < 5;
  const treme = expr === "nervosa" ? Math.sin(f * 1.7) * 4 : 0;
  const bob = Math.sin(f * 0.08) * 8;
  return (
    <Svg>
      <g transform={`translate(${x + treme} ${y + bob})`} opacity={opacity}>
        <circle r={r * 1.5} fill="#FFF6C8" opacity={0.18 * brilho} />
        <circle r={r * 1.22} fill="#FFF6C8" opacity={0.18 * brilho} />
        <circle r={r} fill={LUA.cor} stroke={C.outline} strokeWidth={8} />
        <path d={`M ${r * 0.2} ${-r * 0.95} A ${r} ${r} 0 0 1 ${r * 0.2} ${r * 0.95} A ${r * 0.85} ${r * 0.95} 0 0 0 ${r * 0.2} ${-r * 0.95} Z`} fill={LUA.sombra} opacity={0.6} />
        {[
          [-0.45, -0.5, 0.16],
          [0.5, -0.35, 0.12],
          [0.35, 0.55, 0.18],
          [-0.55, 0.35, 0.1],
        ].map(([cx, cy, rr], i) => (
          <circle key={i} cx={cx * r} cy={cy * r} r={rr * r} fill={LUA.cratera} stroke={C.outline} strokeWidth={3} opacity={0.8} />
        ))}
        {/* olhos */}
        {[-0.3, 0.3].map((ex) => (
          <g key={ex}>
            <ellipse cx={ex * r} cy={-r * 0.08} rx={r * 0.13} ry={piscar ? 2 : r * (expr === "nervosa" ? 0.2 : 0.16)} fill={C.white} stroke={C.outline} strokeWidth={5} />
            {!piscar && <circle cx={ex * r + (expr === "nervosa" ? Math.sin(f * 0.6) * 6 : 3)} cy={-r * 0.06} r={r * 0.07} fill={C.outline} />}
          </g>
        ))}
        {/* boca */}
        {expr === "nervosa" ? (
          <path d={`M ${-r * 0.22} ${r * 0.3} q ${r * 0.075} ${-r * 0.08} ${r * 0.15} 0 t ${r * 0.15} 0 t ${r * 0.15} 0`} stroke={C.outline} strokeWidth={6} fill="none" strokeLinecap="round" />
        ) : (
          <path d={`M ${-r * 0.25} ${r * 0.25} Q 0 ${r * (expr === "orgulhosa" ? 0.55 : 0.48)} ${r * 0.25} ${r * 0.25}`} stroke={C.outline} strokeWidth={7} fill={expr === "orgulhosa" ? "#6B1E2B" : "none"} strokeLinecap="round" />
        )}
        <ellipse cx={-r * 0.5} cy={r * 0.2} rx={r * 0.12} ry={r * 0.07} fill="#FF9AA2" opacity={0.7} />
        <ellipse cx={r * 0.5} cy={r * 0.2} rx={r * 0.12} ry={r * 0.07} fill="#FF9AA2" opacity={0.7} />
        {expr === "nervosa" &&
          [0, 1].map((i) => {
            const t = ((f + i * 15) % 30) / 30;
            return <path key={i} d={`M ${r * (0.75 + i * 0.1)} ${-r * 0.4 + t * r * 0.5} q 10 18 0 26 q -10 -8 0 -26 z`} fill="#8FD3FF" stroke={C.outline} strokeWidth={3} opacity={1 - t} />;
          })}
        {capacete && (
          <g transform={`translate(0 ${-r * 0.78})`}>
            <path d={`M ${-r * 0.75} ${r * 0.12} Q ${-r * 0.75} ${-r * 0.55} 0 ${-r * 0.58} Q ${r * 0.75} ${-r * 0.55} ${r * 0.75} ${r * 0.12} Z`} fill={C.yellow} stroke={C.outline} strokeWidth={7} />
            <rect x={-r * 0.95} y={r * 0.05} width={r * 1.9} height={r * 0.17} rx={8} fill={C.orange} stroke={C.outline} strokeWidth={6} />
          </g>
        )}
      </g>
    </Svg>
  );
};

/** Nuvem de fumaça do "PUF" a partir do frame `at`. */
export const Poof: React.FC<{ x: number; y: number; at: number; r?: number }> = ({ x, y, at, r = 160 }) => {
  const f = useCurrentFrame();
  const t = (f - at) / 30;
  if (t < 0 || t > 1.4) return null;
  return (
    <Svg>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2 + hash(i, 1);
        const d = r * Math.sqrt(Math.min(1, t)) * (0.7 + hash(i, 2) * 0.6);
        const s = r * (0.35 + 0.25 * hash(i, 3)) * (0.6 + t * 0.6);
        return <circle key={i} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d} r={s} fill="#E8E6F0" stroke={C.outline} strokeWidth={5} opacity={interpolate(t, [0, 0.8, 1.4], [1, 0.9, 0])} />;
      })}
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const d = r * 1.6 * Math.min(1, t * 1.5);
        return <circle key={`s${i}`} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d} r={8} fill={C.yellow} opacity={interpolate(t, [0, 0.6], [1, 0], clamp)} />;
      })}
    </Svg>
  );
};

/** Céu noturno com campo: `luar` 1 = lua cheia iluminando, 0 = escuridão total (estrelas mais fortes). */
export const CeuNoturno: React.FC<{ luar: number; chao?: number }> = ({ luar, chao = 1330 }) => {
  const f = useCurrentFrame();
  const l = Math.max(0, Math.min(1, luar));
  const topo = `rgb(${Math.round(11 + 40 * l)},${Math.round(16 + 60 * l)},${Math.round(48 + 90 * l)})`;
  const base = `rgb(${Math.round(30 + 70 * l)},${Math.round(42 + 90 * l)},${Math.round(92 + 100 * l)})`;
  const campo = `rgb(${Math.round(15 + 40 * l)},${Math.round(30 + 70 * l)},${Math.round(30 + 40 * l)})`;
  return (
    <Svg>
      <defs>
        <linearGradient id="ceu-noite" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={topo} />
          <stop offset="1" stopColor={base} />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#ceu-noite)" />
      {Array.from({ length: 90 }).map((_, i) => {
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(f * 0.05 + i));
        return <circle key={i} cx={hash(i, 4) * 1080} cy={hash(i, 5) * (chao - 100)} r={1.5 + hash(i, 6) * 3} fill={C.white} opacity={tw * (0.35 + 0.65 * (1 - l))} />;
      })}
      <path d={`M -40 ${chao - 50} Q 260 ${chao - 160} 560 ${chao - 60} T 1120 ${chao - 90} L 1120 1960 L -40 1960 Z`} fill={campo} stroke={C.outline} strokeWidth={7} />
      {/* casinha com janela acesa */}
      <g transform={`translate(860 ${chao - 110})`}>
        <rect x={-70} y={-40} width={140} height={110} fill="#5A3B4E" stroke={C.outline} strokeWidth={6} />
        <path d="M -90 -40 L 0 -110 L 90 -40 Z" fill="#7A2E3A" stroke={C.outline} strokeWidth={6} strokeLinejoin="round" />
        <rect x={-25} y={-10} width={50} height={45} fill={C.yellow} stroke={C.outline} strokeWidth={5} />
      </g>
    </Svg>
  );
};

/** Feixe de lanterna saindo de (x, y), apontando no ângulo `ang` (graus). */
export const Lanterna: React.FC<{ x: number; y: number; ang?: number; on?: number }> = ({ x, y, ang = 0, on = 1 }) => {
  const f = useCurrentFrame();
  const fl = 0.85 + 0.15 * Math.sin(f * 0.9);
  return (
    <Svg>
      <defs>
        <linearGradient id="feixe" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFF6C8" stopOpacity={0.85} />
          <stop offset="1" stopColor="#FFF6C8" stopOpacity={0} />
        </linearGradient>
      </defs>
      <g transform={`translate(${x} ${y}) rotate(${ang})`} opacity={on * fl}>
        <path d="M 0 -12 L 520 -150 L 520 150 L 0 12 Z" fill="url(#feixe)" />
        <rect x={-46} y={-16} width={52} height={32} rx={8} fill="#4A5160" stroke={C.outline} strokeWidth={5} />
      </g>
    </Svg>
  );
};

/** Cartões de quiz/palpite com letra, cronômetro (timer 0..1) e destaque da resposta certa. */
export const QuizCards: React.FC<{
  opcoes: { letra: string; texto: string; cor: string; at: number }[];
  y: number;
  certa?: number[];
  revela?: number;
  timer?: number;
}> = ({ opcoes, y, certa = [], revela = -1, timer }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: y, display: "flex", flexDirection: "column", gap: 22 }}>
      {opcoes.map((o, i) => {
        const s = spring({ frame: f - o.at, fps, config: { damping: 11, stiffness: 200 } });
        const ok = revela >= 0 && f >= revela && certa.includes(i);
        const apaga = revela >= 0 && f >= revela && !certa.includes(i);
        const pulse = ok ? 1 + Math.sin((f - revela) * 0.4) * 0.03 : 1;
        return (
          <div
            key={o.letra}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              background: ok ? C.green : C.white,
              border: `8px solid ${C.outline}`,
              borderRadius: 30,
              padding: "14px 26px",
              boxShadow: `0 10px 0 ${C.outline}`,
              transform: `translateX(${(1 - s) * (i % 2 ? 900 : -900)}px) scale(${pulse})`,
              opacity: apaga ? 0.45 : 1,
            }}
          >
            <div style={{ width: 74, height: 74, borderRadius: 37, background: o.cor, border: `6px solid ${C.outline}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: TITLE_FONT, fontWeight: 800, fontSize: 50, color: C.white }}>
              {ok ? (
                <svg width={44} height={44} viewBox="0 0 44 44">
                  <path d="M 6 24 L 18 35 L 38 9" stroke={C.white} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                o.letra
              )}
            </div>
            <div style={{ fontFamily: BODY_FONT, fontWeight: 900, fontSize: 52, color: C.outline }}>{o.texto}</div>
          </div>
        );
      })}
      {timer !== undefined && timer > 0 && (
        <div style={{ height: 30, border: `6px solid ${C.outline}`, borderRadius: 20, background: C.white, overflow: "hidden" }}>
          <div style={{ width: `${Math.max(0, Math.min(1, timer)) * 100}%`, height: "100%", background: timer > 0.35 ? C.yellow : C.red }} />
        </div>
      )}
    </div>
  );
};

/** Terra vista de cima com a "barriga" de água das marés. puxaoLua 0..1 (some com a Lua). */
export const TerraMares: React.FC<{ cx: number; cy: number; r?: number; puxaoLua: number; lua: number; sol?: number }> = ({ cx, cy, r = 170, puxaoLua, lua, sol = 1 }) => {
  const f = useCurrentFrame();
  const forca = 0.46 * sol + 1.0 * puxaoLua;
  const stretch = 1 + 0.32 * (forca / 1.46);
  const rot = Math.sin(f * 0.02) * 2;
  const mx = cx - 380;
  return (
    <Svg>
      {/* água esticada na direção da Lua (horizontal) */}
      <ellipse cx={cx} cy={cy} rx={r * 1.22 * stretch} ry={r * 1.22 / Math.sqrt(stretch)} fill="#5AA9FF" stroke={C.outline} strokeWidth={7} opacity={0.9} transform={`rotate(${rot} ${cx} ${cy})`} />
      <circle cx={cx} cy={cy} r={r} fill="#3A86FF" stroke={C.outline} strokeWidth={7} />
      <path d={`M ${cx - 80} ${cy - 60} q 40 -50 100 -10 q 20 50 -40 80 q -70 0 -60 -70 z`} fill="#3DDC84" stroke={C.outline} strokeWidth={4} />
      <path d={`M ${cx + 40} ${cy + 40} q 50 -10 70 30 q -20 50 -70 30 z`} fill="#3DDC84" stroke={C.outline} strokeWidth={4} />
      {/* setas de puxão */}
      {puxaoLua > 0.05 && (
        <g opacity={puxaoLua}>
          <path d={`M ${cx - r * 1.5} ${cy} L ${mx + 170} ${cy}`} stroke={C.yellow} strokeWidth={22 * puxaoLua} strokeLinecap="round" />
          <path d={`M ${mx + 150} ${cy - 34} L ${mx + 110} ${cy} L ${mx + 150} ${cy + 34} Z`} fill={C.yellow} stroke={C.outline} strokeWidth={4} />
        </g>
      )}
      {sol > 0 && (
        <g>
          <path d={`M ${cx + r * 1.5} ${cy} L ${cx + r * 2.2} ${cy}`} stroke={C.orange} strokeWidth={11} strokeLinecap="round" />
          <path d={`M ${cx + r * 2.15} ${cy - 22} L ${cx + r * 2.4} ${cy} L ${cx + r * 2.15} ${cy + 22} Z`} fill={C.orange} stroke={C.outline} strokeWidth={4} />
        </g>
      )}
      {lua < 1 && <circle cx={mx} cy={cy} r={95} fill="none" stroke={C.white} strokeWidth={5} strokeDasharray="14 12" opacity={1 - lua} />}
    </Svg>
  );
};

/** Lobisomem triste com placa "DESEMPREGADO" (a piada do vídeo). */
export const Lobisomem: React.FC<{ x: number; y: number; s?: number; placa?: number; uiva?: number }> = ({ x, y, s = 1, placa = 1, uiva = 0 }) => {
  const f = useCurrentFrame();
  const lagr = ((f % 40) / 40) * 50;
  const cab = uiva * -25;
  return (
    <Svg>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        {/* corpo */}
        <path d="M -95 0 Q -110 -170 -60 -230 L 60 -230 Q 110 -170 95 0 Z" fill="#6E6A75" stroke={C.outline} strokeWidth={7} strokeLinejoin="round" />
        <path d="M -50 -200 Q 0 -150 50 -200 Q 30 -100 0 -90 Q -30 -100 -50 -200 Z" fill="#9A95A3" />
        <rect x={-80} y={-20} width={60} height={30} rx={14} fill="#5A5661" stroke={C.outline} strokeWidth={5} />
        <rect x={20} y={-20} width={60} height={30} rx={14} fill="#5A5661" stroke={C.outline} strokeWidth={5} />
        {/* cabeça */}
        <g transform={`rotate(${cab} 0 -240)`}>
          <path d="M -80 -300 L -95 -400 L -40 -340 Z" fill="#6E6A75" stroke={C.outline} strokeWidth={6} strokeLinejoin="round" />
          <path d="M 80 -300 L 95 -400 L 40 -340 Z" fill="#6E6A75" stroke={C.outline} strokeWidth={6} strokeLinejoin="round" />
          <ellipse cx={0} cy={-290} rx={95} ry={85} fill="#6E6A75" stroke={C.outline} strokeWidth={7} />
          <ellipse cx={0} cy={-250} rx={55} ry={40} fill="#9A95A3" stroke={C.outline} strokeWidth={5} />
          <ellipse cx={0} cy={-272} rx={18} ry={12} fill={C.outline} />
          {/* olhos tristes */}
          {[-38, 38].map((ex) => (
            <g key={ex}>
              <ellipse cx={ex} cy={-315} rx={17} ry={20} fill={C.yellow} stroke={C.outline} strokeWidth={4} />
              <circle cx={ex} cy={-310} r={7} fill={C.outline} />
              <path d={`M ${ex - 20} ${-345 + (ex < 0 ? 8 : 0)} L ${ex + 20} ${-345 + (ex < 0 ? 0 : 8)}`} stroke={C.outline} strokeWidth={6} strokeLinecap="round" />
            </g>
          ))}
          <circle cx={-40} cy={-290 + lagr} r={7} fill="#8FD3FF" opacity={1 - lagr / 50} />
          <path d={uiva > 0.5 ? "M -25 -232 Q 0 -200 25 -232 Z" : "M -22 -228 Q 0 -240 22 -228"} stroke={C.outline} strokeWidth={5} fill={uiva > 0.5 ? "#6B1E2B" : "none"} />
        </g>
        {/* placa */}
        {placa > 0 && (
          <g transform={`translate(0 ${-110}) scale(${placa}) rotate(${Math.sin(f * 0.1) * 3})`}>
            <line x1={-70} y1={-60} x2={-70} y2={60} stroke="#7A4A26" strokeWidth={10} />
            <rect x={-170} y={-60} width={340} height={110} rx={10} fill="#D9B07A" stroke={C.outline} strokeWidth={6} />
            <text x={0} y={-10} textAnchor="middle" fontFamily={TITLE_FONT} fontWeight={800} fontSize={40} fill={C.outline}>DESEMPREGADO</text>
            <text x={0} y={32} textAnchor="middle" fontFamily={BODY_FONT} fontWeight={900} fontSize={26} fill="#7A2E3A">aceito bico de noite</text>
          </g>
        )}
      </g>
    </Svg>
  );
};

/** Recife de corais sob o luar, soltando ovinhos (desova) quando `desova` > 0. */
export const Corais: React.FC<{ chao?: number; desova: number; luar?: number }> = ({ chao = 1330, desova, luar = 1 }) => {
  const f = useCurrentFrame();
  const cores = ["#FF7AB6", "#FF8C42", "#B69CFF", "#3DDC84", "#FFD23F"];
  return (
    <Svg>
      <defs>
        <linearGradient id="mar-fundo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1E4C8F" />
          <stop offset="1" stopColor="#0B2350" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#mar-fundo)" />
      {/* raios de luar na água */}
      {[200, 480, 760].map((x, i) => (
        <path key={i} d={`M ${x} 0 L ${x + 120} 0 L ${x + 260} ${chao} L ${x - 60} ${chao} Z`} fill="#FFF6C8" opacity={0.08 * luar + 0.03 * Math.sin(f * 0.05 + i)} />
      ))}
      <rect y={chao} width={1080} height={1920 - chao} fill="#E8D3A0" stroke={C.outline} strokeWidth={6} />
      {Array.from({ length: 7 }).map((_, i) => {
        const x = 80 + i * 150;
        const h = 160 + hash(i, 7) * 160;
        const c = cores[i % cores.length];
        const sw = Math.sin(f * 0.05 + i) * 4;
        return (
          <g key={i} transform={`rotate(${sw} ${x} ${chao})`}>
            <path d={`M ${x} ${chao} L ${x} ${chao - h} M ${x} ${chao - h * 0.5} L ${x - 50} ${chao - h * 0.8} M ${x} ${chao - h * 0.6} L ${x + 55} ${chao - h * 0.9}`} stroke={C.outline} strokeWidth={30} strokeLinecap="round" />
            <path d={`M ${x} ${chao} L ${x} ${chao - h} M ${x} ${chao - h * 0.5} L ${x - 50} ${chao - h * 0.8} M ${x} ${chao - h * 0.6} L ${x + 55} ${chao - h * 0.9}`} stroke={c} strokeWidth={20} strokeLinecap="round" />
          </g>
        );
      })}
      {desova > 0 &&
        Array.from({ length: 60 }).map((_, i) => {
          const x0 = 80 + (i % 7) * 150 + (hash(i, 8) - 0.5) * 80;
          const sub = ((f * (1.2 + hash(i, 9)) + hash(i, 10) * 900) % 900) * desova;
          return <circle key={`o${i}`} cx={x0 + Math.sin(f * 0.05 + i) * 20} cy={chao - 200 - sub} r={5 + hash(i, 11) * 5} fill={i % 2 ? "#FFB3D1" : "#FFF0F5"} opacity={0.9 * desova} />;
        })}
    </Svg>
  );
};

/** Terra com eixo inclinado (graus) que pode balançar (wobble em graus). */
export const TerraEixo: React.FC<{ cx: number; cy: number; r?: number; tilt?: number; wobble?: number }> = ({ cx, cy, r = 230, tilt = 23.4, wobble = 0 }) => {
  const f = useCurrentFrame();
  const ang = tilt + Math.sin(f * 0.12) * wobble;
  const off = (f * 1.2) % (r * 2);
  return (
    <Svg>
      <defs>
        <clipPath id="terra-eixo-clip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <g transform={`rotate(${ang} ${cx} ${cy})`}>
        <line x1={cx} y1={cy - r * 1.55} x2={cx} y2={cy + r * 1.55} stroke={C.red} strokeWidth={10} strokeLinecap="round" strokeDasharray="22 14" />
        <circle cx={cx} cy={cy} r={r} fill="#3A86FF" stroke={C.outline} strokeWidth={8} />
        <g clipPath="url(#terra-eixo-clip)">
          {[0, 1].map((k) => (
            <g key={k} transform={`translate(${off - k * r * 2} 0)`}>
              <path d={`M ${cx - r * 0.9} ${cy - r * 0.3} q ${r * 0.4} ${-r * 0.4} ${r * 0.7} 0 q ${r * 0.1} ${r * 0.5} ${-r * 0.3} ${r * 0.7} z`} fill="#3DDC84" stroke={C.outline} strokeWidth={4} />
              <path d={`M ${cx + r * 0.2} ${cy + r * 0.05} q ${r * 0.5} ${-r * 0.3} ${r * 0.7} ${r * 0.2} q ${-r * 0.2} ${r * 0.5} ${-r * 0.6} ${r * 0.4} z`} fill="#3DDC84" stroke={C.outline} strokeWidth={4} />
            </g>
          ))}
          <ellipse cx={cx} cy={cy - r * 0.92} rx={r * 0.55} ry={r * 0.16} fill={C.white} />
          <ellipse cx={cx} cy={cy + r * 0.92} rx={r * 0.55} ry={r * 0.16} fill={C.white} />
        </g>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.outline} strokeWidth={8} />
      </g>
      {/* linha vertical de referência e o ângulo */}
      <line x1={cx} y1={cy - r * 1.4} x2={cx} y2={cy - r * 1.05} stroke={C.white} strokeWidth={5} strokeDasharray="8 8" opacity={0.7} />
    </Svg>
  );
};
