import React from "react";
import { useCurrentFrame } from "remotion";
import { TINTA } from "./common";

/** Cenários e objetos 2D do INUTILIDADES 0800 (SVG em 1080x1920). */

/** Cozinha da casa do Seu Kuka. `destruida`: buraco na parede, fuligem e entulho. */
export const Cozinha: React.FC<{ destruida?: boolean }> = ({ destruida = false }) => {
  const lin: React.ReactNode[] = [];
  for (let y = 0; y < 1380; y += 90) lin.push(<path key={`h${y}`} d={`M0 ${y} L1080 ${y}`} />);
  for (let x = 0; x < 1080; x += 90) lin.push(<path key={`v${x}`} d={`M${x} 0 L${x} 1380`} />);
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <rect width={1080} height={1920} fill={destruida ? "#D9BF92" : "#F4D9A8"} />
      <g stroke={destruida ? "#C7AB7C" : "#E5C38E"} strokeWidth={5} fill="none">
        {lin}
      </g>
      {/* janela */}
      {!destruida && (
        <g stroke={TINTA} strokeWidth={8}>
          <rect x={120} y={260} width={300} height={260} fill="#8FD3FF" />
          <path d="M270 260 L270 520 M120 390 L420 390" />
        </g>
      )}
      {destruida && (
        <g>
          <path
            d="M560 420 L700 370 L760 460 L880 400 L1000 480 L1080 460 L1080 1200 L960 1160 L900 1230 L780 1150 L700 1220 L620 1100 L640 980 L560 900 L610 780 L540 660 L600 550 Z"
            fill="#8FD3FF"
            stroke="#2a2a2a"
            strokeWidth={22}
          />
          <g fill="#fff">
            <ellipse cx={820} cy={660} rx={110} ry={50} />
            <ellipse cx={900} cy={630} rx={80} ry={55} />
          </g>
          <g fill="#2a2a2a" opacity={0.35}>
            <ellipse cx={420} cy={700} rx={260} ry={200} />
            <ellipse cx={200} cy={420} rx={160} ry={120} />
          </g>
        </g>
      )}
      <rect y={1380} width={1080} height={540} fill={destruida ? "#B8916A" : "#C9A27A"} />
      <path d="M0 1380 L1080 1380" stroke={TINTA} strokeWidth={10} />
      {destruida && (
        <g fill="#B5523C" stroke={TINTA} strokeWidth={6}>
          <rect x={700} y={1440} width={110} height={56} transform="rotate(-14 755 1468)" />
          <rect x={850} y={1520} width={110} height={56} transform="rotate(20 905 1548)" />
          <rect x={120} y={1470} width={100} height={50} transform="rotate(8 170 1495)" />
          <rect x={300} y={1560} width={90} height={46} transform="rotate(-25 345 1583)" />
        </g>
      )}
    </g>
  );
};

/** Estúdio de televendas: raios girando + palco. */
export const Estudio: React.FC<{ cor?: string; raio?: string }> = ({ cor = "#2E6BE6", raio = "#4A85F5" }) => {
  const f = useCurrentFrame();
  const rot = f * 0.4;
  return (
    <g>
      <rect width={1080} height={1920} fill={cor} />
      <g transform={`translate(540 1050) rotate(${rot})`} fill={raio}>
        {Array.from({ length: 18 }).map((_, i) => {
          const a = (i / 18) * Math.PI * 2;
          const b = a + Math.PI / 18;
          return <path key={i} d={`M0 0 L${2200 * Math.cos(a)} ${2200 * Math.sin(a)} L${2200 * Math.cos(b)} ${2200 * Math.sin(b)} Z`} />;
        })}
      </g>
      <ellipse cx={540} cy={1660} rx={640} ry={200} fill="#6A3FC0" stroke={TINTA} strokeWidth={8} />
      <ellipse cx={540} cy={1640} rx={580} ry={160} fill="#8455E0" />
    </g>
  );
};

