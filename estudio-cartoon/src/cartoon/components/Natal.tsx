import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TITLE_FONT } from "../fonts";
import { C } from "../theme";

/**
 * Objetos natalinos e de confeitaria (vídeo "Por que o panetone só aparece no Natal?").
 * Todos vetoriais e animados por frame. Coordenadas no quadro inteiro (1080x1920).
 */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const hash = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const PAO = {
  crosta: "#B8661F",
  crostaClara: "#D98A3A",
  miolo: "#F7D58A",
  papel: "#8A4B2A",
  papelListra: "#C9A15A",
  passa: "#5A2A3A",
  fruta1: "#E23B3B",
  fruta2: "#3DBE5A",
  fruta3: "#FFB020",
  chocolate: "#4A2618",
};

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
    {children}
  </svg>
);

/** Panetone (base no ponto x,y). `rosto` dá olhos e boca (mascote); `chocolate` vira chocotone. */
export const Panetone: React.FC<{
  x: number;
  y: number;
  s?: number;
  rosto?: boolean;
  boca?: number;
  chocolate?: boolean;
  alto?: number;
  rot?: number;
}> = ({ x, y, s = 1, rosto = false, boca = 0, chocolate = false, alto = 1, rot = 0 }) => {
  const f = useCurrentFrame();
  const W = 120;
  const H = 120 * alto;
  const piscar = f % 90 < 5;
  const pontos = Array.from({ length: 14 }).map((_, i) => ({
    x: (hash(i, 1) - 0.5) * 190,
    y: -H - 20 - hash(i, 2) * 70 + Math.abs((hash(i, 1) - 0.5) * 190) * 0.35,
    c: chocolate ? PAO.chocolate : [PAO.passa, PAO.fruta1, PAO.fruta2, PAO.fruta3][i % 4],
  }));
  return (
    <Svg>
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
        {/* cúpula */}
        <path d={`M ${-W - 14} ${-H + 6} Q ${-W - 20} ${-H - 120} 0 ${-H - 130} Q ${W + 20} ${-H - 120} ${W + 14} ${-H + 6} Z`} fill={PAO.crostaClara} stroke={C.outline} strokeWidth={7} strokeLinejoin="round" />
        <path d={`M ${-W + 10} ${-H - 60} Q 0 ${-H - 150} ${W - 10} ${-H - 60} Q 0 ${-H - 100} ${-W + 10} ${-H - 60} Z`} fill={PAO.crosta} />
        <path d={`M -45 ${-H - 110} L 45 ${-H - 80} M 45 ${-H - 110} L -45 ${-H - 80}`} stroke="#7A3E12" strokeWidth={8} strokeLinecap="round" />
        {pontos.map((p, i) => (
          <rect key={i} x={p.x - 7} y={p.y - 7} width={14} height={12} rx={4} fill={p.c} stroke={C.outline} strokeWidth={2.5} />
        ))}
        {/* forma de papel */}
        <path d={`M ${-W} ${-H} L ${W} ${-H} L ${W - 6} 0 L ${-W + 6} 0 Z`} fill={PAO.papel} stroke={C.outline} strokeWidth={7} strokeLinejoin="round" />
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={i} x1={-W + 20 + i * 25} y1={-H + 6} x2={-W + 22 + i * 25} y2={-6} stroke={PAO.papelListra} strokeWidth={6} opacity={0.6} />
        ))}
        {rosto && (
          <g transform={`translate(0 ${-H - 40})`}>
            {[-45, 45].map((ex) => (
              <g key={ex}>
                <ellipse cx={ex} cy={-10} rx={20} ry={piscar ? 3 : 24} fill={C.white} stroke={C.outline} strokeWidth={5} />
                {!piscar && <circle cx={ex + 4} cy={-6} r={10} fill={C.outline} />}
              </g>
            ))}
            <path d={`M -34 28 Q 0 ${48 + boca * 30} 34 28 Q 0 ${36 + boca * 12} -34 28 Z`} fill="#6B1E2B" stroke={C.outline} strokeWidth={5} />
            <ellipse cx={-70} cy={22} rx={14} ry={8} fill="#FF8A80" opacity={0.7} />
            <ellipse cx={70} cy={22} rx={14} ry={8} fill="#FF8A80" opacity={0.7} />
          </g>
        )}
      </g>
    </Svg>
  );
};

