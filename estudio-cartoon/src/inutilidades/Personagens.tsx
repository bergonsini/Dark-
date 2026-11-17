import React from "react";
import { useCurrentFrame } from "remotion";
import { piscar, TINTA } from "./common";

/**
 * Personagens fixos do INUTILIDADES 0800 (2D, contorno escuro grosso). Sempre use estes componentes.
 * Coordenadas locais: origem nos PÉS (centro), y negativo para cima. Altura ~1060 px na escala 1.
 */

const SW = 8; // espessura do contorno

/** Braço em dois segmentos. Ângulos em graus: 0 = para baixo, 90 = para a direita, 180 = para cima, -90 = esquerda. */
const Braco: React.FC<{
  o: [number, number];
  a1: number;
  a2: number;
  cor: string;
  pele: string;
  mao?: "aberta" | "dedo" | "joinha";
  grossura?: number;
  l1?: number;
  l2?: number;
}> = ({ o, a1, a2, cor, pele, mao = "aberta", grossura = 62, l1 = 125, l2 = 115 }) => {
  const r = (a: number) => (a * Math.PI) / 180;
  const c: [number, number] = [o[0] + Math.sin(r(a1)) * l1, o[1] + Math.cos(r(a1)) * l1];
  const a = a1 + a2;
  const m: [number, number] = [c[0] + Math.sin(r(a)) * l2, c[1] + Math.cos(r(a)) * l2];
  const d = `M${o[0]} ${o[1]} L${c[0]} ${c[1]} L${m[0]} ${m[1]}`;
  // direção do antebraço (para o dedo/polegar)
  const ux = Math.sin(r(a));
  const uy = Math.cos(r(a));
  return (
    <g>
      <path d={d} fill="none" stroke={TINTA} strokeWidth={grossura + SW * 2} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={cor} strokeWidth={grossura} strokeLinecap="round" strokeLinejoin="round" />
      {mao === "dedo" && (
        <g>
          <path d={`M${m[0]} ${m[1]} L${m[0] + ux * 70} ${m[1] + uy * 70}`} stroke={TINTA} strokeWidth={34} strokeLinecap="round" />
          <path d={`M${m[0]} ${m[1]} L${m[0] + ux * 70} ${m[1] + uy * 70}`} stroke={pele} strokeWidth={18} strokeLinecap="round" />
        </g>
      )}
      {mao === "joinha" && (
        <g>
          <path d={`M${m[0]} ${m[1]} L${m[0]} ${m[1] - 62}`} stroke={TINTA} strokeWidth={36} strokeLinecap="round" />
          <path d={`M${m[0]} ${m[1]} L${m[0]} ${m[1] - 62}`} stroke={pele} strokeWidth={20} strokeLinecap="round" />
        </g>
      )}
      <circle cx={m[0]} cy={m[1]} r={grossura * 0.62} fill={pele} stroke={TINTA} strokeWidth={SW} />
    </g>
  );
};

type Pose2 = { a1: number; a2: number; mao?: "aberta" | "dedo" | "joinha" };

// ============================================================================ DOUTOR OFERTA
export type ExprDoutor = "sorriso" | "piscando" | "gritando" | "chocado";
const POSES_DOUTOR: Record<string, { E: Pose2; D: Pose2 }> = {
  apontando: { E: { a1: -30, a2: 60 }, D: { a1: 118, a2: 0, mao: "dedo" } },
  bracosAbertos: { E: { a1: -135, a2: 25 }, D: { a1: 135, a2: -25 } },
  joinha: { E: { a1: -30, a2: 60 }, D: { a1: 40, a2: 120, mao: "joinha" } },
  apresentando: { E: { a1: -30, a2: 60 }, D: { a1: 70, a2: 40 } },
  parado: { E: { a1: -12, a2: 5 }, D: { a1: 12, a2: -5 } },
};