/** Mesa de jantar com toalha xadrez, frango assado e suco de canudinho (o almoço do rato). */
export const Mesa: React.FC<{ x: number; y: number; escala?: number; comido?: number }> = ({ x, y, escala = 1, comido = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${escala})`} stroke={TINTA} strokeWidth={8} strokeLinejoin="round">
    <rect x={-300} y={0} width={30} height={330} fill="#8B5A2B" />
    <rect x={270} y={0} width={30} height={330} fill="#8B5A2B" />
    <path d="M-340 -20 L340 -20 L360 90 L-360 90 Z" fill="#fff" />
    <g fill="#E8282B" stroke="none" opacity={0.85}>
      {[-300, -180, -60, 60, 180, 300].map((cx) => (
        <rect key={cx} x={cx - 20} y={-18} width={40} height={106} />
      ))}
    </g>
    <path d="M-340 -20 L340 -20 L360 90 L-360 90 Z" fill="none" />
    {/* prato + frango */}
    <ellipse cx={-40} cy={-30} rx={170} ry={36} fill="#fff" />
    {comido < 1 && (
      <g transform={`translate(-40 -60) scale(${1 - comido * 0.5})`}>
        <ellipse cx={0} cy={0} rx={110} ry={70} fill="#C8752E" />
        <ellipse cx={-20} cy={-20} rx={50} ry={22} fill="#E0954A" stroke="none" />
        <path d="M80 10 L140 -30" strokeWidth={30} stroke={TINTA} />
        <path d="M80 10 L140 -30" strokeWidth={16} stroke="#C8752E" />
        <circle cx={146} cy={-34} r={14} fill="#fff" />
        <path d="M-80 10 L-140 -30" strokeWidth={30} stroke={TINTA} />
        <path d="M-80 10 L-140 -30" strokeWidth={16} stroke="#C8752E" />
        <circle cx={-146} cy={-34} r={14} fill="#fff" />
      </g>
    )}
    {comido >= 1 && <path d="M-110 -40 L-20 -50 M-60 -60 L20 -36 M-30 -44 L40 -60" stroke="#eee" strokeWidth={12} />}
    {/* suco */}
    <path d="M190 -130 L270 -130 L258 -20 L202 -20 Z" fill="#FF9F1C" />
    <path d="M240 -130 L270 -200 L300 -200" fill="none" strokeWidth={8} stroke="#E8282B" />
  </g>
);

/** Parede de tijolos sendo derrubada: `quebra` 0..1 solta os tijolos voando. */
export const ParedeTijolos: React.FC<{ quebra: number }> = ({ quebra }) => {
  const tij: React.ReactNode[] = [];
  let k = 0;
  for (let row = 0; row < 14; row++)
    for (let col = -1; col < 7; col++) {
      const x = col * 170 + (row % 2) * 85;
      const y = 300 + row * 80;
      k++;
      const solto = x > 380 && x < 900 && y > 650 && y < 1250;
      const s = solto ? quebra : 0;
      const ang = (k * 47) % 360;
      const dx = Math.cos(ang) * 600 * s;
      const dy = (Math.sin(ang) * 400 - 300) * s + 1200 * s * s;
      tij.push(
        <rect
          key={k}
          x={x + dx}
          y={y + dy}
          width={160}
          height={72}
          fill={k % 3 ? "#C0583F" : "#A84B36"}
          stroke={TINTA}
          strokeWidth={6}
          transform={`rotate(${s * ang} ${x + dx + 80} ${y + dy + 36})`}
          opacity={solto ? 1 - Math.max(0, s - 0.85) * 6 : 1}
        />,
      );
    }
  return (
    <g>
      <rect width={1080} height={1920} fill="#2a2a2a" />
      <rect x={380} y={650} width={520} height={600} fill="#8FD3FF" opacity={quebra > 0.05 ? 1 : 0} />
      {tij}
      <rect y={1380} width={1080} height={540} fill="#C9A27A" stroke={TINTA} strokeWidth={10} />
    </g>
  );
};

/** A Ratoeira Explosiva 3000. */
export const Ratoeira: React.FC<{ x: number; y: number; escala?: number; queijo?: boolean; aceso?: boolean; rot?: number }> = ({
  x,
  y,
  escala = 1,
  queijo = true,
  aceso = false,
  rot = 0,
}) => {
  const f = useCurrentFrame();
  const fa = aceso ? 1 + Math.sin(f * 1.7) * 0.25 : 0;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${escala})`} stroke={TINTA} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round">
      <rect x={-140} y={-60} width={280} height={60} rx={8} fill="#B5753C" />
      <path d="M-100 -60 L-100 -110 L100 -110 L100 -60" fill="none" strokeWidth={14} stroke="#9AA4B5" />
      <path d="M-100 -60 L-100 -110 L100 -110 L100 -60" fill="none" strokeWidth={4} />
      {queijo && <path d="M60 -60 L130 -60 L100 -105 Z" fill="#FFD23F" />}
      <rect x={-75} y={-250} width={44} height={190} rx={14} fill="#E8282B" />
      <rect x={-28} y={-260} width={44} height={200} rx={14} fill="#E8282B" />
      <rect x={19} y={-250} width={44} height={190} rx={14} fill="#E8282B" />
      <rect x={-85} y={-160} width={158} height={26} fill={TINTA} />
      <text x={-6} y={-141} fill="#FFD23F" stroke="none" fontSize={22} textAnchor="middle" fontFamily="'Baloo 2'" fontWeight={800}>
        TNT
      </text>
      <path d="M-6 -260 C -10 -310, 50 -310, 40 -360 S 80 -410, 100 -430" fill="none" strokeWidth={7} />
      {aceso && (
        <g transform={`translate(100 -440) scale(${fa})`}>
          <path d="M0 -40 L12 -18 L36 -24 L20 -4 L40 12 L14 10 L6 34 L-2 10 L-28 14 L-10 -4 L-24 -26 L-2 -18 Z" fill="#FFD23F" stroke="#FF7A00" strokeWidth={5} />
        </g>
      )}
    </g>
  );
};

