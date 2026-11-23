import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";

/** Elementos do vídeo "Por que o dedo estala?" (SVG 1080x1920, contorno C.outline). */

const OL = { stroke: C.outline, strokeWidth: 7, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const PELE = "#C98B5E";

const Tela: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {children}
    </svg>
  </AbsoluteFill>
);

/**
 * Junta do dedo em CORTE (raio-x colorido): dois ossos, a cápsula e o líquido sinovial (azul).
 * `afasta` 0..1 separa os ossos; `bolha` 0..1 abre a bolha de gás de repente; `ploc` (frame) solta as ondas do som.
 */
export const Junta: React.FC<{ x: number; y: number; s?: number; afasta: number; bolha: number; ploc?: number }> = ({ x, y, s = 1, afasta, bolha, ploc = -999 }) => {
  const f = useCurrentFrame();
  const d = afasta * 70;
  const t = f - ploc;
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        {/* pele/dedo em volta */}
        <rect x={-190} y={-520 - d} width={380} height={1040 + 2 * d} rx={190} fill={PELE} opacity={0.35} {...OL} strokeWidth={8} />
        {/* cápsula */}
        <ellipse cx={0} cy={0} rx={190} ry={120 + d} fill="#fff3e0" {...OL} strokeWidth={8} />
        {/* líquido */}
        <ellipse cx={0} cy={0} rx={165} ry={80 + d} fill="#7cc8f2" opacity={0.85} />
        {/* bolha de gás */}
        {bolha > 0 && <ellipse cx={0} cy={0} rx={30 + bolha * 110} ry={12 + bolha * (40 + d * 0.6)} fill="#ffffff" stroke="#9fd8ff" strokeWidth={6} />}
        {/* ossos */}
        <path d={`M-110 ${-500 - d} L110 ${-500 - d} L120 ${-70 - d} Q 0 ${-20 - d} -120 ${-70 - d} Z`} fill="#f5ead2" {...OL} strokeWidth={8} />
        <path d={`M-120 ${70 + d} Q 0 ${20 + d} 120 ${70 + d} L110 ${500 + d} L-110 ${500 + d} Z`} fill="#f5ead2" {...OL} strokeWidth={8} />
        {/* ondas do PLOC */}
        {t >= 0 && t < 24 &&
          [0, 1, 2].map((i) => {
            const r = 140 + (t + i * 6) * 14;
            return <circle key={i} r={r} fill="none" stroke={C.yellow} strokeWidth={12 - i * 3} opacity={Math.max(0, 1 - (t + i * 6) / 30)} />;
          })}
      </g>
    </Tela>
  );
};

/** Ventosa num vidro (comparação): `puxa` 0..1; solta no fim com "ploc". */
export const Ventosa: React.FC<{ x: number; y: number; s?: number; puxa: number }> = ({ x, y, s = 1, puxa }) => {
  const solta = puxa >= 1;
  const dx = solta ? 120 : puxa * 40;
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x={-260} y={-300} width={60} height={600} rx={10} fill="#bfe6ff" opacity={0.8} {...OL} strokeWidth={6} />
        <path d="M-245 -260 L-215 -200 M-245 120 L-215 180" stroke="#fff" strokeWidth={10} strokeLinecap="round" />
        <g transform={`translate(${dx} 0)`}>
          <path d={`M-200 -110 Q ${-140 + puxa * 30} 0 -200 110 Q -100 ${60 - puxa * 30} -60 0 Q -100 ${-60 + puxa * 30} -200 -110 Z`} fill="#ff6b8a" {...OL} />
          <rect x={-70} y={-20} width={160} height={40} rx={20} fill="#ff6b8a" {...OL} />
          <circle cx={110} cy={0} r={45} fill="#ff8fa8" {...OL} />
        </g>
      </g>
    </Tela>
  );
};

/** Tela de ressonância (MRI) com o dedo estalando ao vivo e a gravação "REC". */
export const Ressonancia: React.FC<{ x: number; y: number; s?: number; afasta: number; bolha: number }> = ({ x, y, s = 1, afasta, bolha }) => {
  const f = useCurrentFrame();
  const d = afasta * 40;
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x={-330} y={-330} width={660} height={660} rx={40} fill="#263238" {...OL} strokeWidth={10} />
        <rect x={-290} y={-290} width={580} height={580} rx={20} fill="#0d1418" />
        <g opacity={0.9}>
          <rect x={-70} y={-270 - d} width={140} height={230} rx={60} fill="#cfd8dc" />
          <rect x={-70} y={40 + d} width={140} height={230} rx={60} fill="#cfd8dc" />
          <ellipse cx={0} cy={0} rx={90} ry={40 + d} fill="#455a64" />
          {bolha > 0 && <ellipse cx={0} cy={0} rx={20 + bolha * 55} ry={8 + bolha * 25} fill="#000" />}
        </g>
        <circle cx={-230} cy={-240} r={14} fill={f % 30 < 18 ? C.red : "#5a1a1a"} />
        <text x={-205} y={-228} fontSize={34} fontWeight={800} fill="#fff" fontFamily="'Baloo 2'">
          REC
        </text>
        <text x={240} y={260} textAnchor="end" fontSize={34} fontWeight={800} fill="#9fd8ff" fontFamily="'DejaVu Sans Mono', monospace">
          2015
        </text>
      </g>
    </Tela>
  );
};