/** Colomba pascal (pomba), base em x,y. */
export const Colomba: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useCurrentFrame();
  const asa = Math.sin(f * 0.25) * 6;
  return (
    <Svg>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        {/* cauda em leque */}
        <path d="M 150 -70 L 270 -170 L 290 -110 L 300 -40 L 160 -30 Z" fill={PAO.crosta} stroke={C.outline} strokeWidth={7} strokeLinejoin="round" />
        <path d="M 270 -170 L 200 -60 M 290 -110 L 210 -50" stroke="#7A3E12" strokeWidth={5} />
        {/* corpo */}
        <path d="M -150 -20 Q -175 -110 -100 -135 Q 0 -165 120 -120 Q 185 -90 170 -30 Q 160 -12 120 -10 L -110 -10 Q -140 -10 -150 -20 Z" fill={PAO.crostaClara} stroke={C.outline} strokeWidth={7} strokeLinejoin="round" />
        {/* cabeça e bico */}
        <circle cx={-160} cy={-150} r={58} fill={PAO.crostaClara} stroke={C.outline} strokeWidth={7} />
        <path d="M -212 -160 L -265 -140 L -210 -128 Z" fill={C.yellow} stroke={C.outline} strokeWidth={5} strokeLinejoin="round" />
        <circle cx={-172} cy={-162} r={9} fill={C.outline} />
        {/* asa levantada */}
        <path d={`M -40 -130 Q 0 ${-300 - asa} 110 ${-280 - asa} Q 80 -200 90 -125 Z`} fill={PAO.crosta} stroke={C.outline} strokeWidth={7} strokeLinejoin="round" />
        <path d={`M -10 -150 Q 40 ${-250 - asa} 90 ${-250 - asa}`} stroke="#7A3E12" strokeWidth={5} fill="none" />
        {/* forma de papel */}
        <path d="M -150 -20 L 175 -20 L 165 6 L -140 6 Z" fill={PAO.papel} stroke={C.outline} strokeWidth={6} />
        {/* açúcar e amêndoas por cima */}
        {Array.from({ length: 9 }).map((_, i) => (
          <ellipse key={i} cx={-110 + i * 28} cy={-128 - Math.sin((i / 8) * Math.PI) * 26} rx={10} ry={6} fill="#F5EBD8" stroke={C.outline} strokeWidth={2} />
        ))}
      </g>
    </Svg>
  );
};

/** Neve caindo (determinística). */
export const Neve: React.FC<{ n?: number; forca?: number }> = ({ n = 70, forca = 1 }) => {
  const f = useCurrentFrame();
  return (
    <Svg>
      {Array.from({ length: n }).map((_, i) => {
        const x = (hash(i, 3) * 1180 + Math.sin(f * 0.03 + i) * 30) % 1180 - 50;
        const y = (hash(i, 4) * 2000 + f * (2 + hash(i, 5) * 3)) % 2000 - 40;
        return <circle key={i} cx={x} cy={y} r={3 + hash(i, 6) * 6} fill={C.white} opacity={0.85 * forca} />;
      })}
    </Svg>
  );
};