/** Explosão de desenho: `t` 0..1 (cresce, depois vira fumaça). */
export const Explosao: React.FC<{ x: number; y: number; t: number; escala?: number }> = ({ x, y, t, escala = 1 }) => {
  if (t <= 0 || t >= 1) return null;
  const s = Math.min(1, t * 4);
  const fade = t > 0.5 ? 1 - (t - 0.5) * 2 : 1;
  const estrela = (r: number, n = 14) =>
    Array.from({ length: n * 2 })
      .map((_, i) => {
        const a = (i / (n * 2)) * Math.PI * 2;
        const rr = i % 2 ? r * 0.62 : r;
        return `${Math.cos(a) * rr},${Math.sin(a) * rr}`;
      })
      .join(" ");
  return (
    <g transform={`translate(${x} ${y}) scale(${escala * (0.3 + s * 0.9)})`} opacity={fade} stroke={TINTA} strokeWidth={8} strokeLinejoin="round">
      <polygon points={estrela(620)} fill="#E8282B" />
      <polygon points={estrela(470)} fill="#FF8C1A" transform="rotate(12)" />
      <polygon points={estrela(320)} fill="#FFD23F" transform="rotate(-8)" />
      <text y={40} textAnchor="middle" fontSize={170} fill="#fff" stroke={TINTA} strokeWidth={14} paintOrder="stroke" fontFamily="'Baloo 2'" fontWeight={800}>
        BUM!
      </text>
    </g>
  );
};

