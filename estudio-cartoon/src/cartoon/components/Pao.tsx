import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";

/** Elementos do vídeo "Por que o pão fica duro?" (SVG 1080x1920, contorno C.outline). */

const OL = { stroke: C.outline, strokeWidth: 7, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

const Tela: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {children}
    </svg>
  </AbsoluteFill>
);

/**
 * Pão francês com carinha. `duro` 0..1: perde o brilho, ganha rachaduras e cara emburrada;
 * `quente` liga a fumacinha; `bate` (frame) faz o "TOC TOC" de pão duro.
 */
export const Pao: React.FC<{ x: number; y: number; s?: number; duro?: number; quente?: boolean; rot?: number; rosto?: boolean }> = ({ x, y, s = 1, duro = 0, quente = false, rot = 0, rosto = true }) => {
  const f = useCurrentFrame();
  const cor = duro > 0.5 ? "#c58a45" : "#e8a85a";
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
        {quente &&
          [0, 1, 2].map((i) => {
            const q = ((f + i * 14) % 42) / 42;
            return <path key={i} d={`M${-120 + i * 120} ${-120 - q * 160} q 25 -30 0 -60 q -25 -30 0 -60`} fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={(1 - q) * 0.9} />;
          })}
        <path d="M-300 20 Q -320 -110 -150 -130 Q 0 -150 150 -130 Q 320 -110 300 20 Q 280 120 0 120 Q -280 120 -300 20 Z" fill={cor} {...OL} strokeWidth={9} />
        <path d="M-300 20 Q -280 100 0 105 Q 280 100 300 20" fill="none" stroke="#b77a3a" strokeWidth={8} opacity={0.6} />
        {[-150, -30, 90].map((cx, i) => (
          <path key={i} d={`M${cx - 50} -95 Q ${cx} -140 ${cx + 60} -100`} fill="none" stroke="#f6d39a" strokeWidth={14} strokeLinecap="round" />
        ))}
        {duro > 0 && (
          <g stroke="#7a4a20" strokeWidth={6} fill="none" opacity={duro} strokeLinecap="round">
            <path d="M-220 -60 l 30 30 l -10 30 l 25 25" />
            <path d="M200 -40 l -25 30 l 20 25" />
            <path d="M40 60 l 20 -25 l 25 15" />
          </g>
        )}
        {rosto && (
          <g transform="translate(0 -10)">
            <circle cx={-60} cy={-10} r={16} fill={C.outline} />
            <circle cx={60} cy={-10} r={16} fill={C.outline} />
            {duro > 0.5 ? (
              <>
                <path d="M-90 -50 L-35 -35 M90 -50 L35 -35" stroke={C.outline} strokeWidth={9} strokeLinecap="round" />
                <path d="M-30 50 L30 50" stroke={C.outline} strokeWidth={9} strokeLinecap="round" />
              </>
            ) : (
              <path d="M-35 35 Q 0 65 35 35" fill="none" stroke={C.outline} strokeWidth={9} strokeLinecap="round" />
            )}
            <ellipse cx={-110} cy={30} rx={22} ry={12} fill="#ff8a8a" opacity={duro > 0.5 ? 0 : 0.7} />
            <ellipse cx={110} cy={30} rx={22} ry={12} fill="#ff8a8a" opacity={duro > 0.5 ? 0 : 0.7} />
          </g>
        )}
      </g>
    </Tela>
  );
};

/**
 * Grãos de amido por dentro do pão. `incha` 0..1: bebem água (gotinhas entram, ficam redondos e grandes);
 * `cristal` 0..1: se arrumam de novo em fileiras apertadas (duros, angulosos).
 */
export const Amido: React.FC<{ x: number; y: number; s?: number; incha: number; cristal: number }> = ({ x, y, s = 1, incha, cristal }) => {
  const f = useCurrentFrame();
  const n = 12;
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x={-380} y={-380} width={760} height={760} rx={50} fill="#fff6e3" {...OL} strokeWidth={10} />
        {Array.from({ length: n }).map((_, i) => {
          const col = i % 4;
          const lin = Math.floor(i / 4);
          // posição "solta" (inchado) x posição em fileira (cristal)
          const lx = -240 + col * 160 + Math.sin(i * 2.1 + f * 0.05) * 30 * (1 - cristal);
          const ly = -200 + lin * 200 + Math.cos(i * 1.7 + f * 0.05) * 30 * (1 - cristal);
          const cx = -195 + col * 130;
          const cy = -130 + lin * 130;
          const px = lx + (cx - lx) * cristal;
          const py = ly + (cy - ly) * cristal;
          const r = 34 + incha * 34 - cristal * 18;
          return (
            <g key={i} transform={`translate(${px} ${py}) rotate(${cristal * 45})`}>
              {cristal > 0.5 ? (
                <rect x={-r} y={-r} width={r * 2} height={r * 2} rx={6} fill="#e7c98f" {...OL} strokeWidth={5} />
              ) : (
                <circle r={r} fill={incha > 0.3 ? "#f8e3b6" : "#efd29a"} {...OL} strokeWidth={5} />
              )}
              {incha > 0.2 && cristal < 0.5 && <circle cx={-r * 0.3} cy={-r * 0.3} r={r * 0.25} fill="#9fd8ff" opacity={0.8} />}
            </g>
          );
        })}
        {incha > 0 && incha < 1 &&
          [0, 1, 2, 3, 4].map((i) => {
            const q = ((f + i * 9) % 36) / 36;
            return <path key={i} d={`M${-300 + i * 150} ${-420 + q * 200} q 14 22 0 30 q -14 -8 0 -30 Z`} fill="#4FC3F7" stroke="#0277BD" strokeWidth={3} opacity={1 - q} />;
          })}
      </g>
    </Tela>
  );
};