/** Árvore de Natal com luzes piscando. Base em x,y. */
export const Arvore: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useCurrentFrame();
  const cores = [C.red, C.yellow, C.blue, C.pink, C.white];
  return (
    <Svg>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x={-25} y={-60} width={50} height={60} fill="#7A4A26" stroke={C.outline} strokeWidth={6} />
        {[0, 1, 2].map((k) => (
          <path key={k} d={`M ${-200 + k * 40} ${-60 - k * 130} L 0 ${-260 - k * 130} L ${200 - k * 40} ${-60 - k * 130} Z`} fill={k % 2 ? "#2E9E4F" : "#3DBE5A"} stroke={C.outline} strokeWidth={7} strokeLinejoin="round" />
        ))}
        {Array.from({ length: 16 }).map((_, i) => {
          const lx = (hash(i, 7) - 0.5) * (300 - (i % 3) * 60);
          const ly = -90 - (i % 3) * 130 - hash(i, 8) * 60;
          const on = (Math.floor(f / 8) + i) % 3 !== 0;
          return <circle key={i} cx={lx} cy={ly} r={11} fill={cores[i % cores.length]} stroke={C.outline} strokeWidth={3} opacity={on ? 1 : 0.35} />;
        })}
        <path d="M 0 -580 l 16 34 37 5 -27 25 7 37 -33 -18 -33 18 7 -37 -27 -25 37 -5 z" fill={C.yellow} stroke={C.outline} strokeWidth={5} transform={`rotate(${Math.sin(f * 0.1) * 6} 0 -530)`} />
      </g>
    </Svg>
  );
};

/** Folha de calendário. */
export const Calendario: React.FC<{ x: number; y: number; mes: string; dia: string; s?: number; destaque?: number; diaTam?: number }> = ({ x, y, mes, dia, s = 1, destaque = 0, diaTam = 150 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${s}) rotate(${Math.sin(f * 0.05) * 2}deg)` }}>
      <div style={{ width: 260, background: C.white, border: `8px solid ${C.outline}`, borderRadius: 24, overflow: "hidden", boxShadow: `0 10px 0 ${C.outline}` }}>
        <div style={{ background: C.red, color: C.white, fontFamily: TITLE_FONT, fontWeight: 800, fontSize: 52, textAlign: "center", padding: "6px 0", borderBottom: `6px solid ${C.outline}` }}>{mes}</div>
        <div style={{ position: "relative", fontFamily: TITLE_FONT, fontWeight: 800, fontSize: diaTam, color: C.outline, textAlign: "center", lineHeight: 1.1, minHeight: 165, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {dia}
          {destaque > 0 && (
            <svg width={260} height={170} style={{ position: "absolute", left: 0, top: 0 }}>
              <ellipse cx={130} cy={88} rx={100} ry={70} fill="none" stroke={C.red} strokeWidth={10} pathLength={1} strokeDasharray={`${destaque} 2`} transform="rotate(-8 130 88)" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

/** Mapa estilizado da Itália (bota) com alfinete em Milão. */
export const Italia: React.FC<{ x: number; y: number; s?: number; pin?: number }> = ({ x, y, s = 1, pin = 0 }) => {
  const f = useCurrentFrame();
  const bota =
    "M -180 -360 L -40 -385 L 60 -345 L 40 -290 L 10 -250 L 40 -180 L 110 -100 L 180 -20 L 255 30 L 235 70 L 315 115 L 340 170 L 295 180 L 235 125 L 205 170 L 185 250 L 130 305 L 105 265 L 140 200 L 90 130 L 20 40 L -60 -40 L -130 -150 L -205 -220 L -235 -285 Z";
  return (
    <Svg>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d={bota} fill="#5FB35A" stroke={C.outline} strokeWidth={8} strokeLinejoin="round" />
        <path d="M -180 -360 L -40 -385 L 60 -345" stroke="#EAF4FF" strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.8} />
        <path d="M 40 330 L 160 320 L 110 385 Z" fill="#5FB35A" stroke={C.outline} strokeWidth={6} strokeLinejoin="round" />
        <ellipse cx={-185} cy={70} rx={32} ry={62} fill="#5FB35A" stroke={C.outline} strokeWidth={6} />
        {pin > 0 && (
          <g transform={`translate(-115 ${-305 - (1 - pin) * 200 - Math.abs(Math.sin(f * 0.15)) * 14}) scale(${pin})`}>
            <path d="M 0 0 Q -40 -50 -40 -80 A 40 40 0 1 1 40 -80 Q 40 -50 0 0 Z" fill={C.red} stroke={C.outline} strokeWidth={6} />
            <circle cx={0} cy={-82} r={14} fill={C.white} />
          </g>
        )}
      </g>
    </Svg>
  );
};

/** Moldura de livro antigo (sépia) para contar a lenda. Os filhos usam coordenadas LOCAIS (0..w, 0..h). */
export const Pergaminho: React.FC<{ x: number; y: number; w: number; h: number; children: React.ReactNode; s?: number }> = ({ x, y, w, h, children, s = 1 }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `scale(${s})` }}>
    <div style={{ position: "absolute", inset: 0, background: "#F2DFB4", border: `8px solid ${C.outline}`, borderRadius: 30, boxShadow: `0 12px 0 ${C.outline}`, overflow: "hidden", filter: "sepia(0.55)" }}>
      <div style={{ position: "absolute", inset: 14, border: "4px dashed #B08A55", borderRadius: 20 }} />
      <div style={{ position: "absolute", inset: 0 }}>{children}</div>
    </div>
  </div>
);

/** Ajudante de cozinha "Toni" da lenda (personagem secundário simples). */
export const Toni: React.FC<{ x: number; y: number; s?: number; feliz?: number }> = ({ x, y, s = 1, feliz = 0 }) => {
  const f = useCurrentFrame();
  const b = Math.sin(f * 0.2) * 4;
  return (
    <Svg>
      <g transform={`translate(${x} ${y + b}) scale(${s})`}>
        <rect x={-60} y={-160} width={120} height={160} rx={40} fill={C.white} stroke={C.outline} strokeWidth={6} />
        <circle cx={0} cy={-220} r={62} fill="#E8B48A" stroke={C.outline} strokeWidth={6} />
        <path d="M -55 -262 Q -70 -340 -20 -330 Q 0 -370 30 -330 Q 75 -340 55 -262 Z" fill={C.white} stroke={C.outline} strokeWidth={6} />
        <circle cx={-22} cy={-228} r={7} fill={C.outline} />
        <circle cx={22} cy={-228} r={7} fill={C.outline} />
        <path d="M -30 -200 Q -15 -188 0 -198 Q 15 -188 30 -200" stroke={C.outline} strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d={`M -18 -182 Q 0 ${-172 + feliz * 10} 18 -182`} stroke={C.outline} strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>
    </Svg>
  );
};

/** Carimbo que "bate" na tela (frame `at`). */
export const Carimbo: React.FC<{ x: number; y: number; at: number; texto: string; cor?: string }> = ({ x, y, at, texto, cor = C.red }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 12, stiffness: 260 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(-14deg) scale(${2.2 - s * 1.2})`,
        opacity: Math.min(1, s * 2),
        border: `12px solid ${cor}`,
        borderRadius: 18,
        padding: "6px 34px",
        color: cor,
        fontFamily: TITLE_FONT,
        fontWeight: 800,
        fontSize: 110,
        letterSpacing: 6,
        background: "rgba(255,255,255,0.75)",
      }}
    >
      {texto}
    </div>
  );
};

