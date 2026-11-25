import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";

/** Elementos do vídeo "Por que a barriga ronca?" (SVG 1080x1920, contorno C.outline). */

const OL = { stroke: C.outline, strokeWidth: 7, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const FONTE = "'Baloo 2'";

const Tela: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {children}
    </svg>
  </AbsoluteFill>
);

/** Sala de aula em dia de prova: parede, lousa "PROVA / SILÊNCIO!", relógio andando e chão de taco. */
export const SalaProva: React.FC<{ lousa?: string }> = ({ lousa = "PROVA" }) => {
  const f = useCurrentFrame();
  const ang = f * 6;
  return (
    <Tela>
      <rect width={1080} height={1920} fill="#CDEBD9" />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={i * 130 - 20} y={0} width={60} height={1360} fill="#BFE3CE" />
      ))}
      <rect x={0} y={1330} width={1080} height={590} fill="#D9A066" />
      {Array.from({ length: 8 }).map((_, i) => (
        <path key={i} d={`M0 ${1380 + i * 75} L1080 ${1380 + i * 75}`} stroke="#C28A52" strokeWidth={5} />
      ))}
      <rect x={0} y={1320} width={1080} height={22} fill="#8A5A36" />
      {/* lousa */}
      <rect x={110} y={390} width={860} height={440} rx={18} fill="#8A5A36" {...OL} />
      <rect x={135} y={415} width={810} height={390} rx={10} fill="#2F5D4A" />
      <text x={540} y={560} textAnchor="middle" fontSize={120} fontWeight={800} fill="#F2F2E8" fontFamily={FONTE} opacity={0.92}>
        {lousa}
      </text>
      <text x={540} y={700} textAnchor="middle" fontSize={78} fontWeight={800} fill="#FFD9A0" fontFamily={FONTE} opacity={0.9}>
        SILÊNCIO!
      </text>
      <path d="M220 750 q 40 -20 80 0" stroke="#F2F2E8" strokeWidth={5} fill="none" opacity={0.6} />
      <rect x={760} y={815} width={90} height={18} rx={6} fill="#fff" />
      {/* relógio */}
      <g transform="translate(900 250)">
        <circle r={70} fill="#fff" {...OL} />
        <path d={`M0 0 L${Math.sin((ang * Math.PI) / 180) * 50} ${-Math.cos((ang * Math.PI) / 180) * 50}`} stroke={C.red} strokeWidth={6} strokeLinecap="round" />
        <path d="M0 0 L0 -36" stroke={C.outline} strokeWidth={9} strokeLinecap="round" />
        <circle r={8} fill={C.outline} />
      </g>
    </Tela>
  );
};

/** Carteira escolar vista de frente (tampo + pés), com a folha de prova em cima. Desenhe DEPOIS do personagem para cobrir as pernas. */
export const Carteira: React.FC<{ x: number; y: number; s?: number; folha?: boolean }> = ({ x, y, s = 1, folha = true }) => (
  <Tela>
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-230} y={0} width={460} height={60} rx={12} fill="#E0A458" {...OL} />
      <rect x={-210} y={60} width={420} height={240} fill="#C98B4A" {...OL} />
      <rect x={-200} y={300} width={30} height={160} fill="#7a7f8a" {...OL} strokeWidth={6} />
      <rect x={170} y={300} width={30} height={160} fill="#7a7f8a" {...OL} strokeWidth={6} />
      {folha && (
        <g transform="translate(40 -8) rotate(-4)">
          <rect x={-90} y={-14} width={180} height={26} rx={4} fill="#fff" {...OL} strokeWidth={5} />
        </g>
      )}
      <rect x={-150} y={-24} width={90} height={14} rx={7} fill={C.yellow} {...OL} strokeWidth={4} transform="rotate(-8 -105 -17)" />
    </g>
  </Tela>
);

/**
 * Colega de classe (cabeça + ombros atrás da própria carteira). `olha` -1..1 vira os olhos para o lado
 * (negativo = esquerda); `choque` 0..1 arregala os olhos e abre a boca em "O".
 */
export const Colega: React.FC<{ x: number; y: number; s?: number; olha?: number; choque?: number; pele?: string; cabelo?: string; camisa?: string }> = ({
  x,
  y,
  s = 1,
  olha = 0,
  choque = 0,
  pele = "#F2C9A6",
  cabelo = "#3a2414",
  camisa = C.blue,
}) => {
  const rEye = 22 + choque * 8;
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M-140 260 Q -140 120 0 120 Q 140 120 140 260 Z" fill={camisa} {...OL} />
        <circle cx={0} cy={0} r={120} fill={pele} {...OL} />
        <path d="M-120 -10 Q -130 -140 0 -135 Q 130 -140 120 -10 Q 90 -90 0 -85 Q -90 -90 -120 -10 Z" fill={cabelo} {...OL} />
        {[-1, 1].map((l) => (
          <g key={l} transform={`translate(${l * 42} 10)`}>
            <ellipse rx={rEye} ry={rEye + 4} fill="#fff" {...OL} strokeWidth={5} />
            <circle cx={olha * 10} cy={2} r={10} fill={C.outline} />
          </g>
        ))}
        {choque > 0.3 ? <ellipse cx={0} cy={70} rx={16} ry={10 + choque * 14} fill="#6b1020" {...OL} strokeWidth={5} /> : <path d="M-20 70 L20 70" stroke={C.outline} strokeWidth={7} strokeLinecap="round" />}
      </g>
    </Tela>
  );
};

