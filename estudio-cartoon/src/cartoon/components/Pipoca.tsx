import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";

/** Elementos do vídeo "Por que a pipoca estoura?" (SVG 1080x1920, contorno C.outline). */

const W = 1080;
const H = 1920;
const OL = { stroke: C.outline, strokeWidth: 7, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

const Tela: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {children}
    </svg>
  </AbsoluteFill>
);

/** Formato do grão (gota invertida, ponta embaixo). */
const GRAO = "M0 -150 C 120 -150 150 -40 120 50 C 90 130 30 170 0 175 C -30 170 -90 130 -120 50 C -150 -40 -120 -150 0 -150 Z";

/** Pipoca estourada: nuvem branca com uns pedacinhos amarelos da casca. */
const NuvemPipoca: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    {[
      [0, -40, 110],
      [-95, 10, 85],
      [95, 10, 85],
      [-50, 80, 80],
      [55, 85, 78],
      [-70, -95, 70],
      [75, -95, 72],
      [0, -130, 65],
    ].map(([x, y, r], i) => (
      <circle key={i} cx={x} cy={y} r={r} fill="#FFFDF5" {...OL} />
    ))}
    {[
      [0, -40, 100],
      [-90, 10, 76],
      [90, 10, 76],
      [-50, 78, 70],
      [55, 82, 68],
      [-70, -95, 60],
      [75, -95, 62],
      [0, -128, 56],
    ].map(([x, y, r], i) => (
      <circle key={`i${i}`} cx={x} cy={y} r={r} fill="#FFFDF5" />
    ))}
    <path d="M-30 130 Q 0 165 30 130 L 18 100 L -18 100 Z" fill="#F9A825" {...OL} strokeWidth={5} />
    <path d="M-60 -20 Q -40 -40 -20 -20 M30 40 Q 50 20 70 40" fill="none" stroke="#E8DFC8" strokeWidth={6} strokeLinecap="round" />
  </g>
);

/** Carinha simples (olhos + boca) para grãos e pipocas. */
const Carinha: React.FC<{ y?: number; humor?: "feliz" | "tenso" | "triste" | "susto" }> = ({ y = 0, humor = "feliz" }) => (
  <g transform={`translate(0 ${y})`}>
    <ellipse cx={-38} cy={-10} rx={13} ry={humor === "susto" ? 20 : 16} fill={C.outline} />
    <ellipse cx={38} cy={-10} rx={13} ry={humor === "susto" ? 20 : 16} fill={C.outline} />
    <circle cx={-34} cy={-15} r={4} fill="#fff" />
    <circle cx={42} cy={-15} r={4} fill="#fff" />
    {humor === "feliz" && <path d="M-26 25 Q 0 50 26 25" fill="none" {...OL} strokeWidth={7} />}
    {humor === "tenso" && <path d="M-30 32 L-15 22 L0 32 L15 22 L30 32" fill="none" {...OL} strokeWidth={6} />}
    {humor === "triste" && <path d="M-24 40 Q 0 20 24 40" fill="none" {...OL} strokeWidth={7} />}
    {humor === "susto" && <ellipse cx={0} cy={34} rx={16} ry={20} fill={C.outline} />}
    {humor === "tenso" && <path d="M-70 -50 q -10 25 0 35 q 10 -10 0 -35" fill="#81D4FA" stroke={C.outline} strokeWidth={4} />}
  </g>
);

/**
 * O GRÃO de pipoca em corte: casca amarela grossa, amido claro e gotinhas d'água dentro.
 * `corte` 0..1 mostra o interior; `vapor` 0..1 transforma as gotas em vapor agitado;
 * `pressao` 0..1 incha e treme; `estouro` (frame local) vira pipoca; `furos` faz casca porosa (milho comum) com vapor vazando.
 */
