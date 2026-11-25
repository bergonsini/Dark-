import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";

/** Elementos do vídeo "Por que o sol faz espirrar?" (SVG 1080x1920, contorno C.outline). */

const OL = { stroke: C.outline, strokeWidth: 7, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const FONTE = "'Baloo 2'";

const Tela: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {children}
    </svg>
  </AbsoluteFill>
);

/** Rua em frente ao cinema num dia de sol forte: prédio do cinema com letreiro, calçada e raios de sol. `luz` 0..1 clareia tudo. */
export const RuaCinema: React.FC<{ luz?: number }> = ({ luz = 1 }) => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <rect width={1080} height={1920} fill="#8FD3FF" />
      {/* raios */}
      <g transform="translate(900 250)" opacity={0.35 * luz}>
        {Array.from({ length: 10 }).map((_, i) => (
          <path key={i} d="M0 0 L-60 -900 L60 -900 Z" fill="#FFF3A0" transform={`rotate(${i * 36 + f * 0.4})`} />
        ))}
      </g>
      {/* cinema */}
      <rect x={60} y={520} width={620} height={860} fill="#B0413E" {...OL} />
      <rect x={30} y={480} width={680} height={70} rx={12} fill="#7A2B2A" {...OL} />
      <rect x={110} y={600} width={520} height={150} rx={16} fill="#FFF6E3" {...OL} />
      <text x={370} y={705} textAnchor="middle" fontSize={96} fontWeight={800} fill={C.red} fontFamily={FONTE}>
        CINEMA
      </text>
      {Array.from({ length: 12 }).map((_, i) => (
        <circle key={i} cx={130 + i * 44} cy={780} r={10} fill={(Math.floor(f / 6) + i) % 2 ? C.yellow : "#FFF6B0"} {...OL} strokeWidth={3} />
      ))}
      <rect x={200} y={1000} width={340} height={380} fill="#3a2a2a" {...OL} />
      <path d="M370 1000 L370 1380" stroke={C.outline} strokeWidth={7} />
      <rect x={120} y={850} width={150} height={110} rx={8} fill="#FFD23F" {...OL} strokeWidth={5} />
      <rect x={470} y={850} width={150} height={110} rx={8} fill="#7EC8FF" {...OL} strokeWidth={5} />
      {/* calçada */}
      <rect x={0} y={1380} width={1080} height={540} fill="#D8D0C2" />
      <rect x={0} y={1374} width={1080} height={12} fill={C.outline} />
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x={i * 200} y={1386} width={6} height={540} fill="#BDB3A2" />
      ))}
      <rect width={1080} height={1920} fill="#FFFBE0" opacity={0.25 * luz} />
    </Tela>
  );
};