/** Fumaça subindo (círculos cinza). */
export const Fumaca: React.FC<{ x: number; y: number; n?: number; escala?: number }> = ({ x, y, n = 5, escala = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`} fill="#8A8A99" opacity={0.75}>
      {Array.from({ length: n }).map((_, i) => {
        const q = ((f + i * 11) % 50) / 50;
        return <circle key={i} cx={Math.sin(i * 2.1) * 120 + q * 40} cy={-q * 420} r={50 + q * 70} opacity={1 - q} />;
      })}
    </g>
  );
};

/** Banheiro: azulejos azuis, espelho, pia. */
export const Banheiro: React.FC<{ bagunca?: number }> = ({ bagunca = 0 }) => {
  const lin: React.ReactNode[] = [];
  for (let y = 0; y < 1380; y += 80) lin.push(<path key={`h${y}`} d={`M0 ${y} L1080 ${y}`} />);
  for (let x = 0; x < 1080; x += 80) lin.push(<path key={`v${x}`} d={`M${x} 0 L${x} 1380`} />);
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <rect width={1080} height={1920} fill="#BFE6F5" />
      <g stroke="#A3D4E8" strokeWidth={5} fill="none">
        {lin}
      </g>
      <g stroke={TINTA} strokeWidth={8}>
        <rect x={700} y={420} width={300} height={380} rx={24} fill="#E8F7FF" />
        <path d="M740 470 L800 530 M760 520 L790 550" stroke="#fff" strokeWidth={14} />
        <path d="M680 1060 L1020 1060 L990 1180 L710 1180 Z" fill="#fff" />
        <rect x={830} y={1000} width={20} height={60} fill="#C9D0DC" />
      </g>
      <rect y={1380} width={1080} height={540} fill="#9CC9DA" />
      <path d="M0 1380 L1080 1380" stroke={TINTA} strokeWidth={10} />
      {bagunca > 0 && (
        <g fill="#fff" stroke={TINTA} strokeWidth={5} opacity={bagunca}>
          {[[150, 500, 60], [420, 300, 40], [880, 640, 50], [600, 900, 34], [300, 1100, 46], [960, 300, 30], [80, 900, 36]].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} />
          ))}
        </g>
      )}
    </g>
  );
};

/** A Escova de Dentes Turbo V8 (produto em destaque). */
export const EscovaTurbo: React.FC<{ x: number; y: number; escala?: number; ligada?: boolean; rot?: number; cordinha?: number }> = ({ x, y, escala = 1, ligada = false, rot = 0, cordinha = 0 }) => {
  const f = useCurrentFrame();
  const v = ligada ? 6 : 0;
  return (
    <g transform={`translate(${x + Math.sin(f * 4.1) * v} ${y + Math.cos(f * 3.3) * v}) rotate(${rot}) scale(${escala})`} stroke={TINTA} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round">
      {/* cabo + cerdas */}
      <rect x={-260} y={-30} width={300} height={44} rx={20} fill="#3DA5FF" />
      <rect x={-290} y={-80} width={110} height={52} fill="#fff" strokeWidth={6} />
      <path d="M-280 -80 L-280 -30 M-260 -80 L-260 -30 M-240 -80 L-240 -30 M-220 -80 L-220 -30 M-200 -80 L-200 -30" stroke="#7FD3FF" strokeWidth={5} />
      {/* motor V8 */}
      <rect x={30} y={-110} width={210} height={160} rx={16} fill="#E8282B" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={45 + i * 48} y={-150} width={36} height={46} rx={4} fill="#C9D0DC" />
      ))}
      <text x={135} y={0} textAnchor="middle" fontSize={64} fill="#FFD23F" stroke={TINTA} strokeWidth={6} paintOrder="stroke" fontFamily="'Baloo 2'" fontWeight={800}>
        V8
      </text>
      {/* escapamento */}
      <path d="M240 20 L320 20 L320 -60" fill="none" stroke="#777" strokeWidth={26} />
      <path d="M240 20 L320 20 L320 -60" fill="none" strokeWidth={4} />
      {/* cordinha de partida */}
      <path d={`M240 -40 L${280 + cordinha * 160} ${-40 + cordinha * 60}`} fill="none" strokeWidth={5} />
      <rect x={270 + cordinha * 160} y={-55 + cordinha * 60} width={56} height={26} rx={10} fill="#222" />
      {ligada &&
        [0, 1, 2, 3].map((i) => {
          const q = ((f + i * 5) % 20) / 20;
          return <circle key={i} cx={320 + q * 70} cy={-80 - q * 170} r={22 + q * 34} fill="#666" stroke="none" opacity={(1 - q) * 0.8} />;
        })}
    </g>
  );
};

/** Dentes voando para todo lado (t 0..1) e depois no chão, branquinhos. */
export const DentesVoando: React.FC<{ x: number; y: number; t: number; n?: number }> = ({ x, y, t, n = 14 }) => (
  <g stroke={TINTA} strokeWidth={5}>
    {Array.from({ length: n }).map((_, i) => {
      const a = (i / n) * Math.PI * 2 + i;
      const v = 500 + (i % 4) * 180;
      const dx = Math.cos(a) * v * t;
      const dy = Math.sin(a) * v * t - 600 * t + 1500 * t * t;
      return <path key={i} transform={`translate(${x + dx} ${y + dy}) rotate(${t * 900 + i * 40})`} d="M-16 -20 Q0 -28 16 -20 L14 10 L6 22 L0 12 L-6 22 L-14 10 Z" fill="#fff" />;
    })}
  </g>
);

/** Dentes enfileirados no chão, brilhando. */
export const DentesNoChao: React.FC<{ x: number; y: number; escala?: number }> = ({ x, y, escala = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`} stroke={TINTA} strokeWidth={5}>
      {Array.from({ length: 12 }).map((_, i) => (
        <path key={i} transform={`translate(${(i - 5.5) * 52} ${Math.sin(i * 1.7) * 14}) rotate(${(i * 37) % 40 - 20})`} d="M-16 -20 Q0 -28 16 -20 L14 10 L6 22 L0 12 L-6 22 L-14 10 Z" fill="#fff" />
      ))}
      {[0, 1, 2].map((i) => {
        const k = Math.max(0, Math.sin(f * 0.25 + i * 2));
        return <path key={`b${i}`} transform={`translate(${-200 + i * 190} ${-60 - i * 10}) scale(${k})`} d="M0 -30 L8 -8 L30 0 L8 8 L0 30 L-8 8 L-30 0 L-8 -8 Z" fill="#fff" stroke="#FFD23F" strokeWidth={4} />;
      })}
    </g>
  );
};