export const GraoPipoca: React.FC<{
  x: number;
  y: number;
  s?: number;
  corte?: number;
  vapor?: number;
  pressao?: number;
  estouro?: number;
  furos?: boolean;
  seco?: boolean;
  humor?: "feliz" | "tenso" | "triste" | "susto";
  rosto?: boolean;
  destaqueCasca?: boolean;
}> = ({ x, y, s = 1, corte = 0, vapor = 0, pressao = 0, estouro = -999, furos = false, seco = false, humor = "feliz", rosto = true, destaqueCasca = false }) => {
  const f = useCurrentFrame();
  const t = f - estouro;
  if (estouro > -999 && t >= 0) {
    const pop = t < 10 ? 0.4 + (t / 10) * 0.9 : 1.3 - Math.min(0.3, (t - 10) * 0.03);
    return (
      <Tela>
        <g transform={`translate(${x} ${y}) scale(${s * pop}) rotate(${Math.sin(t * 0.08) * 4})`}>
          <NuvemPipoca s={1.15} />
          {rosto && <Carinha y={-30} humor="feliz" />}
          {t < 12 && (
            <g stroke={C.yellow} strokeWidth={14} strokeLinecap="round" opacity={1 - t / 12}>
              {Array.from({ length: 10 }).map((_, i) => {
                const a = (i / 10) * Math.PI * 2;
                const r1 = 230 + t * 12;
                return <path key={i} d={`M${Math.cos(a) * r1} ${Math.sin(a) * r1} L${Math.cos(a) * (r1 + 70)} ${Math.sin(a) * (r1 + 70)}`} />;
              })}
            </g>
          )}
        </g>
      </Tela>
    );
  }
  const treme = pressao > 0.5 ? Math.sin(f * 2.3) * (pressao - 0.5) * 16 : 0;
  const infla = 1 + pressao * 0.12;
  const encolhe = seco ? 0.82 : 1;
  return (
    <Tela>
      <g transform={`translate(${x + treme} ${y}) scale(${s * infla * encolhe} ${s * (1 + pressao * 0.06) * encolhe})`}>
        <path d={GRAO} fill={seco ? "#C99A2E" : "#FBC02D"} {...OL} strokeWidth={destaqueCasca ? 14 : 9} />
        {destaqueCasca && <path d={GRAO} fill="none" stroke="#FF7043" strokeWidth={6} strokeDasharray="20 14" transform="scale(1.1)" />}
        {/* interior (corte) */}
        {corte > 0 && (
          <g opacity={corte}>
            <path d={GRAO} transform="scale(0.78)" fill={seco ? "#E6D3A8" : "#FFF8E1"} stroke="#E0A800" strokeWidth={4} />
            {!seco &&
              Array.from({ length: 7 }).map((_, i) => {
                const bx = [-50, 40, -10, 60, -60, 20, -20][i];
                const by = [-60, -50, 0, 30, 50, 80, -100][i];
                const ag = Math.sin(f * (0.3 + vapor * 0.6) + i * 2) * (8 + vapor * 26);
                const ag2 = Math.cos(f * (0.27 + vapor * 0.5) + i) * (6 + vapor * 22);
                return (
                  <g key={i} transform={`translate(${bx + ag} ${by + ag2})`}>
                    {vapor < 1 && <path d="M0 -22 Q 16 0 0 16 Q -16 0 0 -22 Z" fill="#29B6F6" stroke="#0277BD" strokeWidth={3} opacity={1 - vapor} />}
                    {vapor > 0 && (
                      <g opacity={vapor}>
                        <circle r={14} fill="#ECEFF1" stroke="#90A4AE" strokeWidth={3} />
                        <circle cx={12} cy={-8} r={10} fill="#ECEFF1" stroke="#90A4AE" strokeWidth={3} />
                      </g>
                    )}
                  </g>
                );
              })}
            {seco && <text x={0} y={20} textAnchor="middle" fontSize={44} fontWeight={800} fill="#A1887F" fontFamily="'Baloo 2'">seco</text>}
          </g>
        )}
        {furos && (
          <g>
            {[
              [-100, -60],
              [95, -40],
              [-80, 70],
              [70, 90],
              [0, -140],
            ].map(([hx, hy], i) => {
              const q = ((f + i * 9) % 36) / 36;
              const dx = hx * (0.4 + q);
              const dy = hy * (0.4 + q);
              return (
                <g key={i}>
                  <circle cx={hx} cy={hy} r={12} fill={C.outline} />
                  {vapor > 0 && <circle cx={hx + dx} cy={hy + dy} r={12 + q * 18} fill="#ECEFF1" stroke="#90A4AE" strokeWidth={3} opacity={(1 - q) * vapor} />}
                </g>
              );
            })}
          </g>
        )}
        {rosto && corte < 0.5 && <Carinha y={0} humor={humor} />}
        {pressao > 0.7 && (
          <g stroke={C.outline} strokeWidth={5} fill="none" opacity={(pressao - 0.7) / 0.3}>
            <path d="M-40 -150 l 10 30 l -14 20 l 12 26" />
            <path d="M90 -90 l -20 20 l 6 22" />
          </g>
        )}
      </g>
    </Tela>
  );
};