export const DoutorOferta: React.FC<{
  x: number;
  y: number;
  escala?: number;
  boca?: number;
  expr?: ExprDoutor;
  pose?: keyof typeof POSES_DOUTOR;
  queimado?: boolean;
  flip?: boolean;
  /** depois de um acidente: topete arrepiado e curativo em X na testa */
  curativo?: boolean;
  /** rotação do corpo inteiro (graus), em torno do centro do corpo */
  giro?: number;
}> = ({ x, y, escala = 1, boca = 0, expr = "sorriso", pose = "parado", queimado = false, flip = false, curativo = false, giro = 0 }) => {
  const f = useCurrentFrame();
  const P = POSES_DOUTOR[pose];
  const PELE = queimado ? "#8C6A55" : "#F2C29B";
  const TERNO = queimado ? "#4A3070" : "#7B3FE4";
  const bob = Math.sin(f * 0.15) * 4;
  const pisca = piscar(f, 1);
  const grita = expr === "gritando" || expr === "chocado";
  const ab = Math.max(boca, expr === "gritando" ? 0.7 : expr === "chocado" ? 0.5 : 0);
  const sob = grita ? -18 : 0;
  const h = 40 + 95 * ab;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -escala : escala} ${escala}) rotate(${giro} 0 -520)`} stroke={TINTA} strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round">
      {/* pernas e sapatos */}
      <rect x={-75} y={-225} width={60} height={200} fill="#4B2A8C" />
      <rect x={15} y={-225} width={60} height={200} fill="#4B2A8C" />
      <path d="M-95 -25 Q-45 -55 -5 -25 L-5 0 L-95 0 Z" fill={TINTA} />
      <path d="M5 -25 Q55 -55 105 -25 L105 0 L5 0 Z" fill={TINTA} />
      <g transform={`translate(0 ${bob})`}>
        {/* tronco: terno, camisa, gravata */}
        <path d="M-140 -585 Q0 -635 140 -585 L155 -205 L-155 -205 Z" fill={TERNO} />
        <path d="M-50 -597 L0 -485 L50 -597 Z" fill="#fff" />
        <path d="M-12 -575 L12 -575 L24 -425 L0 -395 L-24 -425 Z" fill="#FFD23F" />
        <path d="M-50 -597 L-18 -465 L-75 -515 Z M50 -597 L18 -465 L75 -515 Z" fill={queimado ? "#5A3C86" : "#9A62F5"} />
        <Braco o={[-130, -555]} {...P.E} cor={TERNO} pele={PELE} />
        <Braco o={[130, -555]} {...P.D} cor={TERNO} pele={PELE} />
        {/* pescoço + cabeça */}
        <rect x={-35} y={-665} width={70} height={60} fill={queimado ? "#7A5A47" : "#E2A97F"} />
        <ellipse cx={-152} cy={-795} rx={26} ry={40} fill={PELE} />
        <ellipse cx={152} cy={-795} rx={26} ry={40} fill={PELE} />
        <ellipse cx={0} cy={-805} rx={155} ry={172} fill={PELE} />
        {/* topete com gel */}
        {queimado ? (
          <path d="M-150 -865 C -160 -985, -30 -1005, 40 -975 C 90 -1010, 170 -990, 160 -905 C 100 -940, 0 -950, -150 -865 Z" fill="#222" />
        ) : curativo ? (
          <path d="M-150 -865 L-190 -960 L-110 -930 L-120 -1040 L-40 -960 L-10 -1080 L40 -970 L110 -1060 L110 -950 L200 -990 L160 -905 C 100 -940, 0 -950, -150 -865 Z" fill="#2B1A12" />
        ) : (
          <>
            <path d="M-150 -865 C -160 -1005, -30 -1025, 40 -995 C 90 -1065, 180 -1025, 160 -905 C 130 -945, 90 -950, 70 -935 C 10 -965, -90 -945, -150 -865 Z" fill="#2B1A12" />
            <path d="M40 -995 C 50 -1055, 130 -1065, 140 -1015 C 110 -1035, 70 -1025, 60 -985" fill="#3A2418" />
          </>
        )}
        {/* sobrancelhas */}
        <path d={`M-100 ${-895 + sob} Q-65 ${-920 + sob} -30 ${-897 + sob} M30 ${-897 + sob} Q65 ${-925 + sob} 102 ${-903 + sob}`} fill="none" strokeWidth={12} />
        {/* olhos */}
        {pisca ? (
          <path d="M-92 -845 Q-62 -830 -32 -845" fill="none" strokeWidth={9} />
        ) : (
          <>
            <ellipse cx={-62} cy={-845} rx={30} ry={grita ? 42 : 36} fill="#fff" />
            <circle cx={-56} cy={-839} r={15} fill={TINTA} />
          </>
        )}
        {expr === "piscando" ? (
          <path d="M35 -840 Q65 -862 95 -840" fill="none" strokeWidth={10} />
        ) : pisca ? (
          <path d="M35 -845 Q65 -830 95 -845" fill="none" strokeWidth={9} />
        ) : (
          <>
            <ellipse cx={65} cy={-845} rx={30} ry={grita ? 42 : 36} fill="#fff" />
            <circle cx={71} cy={-839} r={15} fill={TINTA} />
          </>
        )}
        {/* nariz */}
        <path d="M-2 -825 Q10 -785 -10 -775" fill="none" strokeWidth={7} />
        {/* boca: sorrisão de dentes ou aberta falando */}
        {ab > 0.08 ? (
          <g>
            <path d={`M-95 -760 L95 -760 Q95 ${-760 + h} 0 ${-760 + h} Q-95 ${-760 + h} -95 -760 Z`} fill="#6B1020" />
            <ellipse cx={0} cy={-760 + h * 0.8} rx={50} ry={h * 0.18} fill="#E8687A" stroke="none" />
            <rect x={-78} y={-760} width={156} height={Math.min(24, h * 0.35)} fill="#fff" strokeWidth={4} />
          </g>
        ) : (
          <g>
            <path d="M-100 -750 Q0 -645 105 -750 Z" fill="#fff" />
            <path d="M-65 -740 L-60 -700 M-28 -735 L-26 -682 M10 -735 L10 -676 M48 -737 L46 -688 M80 -743 L72 -712" fill="none" strokeWidth={4} />
          </g>
        )}
        {/* brilho do sorriso */}
        {expr === "sorriso" && ab <= 0.08 && (
          <path d="M140 -735 L148 -715 L170 -709 L150 -701 L142 -679 L134 -701 L114 -709 L136 -715 Z" fill="#fff" stroke="#FFD23F" strokeWidth={4} />
        )}
        {curativo && (
          <g fill="#F5D6A6" strokeWidth={5}>
            <rect x={-80} y={-950} width={130} height={34} rx={8} transform="rotate(25 -15 -933)" />
            <rect x={-80} y={-950} width={130} height={34} rx={8} transform="rotate(-25 -15 -933)" />
          </g>
        )}
        {/* microfone de cabeça */}
        <path d="M156 -785 Q150 -705 40 -705" fill="none" strokeWidth={7} />
        <circle cx={38} cy={-705} r={14} fill="#333" />
        {queimado && (
          <g stroke="none" fill="#777" opacity={0.7}>
            {[0, 1, 2].map((i) => {
              const q = ((f + i * 10) % 30) / 30;
              return <circle key={i} cx={-60 + i * 60} cy={-1000 - q * 120} r={20 + q * 20} opacity={1 - q} />;
            })}
          </g>
        )}
      </g>
    </g>
  );
};

// ============================================================================ SEU KUKA BELUDO
export type EstadoKuka = "normal" | "faminto" | "tostado";
const POSES_KUKA: Record<string, { E: Pose2; D: Pose2 }> = {
  parado: { E: { a1: -25, a2: 10 }, D: { a1: 25, a2: -10 } },
  prato: { E: { a1: -20, a2: -70 }, D: { a1: 20, a2: 70 } },
  joinha: { E: { a1: -25, a2: 10 }, D: { a1: 135, a2: 35, mao: "joinha" } },
  bracosPraCima: { E: { a1: -150, a2: -10 }, D: { a1: 150, a2: 10 } },
  telefone: { E: { a1: -25, a2: 10 }, D: { a1: 30, a2: 150 } },
  escovando: { E: { a1: -25, a2: 10 }, D: { a1: 200, a2: 30 } },
  /** braço direito para cima segurando o cabo do guarda-chuva: a mão fica em (166, -691) */
  guardaChuva: { E: { a1: -25, a2: 10 }, D: { a1: 170, a2: 20 } },
  /** braço direito esticado para a frente: a mão fica em (351, -477) — ali vai o controle remoto */
  controle: { E: { a1: -25, a2: 10 }, D: { a1: 60, a2: 60 } },
};

export const SeuKuka: React.FC<{
  x: number;
  y: number;
  escala?: number;
  boca?: number;
  estado?: EstadoKuka;
  pose?: keyof typeof POSES_KUKA;
  feliz?: boolean;
  flip?: boolean;
  /** sem nenhum dente (gengiva rosa) */
  banguela?: boolean;
  /** espuma de pasta na boca (0..1) */
  espuma?: number;
  /** cabelo soprado para trás (vento/motor) */
  arrepiado?: boolean;
  /** gotas de suor */
  suor?: boolean;
  /** escova na mão (use com pose "escovando"); "turbo" = Escova Turbo V8 ligada */
  escova?: "normal" | "turbo" | "turboDesligada";
  /** tremedeira do corpo (px) */
  treme?: number;
  /** encharcado: roupa mais escura e gotas pingando */
  molhado?: boolean;
  /** o black power encharcado vira uma ESPONJA (maior, com furinhos, pingando) */
  esponja?: boolean;
  /** cabeça abafada: vapor subindo */
  abafado?: boolean;
  /** barba crescendo (0..1): a espera foi tão longa que nasceu barba */
  barba?: number;
  /** galos na cabeça + estrelinhas girando (bateu em algo) */
  galos?: boolean;
}> = ({ x, y, escala = 1, boca = 0, estado = "normal", pose = "parado", feliz = false, flip = false, banguela = false, espuma = 0, arrepiado = false, suor = false, escova, treme = 0, molhado = false, esponja = false, abafado = false, barba = 0, galos = false }) => {
  const f = useCurrentFrame();
  const P = POSES_KUKA[pose];
  const tost = estado === "tostado";
  const PELE = tost ? "#B9805A" : "#E0A16E";
  const CAMISA = tost ? "#3E8F52" : molhado ? "#33945A" : "#4FBF6A";
  const bob = Math.sin(f * 0.13 + 1) * 4;
  const pisca = piscar(f, 2);
  const triste = estado === "faminto";
  const ab = boca;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -escala : escala} ${escala})`} stroke={TINTA} strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round">
      <rect x={-100} y={-200} width={60} height={180} fill={PELE} />
      <rect x={40} y={-200} width={60} height={180} fill={PELE} />
      <ellipse cx={-75} cy={-10} rx={55} ry={26} fill="#fff" />
      <ellipse cx={75} cy={-10} rx={55} ry={26} fill="#fff" />
      <g transform={`translate(${treme ? Math.sin(f * 3.1) * treme : 0} ${bob + (treme ? Math.cos(f * 2.3) * treme * 0.6 : 0)})`}>
        <path d="M-120 -280 L120 -280 L130 -170 L-130 -170 Z" fill="#3D6CC9" />
        <ellipse cx={0} cy={-410} rx={190} ry={175} fill={CAMISA} />
        {tost && (
          <g fill="#222" stroke="none">
            <circle cx={-70} cy={-460} r={26} />
            <circle cx={70} cy={-350} r={20} />
            <circle cx={20} cy={-490} r={14} />
            <circle cx={-110} cy={-360} r={12} />
          </g>
        )}
        <Braco o={[-165, -480]} {...P.E} cor={CAMISA} pele={PELE} grossura={56} l1={110} l2={105} />
        <Braco o={[165, -480]} {...P.D} cor={CAMISA} pele={PELE} grossura={56} l1={110} l2={105} />
        {pose === "prato" && <ellipse cx={0} cy={-300} rx={120} ry={26} fill="#fff" />}
        {pose === "telefone" && <rect x={150} y={-700} width={50} height={110} rx={10} fill="#333" />}
        {/* cabeça */}
        <circle cx={0} cy={-740} r={170} fill={PELE} />
        {/* cabelo: black power volumoso (o "Beludo") — queimado vira carvão com fumaça */}
        <g fill={tost ? "#2a2a2a" : esponja ? "#5A4020" : "#3A2414"} transform={esponja ? "translate(0 -760) scale(1.3) translate(0 760)" : undefined}>
          {(arrepiado
            ? [
                // soprado para trás (vento do motor): o volume vai para a esquerda e para cima, sem cobrir o rosto
                [-250, -860, 70],
                [-190, -950, 82],
                [-90, -990, 84],
                [20, -985, 74],
                [110, -940, 58],
                [-280, -770, 52],
                [-160, -880, 60],
                [-30, -925, 66],
                [150, -895, 40],
              ]
            : [
                [-140, -850, 70],
                [-60, -910, 80],
                [50, -920, 82],
                [140, -860, 72],
                [160, -780, 50],
                [-160, -770, 50],
                [0, -950, 60],
              ]
          ).map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy + (arrepiado ? Math.sin(f * 0.9 + i) * 3 : 0)} r={r} />
          ))}
        </g>
        {esponja && (
          <g fill="#2A1C0C" stroke="none" transform="translate(0 -760) scale(1.3) translate(0 760)">
            {[[-140, -880], [-90, -940], [-20, -980], [60, -950], [130, -890], [-170, -800], [170, -810], [-50, -900], [40, -900], [100, -840], [-110, -850]].map(([cx, cy], i) => (
              <ellipse key={i} cx={cx} cy={cy} rx={12} ry={9} />
            ))}
          </g>
        )}
        {(molhado || esponja) && (
          <g fill="#7FD3FF" strokeWidth={4}>
            {[[-200, -780], [-120, -700], [150, -760], [210, -820], [-60, -560], [90, -420], [-150, -330], [180, -300]].map(([cx, cy], i) => {
              const q = ((f + i * 7) % 22) / 22;
              return <path key={i} d={`M${cx} ${cy + q * 120} q 13 20 0 28 q -13 -8 0 -28 Z`} opacity={1 - q * 0.5} />;
            })}
          </g>
        )}
        {barba > 0 && (
          <path
            d={`M-120 -640 Q -130 ${-640 + 380 * barba} 0 ${-600 + 520 * barba} Q 130 ${-640 + 380 * barba} 120 -640 Q 60 -600 0 -610 Q -60 -600 -120 -640 Z`}
            fill="#FAFAFA"
            strokeWidth={8}
          />
        )}
        {galos && (
          <g>
            <circle cx={-60} cy={-930} r={40} fill="#F28AA0" />
            <circle cx={70} cy={-950} r={32} fill="#F28AA0" />
            {[0, 1, 2].map((i) => {
              const a = f * 0.25 + (i * Math.PI * 2) / 3;
              return (
                <path
                  key={i}
                  transform={`translate(${Math.cos(a) * 190} ${-1000 + Math.sin(a) * 40})`}
                  d="M0 -26 L8 -8 L26 -6 L12 6 L16 26 L0 16 L-16 26 L-12 6 L-26 -6 L-8 -8 Z"
                  fill="#FFD23F"
                  strokeWidth={4}
                />
              );
            })}
          </g>
        )}
        {abafado && (
          <g fill="none" stroke="#fff" strokeWidth={12} strokeLinecap="round">
            {[0, 1, 2].map((i) => {
              const q = ((f + i * 10) % 30) / 30;
              return <path key={i} d={`M${-90 + i * 90} ${-990 - q * 110} q 22 -30 0 -60 q -22 -30 0 -60`} opacity={(1 - q) * 0.9} />;
            })}
          </g>
        )}
        {arrepiado && (
          <g fill="none" stroke={TINTA} strokeWidth={8}>
            {[0, 1, 2].map((i) => {
              const q = ((f * 2 + i * 13) % 30) / 30;
              return <path key={i} d={`M${200 + q * 60} ${-960 + i * 60} l70 -8`} opacity={1 - q} />;
            })}
          </g>
        )}
        {tost && (
          <>
            <g fill="#555" stroke="none">
              <circle cx={-70} cy={-920} r={18} />
              <circle cx={70} cy={-900} r={14} />
              <circle cx={150} cy={-840} r={12} />
            </g>
            <g fill="none" stroke="#8A8A99" strokeWidth={10} opacity={0.8}>
              {[0, 1, 2].map((i) => {
                const q = ((f + i * 12) % 36) / 36;
                return <path key={i} d={`M${-80 + i * 80} ${-990 - q * 90} q -20 -30 0 -60`} opacity={1 - q} />;
              })}
            </g>
            <rect x={-168} y={-860} width={336} height={44} fill="#fff" transform="rotate(-6 0 -838)" />
            <path d="M90 -790 L160 -820 M110 -835 L140 -775" stroke="#E8282B" strokeWidth={16} />
          </>
        )}
        {/* sobrancelhas (o Kuka tostado NÃO tem sobrancelha) */}
        {!tost && (
          <path
            d={triste ? "M-110 -810 L-30 -825 M30 -825 L110 -810" : "M-110 -825 Q-70 -850 -30 -828 M30 -828 Q70 -850 110 -825"}
            fill="none"
            strokeWidth={18}
          />
        )}
        {tost && <path d="M-105 -815 L-40 -820 M40 -820 L105 -815" fill="none" stroke="#7a5a40" strokeWidth={6} strokeDasharray="6 10" />}
        {/* olhos */}
        {pisca ? (
          <path d="M-100 -770 Q-70 -755 -40 -770 M40 -770 Q70 -755 100 -770" fill="none" strokeWidth={9} />
        ) : tost ? (
          <>
            <circle cx={-70} cy={-770} r={36} fill="#fff" />
            <circle cx={70} cy={-770} r={36} fill="#fff" />
            <path d="M-70 -770 m-22 0 a22 22 0 1 0 44 0 a14 14 0 1 0 -28 0 a6 6 0 1 0 12 0 M70 -770 m-22 0 a22 22 0 1 0 44 0 a14 14 0 1 0 -28 0 a6 6 0 1 0 12 0" fill="none" strokeWidth={6} />
          </>
        ) : (
          <>
            <ellipse cx={-70} cy={-770} rx={32} ry={38} fill="#fff" />
            <ellipse cx={70} cy={-770} rx={32} ry={38} fill="#fff" />
            <circle cx={-64} cy={triste ? -760 : -766} r={16} fill={TINTA} />
            <circle cx={64} cy={triste ? -760 : -766} r={16} fill={TINTA} />
          </>
        )}
        {/* nariz e bigodão */}
        <ellipse cx={0} cy={-715} rx={34} ry={26} fill={tost ? "#A26D4B" : "#C98B5E"} />
        <path
          d={tost ? "M-70 -680 Q0 -705 70 -680 Q30 -670 0 -675 Q-30 -670 -70 -680 Z" : "M-110 -670 Q-60 -715 0 -690 Q60 -715 110 -670 Q60 -660 0 -675 Q-60 -660 -110 -670 Z"}
          fill={tost ? "#333" : "#3A2414"}
        />
        {/* boca */}
        {banguela && ab <= 0.08 ? (
          <g>
            <path d="M-60 -655 Q0 -595 60 -655 Z" fill="#6B1020" />
            <path d="M-56 -652 Q0 -640 56 -652" fill="none" stroke="#F28AA0" strokeWidth={10} />
          </g>
        ) : ab > 0.08 ? (
          <path d={`M-55 -655 Q0 ${-655 + 25 + ab * 70} 55 -655 Z`} fill="#6B1020" />
        ) : triste ? (
          <path d="M-45 -630 Q0 -660 45 -630" fill="none" strokeWidth={9} />
        ) : (
          <g>
            <path d="M-60 -655 Q0 -595 60 -655 Z" fill="#fff" />
            {(tost || feliz) && <rect x={-8} y={-655} width={22} height={26} fill={TINTA} stroke="none" />}
          </g>
        )}
        {espuma > 0 && (
          <g fill="#fff" strokeWidth={4}>
            {[
              [-70, -650, 26], [-30, -625, 30], [20, -628, 28], [65, -650, 24], [-95, -620, 18], [95, -615, 18], [0, -600, 22], [-50, -590, 16], [50, -592, 16],
            ].slice(0, Math.ceil(9 * espuma)).map(([cx, cy, r], i) => (
              <circle key={i} cx={cx} cy={cy + Math.sin(f * 0.4 + i) * 3} r={r * (0.7 + espuma * 0.5)} />
            ))}
          </g>
        )}
        {suor && (
          <g fill="#7FD3FF" strokeWidth={4}>
            {[[-150, -820], [160, -800], [130, -880]].map(([cx, cy], i) => {
              const q = ((f + i * 9) % 26) / 26;
              return <path key={i} d={`M${cx} ${cy + q * 70} q 14 22 0 30 q -14 -8 0 -30 Z`} opacity={1 - q * 0.6} />;
            })}
          </g>
        )}
        {escova && (
          <g transform={escova === "turbo" ? `translate(${Math.sin(f * 4.1) * 7} ${Math.cos(f * 3.7) * 7})` : undefined}>
            <rect x={-20} y={-668} width={250} height={26} rx={12} fill="#3DA5FF" />
            <rect x={-30} y={-690} width={60} height={24} fill="#fff" strokeWidth={5} />
            {escova !== "normal" && (
              <g>
                <rect x={220} y={-700} width={110} height={90} rx={10} fill="#E8282B" />
                <rect x={232} y={-724} width={22} height={28} fill="#C9D0DC" />
                <rect x={262} y={-724} width={22} height={28} fill="#C9D0DC" />
                <rect x={292} y={-724} width={22} height={28} fill="#C9D0DC" />
                <text x={275} y={-640} textAnchor="middle" fontSize={34} fill="#FFD23F" stroke="none" fontFamily="'Baloo 2'" fontWeight={800}>V8</text>
                <path d="M330 -630 L370 -630 L370 -660" fill="none" strokeWidth={14} stroke="#777" />
                {escova === "turbo" &&
                  [0, 1, 2].map((i) => {
                    const q = ((f + i * 6) % 18) / 18;
                    return <circle key={i} cx={372 + q * 60} cy={-680 - q * 120} r={16 + q * 26} fill="#666" stroke="none" opacity={(1 - q) * 0.8} />;
                  })}
              </g>
            )}
          </g>
        )}
      </g>
    </g>
  );
};