/** Relógio de parede com contador grande (o "2 minutos"). */
export const RelogioParede: React.FC<{ x: number; y: number; texto: string }> = ({ x, y, texto }) => (
  <g transform={`translate(${x} ${y})`} stroke={TINTA} strokeWidth={8}>
    <rect x={-170} y={-70} width={340} height={140} rx={20} fill="#222" />
    <text y={36} textAnchor="middle" fontSize={100} fill="#FF4B3E" stroke="none" fontFamily="'DejaVu Sans Mono', monospace" fontWeight={700}>
      {texto}
    </text>
  </g>
);

/** Pedestal de produto (estúdio). */
export const Pedestal: React.FC<{ x: number; y: number; escala?: number }> = ({ x, y, escala = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${escala})`} stroke={TINTA} strokeWidth={8} strokeLinejoin="round">
    <path d="M-170 0 L170 0 L150 260 L-150 260 Z" fill="#fff" />
    <rect x={-180} y={-20} width={360} height={40} rx={10} fill="#FFD23F" />
  </g>
);

/** Linhas de velocidade/vibração (motor ligado). */
export const LinhasVelocidade: React.FC<{ forca?: number }> = ({ forca = 1 }) => {
  const f = useCurrentFrame();
  if (forca <= 0) return null;
  return (
    <g fill="#fff" opacity={0.6 * forca}>
      {Array.from({ length: 16 }).map((_, i) => {
        const y = (i * 131 + f * 55) % 1920;
        const x = (i * 271) % 1080;
        return <rect key={i} x={x} y={y} width={12} height={180} rx={6} />;
      })}
    </g>
  );
};