/** Panela no fogão com tampa que pula; `fogo` 0..1, `pulos` liga a tampa pulando, `pipocas` quantas saltam. */
export const PanelaPipoca: React.FC<{ x: number; y: number; s?: number; fogo?: number; pulos?: boolean; pipocas?: number }> = ({ x, y, s = 1, fogo = 1, pulos = false, pipocas = 0 }) => {
  const f = useCurrentFrame();
  const tampa = pulos ? -Math.abs(Math.sin(f * 0.6)) * 50 : 0;
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        {/* fogão */}
        <rect x={-330} y={150} width={660} height={60} rx={14} fill="#90A4AE" {...OL} />
        {fogo > 0 &&
          [-160, -80, 0, 80, 160].map((fx, i) => {
            const h = (60 + Math.sin(f * 0.5 + i * 1.7) * 18) * fogo;
            return (
              <g key={i} transform={`translate(${fx} 150)`}>
                <path d={`M-28 0 Q -30 ${-h * 0.6} 0 ${-h} Q 30 ${-h * 0.6} 28 0 Z`} fill="#FF7043" stroke="#E64A19" strokeWidth={4} />
                <path d={`M-14 0 Q -14 ${-h * 0.35} 0 ${-h * 0.6} Q 14 ${-h * 0.35} 14 0 Z`} fill="#FFD54F" />
              </g>
            );
          })}
        {/* panela */}
        <path d="M-280 -120 L280 -120 L250 90 Q 0 120 -250 90 Z" fill="#B0BEC5" {...OL} strokeWidth={10} />
        <rect x={-380} y={-100} width={110} height={36} rx={18} fill="#455A64" {...OL} />
        <rect x={270} y={-100} width={110} height={36} rx={18} fill="#455A64" {...OL} />
        <path d="M-230 -40 L230 -40" stroke="#ECEFF1" strokeWidth={14} strokeLinecap="round" />
        {/* pipocas pulando */}
        {Array.from({ length: pipocas }).map((_, i) => {
          const per = 26 + (i % 4) * 5;
          const q = ((f + i * 11) % per) / per;
          const px = -180 + ((i * 97) % 360) + (i % 2 ? 1 : -1) * q * 60;
          const py = -140 - Math.sin(q * Math.PI) * (260 + (i % 3) * 80);
          return (
            <g key={i} transform={`translate(${px} ${py}) rotate(${q * 360 * (i % 2 ? 1 : -1)})`}>
              <NuvemPipoca s={0.28} />
            </g>
          );
        })}
        {/* tampa */}
        <g transform={`translate(0 ${-120 + tampa}) rotate(${pulos ? Math.sin(f * 0.9) * 6 : 0})`}>
          <path d="M-300 0 Q 0 -110 300 0 Z" fill="#CFD8DC" {...OL} strokeWidth={10} />
          <rect x={-40} y={-90} width={80} height={36} rx={18} fill="#455A64" {...OL} />
        </g>
      </g>
    </Tela>
  );
};

/** Manômetro (relógio de pressão). `p` 0..1 leva o ponteiro do verde ao vermelho. */
export const Manometro: React.FC<{ x: number; y: number; s?: number; p: number }> = ({ x, y, s = 1, p }) => {
  const f = useCurrentFrame();
  const a = -120 + p * 240 + (p > 0.85 ? Math.sin(f * 2) * 5 : 0);
  const arco = (a0: number, a1: number, cor: string) => {
    const r = 120;
    const rad = (g: number) => ((g - 90) * Math.PI) / 180;
    return (
      <path
        d={`M${Math.cos(rad(a0)) * r} ${Math.sin(rad(a0)) * r} A ${r} ${r} 0 0 1 ${Math.cos(rad(a1)) * r} ${Math.sin(rad(a1)) * r}`}
        fill="none"
        stroke={cor}
        strokeWidth={30}
      />
    );
  };
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x={-24} y={150} width={48} height={90} fill="#90A4AE" {...OL} />
        <circle r={175} fill="#ECEFF1" {...OL} strokeWidth={12} />
        {arco(-120, -40, "#66BB6A")}
        {arco(-40, 40, "#FFCA28")}
        {arco(40, 120, "#EF5350")}
        <g transform={`rotate(${a})`}>
          <path d="M-10 0 L0 -140 L10 0 Z" fill={C.outline} />
        </g>
        <circle r={20} fill={C.outline} />
        <text x={0} y={95} textAnchor="middle" fontSize={40} fontWeight={800} fill={C.outline} fontFamily="'Baloo 2'">
          PRESSÃO
        </text>
      </g>
    </Tela>
  );
};