/** Relógio com contagem até 20 minutos. `p` 0..1. */
export const Relogio20: React.FC<{ x: number; y: number; s?: number; p: number }> = ({ x, y, s = 1, p }) => (
  <Tela>
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={220} fill="#fff" {...OL} strokeWidth={12} />
      <path d={`M0 0 L0 -200 A 200 200 0 ${p * 120 > 180 ? 1 : 0} 1 ${Math.sin((p * 120 * Math.PI) / 180) * 200} ${-Math.cos((p * 120 * Math.PI) / 180) * 200} Z`} fill="#ffd23f" opacity={0.8} />
      {Array.from({ length: 12 }).map((_, i) => (
        <path key={i} d={`M${Math.sin((i * Math.PI) / 6) * 175} ${-Math.cos((i * Math.PI) / 6) * 175} L${Math.sin((i * Math.PI) / 6) * 200} ${-Math.cos((i * Math.PI) / 6) * 200}`} stroke={C.outline} strokeWidth={8} />
      ))}
      <path d={`M0 0 L${Math.sin((p * 120 * Math.PI) / 180) * 160} ${-Math.cos((p * 120 * Math.PI) / 180) * 160}`} stroke={C.red} strokeWidth={12} strokeLinecap="round" />
      <circle r={16} fill={C.outline} />
      <text y={300} textAnchor="middle" fontSize={90} fontWeight={800} fill={C.outline} fontFamily="'Baloo 2'">
        {Math.round(p * 20)} MIN
      </text>
    </g>
  </Tela>
);

/** Duas mãos (esquerda estalando, direita não) + troféu do Ig Nobel. `anos` 0..60 contador; `trofeu` mostra o prêmio. */
export const DuasMaos: React.FC<{ x: number; y: number; s?: number; anos: number; trofeu?: boolean; ok?: boolean }> = ({ x, y, s = 1, anos, trofeu = false, ok = false }) => {
  const f = useCurrentFrame();
  const mao = (dx: number, estala: boolean) => (
    <g transform={`translate(${dx} 0)`}>
      {[-75, -25, 25, 75].map((fx, i) => (
        <rect key={i} x={fx - 22} y={-260 + Math.abs(fx) * 0.4} width={44} height={200} rx={22} fill={PELE} {...OL} strokeWidth={6} />
      ))}
      <rect x={-110} y={-90} width={220} height={210} rx={60} fill={PELE} {...OL} strokeWidth={6} />
      {estala && f % 30 < 10 && <text x={0} y={-290} textAnchor="middle" fontSize={46} fontWeight={800} fill={C.yellow} stroke={C.outline} strokeWidth={6} paintOrder="stroke" fontFamily="'Baloo 2'">ploc!</text>}
      {ok && <text x={0} y={200} textAnchor="middle" fontSize={64} fontWeight={800} fill={C.green} stroke={C.outline} strokeWidth={6} paintOrder="stroke" fontFamily="'Baloo 2'">OK ✔</text>}
    </g>
  );
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        {mao(-200, true)}
        {mao(200, false)}
        <text x={-200} y={-340} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.outline} fontFamily="'Baloo 2'">ESTALA</text>
        <text x={200} y={-340} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.outline} fontFamily="'Baloo 2'">NÃO ESTALA</text>
        <text x={0} y={-420} textAnchor="middle" fontSize={80} fontWeight={800} fill={C.violet} fontFamily="'Baloo 2'">{Math.max(1, Math.round(anos))} {Math.max(1, Math.round(anos)) === 1 ? "ANO" : "ANOS"}</text>
        {trofeu && (
          <g transform="translate(0 330)">
            <path d="M-90 -120 L90 -120 Q 90 20 0 40 Q -90 20 -90 -120 Z" fill={C.yellow} {...OL} />
            <path d="M-90 -100 Q -150 -90 -130 -30 Q -110 0 -80 -20 M90 -100 Q 150 -90 130 -30 Q 110 0 80 -20" fill="none" {...OL} />
            <rect x={-20} y={40} width={40} height={50} fill={C.yellow} {...OL} strokeWidth={5} />
            <rect x={-80} y={90} width={160} height={40} rx={8} fill="#8d5524" {...OL} strokeWidth={5} />
          </g>
        )}
      </g>
    </Tela>
  );
};

/** Pote de pepino abrindo: `abre` 0..1 (tampa sobe e gira); ao abrir, "PLOC!". */
export const PotePepino: React.FC<{ x: number; y: number; s?: number; abre: number }> = ({ x, y, s = 1, abre }) => (
  <Tela>
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-150} y={-180} width={300} height={360} rx={40} fill="#c8e6c9" opacity={0.85} {...OL} strokeWidth={8} />
      {[[-60, -60], [40, -90], [-30, 40], [60, 60]].map(([px, py], i) => (
        <ellipse key={i} cx={px} cy={py} rx={34} ry={70} fill="#66bb6a" {...OL} strokeWidth={5} transform={`rotate(${i * 25} ${px} ${py})`} />
      ))}
      <g transform={`translate(0 ${-200 - abre * 90}) rotate(${abre * -25})`}>
        <rect x={-165} y={-40} width={330} height={70} rx={16} fill="#e53935" {...OL} strokeWidth={8} />
      </g>
    </g>
  </Tela>
);