/** Jato de gotinhas do espirro saindo de (x,y) para a direita (ou esquerda com `dir=-1`). Dura ~20 frames a partir de `at`. */
export const Gotinhas: React.FC<{ x: number; y: number; at: number; dir?: number; s?: number }> = ({ x, y, at, dir = 1, s = 1 }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > 22) return null;
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${dir * s} ${s})`}>
        {Array.from({ length: 12 }).map((_, i) => {
          const a = ((i - 5.5) / 12) * 1.1;
          const d = 40 + t * (18 + (i % 4) * 5);
          return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={9 - (i % 3) * 2} fill="#BFE9FF" stroke="#5EB8F2" strokeWidth={3} opacity={1 - t / 22} />;
        })}
        {[0, 1, 2].map((i) => (
          <path key={`l${i}`} d={`M${30 + t * 6} ${(i - 1) * 40} L${90 + t * 14} ${(i - 1) * 70}`} stroke={C.outline} strokeWidth={6} strokeLinecap="round" opacity={1 - t / 22} />
        ))}
      </g>
    </Tela>
  );
};

/** Carinha redonda simples (amigo). `espirra` = frame do atchim (olhos fecham, cabeça dá tranco). `oculos` escuros. */
export const Carinha: React.FC<{ x: number; y: number; s?: number; pele?: string; cabelo?: string; espirra?: number; oculos?: boolean }> = ({ x, y, s = 1, pele = "#F2C9A6", cabelo = "#3a2414", espirra = -999, oculos = false }) => {
  const f = useCurrentFrame();
  const t = f - espirra;
  const prep = t > -14 && t < 0 ? (t + 14) / 14 : 0;
  const tranco = t >= 0 && t < 10 ? 1 - t / 10 : 0;
  const fechado = prep > 0.4 || tranco > 0;
  return (
    <Tela>
      <g transform={`translate(${x} ${y + tranco * 30}) scale(${s}) rotate(${-prep * 10 + tranco * 14})`}>
        <circle r={110} fill={pele} {...OL} />
        <path d="M-105 -20 Q -115 -130 0 -125 Q 115 -130 105 -20 Q 80 -80 0 -75 Q -80 -80 -105 -20 Z" fill={cabelo} {...OL} />
        {oculos ? (
          <g>
            <rect x={-80} y={-20} width={70} height={46} rx={14} fill="#1F1B2E" />
            <rect x={10} y={-20} width={70} height={46} rx={14} fill="#1F1B2E" />
            <path d="M-10 0 L10 0" stroke={C.outline} strokeWidth={6} />
          </g>
        ) : (
          [-1, 1].map((l) =>
            fechado ? (
              <path key={l} d={`M${l * 40 - 18} 2 Q ${l * 40} 14 ${l * 40 + 18} 2`} fill="none" stroke={C.outline} strokeWidth={7} strokeLinecap="round" />
            ) : (
              <g key={l}>
                <ellipse cx={l * 40} cy={0} rx={18} ry={22} fill="#fff" stroke={C.outline} strokeWidth={5} />
                <circle cx={l * 40 + 3} cy={2} r={9} fill={C.outline} />
              </g>
            ),
          )
        )}
        <ellipse cx={0} cy={36} rx={14 + prep * 6} ry={10} fill="#E9A27E" stroke={C.outline} strokeWidth={4} />
        {tranco > 0 || prep > 0.3 ? <ellipse cx={0} cy={72} rx={22} ry={8 + prep * 14 + tranco * 10} fill="#6b1020" stroke={C.outline} strokeWidth={4} /> : <path d="M-22 70 Q 0 84 22 70" fill="none" stroke={C.outline} strokeWidth={6} strokeLinecap="round" />}
      </g>
    </Tela>
  );
};

/**
 * Cabeça de perfil (olhando para a direita) em corte, com dois "fios": o nervo do OLHO (azul) e o nervo do ESPIRRO (vermelho,
 * vai até o nariz). Os dois passam coladinhos no meio. `luz` 0..1 = bolinha de luz correndo pelo azul; `vaza` 0..1 = faísca
 * pulando pro vermelho e correndo até o nariz; `atchim` mostra o nariz piscando.
 */
export const CabecaNervos: React.FC<{ x: number; y: number; s?: number; luz: number; vaza: number; atchim?: boolean }> = ({ x, y, s = 1, luz, vaza, atchim = false }) => {
  const f = useCurrentFrame();
  // caminho azul: olho (230,-40) → cruzamento (0,30) → fundo do cérebro (-200,-60)
  const azul = (k: number): [number, number] => (k < 0.5 ? [230 - 460 * k, -40 + 140 * k] : [0 - 400 * (k - 0.5), 30 - 180 * (k - 0.5)]);
  // vermelho: cruzamento (10,50) → nariz (300,90)
  const verm = (k: number): [number, number] => [10 + 290 * k, 50 + 40 * k];
  const [lx, ly] = azul(Math.min(0.5, luz));
  const [vx, vy] = verm(vaza);
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M-260 60 Q -300 -220 -60 -300 Q 180 -340 260 -150 Q 290 -90 270 -40 Q 330 40 330 90 Q 300 120 270 120 Q 280 200 210 230 Q 120 260 80 330 L-120 330 Q -110 240 -180 200 Q -260 160 -260 60 Z" fill="#F2C9A6" {...OL} strokeWidth={10} />
        <path d="M-210 -80 Q -200 -250 -20 -270 Q 170 -280 220 -130 Q 120 -170 0 -150 Q -120 -140 -210 -80 Z" fill="#FFB3C7" opacity={0.85} {...OL} strokeWidth={6} />
        {/* olho */}
        <ellipse cx={240} cy={-40} rx={30} ry={36} fill="#fff" {...OL} strokeWidth={6} />
        <circle cx={252} cy={-38} r={14} fill={C.outline} />
        {/* nervos */}
        <path d="M230 -40 L0 30 L-200 -60" fill="none" stroke="#3A86FF" strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-180 120 L10 50 L300 90" fill="none" stroke="#FF4D4D" strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
        <text x={-230} y={-100} fontSize={52} fontWeight={800} fill="#2F6FE0" fontFamily={FONTE}>
          OLHO
        </text>
        <text x={-250} y={180} fontSize={52} fontWeight={800} fill={C.red} fontFamily={FONTE}>
          ESPIRRO
        </text>
        {/* bolinha de luz */}
        {luz > 0 && luz < 1 && <circle cx={lx} cy={ly} r={22 + Math.sin(f * 0.6) * 4} fill={C.yellow} {...OL} strokeWidth={4} />}
        {/* faísca */}
        {vaza > 0 && (
          <g>
            <path d="M0 30 l 14 -22 l 6 20 l 16 -14" fill="none" stroke={C.yellow} strokeWidth={8} strokeLinecap="round" />
            {vaza < 1 && <circle cx={vx} cy={vy} r={22} fill={C.orange} {...OL} strokeWidth={4} />}
          </g>
        )}
        {atchim && <circle cx={320} cy={92} r={40 + Math.sin(f * 0.8) * 8} fill={C.yellow} opacity={0.6} />}
      </g>
    </Tela>
  );
};

/** As letras A·C·H·O·O pulando uma de cada vez (a partir de `at`), com o significado embaixo em letra miúda. */
export const LetrasAchoo: React.FC<{ y: number; at: number }> = ({ y, at }) => {
  const f = useCurrentFrame();
  const letras = ["A", "C", "H", "O", "O"];
  const cores = [C.red, C.orange, C.yellow, C.green, C.blue];
  return (
    <Tela>
      {letras.map((l, i) => {
        const t = f - at - i * 4;
        if (t < 0) return null;
        const pulo = Math.max(0, Math.sin(Math.min(1, t / 10) * Math.PI)) * 60;
        return (
          <text key={i} x={180 + i * 180} y={y - pulo} textAnchor="middle" fontSize={210} fontWeight={800} fill={cores[i]} stroke={C.outline} strokeWidth={12} paintOrder="stroke" fontFamily={FONTE}>
            {l}
          </text>
        );
      })}
    </Tela>
  );
};

/** Busto de Aristóteles (mármore, barba, faixa na cabeça) com pergaminho e um "?" — `espirra` = frame do atchim. */
export const Aristoteles: React.FC<{ x: number; y: number; s?: number; espirra?: number }> = ({ x, y, s = 1, espirra = -999 }) => {
  const f = useCurrentFrame();
  const t = f - espirra;
  const tranco = t >= 0 && t < 10 ? 1 - t / 10 : 0;
  const M = "#EDE7DC";
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x={-170} y={250} width={340} height={70} rx={10} fill="#CFC6B6" {...OL} />
        <path d="M-220 250 Q -200 120 -90 90 L90 90 Q 200 120 220 250 Z" fill={M} {...OL} />
        <path d="M-150 250 Q -100 150 40 110" fill="none" stroke="#C9BFAE" strokeWidth={8} />
        <g transform={`rotate(${tranco * 12})`}>
          <circle cy={-60} r={120} fill={M} {...OL} />
          <path d="M-110 -40 Q -120 130 0 150 Q 120 130 110 -40 Q 60 30 0 30 Q -60 30 -110 -40 Z" fill="#DCD4C6" {...OL} />
          <path d="M-115 -110 Q 0 -150 115 -110" fill="none" stroke="#8FB07A" strokeWidth={18} strokeLinecap="round" />
          {[-1, 1].map((l) =>
            tranco > 0 ? (
              <path key={l} d={`M${l * 42 - 16} -50 Q ${l * 42} -40 ${l * 42 + 16} -50`} fill="none" stroke={C.outline} strokeWidth={6} />
            ) : (
              <ellipse key={l} cx={l * 42} cy={-50} rx={12} ry={8} fill="#CFC6B6" stroke={C.outline} strokeWidth={4} />
            ),
          )}
          <path d="M0 -40 L-14 10 L12 10" fill="none" stroke={C.outline} strokeWidth={5} strokeLinejoin="round" />
          {tranco > 0 && <ellipse cx={0} cy={48} rx={20} ry={18} fill="#6b1020" stroke={C.outline} strokeWidth={4} />}
        </g>
        <g transform={`translate(210 -30) rotate(10)`}>
          <rect x={-60} y={-90} width={120} height={180} rx={10} fill="#F2DFB4" {...OL} strokeWidth={6} />
          <text y={30} textAnchor="middle" fontSize={110} fontWeight={800} fill={C.red} fontFamily={FONTE}>
            ?
          </text>
        </g>
        <text y={300} textAnchor="middle" fontSize={40} fontWeight={800} fill={C.outline} fontFamily={FONTE}>
          ~350 a.C.
        </text>
      </g>
    </Tela>
  );
};