/** Ingrediente com etiqueta de preço "$$$" balançando. tipo: manteiga | ovos | acucar | frutas. */
export const Ingrediente: React.FC<{ tipo: "manteiga" | "ovos" | "acucar" | "frutas"; x: number; y: number; s?: number; preco?: number }> = ({ tipo, x, y, s = 1, preco = 1 }) => {
  const f = useCurrentFrame();
  const sw = Math.sin(f * 0.15 + x) * 10;
  return (
    <Svg>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        {tipo === "manteiga" && (
          <g>
            <path d="M -90 -60 L 70 -60 L 100 -30 L 100 30 L -90 30 Z" fill="#FFE680" stroke={C.outline} strokeWidth={6} strokeLinejoin="round" />
            <path d="M -90 -60 L 70 -60 L 100 -30 L -60 -30 Z" fill="#FFF3B0" stroke={C.outline} strokeWidth={5} />
            <rect x={-90} y={-10} width={190} height={40} fill={C.white} stroke={C.outline} strokeWidth={5} />
            <text x={5} y={20} textAnchor="middle" fontFamily={TITLE_FONT} fontWeight={800} fontSize={26} fill={C.blue}>MANTEIGA</text>
          </g>
        )}
        {tipo === "ovos" &&
          [-55, 0, 55].map((dx, i) => <ellipse key={i} cx={dx} cy={-20 - (i === 1 ? 14 : 0)} rx={34} ry={44} fill="#FFF6E3" stroke={C.outline} strokeWidth={6} />)}
        {tipo === "acucar" && (
          <g>
            <path d="M -70 30 L -60 -90 Q 0 -110 60 -90 L 70 30 Z" fill={C.white} stroke={C.outline} strokeWidth={6} strokeLinejoin="round" />
            <text x={0} y={-15} textAnchor="middle" fontFamily={TITLE_FONT} fontWeight={800} fontSize={26} fill={C.red}>AÇÚCAR</text>
          </g>
        )}
        {tipo === "frutas" && (
          <g>
            <rect x={-60} y={-100} width={120} height={130} rx={20} fill="rgba(200,235,255,0.6)" stroke={C.outline} strokeWidth={6} />
            <rect x={-66} y={-118} width={132} height={26} rx={8} fill={C.red} stroke={C.outline} strokeWidth={5} />
            {Array.from({ length: 12 }).map((_, i) => (
              <rect key={i} x={-48 + (i % 4) * 26} y={-80 + Math.floor(i / 4) * 34} width={20} height={20} rx={5} fill={[PAO.fruta1, PAO.fruta2, PAO.fruta3][i % 3]} stroke={C.outline} strokeWidth={2} />
            ))}
          </g>
        )}
        {preco > 0 && (
          <g transform={`translate(70 -110) rotate(${sw}) scale(${preco})`}>
            <line x1={0} y1={0} x2={-20} y2={30} stroke={C.outline} strokeWidth={4} />
            <path d="M -10 0 L 70 0 L 90 25 L 70 50 L -10 50 Z" fill={C.yellow} stroke={C.outline} strokeWidth={5} strokeLinejoin="round" />
            <text x={38} y={36} textAnchor="middle" fontFamily={TITLE_FONT} fontWeight={800} fontSize={30} fill={C.green} stroke={C.outline} strokeWidth={1.5}>$$$</text>
          </g>
        )}
      </g>
    </Svg>
  );
};