/** Ondas de som saindo de um ponto (o ronco): `forca` 0..1 controla tamanho e opacidade; `cor`. */
export const OndasRonco: React.FC<{ x: number; y: number; forca: number; cor?: string; s?: number }> = ({ x, y, forca, cor = C.orange, s = 1 }) => {
  const f = useCurrentFrame();
  if (forca <= 0) return null;
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        {[0, 1, 2, 3].map((i) => {
          const q = ((f + i * 7) % 28) / 28;
          const r = 60 + q * 220 * forca;
          return <path key={i} d={`M${-r} ${-r * 0.55} Q 0 ${-r * 1.15} ${r} ${-r * 0.55}`} fill="none" stroke={cor} strokeWidth={14 - i * 2} strokeLinecap="round" opacity={(1 - q) * forca} />;
        })}
      </g>
    </Tela>
  );
};

/** Posição de uma "onda" de aperto ao longo do tubo, 0..1 → x. */
const tuboY = (x: number) => Math.sin(x / 140) * 70;

/**
 * Intestino em corte: tubo cor-de-rosa, ondulado, que se APERTA numa onda que corre da esquerda pra direita
 * (`onda` 0..1 = posição do aperto). Bolhas de gás (azul-claro) e gotas são empurradas na frente do aperto.
 * `restos` mostra migalhas; `faxina` desenha a equipe da limpeza (vassourinhas) correndo junto do aperto.
 */
export const Intestino: React.FC<{ x: number; y: number; s?: number; onda: number; bolhas?: boolean; restos?: number; faxina?: boolean }> = ({
  x,
  y,
  s = 1,
  onda,
  bolhas = true,
  restos = 0,
  faxina = false,
}) => {
  const f = useCurrentFrame();
  const W = 900;
  const x0 = -W / 2;
  const pos = x0 - 80 + onda * (W + 160);
  const segs = 46;
  const raio = (sx: number) => {
    const d = (sx - pos) / 70;
    return 105 * (1 - 0.62 * Math.exp(-d * d));
  };
  const topo: string[] = [];
  const base: string[] = [];
  for (let i = 0; i <= segs; i++) {
    const sx = x0 + (W * i) / segs;
    const cy = tuboY(sx);
    topo.push(`${sx} ${cy - raio(sx)}`);
    base.push(`${sx} ${cy + raio(sx)}`);
  }
  const contorno = `M${topo.join(" L")} L${base.reverse().join(" L")} Z`;
  const interno: string[] = [];
  for (let i = 0; i <= segs; i++) {
    const sx = x0 + (W * i) / segs;
    interno.push(`${sx} ${tuboY(sx)}`);
  }
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d={contorno} fill="#FF9FB8" {...OL} strokeWidth={9} />
        <path d={`M${interno.join(" L")}`} fill="none" stroke="#FFC4D3" strokeWidth={60} strokeLinecap="round" opacity={0.7} />
        {/* músculos (anéis) */}
        {Array.from({ length: 13 }).map((_, i) => {
          const sx = x0 + 35 + i * 70;
          const r = raio(sx);
          return <path key={i} d={`M${sx} ${tuboY(sx) - r + 6} Q ${sx + 14} ${tuboY(sx)} ${sx} ${tuboY(sx) + r - 6}`} fill="none" stroke="#E06A8C" strokeWidth={6} opacity={0.6} />;
        })}
        {/* restinhos de comida à frente do aperto */}
        {restos > 0 &&
          [0, 1, 2, 3, 4, 5].map((i) => {
            const bx = Math.max(pos + 60 + i * 34, x0 + 140 + i * 120);
            if (bx > -x0 - 30) return null;
            return <rect key={i} x={bx - 14} y={tuboY(bx) + 40 - (i % 3) * 30} width={26} height={22} rx={6} fill={["#E8A85A", "#7CB342", "#FFD23F"][i % 3]} {...OL} strokeWidth={4} opacity={restos} transform={`rotate(${i * 30} ${bx} ${tuboY(bx) + 50})`} />;
          })}
        {/* bolhas de gás empurradas */}
        {bolhas &&
          [0, 1, 2, 3].map((i) => {
            const bx = Math.max(pos + 70 + i * 55, x0 + 120 + i * 210);
            if (bx > -x0 - 40) return null;
            const wob = Math.sin(f * 0.4 + i) * 6;
            const r = 30 + (i % 2) * 14;
            return (
              <g key={i}>
                <circle cx={bx} cy={tuboY(bx) - 30 + wob + (i % 2) * 40} r={r} fill="#D7F1FF" stroke="#5EB8F2" strokeWidth={6} />
                <circle cx={bx - r * 0.35} cy={tuboY(bx) - 30 + wob + (i % 2) * 40 - r * 0.35} r={r * 0.22} fill="#fff" />
              </g>
            );
          })}
        {/* equipe da faxina */}
        {faxina &&
          [0, 1, 2].map((i) => {
            const bx = pos - 40 + i * 85;
            if (bx < x0 + 20 || bx > -x0 - 20) return null;
            const by = tuboY(bx) + 20;
            const varre = Math.sin(f * 0.8 + i * 2) * 18;
            return (
              <g key={i} transform={`translate(${bx} ${by}) scale(1.7)`}>
                <path d={`M0 -10 L${30 + varre} 50`} stroke="#8A5A36" strokeWidth={7} strokeLinecap="round" />
                <path d={`M${18 + varre} 50 L${48 + varre} 50 L${40 + varre} 68 L${22 + varre} 68 Z`} fill={C.yellow} {...OL} strokeWidth={4} />
                <circle cx={0} cy={-30} r={24} fill={C.teal} {...OL} strokeWidth={5} />
                <circle cx={-7} cy={-34} r={5} fill={C.outline} />
                <circle cx={7} cy={-34} r={5} fill={C.outline} />
                <path d="M-8 -20 Q 0 -14 8 -20" fill="none" stroke={C.outline} strokeWidth={4} strokeLinecap="round" />
                <rect x={-22} y={-62} width={44} height={14} rx={6} fill={C.blue} {...OL} strokeWidth={4} />
              </g>
            );
          })}
      </g>
    </Tela>
  );
};