/** Mapa simplificado da América do Sul com o Peru destacado e um pino. */
export const MapaPeru: React.FC<{ x: number; y: number; s?: number; pino?: number }> = ({ x, y, s = 1, pino = 1 }) => (
  <Tela>
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M-120 -330 Q -20 -360 60 -310 Q 160 -290 230 -210 Q 300 -130 270 -40 Q 230 60 150 120 Q 90 200 40 300 Q 0 360 -40 330 Q -80 250 -90 150 Q -110 30 -170 -60 Q -230 -150 -200 -250 Q -170 -310 -120 -330 Z"
        fill="#A5D6A7"
        {...OL}
        strokeWidth={9}
      />
      <path d="M-200 -250 Q -170 -310 -120 -330 Q -90 -260 -60 -200 Q -50 -120 -90 -60 Q -130 -40 -170 -60 Q -230 -150 -200 -250 Z" fill="#EF5350" {...OL} strokeWidth={7} />
      <text x={-130} y={-140} textAnchor="middle" fontSize={40} fontWeight={800} fill="#fff" fontFamily="'Baloo 2'" stroke={C.outline} strokeWidth={2}>
        PERU
      </text>
      <g transform={`translate(-120 ${-220 - (1 - pino) * 200})`} opacity={pino}>
        <path d="M0 0 Q -50 -60 -50 -100 A 50 50 0 1 1 50 -100 Q 50 -60 0 0 Z" fill={C.yellow} {...OL} />
        <circle cx={0} cy={-100} r={20} fill="#fff" {...OL} strokeWidth={5} />
      </g>
    </g>
  </Tela>
);

/** Vaso de barro antigo com pipocas dentro e um pincel de arqueólogo. */
export const VasoAntigo: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        {[-90, -10, 70].map((px, i) => (
          <g key={i} transform={`translate(${px} -190) rotate(${i * 30})`}>
            <NuvemPipoca s={0.32} />
          </g>
        ))}
        <path d="M-120 -170 Q -200 -60 -150 80 Q -100 160 0 160 Q 100 160 150 80 Q 200 -60 120 -170 Z" fill="#A1622F" {...OL} strokeWidth={10} />
        <rect x={-140} y={-200} width={280} height={44} rx={16} fill="#8D5524" {...OL} />
        <path d="M-150 0 L150 0 M-140 50 L140 50" stroke="#6D3F18" strokeWidth={8} strokeDasharray="30 18" />
        <path d="M-60 -60 l 30 30 l 30 -30 l 30 30" fill="none" stroke="#FFE0B2" strokeWidth={8} />
        <g transform={`translate(230 ${-60 + Math.sin(f * 0.4) * 30}) rotate(-35)`}>
          <rect x={-12} y={-150} width={24} height={150} rx={10} fill="#8D6E63" {...OL} strokeWidth={5} />
          <path d="M-22 0 L22 0 L18 70 L-18 70 Z" fill="#FFE082" {...OL} strokeWidth={5} />
        </g>
      </g>
    </Tela>
  );
};

/** Folha de prova com nota e gotas de suor; no fim vira pipoca (piada da conclusão). */
export const FolhaProva: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <Tela>
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(-6)`}>
      <rect x={-170} y={-220} width={340} height={440} rx={14} fill="#fff" {...OL} strokeWidth={8} />
      <text x={0} y={-150} textAnchor="middle" fontSize={60} fontWeight={800} fill={C.outline} fontFamily="'Baloo 2'">
        PROVA
      </text>
      {[-80, -20, 40, 100, 160].map((ly) => (
        <path key={ly} d={`M-130 ${ly} L130 ${ly}`} stroke="#90CAF9" strokeWidth={6} />
      ))}
      <text x={110} y={-60} textAnchor="middle" fontSize={56} fontWeight={800} fill={C.red} fontFamily="'Baloo 2'">
        ?
      </text>
    </g>
  </Tela>
);