// ============================================================================ O RATO (participação especial)
export const Rato: React.FC<{
  x: number;
  y: number;
  escala?: number;
  boca?: number;
  guardanapo?: boolean;
  talheres?: boolean;
  capacete?: boolean;
  marreta?: number; // ângulo da marreta (graus); undefined = sem marreta
  tostado?: boolean;
  olhar?: number;
  mastiga?: boolean;
}> = ({ x, y, escala = 1, boca = 0, guardanapo, talheres, capacete, marreta, tostado, olhar = 0, mastiga }) => {
  const f = useCurrentFrame();
  const C = tostado ? "#4a4a50" : "#9AA0AA";
  const CC = tostado ? "#5c5c62" : "#C7CCD4";
  const pisca = piscar(f, 3);
  const m = mastiga ? Math.abs(Math.sin(f * 0.6)) * 0.4 : 0;
  const ab = Math.max(boca, m);
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`} stroke={TINTA} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round">
      {/* rabo */}
      <path d="M60 -30 C 160 -20, 170 -120, 120 -150 S 80 -230, 140 -250" fill="none" strokeWidth={14} />
      <path d="M60 -30 C 160 -20, 170 -120, 120 -150 S 80 -230, 140 -250" fill="none" stroke="#E8A0A8" strokeWidth={6} />
      {/* corpo */}
      <ellipse cx={0} cy={-110} rx={95} ry={110} fill={C} />
      <ellipse cx={0} cy={-90} rx={60} ry={75} fill={CC} />
      {guardanapo && <path d="M-60 -175 L60 -175 L0 -80 Z" fill="#fff" />}
      {/* pés */}
      <ellipse cx={-45} cy={-5} rx={40} ry={16} fill="#E8A0A8" />
      <ellipse cx={45} cy={-5} rx={40} ry={16} fill="#E8A0A8" />
      {/* braços com talheres */}
      <path d="M-80 -140 L-120 -95" strokeWidth={30} />
      <path d="M-80 -140 L-120 -95" stroke={C} strokeWidth={18} />
      <path d="M80 -140 L120 -95" strokeWidth={30} />
      <path d="M80 -140 L120 -95" stroke={C} strokeWidth={18} />
      {talheres && (
        <g strokeWidth={5}>
          <path d="M-125 -95 L-125 -190 M-137 -190 L-137 -160 M-125 -190 L-125 -160 M-113 -190 L-113 -160" fill="none" stroke="#9AA4B5" strokeWidth={8} />
          <path d="M125 -95 L125 -150 Q140 -190 125 -200 Z" fill="#C9D0DC" />
        </g>
      )}
      {marreta !== undefined && (
        <g transform={`rotate(${marreta} 110 -110)`}>
          <rect x={102} y={-330} width={18} height={230} fill="#8B5A2B" />
          <rect x={60} y={-380} width={110} height={65} rx={8} fill="#666" />
        </g>
      )}
      {/* cabeça */}
      <g transform={`translate(0 -240) rotate(${olhar})`}>
        <circle cx={-80} cy={-60} r={52} fill={C} />
        <circle cx={-80} cy={-60} r={32} fill="#E8A0A8" />
        <circle cx={80} cy={-60} r={52} fill={C} />
        <circle cx={80} cy={-60} r={32} fill="#E8A0A8" />
        <ellipse cx={0} cy={0} rx={82} ry={72} fill={C} />
        {/* olhos */}
        {tostado ? (
          <path d="M-45 -22 l24 24 m0 -24 l-24 24 M21 -22 l24 24 m0 -24 l-24 24" strokeWidth={8} />
        ) : pisca ? (
          <path d="M-45 -10 l28 0 M17 -10 l28 0" strokeWidth={8} />
        ) : (
          <>
            <ellipse cx={-32} cy={-10} rx={16} ry={20} fill="#fff" />
            <ellipse cx={32} cy={-10} rx={16} ry={20} fill="#fff" />
            <circle cx={-30} cy={-6} r={9} fill={TINTA} />
            <circle cx={34} cy={-6} r={9} fill={TINTA} />
            {/* pálpebra caída: cara de "deboche" */}
            <path d="M-50 -22 L-14 -18 M14 -18 L50 -22" strokeWidth={7} />
          </>
        )}
        {/* focinho, nariz, bigodes */}
        <ellipse cx={0} cy={32} rx={40} ry={28} fill={CC} />
        <circle cx={0} cy={18} r={11} fill="#E86A7A" />
        <path d="M-25 30 L-90 18 M-25 40 L-92 44 M25 30 L90 18 M25 40 L92 44" strokeWidth={4} />
        {ab > 0.08 ? <ellipse cx={0} cy={48} rx={18} ry={8 + ab * 14} fill="#6B1020" strokeWidth={4} /> : <path d="M-14 46 Q0 54 14 46" fill="none" strokeWidth={4} />}
        <rect x={-9} y={50 + ab * 10} width={18} height={14} fill="#fff" strokeWidth={3} />
        {capacete && (
          <g>
            <path d="M-80 -45 Q0 -140 80 -45 Z" fill="#FFC21A" />
            <rect x={-95} y={-52} width={190} height={16} rx={6} fill="#FFC21A" />
          </g>
        )}
        {tostado && (
          <g stroke="none" fill="#777" opacity={0.7}>
            {[0, 1].map((i) => {
              const q = ((f + i * 15) % 30) / 30;
              return <circle key={i} cx={-20 + i * 40} cy={-90 - q * 90} r={14 + q * 14} opacity={1 - q} />;
            })}
          </g>
        )}
      </g>
    </g>
  );
};

// ============================================================================ DONA CLEIDE (cliente nova, ep. 5)
export type ExprCleide = "feliz" | "triste" | "surpresa" | "assustada";
const POSES_CLEIDE: Record<string, { E: Pose2; D: Pose2 }> = {
  parado: { E: { a1: -15, a2: 5 }, D: { a1: 15, a2: -5 } },
  /** mão direita na boca: garfo com alface / tomando a pílula. Mão em ≈ (18, -755) */
  boca: { E: { a1: -15, a2: 5 }, D: { a1: 200, a2: 30 } },
  /** halter acima da cabeça: mãos em ≈ (±160, -800) */
  halter: { E: { a1: -170, a2: 0 }, D: { a1: 170, a2: 0 } },
  bracosPraCima: { E: { a1: -150, a2: -10 }, D: { a1: 150, a2: 10 } },
  telefone: { E: { a1: -15, a2: 5 }, D: { a1: 30, a2: 150 } },
};

export const DonaCleide: React.FC<{
  x: number;
  y: number;
  escala?: number;
  boca?: number;
  expr?: ExprCleide;
  pose?: keyof typeof POSES_CLEIDE;
  suor?: boolean;
  treme?: number;
  /** gira o corpo inteiro (flutuando/voando) */
  giro?: number;
}> = ({ x, y, escala = 1, boca = 0, expr = "feliz", pose = "parado", suor = false, treme = 0, giro = 0 }) => {
  const f = useCurrentFrame();
  const P = POSES_CLEIDE[pose];
  const PELE = "#C98B5E";
  const VEST = "#9A3FD0";
  const CAB = "#E8742B";
  const pisca = piscar(f, 4);
  const ab = Math.max(boca, expr === "surpresa" || expr === "assustada" ? 0.5 : 0);
  const tx = treme ? Math.sin(f * 3.1) * treme : 0;
  const sob = expr === "triste" ? 14 : expr === "surpresa" || expr === "assustada" ? -16 : 0;
  return (
    <g transform={`translate(${x + tx} ${y}) scale(${escala}) rotate(${giro} 0 -520)`} stroke={TINTA} strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round">
      {/* pernas e sapatos */}
      <rect x={-70} y={-240} width={46} height={220} fill={PELE} />
      <rect x={24} y={-240} width={46} height={220} fill={PELE} />
      <path d="M-90 -20 L-20 -20 L-20 0 L-100 0 Z" fill="#E8282B" />
      <path d="M20 -20 L90 -20 L100 0 L20 0 Z" fill="#E8282B" />
      {/* vestido de bolinhas */}
      <path d="M-120 -620 Q0 -660 120 -620 L190 -220 L-190 -220 Z" fill={VEST} />
      <g fill="#fff" stroke="none">
        {[[-80, -540], [40, -560], [-20, -450], [100, -430], [-120, -340], [10, -320], [130, -280], [-60, -260]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={14} />
        ))}
      </g>
      <Braco o={[-120, -590]} {...P.E} cor={VEST} pele={PELE} grossura={48} l1={115} l2={105} />
      <Braco o={[120, -590]} {...P.D} cor={VEST} pele={PELE} grossura={48} l1={115} l2={105} />
      {/* pescoço + cabeça */}
      <rect x={-30} y={-680} width={60} height={60} fill={PELE} />
      {/* cabelo volumoso atrás + coque */}
      <g fill={CAB}>
        <circle cx={0} cy={-1020} r={70} />
        {[[-150, -820, 80], [150, -820, 80], [-120, -930, 85], [120, -930, 85], [0, -970, 95], [-170, -720, 55], [170, -720, 55]].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} />
        ))}
      </g>
      <circle cx={0} cy={-800} r={150} fill={PELE} />
      <path d="M-140 -850 Q -60 -960 0 -900 Q 60 -960 140 -850 Q 100 -930 0 -940 Q -100 -930 -140 -850 Z" fill={CAB} />
      {/* brincos */}
      <circle cx={-150} cy={-750} r={20} fill="#FFD23F" />
      <circle cx={150} cy={-750} r={20} fill="#FFD23F" />
      {/* sobrancelhas */}
      <path d={`M-90 ${-875 + sob} Q -60 ${-895 + sob} -30 ${-878 + sob} M30 ${-878 + sob} Q 60 ${-895 + sob} 90 ${-875 + sob}`} fill="none" strokeWidth={9} />
      {/* olhos com cílios */}
      {pisca ? (
        <path d="M-85 -825 Q -60 -810 -35 -825 M35 -825 Q 60 -810 85 -825" fill="none" strokeWidth={8} />
      ) : (
        <>
          <ellipse cx={-60} cy={-825} rx={26} ry={expr === "assustada" ? 36 : 30} fill="#fff" />
          <ellipse cx={60} cy={-825} rx={26} ry={expr === "assustada" ? 36 : 30} fill="#fff" />
          <circle cx={-56} cy={expr === "triste" ? -818 : -822} r={13} fill={TINTA} />
          <circle cx={56} cy={expr === "triste" ? -818 : -822} r={13} fill={TINTA} />
          <path d="M-86 -846 l-14 -12 M-74 -853 l-8 -16 M86 -846 l14 -12 M74 -853 l8 -16" strokeWidth={6} />
        </>
      )}
      <ellipse cx={-100} cy={-770} rx={22} ry={12} fill="#F28AA0" stroke="none" opacity={0.7} />
      <ellipse cx={100} cy={-770} rx={22} ry={12} fill="#F28AA0" stroke="none" opacity={0.7} />
      <path d="M0 -800 Q 12 -775 -4 -765" fill="none" strokeWidth={6} />
      {/* boca com batom */}
      {ab > 0.08 ? (
        <ellipse cx={0} cy={-725} rx={34} ry={10 + ab * 26} fill="#6B1020" stroke="#D81B60" strokeWidth={9} />
      ) : expr === "triste" ? (
        <path d="M-36 -712 Q 0 -738 36 -712" fill="none" stroke="#D81B60" strokeWidth={11} />
      ) : (
        <path d="M-40 -735 Q 0 -700 40 -735" fill="none" stroke="#D81B60" strokeWidth={11} />
      )}
      {suor && (
        <g fill="#7FD3FF" strokeWidth={4}>
          {[[-170, -880], [175, -860], [140, -950]].map(([cx, cy], i) => {
            const q = ((f + i * 9) % 26) / 26;
            return <path key={i} d={`M${cx} ${cy + q * 70} q 14 22 0 30 q -14 -8 0 -30 Z`} opacity={1 - q * 0.6} />;
          })}
        </g>
      )}
    </g>
  );
};