/**
 * Estômago (formato de feijão) em corte. `cheio` desenha comida dentro; `forca` 0..1 das ondas de som que
 * saem (grandes quando vazio, pequenas quando cheio); `rotulo` embaixo.
 */
export const Estomago: React.FC<{ x: number; y: number; s?: number; cheio?: boolean; forca: number; rotulo: string; cor?: string }> = ({ x, y, s = 1, cheio = false, forca, rotulo, cor = C.blue }) => {
  const f = useCurrentFrame();
  return (
    <Tela>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        {[0, 1, 2].map((i) => {
          const q = ((f + i * 9) % 27) / 27;
          const r = 150 + q * 160 * forca;
          return <circle key={i} r={r} fill="none" stroke={cor} strokeWidth={10 - i * 2} opacity={(1 - q) * forca * 0.9} />;
        })}
        <path d="M-60 -170 Q -20 -190 0 -150 Q 10 -90 90 -90 Q 180 -90 170 30 Q 150 160 10 160 Q -150 160 -150 20 Q -150 -60 -80 -100 Z" fill="#FF9FB8" {...OL} strokeWidth={9} />
        <path d="M-60 -170 L-80 -230" stroke={C.outline} strokeWidth={40} strokeLinecap="round" />
        <path d="M-60 -170 L-80 -230" stroke="#FF9FB8" strokeWidth={26} strokeLinecap="round" />
        <path d="M150 90 L230 130" stroke={C.outline} strokeWidth={40} strokeLinecap="round" />
        <path d="M150 90 L230 130" stroke="#FF9FB8" strokeWidth={26} strokeLinecap="round" />
        {cheio ? (
          <g>
            <path d="M-130 40 Q -120 140 10 145 Q 140 145 155 40 Q 80 10 0 30 Q -80 50 -130 40 Z" fill="#E8A85A" {...OL} strokeWidth={5} />
            {[[-70, 80, "#7CB342"], [20, 70, C.red], [90, 95, C.yellow], [-20, 115, "#7CB342"]].map(([cx, cy, c], i) => (
              <circle key={i} cx={cx as number} cy={cy as number} r={20} fill={c as string} {...OL} strokeWidth={4} />
            ))}
          </g>
        ) : (
          <g>
            <circle cx={-40} cy={20} r={34} fill="#D7F1FF" stroke="#5EB8F2" strokeWidth={6} />
            <circle cx={60} cy={60} r={24} fill="#D7F1FF" stroke="#5EB8F2" strokeWidth={6} />
          </g>
        )}
        <text y={290} textAnchor="middle" fontSize={64} fontWeight={800} fill={C.outline} fontFamily={FONTE}>
          {rotulo}
        </text>
      </g>
    </Tela>
  );
};