/** Eletrodoméstico aberto com o pão dentro: "geladeira" (azul-claro, com gelinho) ou "freezer" (branco, com neve e gelo). */
export const Gelado: React.FC<{ x: number; y: number; s?: number; tipo: "geladeira" | "freezer"; duroPao?: number }> = ({ x, y, s = 1, tipo, duroPao = 0 }) => {
  const f = useCurrentFrame();
  const freezer = tipo === "freezer";
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x={-300} y={-380} width={600} height={720} rx={40} fill={freezer ? "#f2f7fb" : "#dff1ff"} {...OL} strokeWidth={10} />
        <rect x={-260} y={-340} width={520} height={640} rx={20} fill={freezer ? "#cfe6f5" : "#eef8ff"} {...OL} strokeWidth={6} />
        <path d="M-260 -40 L260 -40" stroke={C.outline} strokeWidth={6} />
        {freezer &&
          [0, 1, 2, 3, 4, 5].map((i) => {
            const q = ((f * 0.6 + i * 17) % 100) / 100;
            return <text key={i} x={-220 + i * 85} y={-320 + q * 600} fontSize={38} fill="#fff" stroke="#9fc8e6" strokeWidth={2}>❄</text>;
          })}
        {freezer && <path d="M-260 -340 L260 -340 L240 -300 L200 -330 L150 -290 L100 -330 L40 -295 L-20 -330 L-80 -290 L-140 -330 L-200 -295 L-260 -330 Z" fill="#fff" {...OL} strokeWidth={4} />}
      </g>
      <g transform={`translate(${x} ${y + 150 * s}) scale(${0.55 * s})`}>
        <path d="M-300 20 Q -320 -110 -150 -130 Q 0 -150 150 -130 Q 320 -110 300 20 Q 280 120 0 120 Q -280 120 -300 20 Z" fill={duroPao > 0.5 ? "#c58a45" : "#e8a85a"} {...OL} strokeWidth={12} />
        {freezer && <rect x={-320} y={-160} width={640} height={300} rx={60} fill="#dff3ff" opacity={0.45} />}
      </g>
    </Tela>
  );
};

/** Forno aberto com luz quente, o pão dentro e um borrifador de água. `luz` 0..1. */
export const Forno: React.FC<{ x: number; y: number; s?: number; luz: number; borrifa?: boolean }> = ({ x, y, s = 1, luz, borrifa = false }) => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x={-340} y={-300} width={680} height={560} rx={36} fill="#90a4ae" {...OL} strokeWidth={10} />
        <rect x={-290} y={-220} width={580} height={420} rx={24} fill={`rgb(${Math.round(60 + 195 * luz)},${Math.round(40 + 120 * luz)},${Math.round(30 + 20 * luz)})`} {...OL} strokeWidth={6} />
        {[-200, -60, 80, 220].map((cx, i) => (
          <circle key={i} cx={cx} cy={-262} r={16} fill="#37474f" {...OL} strokeWidth={4} />
        ))}
        <path d="M-260 150 L260 150" stroke="#555" strokeWidth={8} />
        {luz > 0.3 &&
          [0, 1, 2, 3].map((i) => (
            <path key={i} d={`M${-200 + i * 130} 170 q 15 -${20 + Math.sin(f * 0.5 + i) * 10} 0 -40`} fill="none" stroke="#ffb74d" strokeWidth={8} opacity={luz} />
          ))}
      </g>
      {borrifa && (
        <g transform={`translate(${x + 330 * s} ${y - 330 * s}) scale(${s}) rotate(-25)`}>
          <rect x={-40} y={0} width={80} height={150} rx={20} fill="#4fc3f7" {...OL} />
          <rect x={-30} y={-50} width={70} height={60} rx={10} fill="#eceff1" {...OL} strokeWidth={5} />
          <path d="M40 -30 L80 -30" stroke={C.outline} strokeWidth={10} />
          {[0, 1, 2, 3].map((i) => {
            const q = ((f + i * 6) % 20) / 20;
            return <circle key={i} cx={90 + q * 120} cy={-30 + (i - 1.5) * 18 * q} r={8} fill="#4fc3f7" opacity={1 - q} />;
          })}
        </g>
      )}
    </Tela>
  );
};