/** Moedas caindo (de `at` em diante). */
export const Moedas: React.FC<{ at: number; n?: number }> = ({ at, n = 24 }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0) return null;
  return (
    <Svg>
      {Array.from({ length: n }).map((_, i) => {
        const x = 60 + hash(i, 9) * 960;
        const y = -60 + (t * (8 + hash(i, 10) * 8) + hash(i, 11) * 300) % 2000;
        const sx = Math.abs(Math.cos(f * 0.2 + i));
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${0.3 + sx * 0.7} 1)`}>
            <circle r={26} fill={C.yellow} stroke={C.outline} strokeWidth={5} />
            <text y={10} textAnchor="middle" fontFamily={TITLE_FONT} fontWeight={800} fontSize={30} fill={C.orange}>$</text>
          </g>
        );
      })}
    </Svg>
  );
};

/** Tigela com a massa crescendo (cresce 0..1). */
export const Tigela: React.FC<{ x: number; y: number; cresce: number; s?: number }> = ({ x, y, cresce, s = 1 }) => {
  const f = useCurrentFrame();
  const h = 30 + cresce * 170;
  const resp = Math.sin(f * 0.12) * 4 * cresce;
  return (
    <Svg>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d={`M -150 -60 Q -160 ${-60 - h - resp} 0 ${-60 - h - 20 - resp} Q 160 ${-60 - h - resp} 150 -60 Z`} fill="#FFF0C8" stroke={C.outline} strokeWidth={6} />
        {[-60, 0, 50].map((dx, i) => <circle key={i} cx={dx} cy={-60 - h * (0.5 + i * 0.12)} r={6} fill="#E8D3A0" />)}
        <path d="M -190 -70 L 190 -70 Q 170 60 0 70 Q -170 60 -190 -70 Z" fill={C.blue} stroke={C.outline} strokeWidth={7} strokeLinejoin="round" />
        <ellipse cx={0} cy={-70} rx={190} ry={22} fill="#5A9BFF" stroke={C.outline} strokeWidth={6} />
      </g>
    </Svg>
  );
};

/** Relógio com ponteiros girando (vel = voltas por segundo do ponteiro grande). */
export const Relogio: React.FC<{ x: number; y: number; vel: number; s?: number }> = ({ x, y, vel, s = 1 }) => {
  const f = useCurrentFrame();
  const a = f * vel * 12;
  return (
    <Svg>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <circle r={100} fill={C.white} stroke={C.outline} strokeWidth={9} />
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1={0} y1={-80} x2={0} y2={-68} stroke={C.outline} strokeWidth={6} transform={`rotate(${i * 30})`} />
        ))}
        <line x1={0} y1={0} x2={0} y2={-70} stroke={C.outline} strokeWidth={9} strokeLinecap="round" transform={`rotate(${a})`} />
        <line x1={0} y1={0} x2={0} y2={-45} stroke={C.red} strokeWidth={11} strokeLinecap="round" transform={`rotate(${a / 12})`} />
        <circle r={10} fill={C.outline} />
      </g>
    </Svg>
  );
};

/** Panetones pendurados de cabeça para baixo em espetos (balançando). */
export const PanetonesInvertidos: React.FC<{ y: number; n?: number; vis?: number }> = ({ y, n = 3, vis = 1 }) => {
  const f = useCurrentFrame();
  const xs = Array.from({ length: n }).map((_, i) => 540 + (i - (n - 1) / 2) * 300);
  return (
    <>
      <Svg>
        <rect x={60} y={y - 20} width={960} height={26} rx={10} fill="#9C6A3A" stroke={C.outline} strokeWidth={6} />
        <rect x={60} y={y - 20} width={30} height={500} fill="#9C6A3A" stroke={C.outline} strokeWidth={6} />
        <rect x={990} y={y - 20} width={30} height={500} fill="#9C6A3A" stroke={C.outline} strokeWidth={6} />
      </Svg>
      {xs.map((x, i) => {
        const sw = Math.sin(f * 0.1 + i) * 4;
        const k = interpolate(vis, [i * 0.2, i * 0.2 + 0.4], [0, 1], clamp);
        return (
          <div key={i} style={{ position: "absolute", inset: 0, opacity: k, transform: `rotate(${sw}deg)`, transformOrigin: `${x}px ${y}px` }}>
            <Svg>
              <line x1={x - 40} y1={y - 10} x2={x - 40} y2={y + 60} stroke="#C0C6CF" strokeWidth={8} />
              <line x1={x + 40} y1={y - 10} x2={x + 40} y2={y + 60} stroke="#C0C6CF" strokeWidth={8} />
            </Svg>
            <Panetone x={x} y={y + 20} s={0.85} rot={180} />
          </div>
        );
      })}
    </>
  );
};

/** Engrenagem girando. */
export const Engrenagem: React.FC<{ x: number; y: number; r: number; vel?: number; cor?: string }> = ({ x, y, r, vel = 1, cor = "#8A93A6" }) => {
  const f = useCurrentFrame();
  return (
    <Svg>
      <g transform={`translate(${x} ${y}) rotate(${f * 2 * vel})`}>
        {Array.from({ length: 10 }).map((_, i) => (
          <rect key={i} x={-r * 0.16} y={-r * 1.18} width={r * 0.32} height={r * 0.4} rx={4} fill={cor} stroke={C.outline} strokeWidth={5} transform={`rotate(${i * 36})`} />
        ))}
        <circle r={r} fill={cor} stroke={C.outline} strokeWidth={6} />
        <circle r={r * 0.35} fill="#5E6575" stroke={C.outline} strokeWidth={5} />
      </g>
    </Svg>
  );
};

/** Esteira de fábrica com panetones passando. */
export const Esteira: React.FC<{ y: number; vel?: number; colomba?: number }> = ({ y, vel = 4, colomba = 0 }) => {
  const f = useCurrentFrame();
  const off = (f * vel) % 300;
  return (
    <>
      <Svg>
        <rect x={-20} y={y} width={1120} height={50} rx={25} fill="#4A5160" stroke={C.outline} strokeWidth={7} />
        {Array.from({ length: 12 }).map((_, i) => (
          <circle key={i} cx={((i * 100 + f * vel) % 1200) - 60} cy={y + 25} r={16} fill="#8A93A6" stroke={C.outline} strokeWidth={4} />
        ))}
        <rect x={120} y={y + 50} width={30} height={200} fill="#4A5160" stroke={C.outline} strokeWidth={6} />
        <rect x={930} y={y + 50} width={30} height={200} fill="#4A5160" stroke={C.outline} strokeWidth={6} />
      </Svg>
      {[0, 1, 2, 3, 4].map((i) => {
        const x = -150 + i * 300 + off;
        const viraColomba = colomba > 0 && i % 2 === 0;
        return viraColomba ? (
          <div key={i} style={{ position: "absolute", inset: 0, opacity: colomba }}>
            <Colomba x={x} y={y} s={0.55} />
          </div>
        ) : (
          <Panetone key={i} x={x} y={y} s={0.6} />
        );
      })}
    </>
  );
};

/** Fundo: cozinha (azulejos + bancada). */
export const Cozinha: React.FC<{ bancada?: number }> = ({ bancada = 1320 }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#FFF3DC" />
    {Array.from({ length: 12 }).map((_, i) =>
      Array.from({ length: 16 }).map((__, j) => (
        <rect key={`${i}-${j}`} x={i * 92} y={j * 92} width={90} height={90} fill={(i + j) % 2 ? "#FFE7BF" : "#FFF3DC"} stroke="#F2D49B" strokeWidth={2} />
      )),
    )}
    <rect x={0} y={bancada} width={1080} height={1920 - bancada} fill="#B57A45" stroke={C.outline} strokeWidth={8} />
    <rect x={0} y={bancada} width={1080} height={28} fill="#D9985A" stroke={C.outline} strokeWidth={6} />
  </Svg>
);

/** Fundo: sala de Natal à noite (janela com neve e luzinhas). */
export const SalaNatal: React.FC<{ chao?: number }> = ({ chao = 1330 }) => {
  const f = useCurrentFrame();
  const cores = [C.red, C.yellow, C.green, C.blue, C.pink];
  return (
    <Svg>
      <defs>
        <linearGradient id="parede-natal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7A1E2B" />
          <stop offset="1" stopColor="#B83A3A" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#parede-natal)" />
      <rect x={640} y={330} width={330} height={420} rx={20} fill="#1B2A55" stroke={C.outline} strokeWidth={10} />
      {Array.from({ length: 18 }).map((_, i) => (
        <circle key={i} cx={660 + hash(i, 12) * 290} cy={350 + ((hash(i, 13) * 380 + f * 2) % 380)} r={4 + hash(i, 14) * 4} fill={C.white} />
      ))}
      <line x1={805} y1={330} x2={805} y2={750} stroke={C.outline} strokeWidth={10} />
      <line x1={640} y1={540} x2={970} y2={540} stroke={C.outline} strokeWidth={10} />
      <path d={`M -20 200 Q 270 290 540 200 T 1100 200`} stroke="#2E9E4F" strokeWidth={22} fill="none" />
      {Array.from({ length: 12 }).map((_, i) => {
        const x = i * 95 + 20;
        const y = 200 + Math.sin((i / 11) * Math.PI * 2) * 40 + 30;
        return <circle key={`l${i}`} cx={x} cy={y} r={13} fill={cores[i % cores.length]} stroke={C.outline} strokeWidth={4} opacity={(Math.floor(f / 6) + i) % 2 ? 1 : 0.4} />;
      })}
      <rect x={0} y={chao} width={1080} height={1920 - chao} fill="#6E3B2A" stroke={C.outline} strokeWidth={8} />
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={`t${i}`} x1={i * 200} y1={chao} x2={i * 200 - 80} y2={1920} stroke="#5A2E20" strokeWidth={6} />
      ))}
    </Svg>
  );
};
